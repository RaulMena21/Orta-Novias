# WhatsApp Business API - Configuración Django
import os

WHATSAPP_CONFIG = {
    # Configuración general
    'ENABLED': True,
    'DEFAULT_COUNTRY_CODE': '+34',  # España
    
    # Configuración de proveedores
    'USE_TWILIO': False,  # Cambiar a True para usar Twilio
    
    # Meta Business API (Opción 1 - Recomendada para producción)
    'META': {
        'API_TOKEN': os.getenv('WHATSAPP_API_TOKEN'),
        'PHONE_NUMBER_ID': os.getenv('WHATSAPP_PHONE_NUMBER_ID'),
        'VERIFY_TOKEN': os.getenv('WHATSAPP_VERIFY_TOKEN'),
        'API_VERSION': 'v17.0',
    },
    
    # Twilio API (Opción 2 - Más fácil de configurar)
    'TWILIO': {
        'ACCOUNT_SID': os.getenv('TWILIO_ACCOUNT_SID'),
        'AUTH_TOKEN': os.getenv('TWILIO_AUTH_TOKEN'),
        'WHATSAPP_FROM': os.getenv('TWILIO_WHATSAPP_FROM'),
    },
    
    # Templates de mensajes
    'TEMPLATES': {
        'APPOINTMENT_CONFIRMATION': {
            'enabled': True,
            'send_immediately': True,
        },
        'APPOINTMENT_REMINDER': {
            'enabled': True,
            'hours_before': 24,  # Enviar 24h antes
        },
        'FOLLOW_UP': {
            'enabled': True,
            'hours_after': 2,  # Enviar 2h después de la cita
        }
    },
    
    # Límites y configuración
    'RATE_LIMIT': {
        'messages_per_minute': 10,
        'messages_per_hour': 100,
    },
    
    # Logging
    'LOG_MESSAGES': True,
    'LOG_LEVEL': 'INFO',
}

# Agregar a INSTALLED_APPS si no existe
INSTALLED_APPS = [
    # ... tus apps existentes ...
    'backend.apps.notifications',
]

# Configuración de Celery para tareas asíncronas
CELERY_BEAT_SCHEDULE = {
    'send-appointment-reminders': {
        'task': 'backend.apps.notifications.tasks.send_appointment_reminders',
        'schedule': 3600.0,  # Cada hora
    },
    'send-follow-ups': {
        'task': 'backend.apps.notifications.tasks.send_follow_ups',
        'schedule': 3600.0,  # Cada hora
    },
}
