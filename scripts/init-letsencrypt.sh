#!/bin/bash

# Script para inicializar certificados SSL de Let's Encrypt
# Uso: ./init-letsencrypt.sh [dominio]

set -euo pipefail

# Configuración
DOMAIN=${1:-ortanovias.com}
EMAIL="admin@${DOMAIN}"
STAGING=${2:-0}  # Set to 1 for staging certificates

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que el dominio esté configurado
log_info "Verificando configuración para dominio: $DOMAIN"

# Crear certificado dummy inicial
if [ ! -f "./certbot/conf/live/$DOMAIN/fullchain.pem" ]; then
    log_info "Creando certificado dummy para $DOMAIN..."
    
    mkdir -p "./certbot/conf/live/$DOMAIN"
    
    # Generar certificado autofirmado temporal
    openssl req -x509 -nodes -newkey rsa:2048 \
        -keyout "./certbot/conf/live/$DOMAIN/privkey.pem" \
        -out "./certbot/conf/live/$DOMAIN/fullchain.pem" \
        -days 1 \
        -subj "/C=ES/ST=Madrid/L=Madrid/O=Orta Novias/CN=$DOMAIN"
    
    log_info "Certificado dummy creado"
fi

# Iniciar nginx para validación de dominio
log_info "Iniciando nginx para validación de dominio..."
docker-compose -f docker-compose.production.yml up -d nginx

# Esperar a que nginx esté listo
sleep 10

# Obtener certificado real de Let's Encrypt
log_info "Obteniendo certificado SSL de Let's Encrypt..."

# Configurar argumentos para staging o producción
if [ $STAGING != "0" ]; then
    STAGING_ARG="--staging"
    log_warning "Usando servidor de staging de Let's Encrypt"
else
    STAGING_ARG=""
    log_info "Usando servidor de producción de Let's Encrypt"
fi

# Ejecutar certbot
docker-compose -f docker-compose.production.yml run --rm certbot \
    certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    $STAGING_ARG \
    -d $DOMAIN \
    -d www.$DOMAIN

if [ $? -eq 0 ]; then
    log_info "✅ Certificado SSL obtenido exitosamente!"
    
    # Recargar nginx con el nuevo certificado
    log_info "Recargando nginx con el nuevo certificado..."
    docker-compose -f docker-compose.production.yml restart nginx
    
    log_info "🚀 SSL configurado correctamente para $DOMAIN"
    log_info "Certificado se renovará automáticamente cada 12 horas"
else
    log_error "❌ Error al obtener el certificado SSL"
    log_error "Verifica que:"
    log_error "1. El dominio $DOMAIN apunte a este servidor"
    log_error "2. Los puertos 80 y 443 estén abiertos"
    log_error "3. No haya otro servidor web ejecutándose"
    exit 1
fi

# Mostrar información del certificado
log_info "Información del certificado:"
docker-compose -f docker-compose.production.yml run --rm certbot certificates

log_info "✅ Configuración SSL completada!"
log_info "Tu sitio está disponible en: https://$DOMAIN"
