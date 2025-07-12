#!/usr/bin/env python
"""
Script de validación de seguridad para Orta Novias
Verifica que todas las configuraciones de seguridad estén correctas
"""
import os
import sys
import django
from pathlib import Path

# Configurar Django
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings_prod')

try:
    django.setup()
    from django.conf import settings
    from django.core.management import call_command
    from django.test.utils import get_runner
except ImportError as e:
    print(f"❌ Error importando Django: {e}")
    sys.exit(1)

class SecurityValidator:
    """Validador de configuraciones de seguridad"""
    
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.passed = []
    
    def check_secret_key(self):
        """Verificar SECRET_KEY"""
        secret_key = getattr(settings, 'SECRET_KEY', '')
        
        if not secret_key:
            self.errors.append("SECRET_KEY no está configurada")
        elif secret_key == 'django-insecure-change-this-in-production-with-50-chars-long-random-string':
            self.errors.append("SECRET_KEY usa el valor por defecto - CAMBIAR EN PRODUCCIÓN")
        elif len(secret_key) < 50:
            self.warnings.append("SECRET_KEY debería tener al menos 50 caracteres")
        else:
            self.passed.append("SECRET_KEY configurada correctamente")
    
    def check_debug_mode(self):
        """Verificar DEBUG mode"""
        debug = getattr(settings, 'DEBUG', True)
        
        if debug:
            self.errors.append("DEBUG está habilitado - DESACTIVAR EN PRODUCCIÓN")
        else:
            self.passed.append("DEBUG desactivado correctamente")
    
    def check_allowed_hosts(self):
        """Verificar ALLOWED_HOSTS"""
        allowed_hosts = getattr(settings, 'ALLOWED_HOSTS', [])
        
        if not allowed_hosts:
            self.errors.append("ALLOWED_HOSTS está vacío")
        elif '*' in allowed_hosts:
            self.errors.append("ALLOWED_HOSTS contiene '*' - INSEGURO EN PRODUCCIÓN")
        else:
            self.passed.append(f"ALLOWED_HOSTS configurado: {allowed_hosts}")
    
    def check_database_config(self):
        """Verificar configuración de base de datos"""
        databases = getattr(settings, 'DATABASES', {})
        default_db = databases.get('default', {})
        
        if not default_db:
            self.errors.append("Base de datos no configurada")
            return
        
        engine = default_db.get('ENGINE', '')
        if 'sqlite' in engine.lower():
            self.warnings.append("Usando SQLite - considerar PostgreSQL para producción")
        elif 'postgresql' in engine.lower():
            self.passed.append("Usando PostgreSQL")
        
        password = default_db.get('PASSWORD', '')
        if not password:
            self.errors.append("Contraseña de base de datos no configurada")
        elif len(password) < 12:
            self.warnings.append("Contraseña de base de datos debería ser más larga")
        else:
            self.passed.append("Contraseña de base de datos configurada")
    
    def check_security_middleware(self):
        """Verificar middleware de seguridad"""
        middleware = getattr(settings, 'MIDDLEWARE', [])
        
        security_middleware = [
            'django.middleware.security.SecurityMiddleware',
            'django.middleware.csrf.CsrfViewMiddleware',
            'corsheaders.middleware.CorsMiddleware',
        ]
        
        for mw in security_middleware:
            if mw in middleware:
                self.passed.append(f"Middleware de seguridad presente: {mw.split('.')[-1]}")
            else:
                self.warnings.append(f"Middleware de seguridad faltante: {mw}")
    
    def check_ssl_settings(self):
        """Verificar configuraciones SSL"""
        ssl_redirect = getattr(settings, 'SECURE_SSL_REDIRECT', False)
        secure_proxy = hasattr(settings, 'SECURE_PROXY_SSL_HEADER')
        session_secure = getattr(settings, 'SESSION_COOKIE_SECURE', False)
        csrf_secure = getattr(settings, 'CSRF_COOKIE_SECURE', False)
        
        if not ssl_redirect:
            self.warnings.append("SECURE_SSL_REDIRECT no está habilitado")
        else:
            self.passed.append("SSL redirect habilitado")
        
        if not secure_proxy:
            self.warnings.append("SECURE_PROXY_SSL_HEADER no configurado")
        else:
            self.passed.append("SSL proxy header configurado")
        
        if not session_secure:
            self.warnings.append("SESSION_COOKIE_SECURE no está habilitado")
        else:
            self.passed.append("Cookies de sesión seguras")
        
        if not csrf_secure:
            self.warnings.append("CSRF_COOKIE_SECURE no está habilitado")
        else:
            self.passed.append("Cookies CSRF seguras")
    
    def check_cors_settings(self):
        """Verificar configuraciones CORS"""
        cors_origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])
        cors_allow_all = getattr(settings, 'CORS_ALLOW_ALL_ORIGINS', False)
        
        if cors_allow_all:
            self.errors.append("CORS_ALLOW_ALL_ORIGINS está habilitado - INSEGURO")
        elif not cors_origins:
            self.warnings.append("CORS_ALLOWED_ORIGINS no está configurado")
        else:
            self.passed.append(f"CORS configurado para: {cors_origins}")
    
    def check_password_validators(self):
        """Verificar validadores de contraseña"""
        validators = getattr(settings, 'AUTH_PASSWORD_VALIDATORS', [])
        
        if not validators:
            self.warnings.append("Validadores de contraseña no configurados")
        else:
            self.passed.append(f"Validadores de contraseña configurados: {len(validators)}")
    
    def check_logging_config(self):
        """Verificar configuración de logging"""
        logging_config = getattr(settings, 'LOGGING', {})
        
        if not logging_config:
            self.warnings.append("Logging no configurado")
        else:
            handlers = logging_config.get('handlers', {})
            if 'file' in handlers or 'security_file' in handlers:
                self.passed.append("Logging a archivo configurado")
            else:
                self.warnings.append("Logging a archivo no configurado")
    
    def check_cache_config(self):
        """Verificar configuración de caché"""
        caches = getattr(settings, 'CACHES', {})
        default_cache = caches.get('default', {})
        
        backend = default_cache.get('BACKEND', '')
        if 'redis' in backend.lower():
            self.passed.append("Redis cache configurado")
        elif 'memcached' in backend.lower():
            self.passed.append("Memcached cache configurado")
        else:
            self.warnings.append("Cache avanzado no configurado")
    
    def check_email_config(self):
        """Verificar configuración de email"""
        email_backend = getattr(settings, 'EMAIL_BACKEND', '')
        email_host = getattr(settings, 'EMAIL_HOST', '')
        
        if 'console' in email_backend:
            self.warnings.append("Email backend usando consola - configurar SMTP para producción")
        elif email_host:
            self.passed.append(f"Email SMTP configurado: {email_host}")
        else:
            self.warnings.append("Email SMTP no configurado")
    
    def run_all_checks(self):
        """Ejecutar todas las validaciones"""
        print("🔍 Ejecutando validaciones de seguridad...\n")
        
        checks = [
            self.check_secret_key,
            self.check_debug_mode,
            self.check_allowed_hosts,
            self.check_database_config,
            self.check_security_middleware,
            self.check_ssl_settings,
            self.check_cors_settings,
            self.check_password_validators,
            self.check_logging_config,
            self.check_cache_config,
            self.check_email_config,
        ]
        
        for check in checks:
            try:
                check()
            except Exception as e:
                self.errors.append(f"Error ejecutando {check.__name__}: {e}")
        
        self.print_results()
    
    def print_results(self):
        """Imprimir resultados de las validaciones"""
        print("=" * 60)
        print("📊 RESULTADOS DE VALIDACIÓN DE SEGURIDAD")
        print("=" * 60)
        
        if self.passed:
            print("\n✅ CONFIGURACIONES CORRECTAS:")
            for item in self.passed:
                print(f"  ✅ {item}")
        
        if self.warnings:
            print("\n⚠️  ADVERTENCIAS:")
            for item in self.warnings:
                print(f"  ⚠️  {item}")
        
        if self.errors:
            print("\n❌ ERRORES CRÍTICOS:")
            for item in self.errors:
                print(f"  ❌ {item}")
        
        print("\n" + "=" * 60)
        print(f"📈 RESUMEN: {len(self.passed)} ✅ | {len(self.warnings)} ⚠️ | {len(self.errors)} ❌")
        
        if self.errors:
            print("\n🚨 ACCIÓN REQUERIDA: Corrige los errores críticos antes de producción")
            return False
        elif self.warnings:
            print("\n💡 RECOMENDACIÓN: Revisa las advertencias para mejorar la seguridad")
            return True
        else:
            print("\n🎉 ¡EXCELENTE! Todas las configuraciones de seguridad están correctas")
            return True

def main():
    """Función principal"""
    print("🛡️  VALIDADOR DE SEGURIDAD - ORTA NOVIAS")
    print("=" * 60)
    
    validator = SecurityValidator()
    success = validator.run_all_checks()
    
    print("\n💡 RECOMENDACIONES ADICIONALES:")
    print("  • Usa certificados SSL/TLS válidos")
    print("  • Configura backups automáticos")
    print("  • Implementa monitoreo con Sentry")
    print("  • Realiza auditorías de seguridad regulares")
    print("  • Mantén todas las dependencias actualizadas")
    
    return 0 if success else 1

if __name__ == '__main__':
    exit_code = main()
    sys.exit(exit_code)
