#!/bin/bash

# 🚀 Marketing Setup Script - Orta Novias
# Script para configurar todas las herramientas de marketing

echo "🎯 Configurando Marketing Tools para Orta Novias..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}📘 $1${NC}"
}

echo ""
echo "===========================================" 
echo "🎯 MARKETING SETUP - ORTA NOVIAS"
echo "==========================================="

# 1. Verificar archivos de marketing
echo ""
echo "🔍 Verificando archivos de marketing..."

if [ -f "frontend/src/lib/marketing.ts" ]; then
    print_status "Marketing library creada"
else
    print_error "Marketing library faltante"
fi

if [ -f "frontend/src/components/SocialMediaShare.tsx" ]; then
    print_status "Componente de redes sociales creado"
else
    print_error "Componente de redes sociales faltante"
fi

# 2. Configurar variables de entorno
echo ""
echo "📝 Configurando variables de entorno..."

ENV_FILE="frontend/.env.local"

if [ ! -f "$ENV_FILE" ]; then
    print_info "Creando archivo .env.local..."
    cp frontend/.env.example "$ENV_FILE"
    print_status "Archivo .env.local creado desde template"
else
    print_status "Archivo .env.local ya existe"
fi

# 3. Instalar dependencias necesarias
echo ""
echo "📦 Verificando dependencias..."

cd frontend

# Verificar si package.json tiene las dependencias necesarias
if grep -q "react-helmet-async" package.json; then
    print_status "React Helmet Async encontrado"
else
    print_warning "Instalando React Helmet Async..."
    npm install react-helmet-async
fi

cd ..

# 4. Generar guía de configuración
echo ""
echo "📋 Generando guía de configuración..."

cat > "MARKETING_SETUP_GUIDE.md" << 'EOF'
# 🎯 Guía de Configuración de Marketing - Orta Novias

## 🚀 Pasos para Activar Marketing

### 1. Google Analytics 4
```bash
# Ir a: https://analytics.google.com/
# 1. Crear cuenta "Orta Novias"
# 2. Crear propiedad web
# 3. Copiar Measurement ID (G-XXXXXXXXXX)
# 4. Agregar a .env.local:
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Facebook Pixel
```bash
# Ir a: https://business.facebook.com/
# 1. Events Manager → Create Pixel
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
