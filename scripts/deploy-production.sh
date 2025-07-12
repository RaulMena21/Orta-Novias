#!/bin/bash

# Script de despliegue para Orta Novias - Producción
# Uso: ./deploy-production.sh

set -euo pipefail

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuración
PROJECT_NAME="ortanovias"
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"

# Funciones
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar prerequisitos
check_prerequisites() {
    log_info "Verificando prerequisitos..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker no está instalado"
        exit 1
    fi
    
    if [ ! -f ".env.production" ]; then
        log_error "Archivo .env.production no encontrado"
        exit 1
    fi
    
    log_success "Prerequisites verificados"
}

# Crear backup
create_backup() {
    log_info "Creando backup..."
    mkdir -p "$BACKUP_DIR"
    
    # Backup BD
    docker-compose -f docker-compose.production.yml exec -T db pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} > "${BACKUP_DIR}/database.sql"
    
    log_success "Backup creado en $BACKUP_DIR"
}

# Desplegar
deploy() {
    log_info "Desplegando en producción..."
    
    # Construir imágenes
    docker-compose -f docker-compose.production.yml build --no-cache
    
    # Ejecutar migraciones
    docker-compose -f docker-compose.production.yml run --rm backend python manage.py migrate --noinput
    
    # Recopilar estáticos
    docker-compose -f docker-compose.production.yml run --rm backend python manage.py collectstatic --noinput
    
    # Verificar configuración
    docker-compose -f docker-compose.production.yml run --rm backend python manage.py check --deploy
    
    # Desplegar servicios
    docker-compose -f docker-compose.production.yml down
    docker-compose -f docker-compose.production.yml up -d
    
    log_success "Desplegado exitosamente!"
}

# Script principal
main() {
    log_info "🚀 Iniciando despliegue en PRODUCCIÓN"
    
    check_prerequisites
    create_backup
    deploy
    
    log_success "✅ Despliegue completado!"
    log_info "Aplicación disponible en: https://ortanovias.com"
}

main "$@"
