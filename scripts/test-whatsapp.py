#!/usr/bin/env python3
"""
Script para probar la configuración de WhatsApp Business API
"""
import os
import sys
import json
from pathlib import Path

# Agregar el proyecto al path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

try:
    import django
    django.setup()
except ImportError:
    print("❌ Error: Django no está instalado o no se puede importar")
    sys.exit(1)

def test_environment_variables():
    """Verificar variables de entorno"""
    print("🔍 Verificando variables de entorno...")
    
    # Variables para Meta Business API
    meta_vars = {
        'WHATSAPP_API_TOKEN': os.getenv('WHATSAPP_API_TOKEN'),
        'WHATSAPP_PHONE_NUMBER_ID': os.getenv('WHATSAPP_PHONE_NUMBER_ID'),
        'WHATSAPP_VERIFY_TOKEN': os.getenv('WHATSAPP_VERIFY_TOKEN'),
    }
    
    # Variables para Twilio
    twilio_vars = {
        'TWILIO_ACCOUNT_SID': os.getenv('TWILIO_ACCOUNT_SID'),
        'TWILIO_AUTH_TOKEN': os.getenv('TWILIO_AUTH_TOKEN'),
        'TWILIO_WHATSAPP_FROM': os.getenv('TWILIO_WHATSAPP_FROM'),
    }
    
    use_twilio = os.getenv('USE_TWILIO', 'False').lower() == 'true'
    
    print(f"📱 Proveedor seleccionado: {'Twilio' if use_twilio else 'Meta Business API'}")
    
    if use_twilio:
        print("\n🔧 Variables Twilio:")
        for var, value in twilio_vars.items():
            status = "✅" if value and value != f"TU_{var}_REAL" else "❌"
            print(f"  {status} {var}: {'Configurado' if value and value != f'TU_{var}_REAL' else 'No configurado'}")
    else:
        print("\n🔧 Variables Meta Business API:")
        for var, value in meta_vars.items():
            status = "✅" if value and value != f"TU_{var}_REAL" else "❌"
            print(f"  {status} {var}: {'Configurado' if value and value != f'TU_{var}_REAL' else 'No configurado'}")
    
    return True

def test_whatsapp_service():
    """Probar el servicio de WhatsApp"""
    print("\n📱 Probando servicio de WhatsApp...")
    
    try:
        from backend.apps.notifications.whatsapp_service import WhatsAppService
        
        service = WhatsAppService()
        print("✅ Servicio WhatsApp inicializado correctamente")
        
        # Probar formateo de número
        test_numbers = [
            "612345678",
            "+34612345678", 
            "34612345678"
        ]
        
        print("\n📞 Probando formateo de números:")
        for number in test_numbers:
            formatted = service.format_phone_number(number)
            print(f"  {number} → {formatted}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error inicializando servicio: {e}")
        return False

def test_send_message():
    """Probar envío de mensaje (solo si hay credenciales válidas)"""
    print("\n📤 Probando envío de mensaje...")
    
    # IMPORTANTE: Cambiar por tu número real para probar
    TEST_PHONE = "+34600000000"  # ⚠️ CAMBIAR POR TU NÚMERO
    
    if TEST_PHONE == "+34600000000":
        print("⚠️  Para probar envío real, actualiza TEST_PHONE en el script")
        return True
    
    try:
        from backend.apps.notifications.whatsapp_service import send_whatsapp_notification
        
        data = {
            'client_name': 'Cliente Test',
            'date': '15/07/2025',
            'time': '15:30',
            'consultant': 'María García',
            'address': 'C/ Ejemplo 123, Madrid'
        }
        
        print(f"📱 Enviando mensaje de prueba a {TEST_PHONE}...")
        success = send_whatsapp_notification(TEST_PHONE, 'confirmation', data)
        
        if success:
            print("✅ Mensaje enviado correctamente")
        else:
            print("❌ Error enviando mensaje")
            
        return success
        
    except Exception as e:
        print(f"❌ Error probando envío: {e}")
        return False

def show_next_steps():
    """Mostrar próximos pasos"""
    print("\n" + "="*60)
    print("📋 PRÓXIMOS PASOS PARA CONFIGURAR WHATSAPP")
    print("="*60)
    
    print("\n🎯 OPCIÓN 1: Meta Business API (Recomendado)")
    print("   1. Ve a: https://developers.facebook.com/")
    print("   2. Crear nueva app → Business")
    print("   3. Agregar producto WhatsApp")
    print("   4. Configurar número de teléfono")
    print("   5. Obtener credenciales:")
    print("      - WHATSAPP_API_TOKEN")
    print("      - WHATSAPP_PHONE_NUMBER_ID")
    print("      - WHATSAPP_VERIFY_TOKEN")
    
    print("\n⚡ OPCIÓN 2: Twilio (Más fácil)")
    print("   1. Ve a: https://www.twilio.com/")
    print("   2. Crear cuenta ($10 gratis)")
    print("   3. Console → Messaging → WhatsApp")
    print("   4. Obtener credenciales:")
    print("      - TWILIO_ACCOUNT_SID")
    print("      - TWILIO_AUTH_TOKEN")
    print("      - TWILIO_WHATSAPP_FROM")
    print("   5. Cambiar USE_TWILIO=True en .env.production")
    
    print("\n📝 CONFIGURACIÓN:")
    print("   1. Actualizar variables en .env.production")
    print("   2. Cambiar TEST_PHONE en este script")
    print("   3. Ejecutar: python scripts/test-whatsapp.py")
    print("   4. Integrar en tu sistema de citas")
    
    print("\n🔗 DOCUMENTACIÓN COMPLETA:")
    print("   docs/WHATSAPP_BUSINESS_API_SETUP.md")

def main():
    """Función principal"""
    print("🧪 TEST WHATSAPP BUSINESS API - ORTA NOVIAS")
    print("="*50)
    
    try:
        # Tests básicos
        test_environment_variables()
        service_ok = test_whatsapp_service()
        
        if service_ok:
            test_send_message()
        
        show_next_steps()
        
    except Exception as e:
        print(f"❌ Error general: {e}")
        return False
    
    print("\n✅ Test completado")
    return True

if __name__ == "__main__":
    main()
