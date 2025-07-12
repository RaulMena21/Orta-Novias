"""
Middleware para integración con Cloudflare WAF
Maneja IPs reales de clientes y configuraciones específicas de Cloudflare
"""
import logging
from django.conf import settings
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.core.cache import cache
import ipaddress

logger = logging.getLogger('django.security')

class CloudflareMiddleware(MiddlewareMixin):
    """
    Middleware para manejar requests que pasan por Cloudflare WAF
    - Extrae IP real del cliente
    - Valida que requests vengan de Cloudflare
    - Maneja headers específicos de Cloudflare
    - Implementa rate limiting adicional
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        
        # IPs de Cloudflare (se pueden actualizar desde la API)
        self.cloudflare_ips_v4 = [
            '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22',
            '103.31.4.0/22', '141.101.64.0/18', '108.162.192.0/18',
            '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22',
            '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13',
            '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22'
        ]
        
        self.cloudflare_ips_v6 = [
            '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32',
            '2405:b500::/32', '2405:8100::/32', '2a06:98c0::/29',
            '2c0f:f248::/32'
        ]
        
        super().__init__(get_response)
    
    def process_request(self, request):
        """Procesar request con configuraciones de Cloudflare"""
        
        # Solo aplicar si Cloudflare está habilitado
        if not getattr(settings, 'USE_CLOUDFLARE', False):
            return None
        
        # Verificar que el request venga de Cloudflare en producción
        if not settings.DEBUG and not self._is_from_cloudflare(request):
            logger.critical(f"Request not from Cloudflare: {self._get_connecting_ip(request)}")
            return JsonResponse({
                'error': 'Acceso denegado',
                'code': 'NOT_FROM_CLOUDFLARE'
            }, status=403)
        
        # Extraer IP real del cliente
        real_ip = self._get_real_client_ip(request)
        request.META['REAL_CLIENT_IP'] = real_ip
        
        # Procesar headers de Cloudflare
        self._process_cloudflare_headers(request)
        
        # Rate limiting adicional basado en Cloudflare
        if self._is_cloudflare_rate_limited(request):
            logger.warning(f"Cloudflare rate limit for IP: {real_ip}")
            return JsonResponse({
                'error': 'Demasiadas solicitudes detectadas',
                'retry_after': 300
            }, status=429)
        
        return None
    
    def _is_from_cloudflare(self, request):
        """Verificar si el request viene de Cloudflare"""
        connecting_ip = self._get_connecting_ip(request)
        
        if not connecting_ip:
            return False
        
        try:
            client_ip = ipaddress.ip_address(connecting_ip)
            
            # Verificar IPv4
            if client_ip.version == 4:
                for cidr in self.cloudflare_ips_v4:
                    if client_ip in ipaddress.ip_network(cidr):
                        return True
            
            # Verificar IPv6
            elif client_ip.version == 6:
                for cidr in self.cloudflare_ips_v6:
                    if client_ip in ipaddress.ip_network(cidr):
                        return True
            
            return False
            
        except ValueError:
            logger.warning(f"Invalid IP address: {connecting_ip}")
            return False
    
    def _get_connecting_ip(self, request):
        """Obtener IP que se conecta directamente al servidor"""
        return request.META.get('REMOTE_ADDR')
    
    def _get_real_client_ip(self, request):
        """Obtener IP real del cliente desde headers de Cloudflare"""
        # Cloudflare proporciona la IP real en CF-Connecting-IP
        cf_connecting_ip = request.META.get('HTTP_CF_CONNECTING_IP')
        if cf_connecting_ip:
            return cf_connecting_ip
        
        # Fallback a otros headers
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        
        return request.META.get('REMOTE_ADDR', 'unknown')
    
    def _process_cloudflare_headers(self, request):
        """Procesar y almacenar información de headers de Cloudflare"""
        cf_headers = {}
        
        # Headers importantes de Cloudflare
        cloudflare_headers = {
            'CF-Ray': 'HTTP_CF_RAY',
            'CF-Connecting-IP': 'HTTP_CF_CONNECTING_IP',
            'CF-IPCountry': 'HTTP_CF_IPCOUNTRY',
            'CF-Visitor': 'HTTP_CF_VISITOR',
            'CF-ASN': 'HTTP_CF_ASN',
        }
        
        for cf_name, meta_name in cloudflare_headers.items():
            value = request.META.get(meta_name)
            if value:
                cf_headers[cf_name] = value
        
        # Almacenar en request para uso posterior
        request.cloudflare_headers = cf_headers
        
        # Log información útil
        if cf_headers:
            logger.info(
                f"Cloudflare request from {cf_headers.get('CF-IPCountry', 'Unknown')} "
                f"- Ray: {cf_headers.get('CF-Ray', 'Unknown')}"
            )
    
    def _is_cloudflare_rate_limited(self, request):
        """Rate limiting adicional basado en datos de Cloudflare"""
        real_ip = request.META.get('REAL_CLIENT_IP')
        cf_country = request.META.get('HTTP_CF_IPCOUNTRY')
        
        if not real_ip:
            return False
        
        # Rate limiting por país si es necesario
        if cf_country and cf_country in ['CN', 'RU']:  # Países con alta actividad maliciosa
            cache_key = f"cf_country_limit_{cf_country}_{real_ip}"
            requests_count = cache.get(cache_key, 0)
            
            if requests_count > 50:  # 50 requests por hora para estos países
                return True
            
            cache.set(cache_key, requests_count + 1, 3600)
        
        # Rate limiting por ASN sospechoso
        cf_asn = request.META.get('HTTP_CF_ASN')
        if cf_asn:
            # Lista de ASNs conocidos por actividad maliciosa
            suspicious_asns = ['AS16276', 'AS8100', 'AS4134']  # Ejemplos
            
            if cf_asn in suspicious_asns:
                cache_key = f"cf_asn_limit_{cf_asn}_{real_ip}"
                requests_count = cache.get(cache_key, 0)
                
                if requests_count > 20:  # 20 requests por hora para ASNs sospechosos
                    return True
                
                cache.set(cache_key, requests_count + 1, 3600)
        
        return False

class CloudflareSecurityMiddleware(MiddlewareMixin):
    """
    Middleware adicional de seguridad que aprovecha datos de Cloudflare
    """
    
    def process_request(self, request):
        """Aplicar reglas de seguridad adicionales"""
        
        if not getattr(settings, 'USE_CLOUDFLARE', False):
            return None
        
        # Bloquear países específicos si es necesario
        cf_country = request.META.get('HTTP_CF_IPCOUNTRY')
        blocked_countries = getattr(settings, 'BLOCKED_COUNTRIES', [])
        
        if cf_country and cf_country in blocked_countries:
            logger.warning(f"Blocked country access: {cf_country}")
            return JsonResponse({
                'error': 'Acceso no disponible en tu región',
                'code': 'COUNTRY_BLOCKED'
            }, status=403)
        
        # Verificar si Cloudflare ya bloqueó algo
        cf_visitor = request.META.get('HTTP_CF_VISITOR', '{}')
        if '"scheme":"http"' in cf_visitor and not settings.DEBUG:
            # Cloudflare debería forzar HTTPS
            logger.warning("HTTP request bypassed Cloudflare HTTPS redirect")
        
        return None
    
    def process_response(self, request, response):
        """Agregar headers de respuesta relacionados con Cloudflare"""
        
        # Agregar Ray ID para debugging
        cf_ray = request.META.get('HTTP_CF_RAY')
        if cf_ray:
            response['CF-Ray'] = cf_ray
        
        # Headers de caché para Cloudflare
        if request.path.startswith('/static/') or request.path.startswith('/media/'):
            response['Cache-Control'] = 'public, max-age=31536000'  # 1 año
        elif request.path.startswith('/api/'):
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        
        return response
