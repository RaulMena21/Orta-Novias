#!/bin/bash
set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando Orta Novias - Modo Producción${NC}"

# Función de logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Verificar variables de entorno críticas
check_env_vars() {
    log "Verificando variables de entorno..."
    
    required_vars=(
        "DJANGO_SECRET_KEY"
        "POSTGRES_DB"
        "POSTGRES_USER" 
        "POSTGRES_PASSWORD"
        "POSTGRES_HOST"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            error "Variable de entorno requerida no encontrada: $var"
            exit 1
        fi
    done
    
    log "✅ Variables de entorno verificadas"
}

# Esperar a que la base de datos esté lista
wait_for_db() {
    log "Esperando a que PostgreSQL esté listo..."
    
    until pg_isready -h "$POSTGRES_HOST" -p "${POSTGRES_PORT:-5432}" -U "$POSTGRES_USER"; do
        warning "PostgreSQL no está listo - esperando..."
        sleep 2
    done
    
    log "✅ PostgreSQL está listo"
}

# Ejecutar migraciones de base de datos
run_migrations() {
    log "Ejecutando migraciones de base de datos..."
    
    python manage.py makemigrations --noinput
    python manage.py migrate --noinput
    
    log "✅ Migraciones completadas"
}

# Recopilar archivos estáticos
collect_static() {
    log "Recopilando archivos estáticos..."
    
    python manage.py collectstatic --noinput --clear
    
    log "✅ Archivos estáticos recopilados"
}

# Crear superusuario si no existe
create_superuser() {
    log "Verificando superusuario..."
    
    python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()

if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@ortanovias.com',
        password='${DJANGO_ADMIN_PASSWORD:-admin123}'
    )
    print("Superusuario creado")
else:
    print("Superusuario ya existe")
EOF
    
    log "✅ Superusuario verificado"
}

# Verificar configuración de seguridad
security_check() {
    log "Ejecutando verificación de seguridad..."
    
    if [ -f "backend/security_check.py" ]; then
        python backend/security_check.py
        log "✅ Verificación de seguridad completada"
    else
        warning "Script de verificación de seguridad no encontrado"
    fi
}

# Limpiar cache de Redis
clear_cache() {
    log "Limpiando cache de Redis..."
    
    python manage.py shell << EOF
import django_redis
from django.core.cache import cache
try:
    cache.clear()
    print("Cache limpiado exitosamente")
except Exception as e:
    print(f"Error limpiando cache: {e}")
EOF
    
    log "✅ Cache limpiado"
}

# Función principal
main() {
    log "=== INICIANDO CONFIGURACIÓN DE PRODUCCIÓN ==="
    
    # Verificaciones y configuración inicial
    check_env_vars
    wait_for_db
    run_migrations
    collect_static
    create_superuser
    security_check
    clear_cache
    
    log "=== CONFIGURACIÓN COMPLETADA ==="
    
    # Determinar el comando a ejecutar
    if [ "$1" = "celery" ]; then
        log "🔄 Iniciando Celery Worker..."
        exec celery -A core worker -l info --concurrency=4
    elif [ "$1" = "celery-beat" ]; then
        log "⏰ Iniciando Celery Beat..."
        exec celery -A core beat -l info
    elif [ "$1" = "flower" ]; then
        log "🌸 Iniciando Flower (Celery Monitor)..."
        exec celery -A core flower --port=5555
    else
        log "🌐 Iniciando servidor web Django..."
        
        # Usar Gunicorn para producción
        exec gunicorn core.wsgi:application \
            --bind 0.0.0.0:8000 \
            --workers 4 \
            --worker-class gevent \
            --worker-connections 1000 \
            --max-requests 1000 \
            --max-requests-jitter 100 \
            --timeout 30 \
            --keep-alive 2 \
            --log-level info \
            --access-logfile - \
            --error-logfile - \
            --capture-output
    fi
}

# Ejecutar función principal con todos los argumentos
main "$@"
