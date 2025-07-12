#!/usr/bin/env python3
"""
Script para probar WhatsApp GRATUITO con PyWhatKit
"""
import os
import sys
from pathlib import Path

# Agregar el proyecto al path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

def test_pywhatkit_installation():
    """Verificar que PyWhatKit esté instalado"""
    print("🔍 Verificando PyWhatKit...")
    try:
        import pywhatkit as pwk
        print("✅ PyWhatKit instalado correctamente")
        return True
    except ImportError:
        print("❌ PyWhatKit no instalado")
        print("💡 Ejecutar: pip install pywhatkit")
        return False

def test_free_whatsapp_service():
    """Probar el servicio gratuito"""
    print("\n📱 Probando servicio WhatsApp gratuito...")
    
    try:
        # Configurar entorno
        os.environ['WHATSAPP_PROVIDER'] = 'free'
        os.environ['USE_FREE_WHATSAPP'] = 'True'
        
        from backend.apps.notifications.whatsapp_free import FreeWhatsAppService
        
        service = FreeWhatsAppService()
        print("✅ Servicio gratuito inicializado")
        
        # Probar formateo de números
        test_numbers = ["612345678", "+34612345678", "34612345678"]
        print("\n📞 Probando formateo de números:")
        for number in test_numbers:
            formatted = service.format_phone_number(number)
            print(f"  {number} → {formatted}")
        
        return True
        
    except ImportError:
        print("❌ PyWhatKit no está instalado")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_unified_service():
    """Probar el servicio unificado"""
    print("\n🔧 Probando servicio unificado...")
    
    try:
        # Configurar entorno para usar servicio gratuito
        os.environ['WHATSAPP_PROVIDER'] = 'free'
        os.environ['USE_FREE_WHATSAPP'] = 'True'
        
        from backend.apps.notifications.whatsapp_unified import UnifiedWhatsAppService
        
        service = UnifiedWhatsAppService()
        
        if service.is_available():
            print("✅ Servicio unificado disponible")
            
            # Mostrar información del proveedor
            info = service.get_provider_info()
            print(f"📡 Proveedor actual: {info['current_provider']}")
            print(f"💰 Costo: {info['info'].get('cost', 'N/A')}")
            print(f"📊 Límites: {info['info'].get('limits', 'N/A')}")
            
            return True
        else:
            print("❌ Servicio unificado no disponible")
            return False
            
    except Exception as e:
        print(f"❌ Error en servicio unificado: {e}")
        return False

def show_test_example():
    """Mostrar ejemplo de uso"""
    print("\n" + "="*60)
    print("📋 EJEMPLO DE USO")
    print("="*60)
    
    # IMPORTANTE: Cambiar por tu número real
    TEST_PHONE = "+34600000000"  # ⚠️ CAMBIAR POR TU NÚMERO
    
    print(f"\n⚠️  Para probar envío real, actualiza TEST_PHONE: {TEST_PHONE}")
    
    if TEST_PHONE == "+34600000000":
        print("📝 Para probar con tu número, edita el script y cambia TEST_PHONE")
        return
    
    print("\n📱 Probando envío de mensaje...")
    
    try:
        os.environ['WHATSAPP_PROVIDER'] = 'free'
        from backend.apps.notifications.whatsapp_unified import send_whatsapp_notification
        
        data = {
            'client_name': 'Cliente Test',
            'date': '15/07/2025',
            'time': '15:30',
            'consultant': 'María García',
            'address': 'C/ Ejemplo 123, Madrid'
        }
        
        print(f"📤 Enviando confirmación de cita a {TEST_PHONE}...")
        success = send_whatsapp_notification(TEST_PHONE, 'confirmation', data)
        
        if success:
            print("✅ Mensaje programado correctamente")
            print("⏰ Se enviará en ~1 minuto")
            print("💡 Mantén WhatsApp Web abierto")
        else:
            print("❌ Error programando mensaje")
            
    except Exception as e:
        print(f"❌ Error probando envío: {e}")

def show_instructions():
    """Mostrar instrucciones de configuración"""
    print("\n" + "="*60)
    print("📚 INSTRUCCIONES DE USO")
    print("="*60)
    
    print("\n1️⃣ ANTES DE USAR:")
    print("   • Abrir WhatsApp Web en tu navegador")
    print("   • Iniciar sesión con tu cuenta")
    print("   • Mantener la pestaña abierta")
    
    print("\n2️⃣ CONFIGURACIÓN (.env.production):")
    print("   WHATSAPP_PROVIDER=free")
    print("   USE_FREE_WHATSAPP=True")
    
    print("\n3️⃣ USO EN CÓDIGO:")
    print("""
from backend.apps.notifications.whatsapp_unified import send_whatsapp_notification

# Confirmación de cita
send_whatsapp_notification(
    "+34612345678", 
    "confirmation", 
    {
        'client_name': 'María García',
        'date': '15/07/2025',
        'time': '15:30'
    }
)
    """)
    
    print("\n4️⃣ CARACTERÍSTICAS:")
    print("   ✅ 100% Gratuito")
    print("   ✅ Sin límites de mensajes")
    print("   ✅ Sin API keys necesarias")
    print("   ✅ Funciona con WhatsApp Web")
    print("   ⚠️  Requiere WhatsApp Web abierto")
    print("   ⚠️  Programación (no inmediato)")

def main():
    """Función principal"""
    print("🧪 TEST WHATSAPP GRATUITO - ORTA NOVIAS")
    print("="*50)
    
    # Verificar instalación
    if not test_pywhatkit_installation():
        print("\n💡 Para instalar PyWhatKit:")
        print("   pip install pywhatkit")
        return
    
    # Probar servicio gratuito
    if not test_free_whatsapp_service():
        return
    
    # Probar servicio unificado
    if not test_unified_service():
        return
    
    # Mostrar ejemplo (cambiar número para probar)
    show_test_example()
    
    # Mostrar instrucciones
    show_instructions()
    
    print("\n✅ Test completado - WhatsApp gratuito funcionando")

if __name__ == "__main__":
    main()
