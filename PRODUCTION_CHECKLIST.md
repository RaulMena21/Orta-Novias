# ✅ CHECKLIST PRE-PRODUCCIÓN - Orta Novias

## 🔒 SEGURIDAD
- [ ] Cambiar DJANGO_SECRET_KEY por uno seguro y único
- [ ] Configurar DJANGO_DEBUG=False en .env de producción
- [ ] Actualizar ALLOWED_HOSTS con dominios reales
- [ ] Configurar HTTPS/SSL en el servidor
- [ ] Configurar credenciales de email reales
- [ ] Configurar credenciales de Twilio/WhatsApp reales
- [ ] Revisar permisos de archivos y directorios
- [ ] Configurar firewall del servidor

## 🧪 TESTING
- [ ] Ejecutar todos los tests unitarios: `python manage.py test`
- [ ] Probar flujo completo de creación de citas
- [ ] Verificar validación de horarios de negocio
- [ ] Probar envío de emails de confirmación
- [ ] Probar envío de WhatsApp (si aplica)
- [ ] Verificar responsive design en móviles
- [ ] Test de carga con múltiples usuarios simultáneos

## 🐳 INFRAESTRUCTURA
- [ ] Configurar servidor de producción (DigitalOcean, AWS, etc.)
- [ ] Instalar Docker y Docker Compose
- [ ] Configurar dominio y DNS
- [ ] Configurar certificado SSL/TLS
- [ ] Configurar base de datos PostgreSQL
- [ ] Configurar Redis para Celery (opcional)

## 📊 MONITOREO Y BACKUP
- [ ] Configurar logging en archivos
- [ ] Configurar monitoreo de errores (Sentry)
- [ ] Configurar backups automáticos de BD
- [ ] Configurar backup de archivos media
- [ ] Configurar alertas por email para errores críticos

## 📋 DATOS Y CONTENIDO
- [ ] Cargar vestidos reales en la base de datos
- [ ] Cargar testimonios reales
- [ ] Configurar usuarios administradores
- [ ] Verificar que las imágenes se carguen correctamente
- [ ] Configurar horarios de negocio finales

## 🌐 FRONTEND
- [ ] Verificar que todas las páginas funcionen
- [ ] Comprobar navegación en móviles
- [ ] Verificar formularios y validaciones
- [ ] Test de compatibilidad con navegadores
- [ ] Optimizar imágenes para web

## 🔧 CONFIGURACIÓN
- [ ] Configurar variables de entorno de producción
- [ ] Verificar configuración de CORS
- [ ] Configurar archivos estáticos con CDN (opcional)
- [ ] Configurar compresión gzip
- [ ] Configurar cache de navegador

## 📞 COMUNICACIONES
- [ ] Verificar que los emails lleguen correctamente
- [ ] Probar notificaciones WhatsApp
- [ ] Configurar respuestas automáticas
- [ ] Verificar formatos de mensaje

## 🎯 RENDIMIENTO
- [ ] Optimizar consultas de base de datos
- [ ] Configurar cache (Redis)
- [ ] Comprimir archivos CSS/JS
- [ ] Optimizar imágenes
- [ ] Configurar CDN para archivos estáticos

## 📋 DOCUMENTACIÓN
- [ ] Documentar proceso de despliegue
- [ ] Crear manual de usuario administrador
- [ ] Documentar APIs
- [ ] Crear guía de solución de problemas

## 🚀 DESPLIEGUE
- [ ] Hacer backup final antes del launch
- [ ] Ejecutar script de despliegue
- [ ] Verificar que todos los servicios estén corriendo
- [ ] Test final en producción
- [ ] Comunicar el lanzamiento

---

## 🆘 CONTACTOS DE EMERGENCIA
- Desarrollador: [tu-email]
- Hosting: [proveedor-hosting]
- Dominio: [proveedor-dominio]
- Email: [proveedor-email]

## 📱 MONITOREO POST-LANZAMIENTO
- [ ] Monitorear logs las primeras 24h
- [ ] Verificar métricas de rendimiento
- [ ] Revisar errores reportados
- [ ] Monitorear uso de recursos del servidor
- [ ] Recopilar feedback de usuarios iniciales
