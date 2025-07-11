#!/bin/bash

# Script de backup para base de datos y archivos
# Usar: ./backup.sh

echo "🔄 Iniciando backup de Orta Novias..."

# Variables
BACKUP_DIR="/backups/$(date +%Y-%m-%d)"
DB_BACKUP="$BACKUP_DIR/db_backup.sql"
MEDIA_BACKUP="$BACKUP_DIR/media_backup.tar.gz"

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Backup de base de datos
echo "📊 Haciendo backup de base de datos..."
docker exec ortanovias_db_1 pg_dump -U $POSTGRES_USER $POSTGRES_DB > $DB_BACKUP

# Backup de archivos media
echo "📁 Haciendo backup de archivos media..."
tar -czf $MEDIA_BACKUP ./media/

# Backup de logs
echo "📋 Haciendo backup de logs..."
tar -czf "$BACKUP_DIR/logs_backup.tar.gz" ./logs/

# Limpiar backups antiguos (mantener últimos 7 días)
echo "🧹 Limpiando backups antiguos..."
find /backups/ -type d -mtime +7 -exec rm -rf {} +

echo "✅ Backup completado en: $BACKUP_DIR"

# Opcional: Subir a cloud storage
# aws s3 cp $BACKUP_DIR s3://tu-bucket/backups/ --recursive
