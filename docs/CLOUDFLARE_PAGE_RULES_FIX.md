# 🛠️ CONFIGURACIÓN CORRECTA DE PAGE RULES - CLOUDFLARE

## ❌ PROBLEMA DETECTADO:
El error "Target URL contains non-printable characters" aparece cuando hay caracteres especiales en las Page Rules.

## ✅ SOLUCIÓN: Page Rules Correctas

### **REGLA 1: HTTPS Forzado**
```
URL Pattern: ortanovias.com/*
Settings: Always Use HTTPS = On
```

### **REGLA 2: Cache para API (Bypass)**
```
URL Pattern: ortanovias.com/api/*
Settings: Cache Level = Bypass
```

### **REGLA 3: Cache para Assets**
```
URL Pattern: ortanovias.com/*.css
Settings: 
- Cache Level = Cache Everything
- Browser Cache TTL = 1 year

URL Pattern: ortanovias.com/*.js
Settings:
- Cache Level = Cache Everything  
- Browser Cache TTL = 1 year

URL Pattern: ortanovias.com/*.jpg
Settings:
- Cache Level = Cache Everything
- Browser Cache TTL = 1 year

URL Pattern: ortanovias.com/*.png
Settings:
- Cache Level = Cache Everything
- Browser Cache TTL = 1 year
```

## 🚨 IMPORTANTE: Crear por separado

**NO** uses comodines múltiples como `*.css, *.js, *.jpg, *.png`

**SÍ** crea una regla para cada tipo de archivo.

---

## 📋 PASO A PASO EN CLOUDFLARE:

### 1. **Ir a Page Rules**
```
Dashboard → Rules → Page Rules → Create Page Rule
```

### 2. **Regla 1 - HTTPS Forzado**
```
🔹 URL: ortanovias.com/*
🔹 Settings: + Add Setting → Always Use HTTPS → On
🔹 Save and Deploy
```

### 3. **Regla 2 - API Bypass**
```
🔹 URL: ortanovias.com/api/*
🔹 Settings: + Add Setting → Cache Level → Bypass
🔹 Save and Deploy
```

### 4. **Regla 3 - CSS Cache**
```
🔹 URL: ortanovias.com/*.css
🔹 Settings: 
   + Cache Level → Cache Everything
   + Browser Cache TTL → 1 year
🔹 Save and Deploy
```

---

## ⚡ ALTERNATIVA SIMPLIFICADA (3 reglas máximo):

Si quieres usar las 3 reglas del plan gratuito:

### **Regla 1: HTTPS Global**
```
URL: ortanovias.com/*
Setting: Always Use HTTPS = On
```

### **Regla 2: API No Cache** 
```
URL: ortanovias.com/api/*
Setting: Cache Level = Bypass
```

### **Regla 3: Assets Cache**
```
URL: ortanovias.com/assets/*
Settings:
- Cache Level = Cache Everything
- Browser Cache TTL = 1 year
```

---

## 🔧 CONFIGURACIONES ADICIONALES SIN PAGE RULES:

### En **Speed → Optimization**:
```
✅ Auto Minify: CSS, HTML, JS
✅ Brotli Compression: On
```

### En **Caching → Configuration**:
```
✅ Browser Cache TTL: 4 hours
```

---

## ✅ VERIFICAR CONFIGURACIÓN:

1. **Page Rules activas**: Máximo 3 en plan gratuito
2. **Sin caracteres especiales** en URLs
3. **Un asterisco por regla** solamente
4. **Orden de prioridad** correcto (más específicas primero)

---

**🎯 ¿Quieres que configure las Page Rules de la forma simplificada o prefieres otra configuración?**
