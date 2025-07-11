#!/bin/bash

# Script de despliegue para producción
echo "🚀 Desplegando Orta Novias a producción..."

# Verificar que estamos en la rama correcta
if [ "$(git branch --show-current)" != "main" ]; then
    echo "❌ Error: Debes estar en la rama 'main' para desplegar"
    exit 1
fi

# Verificar que no hay cambios sin commitear
if ! git diff-index --quiet HEAD --; then
    echo "❌ Error: Hay cambios sin commitear"
    exit 1
fi

# Backup antes del despliegue
echo "📦 Haciendo backup pre-despliegue..."
./scripts/backup.sh

# Actualizar código
echo "⬇️ Actualizando código..."
git pull origin main

# Construir y desplegar con docker-compose
echo "🐳 Construyendo contenedores..."
docker-compose -f docker-compose.prod.yml build

echo "🔄 Actualizando servicios..."
docker-compose -f docker-compose.prod.yml up -d

# Ejecutar migraciones
echo "📊 Ejecutando migraciones..."
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Recopilar archivos estáticos
echo "📁 Recopilando archivos estáticos..."
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput

# Ejecutar tests
echo "🧪 Ejecutando tests..."
docker-compose -f docker-compose.prod.yml exec backend python manage.py test

# Verificar que los servicios estén corriendo
echo "✅ Verificando servicios..."
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "🎉 Despliegue completado exitosamente!"
    echo "🌐 La aplicación está disponible en: https://tu-dominio.com"
else
    echo "❌ Error en el despliegue. Revisa los logs:"
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi
