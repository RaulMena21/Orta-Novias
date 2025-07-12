# 📡 CONFIGURACIÓN DNS PARA ORTANOVIAS.COM
# Registros que debes añadir en CloudFlare

## 🎯 REGISTROS PRINCIPALES (OBLIGATORIOS)

### 1. REGISTRO PRINCIPAL (@)
```
Clic en "Add record" en CloudFlare

Type: A
Name: @ 
Content: 192.0.2.1
Proxy status: 🧡 Proxied (Orange Cloud ON)
TTL: Auto
```

### 2. SUBDOMINIO WWW
```
Clic en "Add record" 

Type: CNAME
Name: www
Content: ortanovias.com
Proxy status: 🧡 Proxied (Orange Cloud ON)  
TTL: Auto
```

### 3. API SUBDOMAIN
```
Clic en "Add record"

Type: A
Name: api
Content: 192.0.2.1
Proxy status: 🧡 Proxied (Orange Cloud ON)
TTL: Auto
```

## 📧 REGISTROS DE EMAIL (OPCIONALES POR AHORA)

### 4. GOOGLE WORKSPACE (Si quieres email corporativo)
```
Type: MX
Name: @
Content: aspmx.l.google.com
Priority: 1
Proxy status: 🔘 DNS only (Gray Cloud)

Type: MX
Name: @
Content: alt1.aspmx.l.google.com  
Priority: 5
Proxy status: 🔘 DNS only (Gray Cloud)
```

## 🔍 VERIFICACIÓN SPF (OPCIONAL)
```
Type: TXT
Name: @
Content: "v=spf1 include:_spf.google.com ~all"
Proxy status: 🔘 DNS only (Gray Cloud)
```

---

## ⚠️ IMPORTANTE:

### IP TEMPORAL
- **192.0.2.1** es una IP temporal de ejemplo
- **FUNCIONA** para configurar CloudFlare ahora
- **CAMBIAREMOS** cuando tengas servidor de producción

### PROXY STATUS
- **🧡 Proxied (Orange Cloud)** = CloudFlare protege y acelera
- **🔘 DNS only (Gray Cloud)** = Solo DNS, sin protección CloudFlare

---

## ✅ DESPUÉS DE AÑADIR REGISTROS:

1. **Guardar cada registro** después de crearlo
2. **Verificar** que aparezcan en la lista
3. **Esperar** 5-10 minutos para que se activen
4. **Continuar** con configuraciones de seguridad

---

## 🎯 ORDEN DE PRIORIDAD:

1. ✅ **@ (A record)** - MÁS IMPORTANTE
2. ✅ **www (CNAME)** - SEGUNDO MÁS IMPORTANTE  
3. ✅ **api (A record)** - PARA EL BACKEND
4. ⏳ **MX records** - Solo si quieres email corporativo YA
5. ⏳ **TXT records** - Solo si configuraste MX

---

**🚀 EMPEZAR CON LOS 3 PRIMEROS REGISTROS**
**📧 EMAIL LO CONFIGURAMOS DESPUÉS**
