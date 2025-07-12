#!/usr/bin/env python3
"""
Prueba simple de PyWhatKit sin Django
"""
import sys

def test_pywhatkit():
    """Probar PyWhatKit básico"""
    print("🧪 TEST PYWHATKIT SIMPLE")
    print("="*40)
    
    try:
        import pywhatkit as pwk
        print("✅ PyWhatKit importado correctamente")
        
        # Probar formateo de número
        test_phone = "+34612345678"
        test_message = "🧪 Mensaje de prueba desde Orta Novias ✨"
        
        print(f"\n📱 Para enviar mensaje a: {test_phone}")
        print(f"📝 Mensaje: {test_message}")
        
        response = input("\n¿Enviar mensaje de prueba? (s/n): ").lower()
        if response in ['s', 'si', 'y', 'yes']:
            print("\n⚠️  IMPORTANTE:")
            print("1. Asegúrate de tener WhatsApp Web abierto")
            print("2. Estar logueado en WhatsApp Web")
            print("3. El mensaje se enviará en ~1 minuto")
            
            confirm = input("\n¿Continuar? (s/n): ").lower()
            if confirm in ['s', 'si', 'y', 'yes']:
                from datetime import datetime, timedelta
                
                # Programar para 1 minuto después
                now = datetime.now()
                send_time = now + timedelta(minutes=1)
                
                print(f"\n📤 Programando mensaje para {send_time.strftime('%H:%M:%S')}")
                print("⏳ Preparando WhatsApp Web...")
                
                try:
                    pwk.sendwhatmsg(
                        test_phone,
                        test_message,
                        send_time.hour,
                        send_time.minute,
                        15  # Esperar 15 segundos
                    )
                    print("✅ ¡Mensaje programado exitosamente!")
                    print("💡 El navegador se abrirá automáticamente")
                    
                except Exception as e:
                    print(f"❌ Error enviando mensaje: {e}")
                    print("💡 Asegúrate de tener WhatsApp Web configurado")
            else:
                print("❌ Envío cancelado")
        else:
            print("✅ Test completado sin envío")
        
        return True
        
    except ImportError:
        print("❌ PyWhatKit no está instalado")
        print("💡 Ejecutar: pip install pywhatkit")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def show_usage_guide():
    """Mostrar guía de uso"""
    print("\n" + "="*50)
    print("📚 GUÍA DE USO - WHATSAPP GRATUITO")
    print("="*50)
    
    print("\n1️⃣ REQUISITOS:")
    print("   ✅ PyWhatKit instalado")
    print("   ✅ WhatsApp Web abierto en navegador")
    print("   ✅ Sesión iniciada en WhatsApp Web")
    
    print("\n2️⃣ CÓMO FUNCIONA:")
    print("   • PyWhatKit programa mensajes")
    print("   • Abre WhatsApp Web automáticamente")
    print("   • Envía el mensaje programado")
    print("   • Funciona con cualquier número")
    
    print("\n3️⃣ INTEGRACIÓN EN ORTA NOVIAS:")
    print("""
# Ejemplo de uso en tu código:
from backend.apps.notifications.whatsapp_free import send_whatsapp_now

# Enviar confirmación de cita
success = send_whatsapp_now(
    "+34612345678",
    "¡Hola María! Tu cita en Orta Novias está confirmada para mañana a las 15:30 👗"
)

if success:
    print("✅ Mensaje programado")
else:
    print("❌ Error enviando mensaje")
    """)
    
    print("\n4️⃣ VENTAJAS:")
    print("   ✅ 100% Gratuito")
    print("   ✅ Sin límites de mensajes")
    print("   ✅ Sin API keys necesarias")
    print("   ✅ Fácil de usar")
    
    print("\n5️⃣ LIMITACIONES:")
    print("   ⚠️  Requiere WhatsApp Web abierto")
    print("   ⚠️  Programación (no inmediato)")
    print("   ⚠️  Puede abrir ventana del navegador")
    
    print("\n📞 NÚMEROS DE PRUEBA:")
    print("   • Tu número personal para probar")
    print("   • Formato: +34612345678")
    print("   • Asegúrate de tener WhatsApp activo")

def main():
    """Función principal"""
    print("🚀 PRUEBA RÁPIDA WHATSAPP GRATUITO")
    print("   Para Orta Novias - Sistema de notificaciones")
    print()
    
    # Test básico
    if test_pywhatkit():
        show_usage_guide()
    
    print("\n🎯 PRÓXIMOS PASOS:")
    print("1. Probar envío con tu número")
    print("2. Integrar en sistema de citas")
    print("3. Configurar mensajes automáticos")
    print("4. ¡Disfrutar de WhatsApp gratis!")

if __name__ == "__main__":
    main()
