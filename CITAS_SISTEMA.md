# Sistema de Citas - Orta Novias
## Guía de Pruebas

### ✅ Estado Actual
- ✅ Frontend conectado con backend real
- ✅ API de citas funcionando
- ✅ Sistema de notificaciones implementado
- ✅ Base de datos configurada

### 🚀 Cómo Probar el Sistema

#### 1. Verificar que los servidores estén corriendo:
- **Backend (Django)**: http://127.0.0.1:8000/
- **Frontend (Vite)**: http://localhost:5173/

#### 2. Probar el formulario de citas:
1. Ve a la página de citas: http://localhost:5173/appointments
2. Completa el formulario con:
   - Nombre completo
   - Email (requerido)
   - Teléfono (opcional)
   - Método de confirmación (Email o WhatsApp)
   - Fecha preferida
   - Hora preferida
   - Comentarios (opcional)

#### 3. Verificar que la cita se guarde:
- Al enviar el formulario, la cita se guardará en la base de datos
- Se mostrará un mensaje de éxito
- Se enviará una notificación según el método elegido

#### 4. Ver las notificaciones:
- **Email**: Los emails aparecerán en la consola del servidor Django (configuración de testing)
- **WhatsApp**: Requiere configurar credenciales de Twilio en el archivo .env

### 📧 Configuración de Email (Producción)
Para usar email real en producción, edita el archivo `.env`:

```
EMAIL_HOST_USER=tu-email@gmail.com
EMAIL_HOST_PASSWORD=tu-contraseña-de-aplicacion
DEFAULT_FROM_EMAIL=noreply@ortanovias.com
```

Y cambia en `core/settings.py`:
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
```

### 📱 Configuración de WhatsApp (Twilio)
Para usar WhatsApp, configura en el archivo `.env`:

```
TWILIO_ACCOUNT_SID=tu-account-sid
TWILIO_AUTH_TOKEN=tu-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### 🔍 Ver las citas en la base de datos
Para ver las citas guardadas desde la consola:

```bash
python manage.py shell
```

```python
from backend.apps.appointments.models import Appointment
# Ver todas las citas
appointments = Appointment.objects.all()
for apt in appointments:
    print(f"{apt.name} - {apt.date} {apt.time} - {apt.email}")
```

### 🛠️ Administración
Puedes ver y gestionar las citas desde el admin de Django:
1. Crear superusuario: `python manage.py createsuperuser`
2. Ir a: http://127.0.0.1:8000/admin/
3. Ver sección "Appointments"

### 📝 Funcionalidades Implementadas
1. **Formulario de citas** con validación
2. **Guardado en base de datos** real
3. **Sistema de notificaciones** (email/WhatsApp)
4. **Manejo de errores** y estados de carga
5. **Interfaz responsive** y moderna
6. **Confirmación visual** del envío

### 🎯 Próximos Pasos (Opcional)
- [ ] Configurar email real para producción
- [ ] Configurar WhatsApp con Twilio
- [ ] Añadir calendario para selección de fechas
- [ ] Sistema de confirmación de citas por parte del admin
- [ ] Dashboard para gestión de citas
