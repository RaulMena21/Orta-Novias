# 🎯 GOOGLE ANALYTICS CONFIGURADO - Orta Novias

## ✅ **MEASUREMENT ID OBTENIDO:**
```
G-JTHPB8J5L7
```

---

## 🔧 **PASO 1: CONFIGURAR EN FRONTEND**

### 1.1 Instalar Google Analytics
```bash
cd frontend
npm install gtag
```

### 1.2 Crear archivo de configuración
**Archivo**: `src/lib/analytics.ts`
```typescript
declare global {
  interface Window {
    gtag: any;
  }
}

export const GA_TRACKING_ID = 'G-JTHPB8J5L7';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_location: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
```

### 1.3 Añadir script a index.html
**Archivo**: `frontend/index.html`
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-JTHPB8J5L7"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-JTHPB8J5L7');
  </script>
  <!-- Fin Google Analytics -->
  
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/logo.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Orta Novias - Vestidos de Novia en Madrid</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

---

## 📊 **PASO 2: CONFIGURAR EVENTOS DE TRACKING**

### 2.1 Hook personalizado para Analytics
**Archivo**: `src/hooks/useAnalytics.ts`
```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as gtag from '../lib/analytics';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    gtag.pageview(location.pathname + location.search);
  }, [location]);

  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    gtag.event({ action, category, label, value });
  };

  return { trackEvent };
};
```

### 2.2 Implementar en componentes
**Ejemplo en AppointmentList.tsx:**
```typescript
import { useAnalytics } from '../hooks/useAnalytics';

export const AppointmentList = () => {
  const { trackEvent } = useAnalytics();

  const handleBookAppointment = () => {
    // Track appointment booking
    trackEvent('book_appointment', 'engagement', 'appointment_form');
    
    // Tu lógica existente...
  };

  // ... resto del componente
};
```

---

## 🎯 **PASO 3: EVENTOS IMPORTANTES A TRACKEAR**

### 3.1 Eventos de Engagement
```typescript
// Cita solicitada
trackEvent('book_appointment', 'engagement', 'homepage');

// Vestido visualizado
trackEvent('view_dress', 'engagement', dress.name);

// Contacto
trackEvent('contact_click', 'engagement', 'whatsapp');

// Testimonial leído
trackEvent('view_testimonial', 'engagement', testimonial.id);
```

### 3.2 Eventos de Navegación
```typescript
// Página visitada
trackEvent('page_view', 'navigation', 'dresses_page');

// Menú móvil usado
trackEvent('mobile_menu_open', 'navigation', 'mobile');

// Scroll en galería
trackEvent('gallery_scroll', 'engagement', 'dress_gallery');
```

---

## 🔧 **PASO 4: VARIABLES DE ENTORNO**

### 4.1 Archivo .env
```bash
# .env.local
VITE_GA_TRACKING_ID=G-JTHPB8J5L7
VITE_ENVIRONMENT=development

# .env.production
VITE_GA_TRACKING_ID=G-JTHPB8J5L7
VITE_ENVIRONMENT=production
```

### 4.2 Configuración condicional
```typescript
// src/lib/analytics.ts
export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;
export const IS_PRODUCTION = import.meta.env.VITE_ENVIRONMENT === 'production';

export const pageview = (url: string) => {
  if (IS_PRODUCTION && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    });
  }
};
```

---

## 🚀 **PASO 5: IMPLEMENTAR EN App.tsx**

```typescript
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  useAnalytics(); // Esto trackea automáticamente las page views

  return (
    <Router>
      {/* Tu app existente */}
    </Router>
  );
}
```

---

## ✅ **VERIFICACIÓN:**

### 5.1 Testing en desarrollo
1. **Abrir**: Chrome DevTools → Network
2. **Filtrar**: `google-analytics` o `gtag`
3. **Navegar**: por tu app
4. **Verificar**: que se envían requests a GA

### 5.2 Real Time en Google Analytics
1. **Ir a**: Google Analytics Dashboard
2. **Reports** → **Real Time**
3. **Abrir**: tu website
4. **Verificar**: que apareces en tiempo real

---

## 📈 **PRÓXIMOS PASOS:**

### **OPCIÓN A: Facebook Pixel** 🎯
- **Crear**: Facebook Business Manager
- **Configurar**: Pixel de conversiones
- **Tiempo**: 15 minutos

### **OPCIÓN B: Google Ads** 🎯
- **Crear**: Cuenta Google Ads
- **Configurar**: Conversión tracking
- **Tiempo**: 20 minutos

### **OPCIÓN C: Hotjar** 🎯
- **Crear**: Cuenta Hotjar
- **Configurar**: Heatmaps y recordings
- **Tiempo**: 10 minutos

**¿Cuál quieres configurar primero?** 

**O prefiero que configure Google Analytics primero en el código y luego continuamos con los demás?** 🤔
