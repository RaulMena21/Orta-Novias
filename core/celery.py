"""
Configuración optimizada de Celery para producción
"""
import os
from celery import Celery
from django.conf import settings
from kombu import Queue

# Configurar Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('ortanovias')

# Configuración desde Django settings
app.config_from_object('django.conf:settings', namespace='CELERY')

# Configuración optimizada para producción
app.conf.update(
    # Broker settings
    broker_url=settings.CELERY_BROKER_URL,
    result_backend=settings.CELERY_RESULT_BACKEND,
    
    # Serialization
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Europe/Madrid',
    enable_utc=True,
    
    # Task routing
    task_routes={
        'backend.apps.appointments.tasks.send_appointment_email': {'queue': 'email'},
        'backend.apps.appointments.tasks.send_appointment_whatsapp': {'queue': 'whatsapp'},
        'backend.apps.appointments.tasks.send_notification': {'queue': 'notifications'},
        'backend.apps.appointments.tasks.cleanup_old_appointments': {'queue': 'cleanup'},
    },
    
    # Queue configuration
    task_default_queue='default',
    task_queues=(
        Queue('default', routing_key='default'),
        Queue('email', routing_key='email'),
        Queue('whatsapp', routing_key='whatsapp'), 
        Queue('notifications', routing_key='notifications'),
        Queue('cleanup', routing_key='cleanup'),
    ),
    
    # Worker configuration
    worker_hijack_root_logger=False,
    worker_log_format='[%(asctime)s: %(levelname)s/%(processName)s] %(message)s',
    worker_task_log_format='[%(asctime)s: %(levelname)s/%(processName)s][%(task_name)s(%(task_id)s)] %(message)s',
    
    # Task execution
    task_always_eager=False,
    task_eager_propagates=True,
    task_ignore_result=False,
    task_store_eager_result=True,
    
    # Result backend settings
    result_expires=3600,  # 1 hora
    result_persistent=True,
    
    # Error handling
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_reject_on_worker_lost=True,
    
    # Performance
    worker_max_tasks_per_child=1000,
    worker_disable_rate_limits=False,
    
    # Monitoring
    worker_send_task_events=True,
    task_send_sent_event=True,
    
    # Beat schedule para tareas periódicas
    beat_schedule={
        'cleanup-old-appointments': {
            'task': 'backend.apps.appointments.tasks.cleanup_old_appointments',
            'schedule': 3600.0,  # Cada hora
            'options': {'queue': 'cleanup'}
        },
        'send-daily-summary': {
            'task': 'backend.apps.appointments.tasks.send_daily_summary',
            'schedule': 86400.0,  # Cada día
            'options': {'queue': 'email'}
        },
        'backup-database': {
            'task': 'backend.apps.core.tasks.backup_database',
            'schedule': 21600.0,  # Cada 6 horas
            'options': {'queue': 'cleanup'}
        },
    },
)

# Auto-discover tasks from installed apps
app.autodiscover_tasks()

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    """Task de debug para verificar que Celery funciona"""
    print(f'Request: {self.request!r}')
