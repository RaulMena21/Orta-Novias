from django.apps import AppConfig


class NotificationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.apps.notifications'
    verbose_name = 'Notificaciones'
    
    def ready(self):
        import backend.apps.notifications.signals
