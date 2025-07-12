from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from django.core.cache import cache
from django.conf import settings
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from backend.apps.users.models import User
import time
import logging

logger = logging.getLogger('django.security')

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'login'  # Cambiamos el nombre del campo
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Reemplazamos el campo username por login
        self.fields['login'] = serializers.CharField()
        self.fields.pop('username', None)
    
    def validate(self, attrs):
        login = attrs.get('login')
        password = attrs.get('password')
        
        # Obtener IP del request para logging y rate limiting
        request = self.context.get('request')
        ip = self._get_client_ip(request) if request else 'unknown'
        
        # Rate limiting por IP para intentos de login
        if self._is_login_rate_limited(ip):
            logger.warning(f"Login rate limit exceeded for IP: {ip}")
            raise AuthenticationFailed('Demasiados intentos de login. Intenta de nuevo más tarde.')
        
        if login and password:
            # Validar formato de entrada
            if not self._is_valid_login_format(login):
                self._log_failed_attempt(ip, login, 'INVALID_FORMAT')
                raise AuthenticationFailed('Formato de login inválido.')
            
            # Intentar autenticar con email o username
            user = None
            if '@' in login:
                # Si contiene @, asumir que es email
                try:
                    user_obj = User.objects.get(email=login)
                    user = authenticate(username=user_obj.username, password=password)
                except User.DoesNotExist:
                    pass
            else:
                # Si no contiene @, intentar autenticar con username
                user = authenticate(username=login, password=password)
            
            # Verificar si el usuario fue encontrado y autenticado
            if user is None:
                self._log_failed_attempt(ip, login, 'INVALID_CREDENTIALS')
                self._increment_failed_attempts(ip)
                raise AuthenticationFailed('Credenciales inválidas.')
            
            # Verificar si el usuario está activo
            if not user.is_active:
                self._log_failed_attempt(ip, login, 'INACTIVE_USER')
                raise AuthenticationFailed('Cuenta desactivada.')
            
            # Log de login exitoso
            logger.info(f"Successful login for user {user.email} from IP {ip}")
            
            # Limpiar contador de intentos fallidos
            self._clear_failed_attempts(ip)
            
            # Actualizar último login
            update_last_login(None, user)
            
            # Generar tokens usando el método padre
            data = super().validate({'username': user.username, 'password': password})
            
            # Agregar información adicional al token
            data['user'] = {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_staff': user.is_staff,
            }
            
            return data
        else:
            raise AuthenticationFailed('Email/username y contraseña son requeridos.')
    
    def _get_client_ip(self, request):
        """Obtener IP del cliente"""
        if not request:
            return 'unknown'
        
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', 'unknown')
    
    def _is_valid_login_format(self, login):
        """Validar formato básico del login"""
        if not login or len(login) < 3:
            return False
        
        # Si es email, validar formato básico
        if '@' in login:
            return '@' in login and '.' in login.split('@')[1]
        
        # Si es username, solo caracteres alfanuméricos y algunos especiales
        import re
        return re.match(r'^[a-zA-Z0-9._-]+$', login) is not None
    
    def _is_login_rate_limited(self, ip):
        """Verificar rate limiting para intentos de login"""
        cache_key = f"login_attempts_{ip}"
        attempts = cache.get(cache_key, 0)
        
        # Máximo 5 intentos por IP cada 15 minutos
        return attempts >= 5
    
    def _increment_failed_attempts(self, ip):
        """Incrementar contador de intentos fallidos"""
        cache_key = f"login_attempts_{ip}"
        attempts = cache.get(cache_key, 0)
        cache.set(cache_key, attempts + 1, 900)  # 15 minutos
    
    def _clear_failed_attempts(self, ip):
        """Limpiar contador de intentos fallidos"""
        cache_key = f"login_attempts_{ip}"
        cache.delete(cache_key)
    
    def _log_failed_attempt(self, ip, login, reason):
        """Log de intento de login fallido"""
        logger.warning(
            f"Failed login attempt from IP {ip}: {login} - Reason: {reason}",
            extra={
                'ip': ip,
                'login': login,
                'reason': reason,
                'timestamp': time.time()
            }
        )
