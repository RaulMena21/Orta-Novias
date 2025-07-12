# 🌐 Configuración de Nginx para Orta Novias

## 📁 Estructura de Archivos

```
nginx/
├── nginx.conf              # Configuración principal de Nginx
└── conf.d/
    └── ortanovias.conf     # Configuración específica del sitio
```

## ⚙️ Configuración

### nginx.conf
- Configuración principal del servidor Nginx
- Configuraciones globales de gzip, rate limiting, etc.
- Include de archivos de conf.d/

### conf.d/ortanovias.conf
- Configuración específica para ortanovias.com
- SSL/HTTPS configuration
- Proxy pass a Django backend
- Archivos estáticos y media
- Rate limiting específico

## 🔒 SSL/HTTPS

Los certificados SSL se almacenan en:
```
certbot/
├── conf/           # Configuración de Let's Encrypt
└── www/           # Archivos de validación ACME
```

## 🚀 Inicialización

Para configurar SSL por primera vez:
```bash
./scripts/init-letsencrypt.sh ortanovias.com
```

## 📊 Características

- ✅ HTTP/2 habilitado
- ✅ Gzip compression
- ✅ Rate limiting
- ✅ Security headers
- ✅ SSL/TLS optimizado
- ✅ Caché de archivos estáticos
- ✅ Proxy pass a Django
- ✅ Renovación automática de certificados

## 🔧 Comandos Útiles

```bash
# Verificar configuración
docker-compose -f docker-compose.production.yml exec nginx nginx -t

# Recargar configuración
docker-compose -f docker-compose.production.yml exec nginx nginx -s reload

# Ver logs
docker-compose -f docker-compose.production.yml logs nginx

# Renovar certificados manualmente
docker-compose -f docker-compose.production.yml run --rm certbot renew
```
