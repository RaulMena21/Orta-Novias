# 📘 FACEBOOK PIXEL SETUP - Orta Novias

## 🎯 **SIGUIENTE PASO: FACEBOOK PIXEL**

### **¿Qué es Facebook Pixel?**
- **Tracking de visitantes** en Facebook/Instagram
- **Remarketing** a personas que visitaron tu web
- **Conversiones** de citas y contactos
- **Audiencias similares** basadas en clientes

---

## 🚀 **CREAR FACEBOOK BUSINESS MANAGER**

### **Paso 1: Ir a Facebook Business**
🔗 **URL**: https://business.facebook.com/

### **Paso 2: Crear Cuenta Business**
```
1. Clic "Crear cuenta"
2. Nombre del negocio: "Orta Novias"
3. Tu nombre: [Tu nombre]
4. Email del negocio: [tu email]
5. Siguiente
```

### **Paso 3: Información del Negocio**
```
1. Dirección: [Dirección de la tienda]
2. Número de teléfono: [Teléfono de contacto]
3. Sitio web: ortanovias.com
4. Descripción: "Boutique de vestidos de novia en Madrid"
5. Crear
```

---

## 🎯 **CREAR FACEBOOK PIXEL**

### **Paso 4: Crear Pixel**
```
1. Business Manager → Herramientas → Eventos
2. "Conectar fuentes de datos"
3. "Web" → "Facebook Pixel"
4. "Conectar" → "Crear nuevo píxel"
5. Nombre: "Orta Novias Pixel"
6. URL: ortanovias.com
7. Crear
```

### **Paso 5: Obtener Pixel ID**
```
🎯 RESULTADO: ID de 16 dígitos
📋 Ejemplo: 1234567890123456
```

---

## ⚡ **CONFIGURACIÓN RÁPIDA**

### **Método 1: Partner Integration (Recomendado)**
```
1. En configuración del pixel
2. "Agregar eventos" → "Desde el partner"
3. Buscar: "Google Tag Manager" o "Manual"
4. Seleccionar "Manual"
5. Copiar el código del pixel
```

### **Código que obtendrás:**
```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'TU_PIXEL_ID_AQUI');
fbq('track', 'PageView');
</script>
```

---

## 🔧 **EVENTOS IMPORTANTES PARA ORTA NOVIAS**

### **Eventos Estándar de Facebook:**
```javascript
// Página visitada
fbq('track', 'PageView');

// Cita solicitada (LEAD)
fbq('track', 'Lead', {
  content_name: 'Appointment Request',
  content_category: 'Bridal Consultation'
});

// Contacto por WhatsApp
fbq('track', 'Contact', {
  content_name: 'WhatsApp Contact',
  content_category: 'Customer Service'
});

// Vestido visualizado
fbq('track', 'ViewContent', {
  content_type: 'product',
  content_ids: [dress.id],
  content_name: dress.name,
  content_category: 'Wedding Dress'
});

// Inicio de proceso de cita
fbq('track', 'InitiateCheckout', {
  content_name: 'Appointment Process',
  content_category: 'Booking'
});
```

---

## 🎯 **VERIFICACIÓN DEL PIXEL**

### **Test con Facebook Pixel Helper:**

1. **Instalar extensión**: Facebook Pixel Helper (Chrome)
2. **Ir a tu web**: ortanovias.com
3. **Verificar**: Que aparezca el pixel verde
4. **Testear eventos**: Simular citas y contactos

### **Test de Eventos:**
```
✅ PageView se dispara al cargar
✅ Lead se dispara al enviar formulario
✅ Contact se dispara al hacer clic en WhatsApp
✅ ViewContent se dispara al ver vestidos
```

---

## 📊 **AUDIENCIAS PERSONALIZADAS**

### **Crear Audiencias:**
```
1. Business Manager → Audiencias
2. "Crear audiencia" → "Audiencia personalizada"
3. "Tráfico del sitio web"
4. Configurar:
   - Visitantes de ortanovias.com (30 días)
   - Personas que vieron vestidos específicos
   - Personas que iniciaron cita pero no completaron
```

### **Audiencias Recomendadas:**
```
🎯 "Visitantes recientes" - 7 días
🎯 "Interesados en vestidos" - 14 días  
🎯 "Abandonaron cita" - 30 días
🎯 "Clientes potenciales" - 60 días
```

---

## 🚀 **PRÓXIMOS PASOS:**

### **Una vez tengas el Pixel ID:**

1. **Google Ads** (15 min)
   - Conversión tracking
   - Google Ads pixel

2. **Hotjar** (10 min)
   - Heatmaps y recordings
   - Análisis de comportamiento

3. **Email Marketing** (20 min)
   - Mailchimp o similar
   - Formularios de captura

---

## 🔗 **RECURSOS ÚTILES:**

- **Facebook Business Help**: https://www.facebook.com/business/help
- **Pixel Helper**: https://chrome.google.com/webstore (buscar "Facebook Pixel Helper")
- **Events Manager**: https://business.facebook.com/events_manager

---

**¿Vas a crear la cuenta de Facebook Business Manager ahora?** 

**O prefieres que continuemos con Google Ads primero?** 🤔

**Dime cuando tengas el Pixel ID de Facebook** (formato: 1234567890123456)
