# 🔧 Guía de Configuración de Variables de Entorno

## 📁 Archivos de Configuración

### **`.env.example`** - Template Base
- ✅ **Propósito:** Template maestro para todos los entornos
- ✅ **Configuración:** Valores seguros para desarrollo
- ✅ **Uso:** Copiar y modificar según el entorno

### **`.env`** - Desarrollo Local
- ✅ **Propósito:** Desarrollo en tu máquina local
- ✅ **Configuración:** SQLite, DEBUG=True, sin SSL
- ✅ **Uso:** Copia de `.env.example` sin modificaciones

### **`.env.production`** - Producción
- ✅ **Propósito:** Servidor de producción real
- ✅ **Configuración:** PostgreSQL, DEBUG=False, SSL obligatorio
- ✅ **Uso:** Basado en `.env.example` con valores reales

## 🎯 Diferencias Principales

| Variable | Desarrollo | Producción |
|----------|------------|------------|
| `ENVIRONMENT` | `development` | `production` |
| `DJANGO_DEBUG` | `True` | `False` |
| `DATABASE_URL` | `sqlite:///db.sqlite3` | `postgresql://...` |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` | `ortanovias.com,www.ortanovias.com` |
| `SECURE_SSL_REDIRECT` | `False` | `True` |
| `SESSION_COOKIE_SECURE` | `False` | `True` |
| `CSRF_COOKIE_SECURE` | `False` | `True` |
| `EMAIL_BACKEND` | `console` | `smtp` |
| `USE_S3` | `False` | `True` |
| `USE_CLOUDFLARE` | `False` | `True` |
| `BACKUP_ENABLED` | `False` | `True` |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | `https://ortanovias.com` |

## 🚀 Configuración Rápida

### Para Desarrollo Local:
```bash
# 1. Copiar template
cp .env.example .env

# 2. ¡Listo! Ya tienes configuración de desarrollo
python manage.py runserver
```

### Para Producción:
```bash
# 1. Crear archivo de producción
cp .env.example .env.production

# 2. Editar valores reales
nano .env.production

# 3. Configurar variables críticas:
DJANGO_SECRET_KEY=clave-super-segura-de-50-caracteres
POSTGRES_PASSWORD=password-seguro-de-base-datos
EMAIL_HOST_PASSWORD=api-key-de-sendgrid
AWS_ACCESS_KEY_ID=tu-access-key-aws
AWS_SECRET_ACCESS_KEY=tu-secret-key-aws
CLOUDFLARE_API_TOKEN=tu-token-cloudflare
SENTRY_DSN=tu-url-sentry
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# 4. Desplegar
./scripts/deploy-production.sh
```

## 🔒 Variables Críticas de Seguridad

### **Obligatorias para Producción:**
1. **`DJANGO_SECRET_KEY`** - Clave secreta única (ya generada)
2. **`POSTGRES_PASSWORD`** - Password seguro para BD
3. **`EMAIL_HOST_PASSWORD`** - API Key de SendGrid
4. **`AWS_ACCESS_KEY_ID`** - Para almacenamiento S3
5. **`AWS_SECRET_ACCESS_KEY`** - Para almacenamiento S3

### **Recomendadas:**
6. **`CLOUDFLARE_API_TOKEN`** - Para WAF y CDN
7. **`SENTRY_DSN`** - Para monitoreo de errores
8. **`GOOGLE_ANALYTICS_ID`** - Para analytics

### **Opcionales:**
9. **`WHATSAPP_API_TOKEN`** - Para notificaciones
10. **`BACKUP_S3_BUCKET`** - Para backups automáticos

## ⚠️ Advertencias Importantes

### ❌ **NO hacer:**
- Usar `.env.production` en desarrollo
- Subir `.env` o `.env.production` a Git
- Usar `DEBUG=True` en producción
- Usar HTTP en producción (`SECURE_SSL_REDIRECT=False`)

### ✅ **SÍ hacer:**
- Usar `.env` solo para desarrollo
- Usar `.env.production` solo en servidor real
- Mantener `.env.example` actualizado
- Generar passwords únicos y seguros

## 🔄 Migración de Configuración

Si ya tienes archivos de configuración antiguos:

```bash
# 1. Backup de configuración actual
cp .env .env.backup

# 2. Usar nueva configuración
cp .env.example .env

# 3. Migrar valores personalizados del backup
# (comparar .env.backup con .env y copiar valores reales)
```

## 🛠️ Comandos Útiles

```bash
# Verificar configuración actual
python manage.py check --settings=core.settings

# Verificar configuración de producción
python manage.py check --deploy --settings=core.settings_prod

# Ver todas las variables cargadas
python manage.py shell -c "from django.conf import settings; print(vars(settings))"

# Generar nueva SECRET_KEY
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## 📋 Checklist de Configuración

### Desarrollo:
- [ ] Copiar `.env.example` a `.env`
- [ ] Verificar que `DEBUG=True`
- [ ] Verificar que usa SQLite
- [ ] Probar `python manage.py runserver`

### Producción:
- [ ] Crear `.env.production` desde `.env.example`
- [ ] Configurar `DJANGO_SECRET_KEY`
- [ ] Configurar `POSTGRES_PASSWORD`
- [ ] Configurar `EMAIL_HOST_PASSWORD`
- [ ] Configurar credenciales AWS
- [ ] Configurar Cloudflare (opcional)
- [ ] Verificar `DEBUG=False`
- [ ] Verificar SSL habilitado
- [ ] Probar despliegue con Docker
