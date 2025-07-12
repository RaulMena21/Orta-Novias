# 🎯 Configuración de Cuentas de Marketing - Orta Novias
# Guía paso a paso para crear todas las cuentas necesarias

## 📋 Lista de Cuentas Necesarias

### ✅ Cuentas a Crear:
1. **Google Analytics 4** - Análisis de tráfico web
2. **Facebook Business Manager** - Facebook e Instagram Ads
3. **Google Ads** - Publicidad en Google
4. **Hotjar** - Análisis de comportamiento de usuarios
5. **Google Search Console** - SEO y posicionamiento
6. **Pinterest Business** - Marketing en Pinterest
7. **TikTok Business** - Marketing en TikTok

---

## 🚀 PASO 1: GOOGLE ANALYTICS 4

### Crear Cuenta:
1. Ve a: https://analytics.google.com/
2. Haz clic en "Comenzar gratis"
3. Inicia sesión con tu cuenta de Google

### Configurar Propiedad:
1. **Nombre de la cuenta**: "Orta Novias"
2. **Nombre de la propiedad**: "Orta Novias Website"
3. **Zona horaria**: España (GMT+1)
4. **Moneda**: EUR - Euro
5. **Categoría del sector**: Comercio minorista
6. **Tamaño de la empresa**: Empresa pequeña (1-10 empleados)

### Configurar Flujo de Datos:
1. **Plataforma**: Web
2. **URL del sitio web**: https://www.ortanovias.com
3. **Nombre del flujo**: "Orta Novias Web"
4. **Habilitar Enhanced Measurement**: ✅ SÍ

### Obtener Measurement ID:
- Busca el código que empieza con `G-` (ejemplo: G-ABC123DEF4)
- **GUARDA ESTE ID** ⭐

---

## 📘 PASO 2: FACEBOOK BUSINESS MANAGER

### Crear Cuenta Business:
1. Ve a: https://business.facebook.com/
2. Haz clic en "Crear cuenta"
3. **Nombre del negocio**: "Orta Novias"
4. **Tu nombre**: [Tu nombre completo]
5. **Email del negocio**: info@ortanovias.com

### Configurar Páginas:
1. **Crear página de Facebook**:
   - Nombre: "Orta Novias Madrid"
   - Categoría: "Tienda de vestidos de novia"
   - Dirección: [Tu dirección de la tienda]
   
2. **Crear página de Instagram**:
   - Vincular con Facebook
   - Username: @ortanovias

### Crear Facebook Pixel:
1. En Business Manager → "Events Manager"
2. Haz clic en "Conectar orígenes de datos"
3. Selecciona "Web" → "Facebook Pixel"
4. **Nombre del pixel**: "Orta Novias Pixel"
5. **URL del sitio web**: https://www.ortanovias.com
6. **GUARDA EL PIXEL ID** ⭐ (número de 15-16 dígitos)

---

## 🎯 PASO 3: GOOGLE ADS

### Crear Cuenta:
1. Ve a: https://ads.google.com/
2. Haz clic en "Comenzar ahora"
3. **Objetivo inicial**: "Obtener más ventas"
4. **Tipo de negocio**: "Tienda de vestidos de novia"

### Configurar Conversiones:
1. Ve a "Herramientas y configuración" → "Conversiones"
2. Haz clic en "Nueva acción de conversión"
3. **Origen**: "Sitio web"
4. **Categoría**: "Contacto"
5. **Nombre**: "Cita Agendada"
6. **Valor**: Sin valor específico
7. **Recuento**: "Una"
8. **Ventana de conversión**: 30 días

### Obtener Conversion ID:
- Busca el código que empieza con `AW-` (ejemplo: AW-123456789)
- **GUARDA ESTE ID** ⭐

---

## 🔥 PASO 4: HOTJAR

### Crear Cuenta:
1. Ve a: https://www.hotjar.com/
2. Haz clic en "Sign up free"
3. **Organización**: "Orta Novias"
4. **Sitio web**: https://www.ortanovias.com
5. **Tipo de sitio**: "E-commerce"

### Configurar Sitio:
1. **Nombre del sitio**: "Orta Novias"
2. **URL**: https://www.ortanovias.com
3. **Categoría**: "Fashion & Beauty"
4. **Plan**: Básico (gratuito)

### Obtener Site ID:
- Busca el número del sitio (ejemplo: 1234567)
- **GUARDA ESTE ID** ⭐

---

## 🔍 PASO 5: GOOGLE SEARCH CONSOLE

### Configurar:
1. Ve a: https://search.google.com/search-console/
2. Haz clic en "Añadir propiedad"
3. **Tipo**: "Prefijo de URL"
4. **URL**: https://www.ortanovias.com

### Verificar Propiedad:
1. **Método**: "Etiqueta HTML"
2. Copia el código de verificación
3. **Lo configuraremos en el código después**

---

## 📌 PASO 6: PINTEREST BUSINESS

### Crear Cuenta:
1. Ve a: https://business.pinterest.com/
2. **Tipo de cuenta**: "Empresa"
3. **Nombre del negocio**: "Orta Novias"
4. **Tipo de negocio**: "Comercio minorista"
5. **Website**: https://www.ortanovias.com

---

## 🎵 PASO 7: TIKTOK BUSINESS

### Crear Cuenta:
1. Ve a: https://ads.tiktok.com/
2. **País/Región**: España
3. **Tipo de negocio**: "Moda y belleza"
4. **Nombre de la empresa**: "Orta Novias"

---

## 📝 CONFIGURAR VARIABLES DE ENTORNO

Una vez que tengas todos los IDs, actualiza el archivo `.env.production`:

```bash
# Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-[TU_ID_AQUI]

# Facebook Pixel
VITE_FACEBOOK_PIXEL_ID=[TU_PIXEL_ID_AQUI]

# Google Ads
VITE_GOOGLE_ADS_CONVERSION_ID=AW-[TU_CONVERSION_ID_AQUI]

# Hotjar
VITE_HOTJAR_SITE_ID=[TU_SITE_ID_AQUI]
```

---

## ✅ CHECKLIST DE CONFIGURACIÓN

### Google Analytics 4:
- [ ] Cuenta creada
- [ ] Propiedad configurada
- [ ] Measurement ID obtenido: `G-__________`
- [ ] Enhanced Measurement habilitado

### Facebook Business:
- [ ] Business Manager creado
- [ ] Página de Facebook creada
- [ ] Instagram conectado
- [ ] Facebook Pixel creado
- [ ] Pixel ID obtenido: `________________`

### Google Ads:
- [ ] Cuenta creada
- [ ] Conversión configurada
- [ ] Conversion ID obtenido: `AW-__________`

### Hotjar:
- [ ] Cuenta creada
- [ ] Sitio configurado
- [ ] Site ID obtenido: `_______`

### Google Search Console:
- [ ] Propiedad añadida
- [ ] Verificación pendiente

### Pinterest Business:
- [ ] Cuenta creada
- [ ] Perfil configurado

### TikTok Business:
- [ ] Cuenta creada
- [ ] Configuración inicial

---

## 🚀 PRÓXIMOS PASOS

1. **Completar todas las cuentas** usando esta guía
2. **Recopilar todos los IDs** en un documento seguro
3. **Configurar variables de entorno** en producción
4. **Testear tracking** en desarrollo
5. **Crear campañas iniciales** después del lanzamiento

---

## 📞 SOPORTE

Si tienes problemas con alguna configuración:
- **Google**: soporte.google.com
- **Facebook**: business.facebook.com/help
- **Hotjar**: help.hotjar.com

¡Una vez tengas todos los IDs, podremos activar el tracking completo! 🎉
