# 🐳 Arquitectura Docker de Orta Novias

## 📁 Estructura de Archivos Docker

```
├── Dockerfile                      # Dockerfile base/desarrollo
├── Dockerfile.frontend             # Frontend específico 
├── Dockerfile.production           # Producción multi-stage (Backend + Frontend)
├── docker-compose.yml             # Desarrollo local
└── docker-compose.production.yml  # Producción completa
```

## 🚀 Servicios en Producción

### **docker-compose.production.yml** incluye:

1. **`db`** - PostgreSQL 15 Alpine
   - Persistencia con volúmenes
   - Health checks
   - Configuración UTF-8

2. **`redis`** - Redis 7 Alpine  
   - Cache y sesiones
   - Persistencia con AOF
   - Memory limit 256MB

3. **`backend`** - Django API
   - Multi-replica (2 instancias)
   - Health checks
   - Volúmenes para static/media

4. **`celery`** - Worker asíncrono
   - Procesamiento de tareas
   - Concurrency=2

5. **`celery-beat`** - Scheduler
   - Tareas programadas
   - Persistencia de schedule

6. **`flower`** - Monitoreo Celery
   - Puerto 5555
   - UI para ver tareas

7. **`nginx`** - Reverse Proxy
   - SSL/HTTPS
   - Gzip compression
   - Rate limiting
   - Static file serving

8. **`certbot`** - SSL Certificates
   - Let's Encrypt
   - Auto-renovación cada 12h

## ⚙️ Características Implementadas

### ✅ **Seguridad**
- SSL/TLS certificates automáticos
- Security headers en Nginx
- Rate limiting por IP
- Logs rotatorios

### ✅ **Performance**
- Multi-replica backend (2 instancias)
- Redis cache
- Gzip compression
- Static file caching
- Resource limits por servicio

### ✅ **Monitoring**
- Health checks en todos los servicios
- Flower para Celery monitoring
- Logs estructurados JSON
- Resource limits y reservations

### ✅ **Persistence**
- PostgreSQL data volume
- Redis data volume  
- Static files volume
- Media files volume
- Celery beat schedule volume

## 🎯 Comandos de Producción

### Despliegue inicial:
```bash
./scripts/deploy-production.sh
./scripts/init-letsencrypt.sh ortanovias.com
```

### Operaciones:
```bash
# Ver logs de un servicio
docker-compose -f docker-compose.production.yml logs -f backend

# Escalar backend
docker-compose -f docker-compose.production.yml up -d --scale backend=3

# Restart sin downtime
docker-compose -f docker-compose.production.yml restart backend

# Backup manual
docker-compose -f docker-compose.production.yml exec db pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup.sql
```

## 📊 Resource Allocation

| Servicio    | Memory Limit | Memory Reserve | Replicas |
|-------------|--------------|----------------|----------|
| PostgreSQL  | 512M         | 256M           | 1        |
| Redis       | 256M         | -              | 1        |
| Backend     | 512M         | 256M           | 2        |
| Celery      | 256M         | -              | 1        |
| Celery Beat | 128M         | -              | 1        |
| Flower      | 128M         | -              | 1        |
| Nginx       | -            | -              | 1        |

**Total estimado:** ~2GB RAM

## 🌐 Network Architecture

```
┌─────────────┐    ┌─────────────┐
│   Internet  │───▶│    Nginx    │
└─────────────┘    └─────────────┘
                          │
                   ┌──────┴──────┐
                   │  Frontend   │
                   │   Network   │
                   └──────┬──────┘
                          │
                   ┌──────▼──────┐    ┌─────────────┐
                   │   Backend   │───▶│   Redis     │
                   │  (x2 reps)  │    │             │
                   └──────┬──────┘    └─────────────┘
                          │
                   ┌──────▼──────┐    ┌─────────────┐
                   │  Backend    │───▶│ PostgreSQL  │
                   │   Network   │    │             │
                   └─────────────┘    └─────────────┘
```

## ✅ **ESTADO: LISTO PARA PRODUCCIÓN** 🚀

La configuración Docker está completamente optimizada para producción con:
- ✅ Multi-stage builds
- ✅ Security best practices  
- ✅ Resource optimization
- ✅ Automatic SSL
- ✅ Health monitoring
- ✅ Log management
- ✅ Zero-downtime deployments
