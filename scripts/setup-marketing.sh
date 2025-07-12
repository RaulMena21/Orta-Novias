#!/bin/bash

# 🎯 Script de Setup de Marketing - Orta Novias
# Configuración interactiva de todas las cuentas de marketing

echo "🎯 Setup de Marketing - Orta Novias"
echo "==================================="
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Variables
MARKETING_FILE="frontend/src/lib/marketing.ts"
ENV_FILE=".env"

echo -e "${CYAN}Este script te ayudará a configurar todas las cuentas de marketing paso a paso.${NC}"
echo ""

# Función para crear backup
create_backup() {
    local file=$1
    if [ -f "$file" ]; then
        cp "$file" "${file}.backup.$(date +%Y%m%d_%H%M%S)"
        echo -e "${GREEN}✅ Backup creado para $file${NC}"
    fi
}

# Función para actualizar marketing.ts
update_marketing_config() {
    local service=$1
    local id=$2
    local pattern=$3
    local replacement=$4
    
    if [ -f "$MARKETING_FILE" ]; then
        sed -i "s/$pattern/$replacement/g" "$MARKETING_FILE"
        echo -e "${GREEN}✅ $service configurado en marketing.ts${NC}"
    else
        echo -e "${RED}❌ No se encontró $MARKETING_FILE${NC}"
    fi
}

# Función para actualizar .env
update_env_config() {
    local key=$1
    local value=$2
    
    if [ -f "$ENV_FILE" ]; then
        if grep -q "^$key=" "$ENV_FILE"; then
            sed -i "s/^$key=.*/$key=$value/" "$ENV_FILE"
        else
            echo "$key=$value" >> "$ENV_FILE"
        fi
        echo -e "${GREEN}✅ $key agregado a .env${NC}"
    else
        echo "$key=$value" > "$ENV_FILE"
        echo -e "${GREEN}✅ .env creado con $key${NC}"
    fi
}

# 1. GOOGLE ANALYTICS 4
echo -e "${BLUE}📊 CONFIGURACIÓN GOOGLE ANALYTICS 4${NC}"
echo "=================================="
echo ""
echo "📋 PASOS:"
echo "1. Ve a https://analytics.google.com"
echo "2. Crear cuenta → Crear propiedad"
echo "3. Nombre: 'Orta Novias'"
echo "4. URL: tu dominio"
echo "5. Copiar el Measurement ID (G-XXXXXXXXXX)"
echo ""

read -p "🔑 Ingresa tu Google Analytics Measurement ID (G-XXXXXXXXXX): " GA_ID

if [[ -n "$GA_ID" ]]; then
    create_backup "$MARKETING_FILE"
    update_marketing_config "Google Analytics" "$GA_ID" "GA_MEASUREMENT_ID = ''" "GA_MEASUREMENT_ID = '$GA_ID'"
    update_env_config "GOOGLE_ANALYTICS_ID" "$GA_ID"
    echo -e "${GREEN}✅ Google Analytics configurado: $GA_ID${NC}"
else
    echo -e "${YELLOW}⚠️ Google Analytics omitido${NC}"
fi

echo ""

# 2. FACEBOOK PIXEL
echo -e "${BLUE}📘 CONFIGURACIÓN FACEBOOK PIXEL${NC}"
echo "==============================="
echo ""
echo "📋 PASOS:"
echo "1. Ve a https://business.facebook.com"
echo "2. Crear Business Manager (si no tienes)"
echo "3. Configuración → Orígenes de datos → Pixeles"
echo "4. Crear pixel → Nombre: 'Orta Novias'"
echo "5. Copiar el Pixel ID (números)"
echo ""

read -p "🔑 Ingresa tu Facebook Pixel ID: " FB_PIXEL_ID

if [[ -n "$FB_PIXEL_ID" ]]; then
    update_marketing_config "Facebook Pixel" "$FB_PIXEL_ID" "FACEBOOK_PIXEL_ID = ''" "FACEBOOK_PIXEL_ID = '$FB_PIXEL_ID'"
    update_env_config "FACEBOOK_PIXEL_ID" "$FB_PIXEL_ID"
    echo -e "${GREEN}✅ Facebook Pixel configurado: $FB_PIXEL_ID${NC}"
else
    echo -e "${YELLOW}⚠️ Facebook Pixel omitido${NC}"
fi

echo ""

# 3. GOOGLE ADS
echo -e "${BLUE}🎯 CONFIGURACIÓN GOOGLE ADS${NC}"
echo "============================"
echo ""
echo "📋 PASOS:"
echo "1. Ve a https://ads.google.com"
echo "2. Crear cuenta de Google Ads"
echo "3. Herramientas → Medición → Conversiones"
echo "4. Nueva acción de conversión → Sitio web"
echo "5. Copiar el ID de conversión (AW-XXXXXXXXX)"
echo ""

read -p "🔑 Ingresa tu Google Ads Conversion ID (AW-XXXXXXXXX): " GOOGLE_ADS_ID

if [[ -n "$GOOGLE_ADS_ID" ]]; then
    update_marketing_config "Google Ads" "$GOOGLE_ADS_ID" "GOOGLE_ADS_CONVERSION_ID = ''" "GOOGLE_ADS_CONVERSION_ID = '$GOOGLE_ADS_ID'"
    update_env_config "GOOGLE_ADS_CONVERSION_ID" "$GOOGLE_ADS_ID"
    echo -e "${GREEN}✅ Google Ads configurado: $GOOGLE_ADS_ID${NC}"
else
    echo -e "${YELLOW}⚠️ Google Ads omitido${NC}"
fi

echo ""

# 4. HOTJAR
echo -e "${BLUE}🔥 CONFIGURACIÓN HOTJAR${NC}"
echo "======================"
echo ""
echo "📋 PASOS:"
echo "1. Ve a https://www.hotjar.com"
echo "2. Crear cuenta gratuita"
echo "3. Agregar sitio → URL de tu dominio"
echo "4. Copiar el Site ID (números)"
echo ""

read -p "🔑 Ingresa tu Hotjar Site ID: " HOTJAR_ID

if [[ -n "$HOTJAR_ID" ]]; then
    update_marketing_config "Hotjar" "$HOTJAR_ID" "HOTJAR_SITE_ID = ''" "HOTJAR_SITE_ID = '$HOTJAR_ID'"
    update_env_config "HOTJAR_SITE_ID" "$HOTJAR_ID"
    echo -e "${GREEN}✅ Hotjar configurado: $HOTJAR_ID${NC}"
else
    echo -e "${YELLOW}⚠️ Hotjar omitido${NC}"
fi

echo ""

# 5. CONFIGURACIONES ADICIONALES
echo -e "${BLUE}⚙️ CONFIGURACIONES ADICIONALES${NC}"
echo "==============================="
echo ""

# WhatsApp Business
read -p "📱 ¿Tienes WhatsApp Business API Token? (opcional): " WHATSAPP_TOKEN
if [[ -n "$WHATSAPP_TOKEN" ]]; then
    update_env_config "WHATSAPP_ACCESS_TOKEN" "$WHATSAPP_TOKEN"
    echo -e "${GREEN}✅ WhatsApp Business configurado${NC}"
fi

# Email SMTP
read -p "📧 ¿Tienes SMTP para emails? Gmail/SendGrid (optional): " SMTP_HOST
if [[ -n "$SMTP_HOST" ]]; then
    read -p "📧 SMTP Usuario: " SMTP_USER
    read -p "📧 SMTP Password: " SMTP_PASS
    
    update_env_config "EMAIL_HOST" "$SMTP_HOST"
    update_env_config "EMAIL_HOST_USER" "$SMTP_USER"
    update_env_config "EMAIL_HOST_PASSWORD" "$SMTP_PASS"
    echo -e "${GREEN}✅ Email SMTP configurado${NC}"
fi

echo ""

# 6. VERIFICACIÓN
echo -e "${PURPLE}� VERIFICACIÓN DE CONFIGURACIÓN${NC}"
echo "================================="
echo ""

if [ -f "$MARKETING_FILE" ]; then
    echo "📊 Configuraciones en marketing.ts:"
    grep -E "(GA_MEASUREMENT_ID|FACEBOOK_PIXEL_ID|GOOGLE_ADS_CONVERSION_ID|HOTJAR_SITE_ID)" "$MARKETING_FILE" | sed 's/^/   /'
    echo ""
fi

if [ -f "$ENV_FILE" ]; then
    echo "🔧 Variables de entorno configuradas:"
    grep -E "(GOOGLE_ANALYTICS_ID|FACEBOOK_PIXEL_ID|GOOGLE_ADS_CONVERSION_ID|HOTJAR_SITE_ID)" "$ENV_FILE" | sed 's/^/   /'
    echo ""
fi

# 7. TESTING
echo -e "${CYAN}🧪 TESTING DE CONFIGURACIÓN${NC}"
echo "============================"
echo ""

echo "Para verificar que todo funciona:"
echo ""
echo "1. 🚀 Iniciar el servidor:"
echo "   npm run dev"
echo ""
echo "2. 🌐 Abrir en browser:"
echo "   http://localhost:3000"
echo ""
echo "3. 🔍 Verificar en Dev Tools → Network:"
echo "   - analytics.google.com (GA4)"
echo "   - facebook.com/tr (Pixel)"
echo "   - googleadservices.com (Ads)"
echo "   - hotjar.com (Hotjar)"
echo ""

# 8. PRÓXIMOS PASOS
echo -e "${GREEN}✅ CONFIGURACIÓN COMPLETADA${NC}"
echo "=========================="
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo ""
echo "1. 🧪 Testing:"
echo "   npm run test:marketing"
echo ""
echo "2. 🚀 Deploy a producción:"
echo "   docker-compose up -d"
echo ""
echo "3. 📊 Verificar analytics:"
echo "   - Google Analytics: Tiempo real"
echo "   - Facebook: Events Manager"
echo "   - Google Ads: Conversiones"
echo "   - Hotjar: Heatmaps"
echo ""
echo "4. 📈 Monitoreo:"
echo "   - Configurar alertas"
echo "   - Dashboard de métricas"
echo "   - Reports automatizados"
echo ""

echo -e "${CYAN}🎉 ¡Marketing setup completado para Orta Novias!${NC}"
echo ""
echo "📞 ¿Necesitas ayuda? Consulta docs/MARKETING_GUIDE.md"
# 2. Copiar Pixel ID
# 3. Agregar a .env.local:
VITE_FACEBOOK_PIXEL_ID=XXXXXXXXXXXXXXXXX
```

### 3. Google Ads
```bash
# Ir a: https://ads.google.com/
# 1. Tools → Conversions → New Conversion Action
# 2. Copiar Conversion ID
# 3. Agregar a .env.local:
VITE_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXXX
```

### 4. Hotjar
```bash
# Ir a: https://hotjar.com/
# 1. Create organization "Orta Novias"
# 2. Copiar Site ID
# 3. Agregar a .env.local:
VITE_HOTJAR_SITE_ID=XXXXXXX
```

## 📊 Verificar Instalación

1. **Abrir DevTools → Console**
2. **Buscar mensajes de inicialización:**
   - "📊 Google Analytics 4 initialized"
   - "📘 Facebook Pixel initialized"
   - "🎯 Google Ads tracking initialized"
   - "🔥 Hotjar tracking initialized"

## 🎨 Componentes Disponibles

### SocialMediaShare
```tsx
import SocialMediaShare from '../components/SocialMediaShare';

<SocialMediaShare
  shareUrl="https://ortanovias.com/vestidos/1"
  shareTitle="Vestido de Novia Elegante"
  shareDescription="Descubre este hermoso vestido"
  showFollow={true}
/>
```

### Marketing Hooks
```tsx
import { useMarketing } from '../lib/marketing';

const { trackAppointmentBooking, trackDressView } = useMarketing();

// Tracking cita agendada
trackAppointmentBooking({
  serviceType: 'Prueba de vestido',
  date: '2024-01-15'
});

// Tracking visualización de vestido
trackDressView({
  id: 1,
  name: 'Vestido Elegante',
  category: 'Clásico',
  price: 1200
});
```

## 🔧 Troubleshooting

### Error: Variables no definidas
- Verificar que .env.local tiene todas las variables
- Reiniciar servidor de desarrollo

### Error: Scripts no cargan
- Verificar conexión a internet
- Verificar IDs de tracking válidos

### Error: Eventos no se registran
- Abrir DevTools → Network tab
- Verificar requests a analytics/pixel endpoints

## 📈 Próximos Pasos

1. **Configurar campañas de retargeting**
2. **Crear audiences personalizadas**
3. **Setup de A/B testing**
4. **Dashboard de métricas**
5. **Automatización de marketing**
EOF

print_status "Guía de configuración generada"

# 5. Mostrar resumen
echo ""
echo "=========================================="
echo "✅ MARKETING SETUP COMPLETADO"
echo "=========================================="
echo ""
print_info "Archivos creados:"
echo "   • frontend/src/lib/marketing.ts"
echo "   • frontend/src/components/SocialMediaShare.tsx" 
echo "   • docs/MARKETING_SETUP.md"
echo "   • MARKETING_SETUP_GUIDE.md"
echo ""
print_warning "SIGUIENTE PASO:"
echo "   1. Configurar IDs de tracking en frontend/.env.local"
echo "   2. Leer MARKETING_SETUP_GUIDE.md para configuración detallada"
echo "   3. Testear en desarrollo antes de producción"
echo ""
print_info "Para verificar instalación:"
echo "   • cd frontend && npm run dev"
echo "   • Abrir DevTools → Console"
echo "   • Buscar mensajes de inicialización de marketing"
echo ""

# 6. Test de configuración actual
echo "🧪 Testeando configuración actual..."

if [ -f "frontend/.env.local" ]; then
    if grep -q "VITE_GA_MEASUREMENT_ID=" frontend/.env.local; then
        if grep -q "VITE_GA_MEASUREMENT_ID=G-" frontend/.env.local; then
            print_status "Google Analytics configurado"
        else
            print_warning "Google Analytics: ID no configurado"
        fi
    else
        print_warning "Google Analytics: Variable faltante"
    fi
    
    if grep -q "VITE_FACEBOOK_PIXEL_ID=" frontend/.env.local; then
        print_warning "Facebook Pixel: Verificar configuración"
    else
        print_warning "Facebook Pixel: Variable faltante"
    fi
else
    print_error "Archivo .env.local no encontrado"
fi

echo ""
echo "🎯 Marketing setup completado! 🎉"
echo "📖 Consulta MARKETING_SETUP_GUIDE.md para instrucciones detalladas"
