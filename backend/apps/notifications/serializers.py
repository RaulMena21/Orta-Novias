from rest_framework import serializers
from .models import Notification, EmailTemplate, ReminderSchedule


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer para notificaciones"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    appointment_date = serializers.DateTimeField(source='appointment.appointment_date', read_only=True)
    time_since_created = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message', 'notification_type', 'status',
            'sent_at', 'read_at', 'created_at', 'user_email', 'user_name',
            'appointment_date', 'time_since_created', 'retry_count'
        ]
        read_only_fields = ['id', 'sent_at', 'created_at', 'retry_count']
    
    def get_time_since_created(self, obj):
        """Calcular tiempo transcurrido desde la creación"""
        from django.utils import timezone
        from django.utils.timesince import timesince
        
        if obj.created_at:
            return timesince(obj.created_at, timezone.now())
        return None


class NotificationListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para lista de notificaciones"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'notification_type', 'status', 
            'sent_at', 'created_at', 'user_name'
        ]


class EmailTemplateSerializer(serializers.ModelSerializer):
    """Serializer para plantillas de email"""
    
    class Meta:
        model = EmailTemplate
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class ReminderScheduleSerializer(serializers.ModelSerializer):
    """Serializer para recordatorios programados"""
    appointment_details = serializers.SerializerMethodField()
    user_name = serializers.CharField(source='appointment.user.get_full_name', read_only=True)
    time_until_reminder = serializers.SerializerMethodField()
    
    class Meta:
        model = ReminderSchedule
        fields = [
            'id', 'appointment', 'reminder_type', 'hours_before', 
            'scheduled_time', 'is_sent', 'sent_at', 'appointment_details',
            'user_name', 'time_until_reminder'
        ]
        read_only_fields = ['sent_at']
    
    def get_appointment_details(self, obj):
        """Obtener detalles básicos de la cita"""
        if obj.appointment:
            return {
                'id': obj.appointment.id,
                'date': obj.appointment.appointment_date,
                'service_type': obj.appointment.service_type,
                'user_email': obj.appointment.user.email
            }
        return None
    
    def get_time_until_reminder(self, obj):
        """Calcular tiempo hasta el recordatorio"""
        from django.utils import timezone
        from django.utils.timesince import timeuntil
        
        if obj.scheduled_time and not obj.is_sent:
            if obj.scheduled_time > timezone.now():
                return timeuntil(timezone.now(), obj.scheduled_time)
            else:
                return "Pendiente de envío"
        return None


class MarkNotificationAsReadSerializer(serializers.Serializer):
    """Serializer para marcar notificaciones como leídas"""
    notification_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=True,
        help_text="Lista de IDs de notificaciones a marcar como leídas"
    )


class ResendNotificationSerializer(serializers.Serializer):
    """Serializer para reenviar notificaciones"""
    notification_id = serializers.IntegerField(required=True)
    force_resend = serializers.BooleanField(
        default=False,
        help_text="Forzar reenvío aunque ya haya sido enviada"
    )


class NotificationStatsSerializer(serializers.Serializer):
    """Serializer para estadísticas de notificaciones"""
    total_notifications = serializers.IntegerField()
    sent_count = serializers.IntegerField()
    failed_count = serializers.IntegerField()
    pending_count = serializers.IntegerField()
    unread_count = serializers.IntegerField()
    email_count = serializers.IntegerField()
    whatsapp_count = serializers.IntegerField()
    internal_count = serializers.IntegerField()
    success_rate = serializers.FloatField()


class SendTestNotificationSerializer(serializers.Serializer):
    """Serializer para enviar notificación de prueba"""
    user_id = serializers.IntegerField(required=True)
    notification_type = serializers.ChoiceField(
        choices=['email', 'whatsapp', 'internal'],
        required=True
    )
    title = serializers.CharField(max_length=200, required=True)
    message = serializers.CharField(required=True)
    template_name = serializers.CharField(
        required=False,
        help_text="Nombre de plantilla para emails (opcional)"
    )
