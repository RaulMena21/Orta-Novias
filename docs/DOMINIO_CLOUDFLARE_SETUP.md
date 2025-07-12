# 🌐 Configuración de Dominio y CloudFlare - Orta Novias

## 📋 PASO 1: COMPRAR EL DOMINIO

### Dominios Recomendados:
1. **ortanovias.com** ⭐ (Primera opción)
2. **ortanovias.es** 
3. **ortanoviasmadrid.com**
4. **ortanoviasboutique.com**

### Registradores Recomendados:
- **Namecheap** - Mejor relación calidad/precio
- **GoDaddy** - Más conocido
- **Google Domains** - Integración con Google
- **Cloudflare Registrar** - Si ya tienes cuenta CloudFlare

### Configuraciones al Comprar:
```
✅ Auto-renovación: ACTIVADA
✅ Privacy Protection: ACTIVADA (WHOIS privado)
✅ DNS Management: Transferir a CloudFlare después
✅ Email forwarding: Configurar después
```

---

## ☁️ PASO 2: CONFIGURAR CLOUDFLARE

### 2.1 Crear Cuenta CloudFlare
1. Ve a: https://cloudflare.com/
2. **Plan recomendado**: FREE (suficiente para empezar)
3. **Upgrade después**: Pro ($20/mes) cuando tengas más tráfico

### 2.2 Añadir Sitio a CloudFlare
1. **Add Site**: `ortanovias.com`
2. **Scan DNS**: CloudFlare detectará registros existentes
3. **Select Plan**: Free
4. **Update Nameservers**: En tu registrador de dominio

### Nameservers CloudFlare (ejemplo):
```
brad.ns.cloudflare.com
luna.ns.cloudflare.com
```
*Los nameservers exactos te los dará CloudFlare*

---

## 🛡️ PASO 3: CONFIGURACIÓN DE SEGURIDAD CLOUDFLARE

### 3.1 SSL/TLS Settings
```
SSL/TLS Mode: Full (Strict)
Always Use HTTPS: ON
Minimum TLS Version: 1.2
```

### 3.2 Security Settings
```
Security Level: Medium
Bot Fight Mode: ON
Browser Integrity Check: ON
Privacy Pass Support: ON
```

### 3.3 Firewall Rules
```
Rule 1: Block known bad bots
Rule 2: Rate limiting (100 requests/10min per IP)
Rule 3: Geo-blocking países problemáticos (opcional)
```

---

## 📡 PASO 4: CONFIGURAR DNS EN CLOUDFLARE

### Registros DNS Necesarios:

```dns
# Registro principal
Type: A
Name: @
Content: [IP_DE_TU_SERVIDOR]
Proxy: 🧡 Proxied (Orange Cloud)

# Subdominio www
Type: CNAME
Name: www
Content: ortanovias.com
Proxy: 🧡 Proxied

# Email (si usas email personalizado)
Type: MX
Name: @
Content: [SERVIDOR_EMAIL]
Priority: 10

# Verificaciones
Type: TXT
Name: @
Content: "v=spf1 include:_spf.google.com ~all"

# API subdomain (para backend)
Type: A
Name: api
Content: [IP_DE_TU_SERVIDOR]
Proxy: 🧡 Proxied
```

---

## 🚀 PASO 5: CONFIGURAR SERVIDOR PARA PRODUCCIÓN

### 5.1 Actualizar Variables de Entorno
```bash
# .env.production
DJANGO_ALLOWED_HOSTS=ortanovias.com,www.ortanovias.com,api.ortanovias.com
DJANGO_SECURE_SSL_REDIRECT=True
DJANGO_SECURE_PROXY_SSL_HEADER=HTTP_CF_VISITOR,https
DJANGO_USE_TZ=True

# Frontend
VITE_API_BASE_URL=https://api.ortanovias.com
```

### 5.2 Configurar Nginx
```nginx
# /etc/nginx/sites-available/ortanovias.com
server {
    listen 80;
    server_name ortanovias.com www.ortanovias.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ortanovias.com www.ortanovias.com;
    
    # SSL Configuration (CloudFlare Origin Certificate)
    ssl_certificate /etc/ssl/certs/ortanovias_origin.pem;
    ssl_certificate_key /etc/ssl/private/ortanovias_origin.key;
    
    # Frontend (React/Vite)
    location / {
        root /var/www/ortanovias/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cacheing
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CloudFlare headers
        proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;
        proxy_set_header CF-RAY $http_cf_ray;
    }
}

# API subdomain
server {
    listen 443 ssl http2;
    server_name api.ortanovias.com;
    
    ssl_certificate /etc/ssl/certs/ortanovias_origin.pem;
    ssl_certificate_key /etc/ssl/private/ortanovias_origin.key;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "https://ortanovias.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
    }
}
```

---

## 🔐 PASO 6: CERTIFICADOS SSL CLOUDFLARE

### Opción 1: CloudFlare Origin Certificate (Recomendado)
1. CloudFlare Dashboard → SSL/TLS → Origin Server
2. **Create Certificate**
3. **Hostnames**: `*.ortanovias.com, ortanovias.com`
4. **Key Format**: RSA (2048)
5. **Validity**: 15 years

### Instalar en Servidor:
```bash
# Crear directorios
sudo mkdir -p /etc/ssl/certs /etc/ssl/private

# Copiar certificado (archivo .pem)
sudo nano /etc/ssl/certs/ortanovias_origin.pem
# Pegar contenido del certificado

# Copiar clave privada (archivo .key)
sudo nano /etc/ssl/private/ortanovias_origin.key
# Pegar contenido de la clave

# Permisos de seguridad
sudo chmod 644 /etc/ssl/certs/ortanovias_origin.pem
sudo chmod 600 /etc/ssl/private/ortanovias_origin.key
```

---

## ⚡ PASO 7: OPTIMIZACIONES CLOUDFLARE

### 7.1 Page Rules (Free Plan: 3 reglas) ✅ COMPLETADO
```
✅ Rule 1: ortanovias.com/*
- Always Use HTTPS: ON

✅ Rule 2: ortanovias.com/api/*
- Cache Level: Bypass

✅ Rule 3: ortanovias.com/assets/*
- Cache Level: Cache Everything
- Browser Cache TTL: 1 year
```

### 7.2 Optimización de Velocidad
```
Auto Minify: CSS ✅ HTML ✅ JS ✅
Brotli Compression: ON
Early Hints: ON (Pro plan)
Polish: Lossy (Pro plan)
Mirage: ON (Pro plan)
```

---

## 📧 PASO 8: CONFIGURAR EMAIL PERSONALIZADO

### Opción 1: Google Workspace (Recomendado)
```
Costo: $6/usuario/mes
Emails: info@ortanovias.com, contacto@ortanovias.com
```

### Configurar en CloudFlare:
```dns
# MX Records para Google
Type: MX, Name: @, Content: aspmx.l.google.com, Priority: 1
Type: MX, Name: @, Content: alt1.aspmx.l.google.com, Priority: 5
Type: MX, Name: @, Content: alt2.aspmx.l.google.com, Priority: 5

# TXT Records
Type: TXT, Name: @, Content: "v=spf1 include:_spf.google.com ~all"
Type: TXT, Name: _dmarc, Content: "v=DMARC1; p=quarantine; rua=mailto:info@ortanovias.com"
```

---

## 📊 PASO 9: CONFIGURAR ANALYTICS CON DOMINIO ✅ COMPLETADO

### Google Analytics: ✅ COMPLETADO
```
✅ Measurement ID: G-JTHPB8J5L7
✅ Dominio principal: ortanovias.com
✅ Subdominios: api.ortanovias.com
✅ Cross-domain tracking: Configurado
✅ Eventos de conversión: Configurados
```

### Google Search Console: ✅ COMPLETADO
```
✅ Propiedad verificada: ortanovias.com
✅ Ownership auto verified
✅ Método: Domain name provider
✅ Configuración completa
```

---

## ✅ CHECKLIST DE CONFIGURACIÓN

### Dominio:
- [ ] Dominio comprado y activo
- [ ] Nameservers cambiados a CloudFlare
- [ ] DNS propagado (24-48 horas)

### CloudFlare: ✅ COMPLETADO
- [x] Sitio añadido y activo
- [x] SSL/TLS configurado (Full Strict)
- [x] Registros DNS configurados
- [x] Security settings configuradas
- [x] Page rules configuradas (3/3)

### Servidor:
- [ ] Nginx configurado para dominio
- [ ] SSL certificados instalados
- [ ] Variables de entorno actualizadas
- [ ] Backend corriendo en producción

### Email:
- [ ] Email personalizado configurado
- [ ] MX records configurados
- [ ] SPF/DKIM/DMARC configurados

### Testing:
- [ ] Sitio web accesible
- [ ] HTTPS funcionando
- [ ] API funcionando
- [ ] SSL score A+ en SSLLabs
- [ ] Performance optimizado

---

## 🔧 COMANDOS ÚTILES

### Verificar DNS:
```bash
# Verificar propagación DNS
nslookup ortanovias.com
dig ortanovias.com

# Test SSL
openssl s_client -connect ortanovias.com:443
```

### Test de Velocidad:
- **GTmetrix**: https://gtmetrix.com/
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Pingdom**: https://tools.pingdom.com/

---

## 📞 SOPORTE

### CloudFlare Support:
- Free Plan: Community support
- Pro Plan: Standard support
- Business Plan: 24/7 support

### Monitoreo:
- **UptimeRobot**: Monitoreo gratuito
- **StatusCake**: Alternativa a UptimeRobot
- **CloudFlare Analytics**: Métricas incluidas

---

**¡Una vez tengas el dominio, podremos proceder con la configuración paso a paso!** 🚀

**Tiempo estimado total: 2-4 horas** (más tiempo de propagación DNS)
