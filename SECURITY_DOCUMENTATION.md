# 🛡️ DOCUMENTACIÓN DE SEGURIDAD - ORTA NOVIAS

## **RESUMEN EJECUTIVO**

Este documento describe la arquitectura de seguridad completa implementada para **Orta Novias**, incluyendo el **Web Application Firewall (WAF) de Cloudflare** y todas las medidas de protección de múltiples capas.

---

## **📊 BENEFICIOS DEL WAF DE CLOUDFLARE**

### **1. ¿Para qué sirve el WAF de Cloudflare?**

#### **🔒 Protección contra Ataques**
- **DDoS Protection**: Protege contra ataques de denegación de servicio distribuidos
- **SQL Injection**: Bloquea intentos de inyección SQL automáticamente
- **XSS (Cross-Site Scripting)**: Previene ataques de scripts maliciosos
- **CSRF (Cross-Site Request Forgery)**: Protege contra falsificación de solicitudes
- **Bot Protection**: Filtra tráfico malicioso de bots y scrapers

#### **⚡ Mejoras de Rendimiento**
- **CDN Global**: Distribución de contenido desde 275+ ubicaciones
- **Caching Inteligente**: Cacheo automático de contenido estático
- **Minificación**: Compresión automática de CSS, JS y HTML
- **HTTP/2 y HTTP/3**: Protocolos optimizados automáticamente
- **Brotli Compression**: Compresión avanzada para menor tiempo de carga

#### **🌍 Optimización Geográfica**
- **Edge Computing**: Procesamiento en servidores cercanos al usuario
- **Smart Routing**: Selección automática de la ruta más rápida
- **Geo-blocking**: Bloqueo por país (útil para admin desde España)
- **Latency Reduction**: Reducción significativa de latencia global

#### **📈 Analytics y Monitoreo**
- **Real-time Analytics**: Métricas en tiempo real de tráfico y ataques
- **Security Insights**: Reportes detallados de amenazas bloqueadas
- **Performance Metrics**: Métricas de rendimiento y disponibilidad
- **Custom Dashboards**: Paneles personalizados de monitoreo

---

## **🏗️ ARQUITECTURA DE SEGURIDAD MULTICAPA**

### **Capa 1: Cloudflare WAF (Edge)**
```
Internet → Cloudflare Edge → WAF Rules → Rate Limiting → Cache
```

### **Capa 2: Servidor Web (Nginx/Apache)**
```
Cloudflare → SSL Termination → Load Balancer → Web Server
```

### **Capa 3: Aplicación Django**
```
Web Server → Django Security Middleware → Custom Security → Application
```

### **Capa 4: Base de Datos**
```
Application → Connection Pool → PostgreSQL Security → Database
```

---

## **⚙️ CONFIGURACIÓN IMPLEMENTADA**

### **1. Cloudflare WAF Rules**

#### **Reglas de Protección Básica**
```python
# SQL Injection Protection
Expression: (http.request.uri.query contains "union select") or 
           (http.request.uri.query contains "drop table") or 
           (http.request.body contains "union select")
Action: BLOCK

# XSS Protection  
Expression: (http.request.uri.query contains "<script") or 
           (http.request.body contains "<script") or 
           (http.request.uri.query contains "javascript:")
Action: BLOCK

# Admin Geo-blocking
Expression: (http.request.uri.path matches "^/admin/") and 
           (ip.geoip.country ne "ES")
Action: BLOCK
```

#### **Reglas de Rate Limiting**
```python
# API Login Protection
Endpoint: /api/token/*
Limit: 5 requests per 5 minutes
Action: BAN for 15 minutes

# General API Protection
Endpoint: /api/*
Limit: 100 requests per 5 minutes  
Action: CHALLENGE

# Contact Form Protection
Endpoint: /api/appointments/*
Limit: 3 requests per 10 minutes
Action: BAN for 30 minutes
```

### **2. Django Security Middleware**

#### **Headers de Seguridad**
```python
SECURE_HSTS_SECONDS = 31536000  # 1 año
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_SSL_REDIRECT = True
X_FRAME_OPTIONS = 'DENY'
```

#### **Configuración CORS**
```python
CORS_ALLOWED_ORIGINS = [
    "https://ortanovias.com",
    "https://www.ortanovias.com",
]
CORS_ALLOW_CREDENTIALS = True
```

#### **CSP (Content Security Policy)**
```python
CSP_DEFAULT_SRC = ("'self'",)
CSP_SCRIPT_SRC = ("'self'", "'unsafe-inline'", "cloudflare.com")
CSP_STYLE_SRC = ("'self'", "'unsafe-inline'", "fonts.googleapis.com")
CSP_IMG_SRC = ("'self'", "data:", "*.cloudfront.net")
```

### **3. Middleware Personalizado**

#### **Advanced Security Middleware**
- **IP Whitelisting**: Lista blanca de IPs administrativas
- **Request Size Limiting**: Límite de tamaño de peticiones
- **File Upload Security**: Validación de archivos subidos
- **Suspicious Activity Detection**: Detección de patrones sospechosos

#### **Cloudflare Integration Middleware**
- **Real IP Detection**: Extracción de IP real desde headers de Cloudflare
- **Country Blocking**: Bloqueo adicional por país
- **ASN Filtering**: Filtrado por proveedor de internet
- **Security Headers Enhancement**: Headers adicionales de seguridad

---

## **🔐 AUTENTICACIÓN Y AUTORIZACIÓN**

### **JWT Enhanced Security**

#### **Características Implementadas**
```python
# Token Configuration
ACCESS_TOKEN_LIFETIME: 15 minutes
REFRESH_TOKEN_LIFETIME: 7 days
ROTATE_REFRESH_TOKENS: True
BLACKLIST_AFTER_ROTATION: True

# Security Features
ALGORITHM: "HS256" 
ISSUER_CHECK: True
AUDIENCE_CHECK: True
REQUIRE_EXP: True
```

#### **Rate Limiting en Login**
```python
# Failed Login Protection
Max Attempts: 5 per 15 minutes per IP
Lockout Duration: 30 minutes
Suspicious Activity Threshold: 10 attempts

# Device Tracking
Track User Agents: True
Location Verification: True
Unusual Activity Alerts: True
```

### **Session Security**
```python
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Strict'
SESSION_COOKIE_AGE = 3600  # 1 hora
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
```

---

## **📊 MONITOREO Y ALERTAS**

### **1. Sentry Integration**
```python
# Error Tracking
Automatic Error Capture: True
Performance Monitoring: True
Release Tracking: True
User Feedback: True

# Security Alerts
Failed Login Attempts: True
Suspicious IP Activity: True
API Abuse Detection: True
```

### **2. Logging Configuration**
```python
# Security Logs
Path: /var/log/ortanovias/security.log
Level: INFO
Rotation: Daily
Retention: 90 days

# Application Logs  
Path: /var/log/ortanovias/application.log
Level: WARNING
Rotation: Weekly
Retention: 30 days
```

### **3. Cloudflare Analytics**
- **Real-time Dashboard**: Métricas en vivo
- **Security Events**: Log de ataques bloqueados
- **Performance Metrics**: Tiempos de carga y disponibilidad
- **Traffic Analysis**: Análisis de patrones de tráfico

---

## **🚀 OPTIMIZACIONES DE RENDIMIENTO**

### **1. Caching Strategy**

#### **Cloudflare Edge Caching**
```python
# Static Files
TTL: 1 year (31536000 seconds)
Cache Level: Cache Everything
Browser Cache: 1 year

# API Responses
TTL: No cache
Cache Level: Bypass
Dynamic Content: Always fresh

# Media Files
TTL: 3 months (7776000 seconds)  
Cache Level: Cache Everything
Optimization: Automatic
```

#### **Redis Backend Caching**
```python
# Session Storage
Backend: Redis
TTL: 1 hour
Key Prefix: "ortanovias:session:"

# API Rate Limiting
Backend: Redis  
TTL: Variable per endpoint
Key Prefix: "ortanovias:ratelimit:"

# Query Caching
Backend: Redis
TTL: 15 minutes
Key Prefix: "ortanovias:query:"
```

### **2. Database Optimization**
```python
# Connection Pooling
CONN_MAX_AGE: 600 seconds
CONN_HEALTH_CHECKS: True
AUTOCOMMIT: True

# Query Optimization
SELECT_RELATED: Used everywhere
PREFETCH_RELATED: For nested queries
INDEX_OPTIMIZATION: All foreign keys
```

---

## **🔧 HERRAMIENTAS DE ADMINISTRACIÓN**

### **1. Security Validation Script**
```bash
# Ejecutar validación completa
python backend/security_check.py

# Verificaciones incluidas:
- SSL/TLS Configuration
- Headers de Seguridad  
- CORS Configuration
- JWT Settings
- Database Security
- File Permissions
- Environment Variables
```

### **2. Cloudflare Setup Script**
```bash
# Configuración automática
python cloudflare_setup.py

# Configuraciones aplicadas:
- WAF Rules Creation
- Rate Limiting Setup  
- Security Settings
- Page Rules
- Analytics Setup
```

### **3. Deployment Script**
```bash
# Despliegue completo
python deploy.py

# Proceso automatizado:
- Prerequisites Check
- Environment Setup
- Frontend Build
- Backend Configuration  
- Security Validation
- Cloudflare Setup
- Docker Deployment
- Post-deployment Tests
```

---

## **📋 CHECKLIST DE SEGURIDAD**

### **✅ Implementado**
- [x] WAF de Cloudflare configurado
- [x] Rate limiting en múltiples capas
- [x] Headers de seguridad completos
- [x] CORS configuration  
- [x] CSP implementation
- [x] JWT security enhanced
- [x] SQL injection protection
- [x] XSS protection
- [x] CSRF protection
- [x] Session security
- [x] SSL/TLS enforcement
- [x] Geo-blocking para admin
- [x] IP whitelisting
- [x] File upload security
- [x] Error monitoring (Sentry)
- [x] Security logging
- [x] Environment variables
- [x] Database security
- [x] Middleware personalizado

### **🔄 Configuración Pendiente**
- [ ] Certificados SSL personalizados
- [ ] Backup automático de base de datos
- [ ] Disaster recovery plan
- [ ] Penetration testing
- [ ] Security audit externo
- [ ] Compliance documentation

---

## **🎯 MÉTRICAS DE SEGURIDAD**

### **Objetivos de Protección**
- **99.9%** de disponibilidad
- **< 1 segundo** tiempo de respuesta con WAF
- **0** brechas de seguridad
- **< 5 minutos** tiempo de detección de amenazas
- **100%** de tráfico sobre HTTPS

### **KPIs de Monitoreo**
- Ataques bloqueados por día
- Tiempo de respuesta promedio
- Porcentaje de tráfico legítimo vs malicioso
- Disponibilidad del servicio
- Tiempo de resolución de incidentes

---

## **📞 CONTACTO Y SOPORTE**

### **En caso de incidente de seguridad:**
1. **Inmediato**: Revisar dashboard de Cloudflare
2. **< 5 minutos**: Verificar logs de Sentry
3. **< 10 minutos**: Ejecutar script de validación
4. **< 15 minutos**: Implementar medidas correctivas
5. **< 30 minutos**: Documentar incidente

### **Recursos de Apoyo:**
- **Cloudflare Dashboard**: [dashboard.cloudflare.com](https://dash.cloudflare.com)
- **Sentry Dashboard**: [sentry.io](https://sentry.io)
- **Logs del Sistema**: `/var/log/ortanovias/`
- **Documentación API**: `https://ortanovias.com/api/docs/`

---

## **🔮 ROADMAP DE SEGURIDAD**

### **Próximas 4 semanas:**
- Implementar certificates SSL personalizados
- Configurar backups automáticos
- Realizar audit de seguridad
- Implementar 2FA para admin

### **Próximos 3 meses:**
- Penetration testing profesional
- Compliance assessment (GDPR)
- Advanced threat detection
- Security awareness training

### **Próximos 6 meses:**
- WAF machine learning rules
- Advanced DDoS protection
- Security orchestration
- Incident response automation

---

**📅 Última actualización:** `date +%Y-%m-%d`  
**👨‍💻 Implementado por:** Equipo de Desarrollo Orta Novias  
**📧 Contacto técnico:** admin@ortanovias.com  

---

> **💡 NOTA IMPORTANTE:** Esta documentación debe mantenerse actualizada con cada cambio en la configuración de seguridad. Revisar mensualmente y actualizar después de cada despliegue importante.
