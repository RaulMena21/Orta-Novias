#!/usr/bin/env python3
"""
Instalación rápida de WhatsApp GRATUITO para Orta Novias
"""
import subprocess
import sys
import os
from pathlib import Path

def install_pywhatkit():
    """Instalar PyWhatKit"""
    print("📦 Instalando PyWhatKit...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pywhatkit"])
        print("✅ PyWhatKit instalado correctamente")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error instalando PyWhatKit: {e}")
        return False

def test_installation():
    """Probar la instalación"""
    print("🧪 Probando instalación...")
    try:
        import pywhatkit as pwk
        print("✅ PyWhatKit importado correctamente")
        return True
    except ImportError:
        print("❌ Error importando PyWhatKit")
        return False

def show_usage_instructions():
    """Mostrar instrucciones de uso"""
    print("\n" + "="*60)
    print("🎉 ¡WHATSAPP GRATUITO LISTO!")
    print("="*60)
    
    print("\n📱 CÓMO USAR:")
    print("1. Mantén WhatsApp Web abierto en tu navegador")
    print("2. Asegúrate de estar logueado en WhatsApp Web")
    print("3. El sistema programará mensajes automáticamente")
    
    print("\n🔧 CÓDIGO DE EJEMPLO:")
    print("""
from backend.apps.notifications.whatsapp_unified import send_whatsapp_notification

# Enviar confirmación de cita
send_whatsapp_notification(
    "+34612345678",
    "confirmation", 
    {
        'client_name': 'María García',
        'date': '15/07/2025',
        'time': '15:30',
        'consultant': 'Carmen López',
        'address': 'C/ Princesa 45, Madrid'
    }
)
    """)
    
    print("\n⚙️ CONFIGURACIÓN:")
    print("- Archivo: .env.production")
    print("- Variable: WHATSAPP_PROVIDER=free")
    print("- Variable: USE_FREE_WHATSAPP=True")
    
    print("\n🚀 PRÓXIMOS PASOS:")
    print("1. Abrir WhatsApp Web en tu navegador")
    print("2. Probar con: python scripts/test-whatsapp-free.py")
    print("3. Integrar en tu sistema de citas")
    
    print("\n📚 DOCUMENTACIÓN:")
    print("- docs/WHATSAPP_GRATIS.md")
    print("- backend/apps/notifications/whatsapp_free.py")

def main():
    """Función principal"""
    print("🚀 INSTALACIÓN WHATSAPP GRATUITO - ORTA NOVIAS")
    print("="*50)
    
    print("Esta instalación te dará:")
    print("✅ WhatsApp 100% GRATUITO")
    print("✅ Sin límites de mensajes")
    print("✅ Sin necesidad de API keys")
    print("✅ Integración automática")
    
    response = input("\n¿Continuar con la instalación? (s/n): ").lower()
    if response not in ['s', 'si', 'y', 'yes']:
        print("❌ Instalación cancelada")
        return
    
    # Instalar PyWhatKit
    if not install_pywhatkit():
        print("❌ Error en la instalación")
        return
    
    # Probar instalación
    if not test_installation():
        print("❌ Error en la verificación")
        return
    
    # Mostrar instrucciones
    show_usage_instructions()
    
    print("\n✅ ¡Instalación completada exitosamente!")

if __name__ == "__main__":
    main()
