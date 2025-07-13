# 🚀 Deploy Cloud: Vercel + Railway (GRATIS) - Orta Novias

## 🎯 **ARQUITECTURA ELEGIDA:**
- **Frontend**: Vercel (100% gratis)
- **Backend + BD**: Railway (Plan gratuito con $5 crédito mensual)
- **Dominio**: ortanovias.com (ya configurado con CloudFlare)

---

## 📋 **PASO 1: PREPARAR EL PROYECTO**

### 1.1 Verificar Estructura del Frontend
```
frontend/
├── src/
├── public/
├── package.json
├── vite.config.ts
└── index.html
```

### 1.2 Preparar Variables de Entorno para Producción
```bash
# frontend/.env.production
VITE_API_BASE_URL=https://ortanovias-backend-production.up.railway.app
VITE_GA_MEASUREMENT_ID=G-JTHPB8J5L7
```

### 1.3 Verificar Build del Frontend
```bash
cd frontend
npm run build
# Verificar que se crea la carpeta dist/
```

---

## 🎨 **PASO 2: DEPLOY FRONTEND EN VERCEL**

### 2.1 Crear Cuenta en Vercel
1. Ve a: https://vercel.com/
2. **Sign up with GitHub** (recomendado)
3. Conecta tu repositorio de GitHub

### 2.2 Configurar Proyecto en Vercel
```
✅ Import Git Repository: [tu-repo-ortanovias]
✅ Framework Preset: Vite
✅ Root Directory: frontend/
✅ Build Command: npm run build
✅ Output Directory: dist/
```

### 2.3 Variables de Entorno en Vercel
```
Environment Variables:
- VITE_API_BASE_URL: https://ortanovias-backend-production.up.railway.app
- VITE_GA_MEASUREMENT_ID: G-JTHPB8J5L7
```

### 2.4 Configurar Dominio Personalizado
```
1. Vercel Dashboard → Settings → Domains
2. Add Domain: ortanovias.com
3. Add Domain: www.ortanovias.com
```

---

## 🚂 **PASO 3: DEPLOY BACKEND EN RAILWAY**

### 3.1 Crear Cuenta en Railway
1. Ve a: https://railway.app/
2. **Sign up with GitHub**
3. Plan: **Hobby (Gratis con $5 crédito)**

### 3.2 Crear Nuevo Proyecto
```
✅ New Project → Deploy from GitHub repo
✅ Seleccionar tu repositorio
✅ Root Directory: backend/ (si es necesario)
```

### 3.3 Configurar Variables de Entorno Railway
```python
# Variables de entorno en Railway Dashboard
DEBUG=False
DJANGO_SETTINGS_MODULE=core.settings
ALLOWED_HOSTS=ortanovias-backend-production.up.railway.app,api.ortanovias.com,ortanovias.com
SECRET_KEY=[generar-nueva-clave-secreta]

# Base de datos (Railway PostgreSQL)
DATABASE_URL=[railway-postgresql-url]  # Se genera automáticamente

# CORS
CORS_ALLOWED_ORIGINS=https://ortanovias.com,https://www.ortanovias.com

# Seguridad
SECURE_SSL_REDIRECT=True
SECURE_PROXY_SSL_HEADER=HTTP_X_FORWARDED_PROTO,https
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### 3.4 Añadir Base de Datos PostgreSQL
```
1. Railway Dashboard → Add Service
2. Database → PostgreSQL
3. Se conecta automáticamente al backend
```

### 3.5 Configurar Railway.json (opcional)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python manage.py migrate && python manage.py collectstatic --noinput && gunicorn core.wsgi:application --bind 0.0.0.0:$PORT",
    "healthcheckPath": "/api/health/"
  }
}
```

---

## ⚙️ **PASO 4: CONFIGURAR BACKEND PARA PRODUCCIÓN**

### 4.1 Instalar Dependencias de Producción
```bash
# backend/requirements.txt - Añadir:
gunicorn==21.2.0
psycopg2-binary==2.9.7
whitenoise==6.5.0
django-cors-headers==4.3.1
```

### 4.2 Actualizar settings.py
```python
# core/settings.py

import os
from pathlib import Path
import dj_database_url

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-fallback-secret-key')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost').split(',')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'backend.apps.store',
    'backend.apps.appointments',
    'backend.apps.testimonials',
    'backend.apps.users',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

# Database
if os.environ.get('DATABASE_URL'):
    DATABASES = {
        'default': dj_database_url.parse(os.environ.get('DATABASE_URL'))
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# CORS settings
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:5173').split(',')
CORS_ALLOW_CREDENTIALS = True

# Security settings for production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
```

### 4.3 Crear Health Check Endpoint
```python
# backend/api_urls.py - Añadir:
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "healthy", "service": "ortanovias-backend"})

# En urlpatterns añadir:
path('health/', health_check, name='health_check'),
```

---

## 🌐 **PASO 5: CONFIGURAR DNS EN CLOUDFLARE**

### 5.1 Actualizar Registros DNS
```dns
# CloudFlare DNS Records:

# Frontend (Vercel)
Type: CNAME
Name: @
Content: cname.vercel-dns.com
Proxy: 🧡 Proxied

Type: CNAME  
Name: www
Content: cname.vercel-dns.com
Proxy: 🧡 Proxied

# Backend (Railway)
Type: CNAME
Name: api
Content: ortanovias-backend-production.up.railway.app
Proxy: 🧡 Proxied
```

---

## 🚀 **PASO 6: DEPLOYMENT PROCESS**

### 6.1 Deploy Frontend (Vercel)
```bash
# Automático con cada push a main branch
git add .
git commit -m "feat: prepare frontend for Vercel deployment"
git push origin main

# Vercel detecta cambios y deploys automáticamente
```

### 6.2 Deploy Backend (Railway)
```bash
# Automático con cada push a main branch
git add .
git commit -m "feat: configure backend for Railway deployment"
git push origin main

# Railway detecta cambios y redeploys automáticamente
```

### 6.3 Ejecutar Migraciones
```bash
# En Railway Dashboard → Deployments → Select deployment → Shell
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser  # Para admin access
```

---

## ✅ **PASO 7: VERIFICACIÓN Y TESTING**

### 7.1 Verificar Frontend
```
✅ https://ortanovias.com - Carga correctamente
✅ https://www.ortanovias.com - Redirecciona correctamente  
✅ HTTPS/SSL funcionando
✅ Google Analytics tracking
```

### 7.2 Verificar Backend
```
✅ https://api.ortanovias.com/api/ - API funcionando
✅ https://api.ortanovias.com/admin/ - Admin panel accesible
✅ Base de datos PostgreSQL conectada
✅ CORS configurado correctamente
```

### 7.3 Verificar Integración
```
✅ Frontend puede conectar al backend
✅ Formularios funcionando
✅ Autenticación funcionando
✅ Subida de imágenes funcionando
```

---

## 💰 **COSTOS RESUMEN:**

```
✅ Frontend (Vercel): $0/mes (GRATIS)
✅ Backend (Railway): $0/mes (GRATIS con límites)
✅ Dominio: Ya comprado
✅ CloudFlare: Plan Free
✅ Base de datos: Incluida en Railway
---
💰 TOTAL: $0/mes para empezar
```

### 📊 **Límites Plan Gratuito Railway:**
- **$5 USD crédito mensual gratis**
- **512MB RAM máximo**
- **1GB almacenamiento**
- **Perfecto para validar el negocio**

---

## 🔄 **UPGRADE PATH:**

Cuando necesites más recursos:
```
Railway Hobby: $5/mes
- Sin límites estrictos
- Mejor rendimiento
- Sin suspensiones automáticas
```

---

## 📞 **SOPORTE Y MONITOREO:**

### Vercel:
- Dashboard: https://vercel.com/dashboard
- Analytics incluido
- Logs en tiempo real

### Railway:
- Dashboard: https://railway.app/dashboard  
- Logs y métricas
- Database management

### Monitoreo gratuito:
- **UptimeRobot**: Monitor 24/7 gratuito
- **CloudFlare Analytics**: Métricas incluidas
- **Google Analytics**: Ya configurado

---

**¡Listo para comenzar con el deployment gratuito! 🚀**

**Tiempo estimado: 1-2 horas**
