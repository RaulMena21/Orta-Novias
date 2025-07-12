# 🚀 Meta Business API - Configuración Paso a Paso para Orta Novias

## ✅ **Por qué Meta Business API es perfecto para Orta Novias:**

- 🆓 **1000 conversaciones GRATIS cada mes**
- 🔄 **Funciona 24/7 sin WhatsApp Web**
- 🏢 **API oficial de WhatsApp**
- 💰 **Después de 1000: solo €0.05-0.15 por conversación**
- 📈 **Escalable para crecimiento del negocio**

---

## 📋 **PASO 1: Crear Cuenta Meta Business**

### 1.1 Registrarse en Meta Business
```
🔗 Ve a: https://business.facebook.com/
📝 Crear cuenta empresarial
🏢 Nombre: "Orta Novias" o tu nombre comercial
📧 Email empresarial recomendado
```

### 1.2 Verificar Empresa
```
📄 Documentos necesarios:
   • NIF/CIF de la empresa
   • Certificado de empresa (opcional)
   • Dirección comercial
   
⏱️ Tiempo de verificación: 1-2 días hábiles
```

---

## 📋 **PASO 2: Configurar WhatsApp Business API**

### 2.1 Crear Aplicación
```
🔗 Ve a: https://developers.facebook.com/
➕ Crear nueva app → Seleccionar "Business"
📝 Nombre: "Orta Novias WhatsApp"
📧 Email de contacto empresarial
```

### 2.2 Agregar Producto WhatsApp
```
📱 En tu app, ir a "Productos"
➕ Agregar "WhatsApp Business API"
🔧 Configurar producto
```

### 2.3 Configurar Número de Teléfono
```
⚠️ IMPORTANTE: Necesitas un número dedicado
   • NO usar tu WhatsApp personal
   • Número fijo o móvil exclusivo para el negocio
   • Ejemplo: +34 XXX XXX XXX

📞 Opciones:
   1. Línea fija de la tienda
   2. Móvil exclusivo del negocio
   3. Nuevo número para WhatsApp Business
```

---

## 📋 **PASO 3: Obtener Credenciales**

Después de la configuración, obtendrás:

```bash
# Credenciales que necesitas copiar:
WHATSAPP_API_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_VERIFY_TOKEN=tu_token_verificacion_personalizado
```

---

## 📋 **PASO 4: Configurar en tu Proyecto**

### 4.1 Actualizar `.env.production`
```bash
# Cambiar configuración actual por:
WHATSAPP_PROVIDER=meta
USE_FREE_WHATSAPP=False

# Meta Business API (Reemplazar con credenciales reales)
WHATSAPP_API_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_VERIFY_TOKEN=tu_token_verificacion_personalizado
```

### 4.2 Verificar Configuración
```bash
# Ejecutar test:
python scripts/test-whatsapp.py
```

---

## 📋 **PASO 5: Verificación y Testing**

### 5.1 Verificar Número
```
📱 Meta enviará código SMS/llamada
🔢 Introducir código en la plataforma
✅ Verificación completada
```

### 5.2 Probar Envío
```python
# Test básico desde tu proyecto:
from backend.apps.notifications.whatsapp_unified import send_whatsapp_notification

# Enviar a tu número personal para probar
success = send_whatsapp_notification(
    "+34TU_NUMERO_PERSONAL",
    "custom",
    {"message": "🧪 Test desde Orta Novias - Meta Business API funcionando! ✅"}
)

print(f"Resultado: {'✅ Enviado' if success else '❌ Error'}")
```

---

## 💰 **Costos y Límites**

### Mensajes GRATIS:
```
🆓 1000 conversaciones por mes
📊 Una conversación = ventana de 24 horas
💡 Múltiples mensajes en 24h = 1 conversación
```

### Después de 1000:
```
💰 Marketing: €0.15 por conversación
💰 Utilidad: €0.05 por conversación  
💰 Autenticación: €0.10 por conversación
💰 Servicio: €0.10 por conversación
```

### ¿Cuánto cuesta para Orta Novias?
```
📊 Estimación mensual:
   • 50 citas = 50 confirmaciones
   • 50 recordatorios  
   • 25 seguimientos
   = 125 conversaciones/mes
   
💰 Costo: ¡GRATIS! (dentro de los 1000)
```

---

## 🎯 **Ventajas para Orta Novias**

### ✅ **Profesionalismo:**
- Número comercial dedicado
- Sin dependencia de WhatsApp Web personal
- Funciona 24/7 automáticamente

### ✅ **Escalabilidad:**
- Hasta 1000 conversaciones gratis/mes
- Suficiente para 200+ citas mensuales
- Crecimiento sin problemas técnicos

### ✅ **Confiabilidad:**
- API oficial de WhatsApp
- Servidores de Meta/Facebook
- Entrega garantizada

---

## 📞 **¿Qué Número Usar?**

### Opciones recomendadas:
```
1️⃣ **Nuevo móvil para el negocio** (Recomendado)
   • Comprar SIM exclusiva
   • Usar solo para WhatsApp Business
   • Mantener separado de personal

2️⃣ **Línea fija con móvil virtual**
   • Usar línea fija existente
   • Configurar desvío si es necesario
   
3️⃣ **Segundo número móvil**
   • Si tienes móvil dual SIM
   • Usar segunda línea
```

### ⚠️ **NO usar:**
- Tu WhatsApp personal
- Número que ya usa WhatsApp normal
- Número compartido con otros servicios

---

## 🚀 **Cronograma de Implementación**

### **Semana 1:**
- [ ] Crear cuenta Meta Business
- [ ] Enviar documentos verificación
- [ ] Conseguir número dedicado

### **Semana 2:**
- [ ] Verificación empresarial aprobada
- [ ] Crear app WhatsApp
- [ ] Configurar número y obtener credenciales

### **Semana 3:**
- [ ] Configurar credenciales en proyecto
- [ ] Testing exhaustivo
- [ ] Integrar con sistema de citas

### **Semana 4:**
- [ ] Lanzamiento en producción
- [ ] Monitoreo primeros envíos
- [ ] Ajustes si es necesario

---

## 📝 **Checklist de Configuración**

### Meta Business:
- [ ] Cuenta Meta Business creada
- [ ] Empresa verificada
- [ ] App WhatsApp creada
- [ ] Número configurado y verificado
- [ ] Credenciales obtenidas

### Proyecto:
- [ ] `.env.production` actualizado
- [ ] WHATSAPP_PROVIDER=meta
- [ ] Credenciales configuradas
- [ ] Test exitoso
- [ ] Integración completa

### Testing:
- [ ] Mensaje de prueba enviado
- [ ] Confirmación de cita probada
- [ ] Recordatorio probado
- [ ] Seguimiento probado
- [ ] Manejo de errores verificado

---

## 🆘 **Soporte y Ayuda**

### Si tienes problemas:
```
📚 Documentación: https://developers.facebook.com/docs/whatsapp
💬 Comunidad: Facebook Developer Community
📧 Soporte: business.facebook.com/help
```

### En nuestro proyecto:
```
🔧 Scripts de test: scripts/test-whatsapp.py
📄 Documentación: docs/WHATSAPP_BUSINESS_API_SETUP.md
🛠️ Código: backend/apps/notifications/whatsapp_service.py
```

---

## 🎉 **¡Empezamos la Configuración!**

¿Quieres que te guíe a través del primer paso? 

**Siguiente acción:** Ir a https://business.facebook.com/ y crear la cuenta Meta Business para Orta Novias.

¿Tienes alguna pregunta antes de empezar?
