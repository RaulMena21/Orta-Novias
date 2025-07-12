#!/usr/bin/env python3
"""
Script para verificar la configuración de variables de entorno
"""
import os
import sys
from pathlib import Path

def verificar_archivo_env(archivo):
    """Verifica que un archivo .env tenga todas las variables necesarias"""
    if not os.path.exists(archivo):
        print(f"❌ ERROR: Archivo {archivo} no encontrado")
        return False
    
    print(f"📋 Verificando: {archivo}")
    
    # Variables críticas que deben estar presentes
    variables_criticas = [
        'DJANGO_SECRET_KEY',
        'DATABASE_URL',
        'REDIS_URL',
        'EMAIL_HOST',
        'EMAIL_HOST_USER',
    ]
    
    # Variables de servicios externos
    variables_servicios = [
        'WHATSAPP_API_TOKEN',      # WhatsApp Business API
        'TWILIO_ACCOUNT_SID',      # Twilio alternativo
        'AWS_ACCESS_KEY_ID',       # AWS S3
        'SENTRY_DSN',              # Monitoreo
        'CLOUDFLARE_API_TOKEN',    # CDN/WAF
    ]
    
    # Leer archivo
    with open(archivo, 'r', encoding='utf-8') as f:
        contenido = f.read()
    
    # Verificar variables críticas
    print("\n🔍 Variables críticas:")
    for var in variables_criticas:
        if f"{var}=" in contenido:
            print(f"  ✅ {var}")
        else:
            print(f"  ❌ {var} - FALTANTE")
    
    # Verificar servicios externos
    print("\n📡 Servicios externos:")
    for var in variables_servicios:
        if f"{var}=" in contenido:
            print(f"  ✅ {var}")
        else:
            print(f"  ⚠️  {var} - No configurado")
    
    # Verificar configuraciones específicas por ambiente
    if 'production' in archivo:
        print("\n🔒 Verificaciones de producción:")
        checks_prod = [
            ('DJANGO_DEBUG=False', 'DEBUG deshabilitado'),
            ('SECURE_SSL_REDIRECT=True', 'SSL obligatorio'),
            ('USE_S3=True', 'S3 habilitado'),
            ('BACKUP_ENABLED=True', 'Backups habilitados'),
        ]
        
        for check, desc in checks_prod:
            if check in contenido:
                print(f"  ✅ {desc}")
            else:
                print(f"  ⚠️  {desc} - Verificar configuración")
    else:
        print("\n🛠️  Verificaciones de desarrollo:")
        checks_dev = [
            ('DJANGO_DEBUG=True', 'DEBUG habilitado'),
            ('SECURE_SSL_REDIRECT=False', 'SSL opcional'),
            ('sqlite:', 'Base de datos SQLite'),
        ]
        
        for check, desc in checks_dev:
            if check in contenido:
                print(f"  ✅ {desc}")
            else:
                print(f"  ⚠️  {desc} - Verificar configuración")
    
    print("\n" + "="*50)
    return True

def main():
    """Función principal"""
    print("🔧 VERIFICADOR DE CONFIGURACIÓN - ORTA NOVIAS")
    print("=" * 50)
    
    archivos = [
        '.env.example',
        '.env',
        '.env.production'
    ]
    
    for archivo in archivos:
        if os.path.exists(archivo):
            verificar_archivo_env(archivo)
        else:
            print(f"📝 {archivo} - No encontrado (opcional)")
    
    print("\n📋 GUÍA RÁPIDA:")
    print("   Para desarrollo: cp .env.example .env")
    print("   Para producción: cp .env.example .env.production (y configurar valores reales)")
    print("\n🔗 Documentación completa: CONFIGURACION_ENV.md")

if __name__ == "__main__":
    main()
