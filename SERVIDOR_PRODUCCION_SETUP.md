# 🌐 SERVIDOR DE PRODUCCIÓN - Orta Novias

## 🎯 **OBJETIVO: PONER LA WEB ONLINE**

Configurar servidor para que **ortanovias.com** funcione correctamente con:
- ✅ Frontend (React/Vite) en ortanovias.com
- ✅ Backend (Django) en api.ortanovias.com  
- ✅ SSL/HTTPS automático
- ✅ Google Analytics funcionando

---

## 🚀 **OPCIONES DE HOSTING**

### **OPCIÓN 1: VPS (Recomendado para control total)**
```
💰 Costo: 10-20€/mes
🔧 Control: Total
⚙️ Configuración: Manual pero flexible

Proveedores recomendados:
- Hetzner (Alemania): 4.15€/mes
- DigitalOcean (EEUU): $6/mes  
- Vultr (Europa): $6/mes
- Contabo (Alemania): 4.99€/mes
```

### **OPCIÓN 2: Hosting Compartido**
```
💰 Costo: 5-15€/mes
🔧 Control: Limitado
⚙️ Configuración: Más fácil

Proveedores:
- SiteGround: ~10€/mes
- Hostinger: ~5€/mes
- WebEmpresa (España): ~8€/mes
```

### **OPCIÓN 3: Plataformas Cloud (Más fácil)**
```
💰 Costo: 0-20€/mes (según uso)
🔧 Control: Automático
⚙️ Configuración: Muy fácil

Opciones:
- Vercel (Frontend) + Railway (Backend)
- Netlify (Frontend) + Heroku (Backend)  
- AWS Amplify (Todo junto)
```

---

## 💡 **MI RECOMENDACIÓN PARA ORTA NOVIAS**

### **Para empezar: OPCIÓN 3 (Cloud)**
```
✅ Frontend en Vercel (GRATIS)
✅ Backend en Railway ($5/mes)
✅ Base de datos PostgreSQL incluida
✅ SSL automático
✅ Deploy automático desde Git
✅ Escalable cuando crezca el negocio

Total: ~$5/mes para empezar
```

### **Cuando crezca: OPCIÓN 1 (VPS)**
```
✅ Servidor dedicado Hetzner (4.15€/mes)
✅ Control total
✅ Múltiples proyectos
✅ Mejor rendimiento
```

---

## 🔧 **CONFIGURACIÓN RÁPIDA CON CLOUD**

### **PASO 1: Frontend en Vercel**
```
1. Ir a: https://vercel.com/
2. "Sign up" con GitHub
3. "Import Project" → tu repositorio GitHub
4. "Import" proyecto Orta Novias
5. Configurar:
   - Framework: Vite
   - Root Directory: frontend/
   - Build Command: npm run build
   - Output Directory: dist/
   - Environment Variables:
     VITE_API_BASE_URL=https://tu-backend.railway.app
```

### **PASO 2: Backend en Railway** 
```
1. Ir a: https://railway.app/
2. "Start a New Project"
3. "Deploy from GitHub repo"
4. Seleccionar tu repositorio
5. Configurar:
   - Start Command: python manage.py runserver 0.0.0.0:$PORT
   - Environment Variables:
     DJANGO_ALLOWED_HOSTS=*.railway.app,ortanovias.com,www.ortanovias.com
     DJANGO_DEBUG=False
     DJANGO_SECRET_KEY=[generar nueva]
```

### **PASO 3: Configurar Dominio Personalizado**
```
En Vercel:
1. Project Settings → Domains
2. Añadir: ortanovias.com
3. Añadir: www.ortanovias.com

En Railway:
1. Settings → Domains  
2. Añadir: api.ortanovias.com
```

### **PASO 4: Actualizar DNS en CloudFlare**
```
Vercel te dará IPs como:
76.76.19.61

Railway te dará dominio como:
tu-proyecto.railway.app

Configurar en CloudFlare:
Type: A, Name: @, Content: 76.76.19.61
Type: CNAME, Name: www, Content: ortanovias.com  
Type: CNAME, Name: api, Content: tu-proyecto.railway.app
```

---

## 🔧 **CONFIGURACIÓN MANUAL CON VPS**

### **Si prefieres VPS (más técnico):**

#### **PASO 1: Contratar VPS**
```
Recomendado: Hetzner Cloud
- CPU: 1 vCPU
- RAM: 2GB  
- SSD: 20GB
- Precio: 4.15€/mes
- OS: Ubuntu 22.04
```

#### **PASO 2: Configurar Servidor**
```bash
# Conectar por SSH
ssh root@TU_IP_SERVIDOR

# Actualizar sistema
apt update && apt upgrade -y

# Instalar dependencias
apt install -y nginx python3 python3-pip nodejs npm git postgresql

# Configurar firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

#### **PASO 3: Desplegar Aplicación**
```bash
# Clonar repositorio
cd /var/www/
git clone https://github.com/TU_USUARIO/orta-novias.git
cd orta-novias

# Backend
cd backend
pip3 install -r requirements.txt
python3 manage.py collectstatic --noinput
python3 manage.py migrate

# Frontend  
cd ../frontend
npm install
npm run build
```

#### **PASO 4: Configurar Nginx**
Ya tienes la configuración en el archivo `DOMINIO_CLOUDFLARE_SETUP.md`

---

## 🎯 **¿QUÉ OPCIÓN PREFIERES?**

### **A) OPCIÓN CLOUD (Fácil y rápido)** ⭐
- Vercel + Railway
- 5-10 minutos setup
- ~$5/mes
- Sin configuración técnica

### **B) OPCIÓN VPS (Control total)**
- Hetzner Cloud  
- 1-2 horas setup
- ~4€/mes
- Configuración manual

### **C) HOSTING COMPARTIDO**
- SiteGround/Hostinger
- Setup intermedio
- ~8€/mes

---

## 📋 **INFORMACIÓN QUE NECESITO:**

**Para cualquier opción:**
1. **¿Tienes cuenta en GitHub?** (necesaria para deploy automático)
2. **¿Prefieres fácil y rápido (A) o control total (B)?**

**Si eliges VPS:**
3. **¿Tienes experiencia con servidores Linux?**
4. **¿Prefieres que configure yo todo paso a paso?**

---

**¿Cuál opción prefieres: A (Cloud), B (VPS) o C (Hosting)?** 🤔

**Una vez que elijas, te guío paso a paso para tener ortanovias.com funcionando.** 🚀
