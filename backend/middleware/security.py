"""
Middleware de seguridad personalizado para Django
"""
import logging
import time
from collections import defaultdict
from datetime import datetime, timedelta
from django.core.cache import cache
from django.http import JsonResponse
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser
# from backend.apps.appointments.security_monitor import SecurityMonitor

logger = logging.getLogger(__name__)

class SecurityMiddleware(MiddlewareMixin):
    """
    Middleware de seguridad que incluye:
    - Rate limiting
    - Logging de seguridad
    - Validación de requests
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        self.rate_limit_storage = defaultdict(list)
        super().__init__(get_response)

    def process_request(self, request):
        """Procesar request entrante"""
        
        ip = self._get_client_ip(request)
        
        # Verificar si la IP está bloqueada (temporalmente deshabilitado)
        # if SecurityMonitor.is_ip_blocked(ip):
        #     logger.critical(f"Blocked IP {ip} attempted access to {request.get_full_path()}")
        #     return JsonResponse({
        #         'error': 'Acceso denegado. Contacta al administrador si crees que esto es un error.',
        #         'code': 'IP_BLOCKED'
        #     }, status=403)
        
        # Rate limiting
        if self._is_rate_limited(request):
            logger.warning(f"Rate limit exceeded for IP: {ip}")
            return JsonResponse({
                'error': 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
                'retry_after': 60
            }, status=429)
        
        # Log requests sospechosos
        self._log_suspicious_activity(request)
        
        return None

    def process_response(self, request, response):
        """Procesar response saliente"""
        
        # Agregar headers de seguridad
        if not settings.DEBUG:
            response['X-Content-Type-Options'] = 'nosniff'
            response['X-Frame-Options'] = 'DENY'
            response['X-XSS-Protection'] = '1; mode=block'
            response['Referrer-Policy'] = 'same-origin'
            
            # HSTS solo para HTTPS
            if request.is_secure():
                response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        # Log errores de seguridad
        if response.status_code in [401, 403, 429]:
            logger.warning(
                f"Security event: {response.status_code} for IP: {self._get_client_ip(request)} "
                f"URL: {request.get_full_path()}"
            )
        
        return response

    def _get_client_ip(self, request):
        """Obtener IP real del cliente"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def _is_rate_limited(self, request):
        """Verificar rate limiting"""
        ip = self._get_client_ip(request)
        now = time.time()
        
        # Configuración de rate limits por endpoint
        rate_limits = {
            '/api/appointments/': {'max_requests': 20, 'window': 300},  # 20 por 5 minutos (aumentado para desarrollo)
            '/api/appointments/create/': {'max_requests': 10, 'window': 300},  # 10 por 5 minutos (aumentado)
            '/api/': {'max_requests': 100, 'window': 300},  # 100 por 5 minutos general (aumentado)
        }
        
        # Buscar el rate limit más específico
        rate_limit = None
        for path, config in rate_limits.items():
            if request.path.startswith(path):
                rate_limit = config
                break
        
        if not rate_limit:
            return False
        
        # Usar cache de Django para almacenar intentos
        cache_key = f"rate_limit:{ip}:{request.path}"
        attempts = cache.get(cache_key, [])
        
        # Filtrar intentos dentro de la ventana de tiempo
        valid_attempts = [
            attempt for attempt in attempts 
            if now - attempt < rate_limit['window']
        ]
        
        # Verificar si excede el límite
        if len(valid_attempts) >= rate_limit['max_requests']:
            # Registrar con el monitor de seguridad (temporalmente deshabilitado)
            # SecurityMonitor.log_failed_validation(
            #     ip, 
            #     'rate_limit_exceeded', 
            #     f"Rate limit exceeded for path {request.path}"
            # )
            logger.warning(f"Rate limit exceeded for IP {ip} on path {request.path}")
            return True
        
        # Registrar nuevo intento
        valid_attempts.append(now)
        cache.set(cache_key, valid_attempts, rate_limit['window'])
        
        return False

    def _log_suspicious_activity(self, request):
        """Detectar y registrar actividad sospechosa"""
        
        # Detectar intentos de SQL injection
        suspicious_patterns = [
            'union select', 'drop table', 'insert into', 'delete from',
            'script>', '<iframe', 'javascript:', 'on\w+\s*=',
            '../', '..\\', '/etc/passwd', '/etc/shadow'
        ]
        
        # Revisar en query string y POST data
        check_data = []
        check_data.append(request.META.get('QUERY_STRING', '').lower())
        
        if hasattr(request, 'body'):
            try:
                check_data.append(request.body.decode('utf-8', errors='ignore').lower())
            except:
                pass
        
        for data in check_data:
            for pattern in suspicious_patterns:
                if pattern in data:
                    ip = self._get_client_ip(request)
                    
                    # Registrar con el monitor de seguridad (temporalmente deshabilitado)
                    # SecurityMonitor.log_suspicious_pattern(
                    #     ip, 
                    #     pattern, 
                    #     data[:500]  # Limitar datos para logs
                    # )
                    
                    logger.critical(
                        f"SECURITY ALERT: Suspicious pattern '{pattern}' detected from "
                        f"IP: {ip} "
                        f"URL: {request.get_full_path()} "
                        f"User-Agent: {request.META.get('HTTP_USER_AGENT', 'Unknown')}"
                    )
                    break


class CSRFSecurityMiddleware(MiddlewareMixin):
    """
    Middleware adicional para validar tokens CSRF en APIs
    """
    
    def process_request(self, request):
        """Validar CSRF para requests no-GET"""
        
        # Skip para métodos seguros
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return None
        
        # Skip para usuarios autenticados con token válido
        if hasattr(request, 'user') and not isinstance(request.user, AnonymousUser):
            return None
        
        # Para APIs públicas, validar origin
        origin = request.META.get('HTTP_ORIGIN')
        referer = request.META.get('HTTP_REFERER')
        
        allowed_origins = getattr(settings, 'ALLOWED_ORIGINS', [])
        
        if origin and allowed_origins:
            if not any(origin.startswith(allowed) for allowed in allowed_origins):
                logger.warning(f"Request from unauthorized origin: {origin}")
                return JsonResponse({
                    'error': 'Origen no autorizado'
                }, status=403)
        
        return None


class DataSanitizationMiddleware(MiddlewareMixin):
    """
    Middleware para sanitizar datos de entrada
    """
    
    def process_request(self, request):
        """Sanitizar datos de entrada"""
        
        # Lista de caracteres potencialmente peligrosos
        dangerous_chars = ['<script', '</script>', '<iframe', '</iframe>', 
                          'javascript:', 'data:', 'vbscript:', 'onload=', 
                          'onerror=', 'onclick=']
        
        # Sanitizar query parameters
        if request.GET:
            for key, value in request.GET.items():
                for char in dangerous_chars:
                    if char.lower() in value.lower():
                        logger.warning(
                            f"Dangerous character '{char}' in GET parameter '{key}' "
                            f"from IP: {self._get_client_ip(request)}"
                        )
        
        # Sanitizar POST data si es form data
        if request.POST:
            for key, value in request.POST.items():
                for char in dangerous_chars:
                    if char.lower() in str(value).lower():
                        logger.warning(
                            f"Dangerous character '{char}' in POST parameter '{key}' "
                            f"from IP: {self._get_client_ip(request)}"
                        )
        
        return None
    
    def _get_client_ip(self, request):
        """Obtener IP real del cliente"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
