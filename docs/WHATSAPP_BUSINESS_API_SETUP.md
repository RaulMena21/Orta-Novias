# 📱 WhatsApp Business API - Guía de Configuración

## 🎯 ¿Qué es WhatsApp Business API?

WhatsApp Business API te permite:
- ✅ Enviar notificaciones automáticas a clientes
- ✅ Confirmaciones de citas
- ✅ Recordatorios de citas
- ✅ Mensajes de marketing (con consentimiento)
- ✅ Soporte al cliente automatizado

## 🚀 Métodos para Obtener WhatsApp Business API

### **Opción 1: Meta Business (Facebook) - GRATIS** ⭐ **RECOMENDADO**

#### Requisitos:
- ✅ Cuenta de Facebook Business
- ✅ Número de teléfono dedicado (no personal)
- ✅ Verificación de identidad empresarial

#### Pasos:
1. **Crear cuenta Meta Business:**
   - Ve a: https://business.facebook.com/
   - Crea cuenta empresarial
   - Verifica tu empresa (puede tardar 1-2 días)

2. **Configurar WhatsApp Business API:**
   - Ve a: https://developers.facebook.com/
   - Crear nueva app → "Business"
   - Agregar producto "WhatsApp"
   - Configurar número de teléfono

3. **Verificación del número:**
   - Usar número dedicado (no WhatsApp personal)
   - Verificar por SMS/llamada
   - Aceptar términos de WhatsApp Business

4. **Obtener credenciales:**
   ```bash
   WHATSAPP_API_TOKEN=EAAxxxxxxxxxxxxxxx
   WHATSAPP_PHONE_NUMBER_ID=123456789012345
   ```

#### Costos:
- 🆓 **Gratis** hasta 1,000 conversaciones/mes
- 💰 Después: €0.05-0.15 por conversación

---

### **Opción 2: Twilio - MÁS FÁCIL** ⚡

#### Ventajas:
- ✅ Configuración más simple
- ✅ Mejor documentación
- ✅ Soporte técnico incluido

#### Pasos:
1. **Crear cuenta Twilio:**
   - Ve a: https://www.twilio.com/
   - Registrarse (incluye $10 de crédito gratis)

2. **Configurar WhatsApp:**
   - Console → Messaging → WhatsApp
   - Configurar número de teléfono
   - Verificar sandbox para testing

3. **Obtener credenciales:**
   ```bash
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxx
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   ```

#### Costos:
- 💰 €0.05 por mensaje enviado
- 💰 €0.01 por mensaje recibido

---

### **Opción 3: Proveedores Españoles** 🇪🇸

#### **WhatsBroadcast**
- Web: https://whatsbroadcast.com/
- Precios: desde €29/mes
- Incluye soporte en español

#### **Yowsup API**
- Más técnico, requiere servidor propio
- Gratis pero complejo de configurar

---

## 🛠️ Configuración en tu Proyecto

### **Para WhatsApp Business API (Meta):**

1. **Actualizar `.env.production`:**
```bash
# WhatsApp Business API
WHATSAPP_API_TOKEN=tu_token_real_de_meta
WHATSAPP_PHONE_NUMBER_ID=tu_phone_id_real
WHATSAPP_VERIFY_TOKEN=tu_token_verificacion
```

2. **Código Python básico:**
```python
import requests

def enviar_whatsapp(numero, mensaje):
    url = f"https://graph.facebook.com/v17.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_API_TOKEN}",
        "Content-Type": "application/json"
    }
    data = {
        "messaging_product": "whatsapp",
        "to": numero,
        "text": {"body": mensaje}
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()
```

### **Para Twilio:**

1. **Actualizar `.env.production`:**
```bash
# Twilio WhatsApp
USE_TWILIO=True
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

2. **Instalar dependencia:**
```bash
pip install twilio
```

3. **Código Python básico:**
```python
from twilio.rest import Client

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def enviar_whatsapp_twilio(numero, mensaje):
    message = client.messages.create(
        body=mensaje,
        from_=TWILIO_WHATSAPP_FROM,
        to=f'whatsapp:{numero}'
    )
    return message.sid
```

---

## 📋 Comparación de Opciones

| Característica | Meta Business API | Twilio | Proveedores ES |
|----------------|-------------------|--------|----------------|
| **Costo inicial** | Gratis | $10 crédito | €29/mes |
| **Configuración** | Compleja | Fácil | Muy fácil |
| **Soporte** | Comunidad | Excelente | Español |
| **Escalabilidad** | Excelente | Excelente | Limitada |
| **Documentación** | Buena | Excelente | Variable |

---

## ⚠️ **DIFERENCIAS IMPORTANTES - WhatsApp Web vs API**

### **🆓 PyWhatKit (GRATIS) - Requiere WhatsApp Web**
```bash
✅ Ventajas:
   • 100% GRATUITO
   • Sin límites de mensajes
   • Sin API keys necesarias
   • Fácil configuración

❌ Limitaciones:
   • REQUIERE WhatsApp Web abierto 24/7
   • Dependiente de tu conexión
   • Puede fallar si se cierra el navegador
   • No es profesional para producción continua
```

### **🏢 Meta Business API / Twilio - NO requiere WhatsApp Web**
```bash
✅ Ventajas:
   • NO requiere WhatsApp Web abierto
   • Funciona 24/7 automáticamente
   • Servidores profesionales
   • Mayor confiabilidad
   • Integración empresarial

💰 Costos:
   • Meta: 1000 gratis/mes, después €0.05-0.15
   • Twilio: €0.05 por mensaje
```

## 🎯 Recomendación para Orta Novias

### **Para TESTING y PRUEBAS: PyWhatKit** 🧪
- Perfecto para probar el sistema
- Desarrollar templates de mensajes
- Validar funcionalidad
- **REQUIERE: WhatsApp Web abierto**

### **Para PRODUCCIÓN REAL: Meta Business API** ⭐
- Funcionamiento 24/7 automático
- No dependes de tener navegador abierto
- Más profesional y confiable
- 1000 mensajes gratis/mes (suficiente para empezar)

---

## 📝 Checklist de Implementación

### Paso 1: Configuración inicial
- [ ] Elegir proveedor (Twilio recomendado para empezar)
- [ ] Crear cuenta y verificar empresa
- [ ] Obtener número de teléfono dedicado
- [ ] Conseguir credenciales API

### Paso 2: Configuración en proyecto
- [ ] Actualizar `.env.production`
- [ ] Instalar dependencias necesarias
- [ ] Crear funciones de envío
- [ ] Configurar templates de mensajes

### Paso 3: Testing
- [ ] Probar envío a tu número
- [ ] Verificar recepción de mensajes
- [ ] Testear diferentes tipos de mensaje

### Paso 4: Integración
- [ ] Conectar con sistema de citas
- [ ] Configurar notificaciones automáticas
- [ ] Crear templates para diferentes eventos

---

## 🚨 Consideraciones Importantes

### **Legales:**
- ✅ Solo enviar a números que dieron consentimiento
- ✅ Incluir opción de darse de baja
- ✅ Cumplir GDPR (protección de datos)

### **Técnicas:**
- ✅ Usar números en formato internacional (+34...)
- ✅ Manejar errores de entrega
- ✅ Implementar rate limiting
- ✅ Logs de mensajes enviados

### **Buenas prácticas:**
- ✅ Mensajes personalizados
- ✅ Horarios apropiados (9AM-9PM)
- ✅ Contenido relevante y útil
- ✅ No spam

---

## 💡 Ideas de Uso para Orta Novias

1. **Confirmación de cita:**
   ```
   ¡Hola María! 👗
   Tu cita en Orta Novias está confirmada:
   📅 Mañana 15:30
   📍 C/ Ejemplo, 123
   
   ¿Alguna pregunta? Responde a este mensaje.
   ```

2. **Recordatorio 24h antes:**
   ```
   ¡Hola! 💍
   Te recordamos tu cita mañana a las 15:30.
   Trae estas medidas si las tienes:
   - Busto: ___
   - Cintura: ___
   - Cadera: ___
   
   ¡Te esperamos!
   ```

3. **Seguimiento post-cita:**
   ```
   ¡Gracias por visitarnos! ✨
   ¿Qué te pareció tu experiencia?
   Si tienes fotos del vestido, ¡envíanoslas!
   
   Próxima cita sugerida: 2 semanas
   ```

---

## 🔗 Enlaces Útiles

- **Meta Business API:** https://developers.facebook.com/docs/whatsapp
- **Twilio WhatsApp:** https://www.twilio.com/whatsapp
- **WhatsApp Business Policy:** https://www.whatsapp.com/legal/business-policy
- **Formato de números:** https://developers.facebook.com/docs/whatsapp/phone-numbers
