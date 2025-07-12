from django.contrib import admin
from .models import (
    Notification, EmailTemplate, EmailLog, WhatsAppLog, ReminderSchedule
)


@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'subject', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'subject']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'notification_type', 'status', 'sent_at', 'created_at']
    list_filter = ['notification_type', 'status', 'created_at']
    search_fields = ['title', 'user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['created_at', 'updated_at', 'sent_at', 'read_at']
    
    fieldsets = (
        ('Información General', {
            'fields': ('user', 'appointment', 'title', 'message')
        }),
        ('Configuración', {
            'fields': ('notification_type', 'status', 'retry_count', 'max_retries')
        }),
        ('Datos Específicos', {
            'fields': ('email_data', 'whatsapp_data'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'sent_at', 'read_at'),
            'classes': ('collapse',)
        }),
        ('Errores', {
            'fields': ('error_message',),
            'classes': ('collapse',)
        })
    )


@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = ['to_email', 'subject', 'success', 'sent_at']
    list_filter = ['success', 'sent_at']
    search_fields = ['to_email', 'subject']
    readonly_fields = ['sent_at']


@admin.register(WhatsAppLog)
class WhatsAppLogAdmin(admin.ModelAdmin):
    list_display = ['to_phone', 'message_sid', 'success', 'sent_at']
    list_filter = ['success', 'sent_at']
    search_fields = ['to_phone', 'message_sid']
    readonly_fields = ['sent_at']


@admin.register(ReminderSchedule)
class ReminderScheduleAdmin(admin.ModelAdmin):
    list_display = ['appointment', 'reminder_type', 'hours_before', 'scheduled_time', 'is_sent']
    list_filter = ['reminder_type', 'is_sent', 'hours_before']
    search_fields = ['appointment__user__email', 'appointment__service_type']
    readonly_fields = ['scheduled_time', 'sent_at']
