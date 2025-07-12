"""
Middleware de seguridad avanzado para Orta Novias
Incluye protecciones adicionales para producción
"""
import logging
import re
import time
from collections import defaultdict
from django.core.cache import cache
from django.http import JsonResponse
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('django.security')

class AdvancedSecurityMiddleware(MiddlewareMixin):
    """
    Middleware de seguridad avanzado que incluye:
    - Detección de patrones de ataque
    - Validación de User-Agent
    - Protección contra SQL injection
    - Logging de seguridad mejorado
    - Rate limiting por usuario y IP
    """
    
    # Patrones sospechosos comunes
    SUSPICIOUS_PATTERNS = [
        r'union\s+select',
        r'drop\s+table',
        r'insert\s+into',
        r'delete\s+from',
        r'<script',
        r'javascript:',
        r'eval\(',
        r'base64',
        r'\.\./',
        r'etc/passwd',
        r'proc/self',
        r'cmd=',
        r'exec\(',
        r'system\(',
    ]
    
    # User agents sospechosos
    SUSPICIOUS_USER_AGENTS = [
        'sqlmap',
        'nmap',
        'nikto',
        'dirb',
        'gobuster',
        'masscan',
        'zap',
    ]
    
    # Extensiones de archivo peligrosas
    DANGEROUS_EXTENSIONS = [
        '.php', '.asp', '.aspx', '.jsp', '.cgi', '.pl', '.py', '.rb', '.sh'
    ]
    
    def __init__(self, get_response):
        self.get_response = get_response
        self.suspicious_patterns = [re.compile(pattern, re.IGNORECASE) for pattern in self.SUSPICIOUS_PATTERNS]
        super().__init__(get_response)

    def process_request(self, request):
        """Procesar request con validaciones de seguridad avanzadas"""
        
        ip = self._get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '').lower()
        
        # Solo aplicar en producción o si está configurado
        if not settings.DEBUG or getattr(settings, 'ENABLE_ADVANCED_SECURITY', False):
            
            # 1. Validar User-Agent sospechoso
            if self._is_suspicious_user_agent(user_agent):
                self._log_security_incident(ip, 'SUSPICIOUS_USER_AGENT', user_agent)
                return self._security_response('Acceso denegado', 'SUSPICIOUS_USER_AGENT', 403)
            
            # 2. Validar patrones sospechosos en la URL y parámetros
            if self._contains_suspicious_patterns(request):
                self._log_security_incident(ip, 'SUSPICIOUS_PATTERN', request.get_full_path())
                return self._security_response('Solicitud inválida', 'SUSPICIOUS_PATTERN', 400)
            
            # 3. Validar extensiones de archivo peligrosas
            if self._has_dangerous_extension(request.path):
                self._log_security_incident(ip, 'DANGEROUS_EXTENSION', request.path)
                return self._security_response('Archivo no permitido', 'DANGEROUS_EXTENSION', 403)
            
            # 4. Rate limiting avanzado
            if self._is_advanced_rate_limited(request):
                self._log_security_incident(ip, 'RATE_LIMIT_EXCEEDED', f"Path: {request.path}")
                return self._security_response('Demasiadas solicitudes', 'RATE_LIMIT_EXCEEDED', 429)
        
        # 5. Logging de requests sensibles (siempre activo)
        self._log_sensitive_request(request)
        
        return None

    def process_response(self, request, response):
        """Agregar headers de seguridad adicionales"""
        
        # Headers de seguridad adicionales
        security_headers = {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
        }
        
        for header, value in security_headers.items():
            response[header] = value
        
        # HSTS solo para HTTPS en producción
        if not settings.DEBUG and request.is_secure():
            response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
        
        # Log de eventos de seguridad
        if response.status_code in [401, 403, 404, 429, 500]:
            self._log_response_event(request, response)
        
        return response

    def _is_suspicious_user_agent(self, user_agent):
        """Verificar si el User-Agent es sospechoso"""
        if not user_agent or len(user_agent) < 10:
            return True
        
        for suspicious in self.SUSPICIOUS_USER_AGENTS:
            if suspicious in user_agent:
                return True
        
        # Verificar si es demasiado genérico
        if user_agent in ['mozilla', 'curl', 'wget', 'python', 'bot']:
            return True
        
        return False

    def _contains_suspicious_patterns(self, request):
        """Verificar patrones sospechosos en URL, query params y body"""
        # Verificar URL y query string
        full_path = request.get_full_path().lower()
        for pattern in self.suspicious_patterns:
            if pattern.search(full_path):
                return True
        
        # Verificar headers HTTP
        for header_name, header_value in request.META.items():
            if header_name.startswith('HTTP_') and header_value:
                header_str = str(header_value).lower()
                for pattern in self.suspicious_patterns:
                    if pattern.search(header_str):
                        return True
        
        # Verificar parámetros POST/PUT
        if request.method in ['POST', 'PUT', 'PATCH']:
            try:
                body = request.body.decode('utf-8', errors='ignore').lower()
                for pattern in self.suspicious_patterns:
                    if pattern.search(body):
                        return True
            except (UnicodeDecodeError, AttributeError):
                pass
        
        return False

    def _has_dangerous_extension(self, path):
        """Verificar si la URL tiene extensiones peligrosas"""
        path_lower = path.lower()
        for extension in self.DANGEROUS_EXTENSIONS:
            if path_lower.endswith(extension):
                return True
        return False

    def _is_advanced_rate_limited(self, request):
        """Rate limiting avanzado por IP y usuario"""
        ip = self._get_client_ip(request)
        user_id = getattr(request.user, 'id', None) if hasattr(request, 'user') and request.user.is_authenticated else None
        
        # Rate limits diferentes para usuarios autenticados y anónimos
        if user_id:
            cache_key = f"rate_limit_user_{user_id}"
            limit = 1000  # 1000 requests por hora para usuarios autenticados
        else:
            cache_key = f"rate_limit_ip_{ip}"
            limit = 100   # 100 requests por hora para usuarios anónimos
        
        window = 3600  # 1 hora
        
        current_requests = cache.get(cache_key, 0)
        if current_requests >= limit:
            return True
        
        cache.set(cache_key, current_requests + 1, window)
        return False

    def _get_client_ip(self, request):
        """Obtener IP real del cliente considerando proxies"""
        # Lista de headers que pueden contener la IP real
        ip_headers = [
            'HTTP_X_FORWARDED_FOR',
            'HTTP_X_REAL_IP',
            'HTTP_CF_CONNECTING_IP',  # Cloudflare
            'HTTP_X_FORWARDED',
            'HTTP_FORWARDED_FOR',
            'HTTP_FORWARDED',
            'REMOTE_ADDR'
        ]
        
        for header in ip_headers:
            ip = request.META.get(header)
            if ip:
                # Si hay múltiples IPs (X-Forwarded-For), tomar la primera
                if ',' in ip:
                    ip = ip.split(',')[0].strip()
                
                # Validar que sea una IP válida
                if self._is_valid_ip(ip):
                    return ip
        
        return request.META.get('REMOTE_ADDR', 'unknown')

    def _is_valid_ip(self, ip):
        """Validar formato de IP"""
        parts = ip.split('.')
        if len(parts) != 4:
            return False
        
        try:
            for part in parts:
                if not 0 <= int(part) <= 255:
                    return False
            return True
        except ValueError:
            return False

    def _log_security_incident(self, ip, incident_type, details):
        """Log de incidentes de seguridad"""
        logger.critical(
            f"SECURITY INCIDENT: {incident_type} from IP {ip} - Details: {details}",
            extra={
                'ip': ip,
                'incident_type': incident_type,
                'details': details,
                'timestamp': time.time()
            }
        )

    def _log_sensitive_request(self, request):
        """Log de requests a endpoints sensibles"""
        sensitive_paths = [
            '/admin/',
            '/api/users/',
            '/api/token/',
            '/api/notifications/',
        ]
        
        path = request.path.lower()
        for sensitive_path in sensitive_paths:
            if path.startswith(sensitive_path):
                logger.info(
                    f"Sensitive request: {request.method} {request.path} from IP {self._get_client_ip(request)}",
                    extra={
                        'ip': self._get_client_ip(request),
                        'method': request.method,
                        'path': request.path,
                        'user': str(request.user) if hasattr(request, 'user') else 'anonymous'
                    }
                )
                break

    def _log_response_event(self, request, response):
        """Log de eventos de respuesta"""
        logger.warning(
            f"Response {response.status_code}: {request.method} {request.path} from IP {self._get_client_ip(request)}",
            extra={
                'status_code': response.status_code,
                'ip': self._get_client_ip(request),
                'method': request.method,
                'path': request.path,
                'user_agent': request.META.get('HTTP_USER_AGENT', '')[:200]
            }
        )

    def _security_response(self, message, code, status_code):
        """Respuesta estándar para incidentes de seguridad"""
        return JsonResponse({
            'error': message,
            'code': code,
            'timestamp': int(time.time())
        }, status=status_code)
