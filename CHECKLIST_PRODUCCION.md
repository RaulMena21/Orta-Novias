# 🚀 Checklist de Preparación para Producción - Orta Novias

## ✅ **CONFIGURACIÓN DE ENTORNO**
- [ ] Configurar variables de entorno en `.env.production`
- [ ] Generar `DJANGO_SECRET_KEY` seguro (50+ caracteres)
- [ ] Configurar `ALLOWED_HOSTS` con dominio real
- [ ] Configurar SSL/HTTPS (`SECURE_SSL_REDIRECT=True`)
- [ ] Configurar base de datos PostgreSQL de producción
- [ ] Configurar Redis para cache y sesiones

## ✅ **SEGURIDAD**
- [ ] Desactivar `DEBUG=False`
- [ ] Configurar CORS solo para dominios autorizados
- [ ] Configurar headers de seguridad (HSTS, CSP, etc.)
- [ ] Configurar rate limiting
- [ ] Configurar Cloudflare WAF
- [ ] Configurar backup automático de BD
- [ ] Configurar Sentry para monitoreo de errores

## ✅ **INFRAESTRUCTURA**
- [ ] Registrar dominio `ortanovias.com`
- [ ] Configurar DNS apuntando al servidor
- [ ] Configurar certificados SSL (Let's Encrypt)
- [ ] Configurar servidor (VPS/Cloud)
- [ ] Instalar Docker y Docker Compose
- [ ] Configurar firewall (solo puertos 80, 443, 22)

## ✅ **BASE DE DATOS**
- [ ] Configurar PostgreSQL 15+
- [ ] Configurar backups automáticos diarios
- [ ] Ejecutar migraciones en producción
- [ ] Crear superusuario admin
- [ ] Optimizar configuración PostgreSQL

## ✅ **ARCHIVOS ESTÁTICOS Y MEDIA**
- [ ] Configurar AWS S3 para archivos media
- [ ] Configurar CDN (CloudFlare)
- [ ] Optimizar imágenes y archivos estáticos
- [ ] Configurar compresión Gzip
- [ ] Configurar caché de archivos estáticos

## ✅ **SERVICIOS EXTERNOS**
- [ ] Configurar SendGrid para emails
- [x] Configurar Google Analytics 4 ✅
- [x] Configurar Facebook Pixel ✅
- [x] Configurar Google Ads Tracking ✅
- [x] Configurar Hotjar Analytics ✅
- [ ] Configurar WhatsApp Business API
- [ ] Configurar Sentry para monitoreo
- [ ] Configurar backup en S3

## ✅ **RENDIMIENTO**
- [ ] Configurar Redis para cache
- [ ] Configurar Celery para tareas asíncronas
- [ ] Optimizar queries de base de datos
- [ ] Configurar compresión de respuestas
- [ ] Optimizar build del frontend

## ✅ **TESTING EN PRODUCCIÓN**
- [ ] Verificar todas las páginas funcionan
- [ ] Probar formulario de citas
- [ ] Probar carga de testimonios
- [ ] Verificar envío de emails
- [ ] Probar admin de Django
- [ ] Verificar analytics funcionando

## 🎯 **COMANDOS PARA DESPLIEGUE**

### Despliegue inicial:
```bash
# 1. Configurar variables
cp .env.example .env.production
nano .env.production

# 2. Desplegar
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh

# 3. Crear admin
docker-compose -f docker-compose.production.yml exec backend python manage.py createsuperuser
```

## 📊 **SIGUIENTE PASO PRIORITARIO**
1. **Configurar dominio y servidor** - Registrar ortanovias.com
2. **Configurar variables de entorno** - Completar .env.production
3. **Configurar SSL certificates** - Let's Encrypt
4. **Primera prueba de despliegue** - En servidor de staging
