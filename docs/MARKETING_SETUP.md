# 📊 Marketing & Analytics Setup - Orta Novias

## 🎯 Marketing Tools Implementados

### 1. **Google Analytics 4**
- ✅ Tracking completo de conversiones
- ✅ Eventos personalizados para citas
- ✅ Seguimiento de visualización de vestidos
- ✅ Análisis de comportamiento de usuarios

### 2. **Facebook Pixel**
- ✅ Retargeting de usuarios
- ✅ Lookalike audiences
- ✅ Optimización de campañas de Facebook/Instagram
- ✅ Tracking de conversiones

### 3. **Google Ads**
- ✅ Conversion tracking
- ✅ Remarketing lists
- ✅ Performance measurement
- ✅ ROI optimization

### 4. **Hotjar**
- ✅ Heatmaps de comportamiento
- ✅ Session recordings
- ✅ User feedback
- ✅ Conversion funnel analysis

## 🚀 Configuración Requerida

### Variables de Entorno (.env)
```bash
# Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Facebook Pixel
VITE_FACEBOOK_PIXEL_ID=XXXXXXXXXXXXXXXXX

# Google Ads
VITE_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXXX

# Hotjar
VITE_HOTJAR_SITE_ID=XXXXXXX
```

### Obtener IDs:

#### Google Analytics 4:
1. Ir a [Google Analytics](https://analytics.google.com/)
2. Crear propiedad "Orta Novias"
3. Copiar Measurement ID (formato: G-XXXXXXXXXX)

#### Facebook Pixel:
1. Ir a [Facebook Business Manager](https://business.facebook.com/)
2. Events Manager → Create Pixel
3. Copiar Pixel ID

#### Google Ads:
1. Ir a [Google Ads](https://ads.google.com/)
2. Tools → Conversions → New Conversion Action
3. Copiar Conversion ID

#### Hotjar:
1. Ir a [Hotjar](https://hotjar.com/)
2. Create organization "Orta Novias"
3. Copiar Site ID

## 📈 Eventos Tracked

### Conversiones Principales:
- **Appointment Booking**: Cuando se agenda una cita
- **Contact Form**: Envío de formularios de contacto
- **Phone Call Click**: Clicks en número de teléfono
- **WhatsApp Click**: Clicks en botón de WhatsApp

### Engagement:
- **Dress View**: Visualización de vestidos específicos
- **Gallery Navigation**: Navegación por galería
- **Testimonial View**: Lectura de testimonios
- **Social Media Click**: Clicks en redes sociales

### E-commerce Tracking:
- **View Item**: Visualización de productos
- **Add to Wishlist**: Agregar a favoritos
- **Search**: Búsquedas realizadas
- **Filter Usage**: Uso de filtros de búsqueda

## 🎨 Marketing Automation

### Retargeting Campaigns:
1. **Visited Dresses**: Usuarios que vieron vestidos pero no agendaron cita
2. **Abandoned Appointment**: Usuarios que iniciaron pero no completaron cita
3. **Past Customers**: Ex-clientes para nuevas colecciones

### Lookalike Audiences:
1. **High-Value Customers**: Basado en clientes que compraron vestidos premium
2. **Appointment Bookers**: Usuarios que agendaron citas
3. **Engaged Users**: Usuarios con alta interacción en el sitio

## 📊 KPIs y Métricas

### Conversion Metrics:
- **Appointment Conversion Rate**: % de visitantes que agendan cita
- **Contact Form Conversion**: % de formularios completados
- **Phone Call Conversion**: % de clicks en teléfono
- **Page-to-Appointment**: Tiempo promedio de página a cita

### Engagement Metrics:
- **Time on Site**: Tiempo promedio en el sitio
- **Bounce Rate**: Tasa de rebote por página
- **Pages per Session**: Páginas vistas por sesión
- **Return Visitor Rate**: % de visitantes recurrentes

### Business Metrics:
- **Cost per Acquisition (CPA)**: Costo por cita agendada
- **Return on Ad Spend (ROAS)**: Retorno de inversión publicitaria
- **Customer Lifetime Value (CLV)**: Valor de vida del cliente
- **Lead Quality Score**: Calidad de leads generados

## 🚀 Implementación en Producción

### 1. Configurar Google Analytics 4:
```bash
# Obtener Measurement ID de Google Analytics
echo "VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX" >> frontend/.env.production
```

### 2. Configurar Facebook Pixel:
```bash
# Obtener Pixel ID de Facebook Business Manager
echo "VITE_FACEBOOK_PIXEL_ID=XXXXXXXXXXXXXXXXX" >> frontend/.env.production
```

### 3. Configurar Google Ads:
```bash
# Obtener Conversion ID de Google Ads
echo "VITE_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXXX" >> frontend/.env.production
```

### 4. Configurar Hotjar:
```bash
# Obtener Site ID de Hotjar
echo "VITE_HOTJAR_SITE_ID=XXXXXXX" >> frontend/.env.production
```

## 📱 Social Media Integration

### Instagram Business:
- Enlace directo desde galería de vestidos
- Stories highlighting con vestidos
- Shopping tags en posts

### Facebook Business:
- Catalog sync con vestidos
- Messenger integration
- Event promotion para trunk shows

### Pinterest Business:
- Rich Pins para vestidos
- Wedding board creation
- Seasonal collections

### TikTok Business:
- Behind-the-scenes content
- Dress try-on videos
- Wedding planning tips

## 🔒 Privacy & GDPR

### Cookie Consent:
- Implementar banner de cookies
- Gestión de preferencias de tracking
- Opt-out mechanisms

### Data Protection:
- Anonymización de datos sensibles
- Retention policies
- User data export/deletion

## 📊 Reporting Dashboard

### Weekly Reports:
- Traffic sources breakdown
- Conversion funnel analysis
- Top performing content
- Campaign performance

### Monthly Reports:
- ROI analysis
- Customer acquisition trends
- Seasonal performance
- Competitive analysis

---

**Next Steps:**
1. Obtener todos los IDs de tracking
2. Configurar campañas iniciales
3. Setup de audiences de retargeting
4. Implementar A/B testing
5. Dashboard de reporting automatizado
