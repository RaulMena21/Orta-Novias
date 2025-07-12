#!/usr/bin/env python3
"""
🎯 Marketing Account Setup Assistant - Orta Novias
Asistente interactivo para configurar cuentas de marketing
"""

import json
import os
from datetime import datetime

def print_header():
    print("\n" + "="*60)
    print("🎯 ASISTENTE DE CONFIGURACIÓN DE MARKETING")
    print("    Orta Novias - Setup de Cuentas")
    print("="*60)

def print_step(number, title, description):
    print(f"\n📋 PASO {number}: {title}")
    print(f"   {description}")
    print("-" * 50)

def get_user_input(prompt, required=True):
    while True:
        value = input(f"💬 {prompt}: ").strip()
        if value or not required:
            return value
        print("❌ Este campo es requerido. Por favor, ingresa un valor.")

def validate_ga_id(ga_id):
    return ga_id.startswith('G-') and len(ga_id) >= 10

def validate_pixel_id(pixel_id):
    return pixel_id.isdigit() and len(pixel_id) >= 15

def validate_ads_id(ads_id):
    return ads_id.startswith('AW-') and len(ads_id) >= 12

def validate_hotjar_id(hotjar_id):
    return hotjar_id.isdigit() and len(hotjar_id) >= 6

def main():
    print_header()
    
    print("\n🚀 Este asistente te ayudará a configurar todas las cuentas de marketing")
    print("   para Orta Novias paso a paso.\n")
    
    input("🟢 Presiona ENTER para continuar...")
    
    # Configuración
    config = {
        'business_info': {},
        'marketing_accounts': {},
        'setup_date': datetime.now().isoformat(),
        'status': 'in_progress'
    }
    
    # Información del negocio
    print_step(1, "INFORMACIÓN DEL NEGOCIO", "Configuremos los datos básicos")
    
    config['business_info'] = {
        'name': get_user_input("Nombre del negocio", required=False) or "Orta Novias",
        'website': get_user_input("URL del sitio web", required=False) or "https://www.ortanovias.com",
        'email': get_user_input("Email de contacto", required=False) or "info@ortanovias.com",
        'phone': get_user_input("Teléfono de contacto", required=False),
        'address': get_user_input("Dirección de la tienda", required=False),
        'city': get_user_input("Ciudad", required=False) or "Madrid",
        'country': get_user_input("País", required=False) or "España"
    }
    
    # Google Analytics 4
    print_step(2, "GOOGLE ANALYTICS 4", "Configurar análisis web")
    print("📊 Ve a: https://analytics.google.com/")
    print("   1. Crear cuenta 'Orta Novias'")
    print("   2. Configurar propiedad web")
    print("   3. Copiar el Measurement ID (formato: G-XXXXXXXXXX)")
    
    while True:
        ga_id = get_user_input("Measurement ID de Google Analytics (G-XXXXXXXXXX)", required=False)
        if not ga_id:
            config['marketing_accounts']['google_analytics'] = {'status': 'pending'}
            break
        elif validate_ga_id(ga_id):
            config['marketing_accounts']['google_analytics'] = {
                'measurement_id': ga_id,
                'status': 'configured'
            }
            print(f"✅ Google Analytics configurado: {ga_id}")
            break
        else:
            print("❌ ID inválido. Debe empezar con 'G-' y tener al menos 10 caracteres")
    
    # Facebook Pixel
    print_step(3, "FACEBOOK PIXEL", "Configurar tracking de Facebook/Instagram")
    print("📘 Ve a: https://business.facebook.com/")
    print("   1. Crear Business Manager")
    print("   2. Ir a Events Manager → Create Pixel")
    print("   3. Copiar el Pixel ID (15-16 dígitos)")
    
    while True:
        pixel_id = get_user_input("Facebook Pixel ID", required=False)
        if not pixel_id:
            config['marketing_accounts']['facebook_pixel'] = {'status': 'pending'}
            break
        elif validate_pixel_id(pixel_id):
            config['marketing_accounts']['facebook_pixel'] = {
                'pixel_id': pixel_id,
                'status': 'configured'
            }
            print(f"✅ Facebook Pixel configurado: {pixel_id}")
            break
        else:
            print("❌ ID inválido. Debe ser un número de 15-16 dígitos")
    
    # Google Ads
    print_step(4, "GOOGLE ADS", "Configurar conversiones de Google Ads")
    print("🎯 Ve a: https://ads.google.com/")
    print("   1. Crear cuenta de Google Ads")
    print("   2. Ir a Herramientas → Conversiones")
    print("   3. Crear conversión 'Cita Agendada'")
    print("   4. Copiar Conversion ID (formato: AW-XXXXXXXXXX)")
    
    while True:
        ads_id = get_user_input("Google Ads Conversion ID (AW-XXXXXXXXXX)", required=False)
        if not ads_id:
            config['marketing_accounts']['google_ads'] = {'status': 'pending'}
            break
        elif validate_ads_id(ads_id):
            config['marketing_accounts']['google_ads'] = {
                'conversion_id': ads_id,
                'status': 'configured'
            }
            print(f"✅ Google Ads configurado: {ads_id}")
            break
        else:
            print("❌ ID inválido. Debe empezar con 'AW-' y tener al menos 12 caracteres")
    
    # Hotjar
    print_step(5, "HOTJAR", "Configurar análisis de comportamiento")
    print("🔥 Ve a: https://www.hotjar.com/")
    print("   1. Crear cuenta gratuita")
    print("   2. Añadir sitio web")
    print("   3. Copiar Site ID (6-7 dígitos)")
    
    while True:
        hotjar_id = get_user_input("Hotjar Site ID", required=False)
        if not hotjar_id:
            config['marketing_accounts']['hotjar'] = {'status': 'pending'}
            break
        elif validate_hotjar_id(hotjar_id):
            config['marketing_accounts']['hotjar'] = {
                'site_id': hotjar_id,
                'status': 'configured'
            }
            print(f"✅ Hotjar configurado: {hotjar_id}")
            break
        else:
            print("❌ ID inválido. Debe ser un número de 6-7 dígitos")
    
    # Resumen
    print("\n" + "="*60)
    print("📊 RESUMEN DE CONFIGURACIÓN")
    print("="*60)
    
    for account, data in config['marketing_accounts'].items():
        status = data.get('status', 'unknown')
        if status == 'configured':
            print(f"✅ {account.replace('_', ' ').title()}: Configurado")
        else:
            print(f"⏳ {account.replace('_', ' ').title()}: Pendiente")
    
    # Generar archivo .env
    env_content = generate_env_content(config)
    
    print(f"\n📝 VARIABLES DE ENTORNO GENERADAS:")
    print("-" * 50)
    print(env_content)
    
    # Guardar configuración
    save_choice = get_user_input("\n💾 ¿Guardar configuración en archivo? (s/n)", required=False) or "s"
    
    if save_choice.lower() == 's':
        # Guardar JSON de configuración
        with open('marketing_config.json', 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
        
        # Guardar variables de entorno
        env_file = 'frontend/.env.marketing'
        with open(env_file, 'w', encoding='utf-8') as f:
            f.write(env_content)
        
        print(f"✅ Configuración guardada en:")
        print(f"   • marketing_config.json")
        print(f"   • {env_file}")
    
    # Próximos pasos
    print("\n🚀 PRÓXIMOS PASOS:")
    print("1. Completar las cuentas pendientes")
    print("2. Actualizar variables de entorno en producción")
    print("3. Testear tracking en desarrollo")
    print("4. Configurar campañas de marketing")
    
    print(f"\n✨ ¡Configuración de marketing lista para Orta Novias! ✨")

def generate_env_content(config):
    """Generar contenido del archivo .env con las configuraciones"""
    content = "# 🎯 Marketing Configuration - Orta Novias\n"
    content += f"# Generado el: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
    
    # Google Analytics
    ga = config['marketing_accounts'].get('google_analytics', {})
    if ga.get('measurement_id'):
        content += f"VITE_GA_MEASUREMENT_ID={ga['measurement_id']}\n"
    else:
        content += "# VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX\n"
    
    # Facebook Pixel
    fb = config['marketing_accounts'].get('facebook_pixel', {})
    if fb.get('pixel_id'):
        content += f"VITE_FACEBOOK_PIXEL_ID={fb['pixel_id']}\n"
    else:
        content += "# VITE_FACEBOOK_PIXEL_ID=XXXXXXXXXXXXXXXXX\n"
    
    # Google Ads
    ads = config['marketing_accounts'].get('google_ads', {})
    if ads.get('conversion_id'):
        content += f"VITE_GOOGLE_ADS_CONVERSION_ID={ads['conversion_id']}\n"
    else:
        content += "# VITE_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXXX\n"
    
    # Hotjar
    hotjar = config['marketing_accounts'].get('hotjar', {})
    if hotjar.get('site_id'):
        content += f"VITE_HOTJAR_SITE_ID={hotjar['site_id']}\n"
    else:
        content += "# VITE_HOTJAR_SITE_ID=XXXXXXX\n"
    
    content += "\n# Optional: Analytics Debug Mode\n"
    content += "VITE_ANALYTICS_DEBUG=false\n"
    
    return content

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Configuración cancelada por el usuario")
    except Exception as e:
        print(f"\n❌ Error durante la configuración: {e}")
