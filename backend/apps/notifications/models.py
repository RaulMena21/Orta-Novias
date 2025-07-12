from django.db import models
from django.contrib.auth import get_user_model
from backend.apps.appointments.models import Appointment

User = get_user_model()


class NotificationType(models.TextChoices):
    """Tipos de notificaciones"""
    EMAIL = 'email', 'Email'
    WHATSAPP = 'whatsapp', 'WhatsApp'
    INTERNAL = 'internal', 'Mensaje Interno'
    PUSH = 'push', 'Notificación Push'


class NotificationStatus(models.TextChoices):
    """Estados de las notificaciones"""
    PENDING = 'pending', 'Pendiente'
    SENT = 'sent', 'Enviado'
    FAILED = 'failed', 'Fallido'
    READ = 'read', 'Leído'


class EmailTemplate(models.Model):
    """Plantillas de email para diferentes tipos de notificaciones"""
    name = models.CharField(max_length=100, unique=True)
    subject = models.CharField(max_length=200)
    html_content = models.TextField()
    text_content = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Plantilla de Email"
        verbose_name_plural = "Plantillas de Email"
    
    def __str__(self):
        return self.name


class Notification(models.Model):
    """Modelo principal para todas las notificaciones"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, null=True, blank=True)
    
    # Contenido de la notificación
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NotificationType.choices)
    status = models.CharField(max_length=20, choices=NotificationStatus.choices, default=NotificationStatus.PENDING)
    
    # Metadata
    sent_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    retry_count = models.IntegerField(default=0)
    max_retries = models.IntegerField(default=3)
    
    # Datos específicos del canal
    email_data = models.JSONField(null=True, blank=True)  # Para emails: template_name, attachments, etc.
    whatsapp_data = models.JSONField(null=True, blank=True)  # Para WhatsApp: phone_number, etc.
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Notificación"
        verbose_name_plural = "Notificaciones"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.email}"
    
    def mark_as_read(self):
        """Marcar notificación como leída"""
        if not self.read_at:
            self.read_at = models.timezone.now()
            self.status = NotificationStatus.READ
            self.save()


class EmailLog(models.Model):
    """Log detallado de emails enviados"""
    notification = models.OneToOneField(Notification, on_delete=models.CASCADE)
    to_email = models.EmailField()
    from_email = models.EmailField()
    subject = models.CharField(max_length=200)
    template_name = models.CharField(max_length=100, blank=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    success = models.BooleanField(default=False)
    error_message = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Log de Email"
        verbose_name_plural = "Logs de Email"
    
    def __str__(self):
        return f"Email a {self.to_email} - {'Éxito' if self.success else 'Error'}"


class WhatsAppLog(models.Model):
    """Log detallado de mensajes de WhatsApp"""
    notification = models.OneToOneField(Notification, on_delete=models.CASCADE)
    to_phone = models.CharField(max_length=20)
    message_sid = models.CharField(max_length=100, blank=True)  # ID de Twilio
    sent_at = models.DateTimeField(auto_now_add=True)
    success = models.BooleanField(default=False)
    error_message = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Log de WhatsApp"
        verbose_name_plural = "Logs de WhatsApp"
    
    def __str__(self):
        return f"WhatsApp a {self.to_phone} - {'Éxito' if self.success else 'Error'}"


class ReminderSchedule(models.Model):
    """Programación de recordatorios automáticos"""
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='reminders')
    reminder_type = models.CharField(max_length=20, choices=NotificationType.choices)
    hours_before = models.IntegerField()  # Horas antes de la cita para enviar el recordatorio
    is_sent = models.BooleanField(default=False)
    scheduled_time = models.DateTimeField()  # Momento calculado para enviar
    sent_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Recordatorio Programado"
        verbose_name_plural = "Recordatorios Programados"
        unique_together = ['appointment', 'reminder_type', 'hours_before']
    
    def __str__(self):
        return f"Recordatorio {self.hours_before}h antes - {self.appointment}"
