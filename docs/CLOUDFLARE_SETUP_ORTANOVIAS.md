# 🌐 CONFIGURACIÓN CLOUDFLARE PARA ORTANOVIAS.COM

## ✅ PASO 1: CREAR CUENTA Y AÑADIR SITIO

### 1.1 Ir a CloudFlare
**🔗 https://cloudflare.com/sign-up**

### 1.2 Crear Cuenta
- Email: tu email principal
- Password: segura
- Plan: **FREE** (gratis)

### 1.3 Añadir Sitio
1. **Add Site** → Escribe: `ortanovias.com`
2. **Scan DNS Records** → CloudFlare buscará automáticamente
3. **Select Plan** → Elegir **FREE**
4. **Continue** → Seguir al siguiente paso

---

## 📡 PASO 2: CAMBIAR NAMESERVERS

CloudFlare te dará 2 nameservers únicos, algo como:
```
brad.ns.cloudflare.com
luna.ns.cloudflare.com
```

### 2.1 En tu Registrador de Dominio:
1. **Ir al panel de control** donde compraste ortanovias.com
2. **Buscar "Nameservers"** o "DNS Management"
3. **Cambiar de "Default" a "Custom"**
4. **Pegar los 2 nameservers** que te dio CloudFlare
5. **Guardar cambios**

### 2.2 Tiempos de Propagación:
- **Mínimo**: 2-4 horas
- **Máximo**: 24-48 horas
- **Promedio**: 6-12 horas

---

## 🔧 PASO 3: CONFIGURAR DNS EN CLOUDFLARE

Una vez que CloudFlare detecte tu dominio, configurar estos registros:

### Registros DNS Necesarios:

```
📍 REGISTRO PRINCIPAL
Type: A
Name: @
Content: [IP_DE_TU_SERVIDOR]
Proxy: 🧡 ON (Orange Cloud)

📍 SUBDOMINIO WWW  
Type: CNAME
Name: www
Content: ortanovias.com
Proxy: 🧡 ON (Orange Cloud)

📍 API SUBDOMAIN
Type: A  
Name: api
Content: [IP_DE_TU_SERVIDOR]
Proxy: 🧡 ON (Orange Cloud)
```

**🚨 IMPORTANTE**: Por ahora deja el IP como `192.0.2.1` (placeholder). Lo cambiaremos cuando tengas el servidor listo.

---

## 🛡️ PASO 4: CONFIGURAR SEGURIDAD

### 4.1 SSL/TLS Settings
```
Ir a: SSL/TLS → Overview
SSL/TLS encryption mode: Full (Strict)
Always Use HTTPS: ON
```

### 4.2 Security Settings  
```
Ir a: Security → Settings
Security Level: Medium
Bot Fight Mode: ON
```

---

## ⚡ PASO 5: OPTIMIZACIONES BÁSICAS

### 5.1 Speed Settings
```
Ir a: Speed → Optimization
Auto Minify: CSS ✅ HTML ✅ JS ✅
Brotli: ON
```

### 5.2 Page Rules (3 gratis)
```
Rule 1: ortanovias.com/*
- Always Use HTTPS: ON

Rule 2: ortanovias.com/api/*  
- Cache Level: Bypass

Rule 3: ortanovias.com/*.css, *.js, *.jpg, *.png
- Cache Level: Cache Everything
- Browser Cache TTL: 1 year
```

---

## ✅ VERIFICAR CONFIGURACIÓN

### Mientras DNS propaga, verifica:

1. **CloudFlare Dashboard** → Status debe mostrar "Active"
2. **SSL Status** → "Active Certificate"  
3. **DNS Records** → Todos con 🧡 (Proxied)

### Comandos para verificar:
```powershell
# Verificar nameservers
nslookup -type=NS ortanovias.com

# Verificar cuando esté activo
nslookup ortanovias.com
```

---

## 🎯 PRÓXIMOS PASOS

### Mientras DNS propaga (6-24 horas):

1. **✅ Configurar Marketing**
   ```powershell
   # Configurar Google Analytics, Facebook Pixel, etc.
   .\scripts\setup-marketing.sh
   ```

2. **✅ Preparar Servidor**
   - Configurar Docker en producción
   - Preparar certificados SSL
   - Configurar variables de entorno

3. **✅ Configurar Email**
   - Google Workspace para info@ortanovias.com
   - Configurar MX records

---

## 🔍 VERIFICACIÓN FINAL

Una vez que DNS haya propagado:

```powershell
# Verificar dominio completo
.\scripts\verify-domain.ps1 -Domain "ortanovias.com"
```

**✅ Deberías ver:**
- DNS apuntando a CloudFlare
- SSL certificate activo
- CloudFlare headers detectados

---

## 📞 SOPORTE

Si tienes problemas:

1. **CloudFlare Community**: community.cloudflare.com
2. **DNS Checker**: dnschecker.org
3. **Status CloudFlare**: cloudflarestatus.com

---

**🚀 ESTADO ACTUAL: CloudFlare configurándose...**

**⏰ Tiempo estimado: 6-24 horas para propagación completa**
