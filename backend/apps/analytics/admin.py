from django.contrib import admin
from .models import AnalyticsEvent, ConversionEvent, UserSession, BusinessMetrics

@admin.register(AnalyticsEvent)
class AnalyticsEventAdmin(admin.ModelAdmin):
    list_display = ['event_name', 'event_category', 'user', 'timestamp', 'page_url']
    list_filter = ['event_category', 'timestamp', 'event_name']
    search_fields = ['event_name', 'page_url', 'user__username']
    readonly_fields = ['timestamp', 'created_at']
    date_hierarchy = 'timestamp'
    
    fieldsets = (
        ('Event Information', {
            'fields': ('event_name', 'event_category', 'event_label', 'event_value')
        }),
        ('User Context', {
            'fields': ('user', 'session_id', 'user_agent', 'ip_address')
        }),
        ('Page Context', {
            'fields': ('page_url', 'page_title', 'referrer')
        }),
        ('Additional Data', {
            'fields': ('custom_parameters',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('timestamp', 'created_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(ConversionEvent)
class ConversionEventAdmin(admin.ModelAdmin):
    list_display = ['conversion_type', 'conversion_value', 'currency', 'user', 'timestamp']
    list_filter = ['conversion_type', 'timestamp', 'currency']
    search_fields = ['conversion_type', 'user__username']
    readonly_fields = ['timestamp', 'created_at']
    date_hierarchy = 'timestamp'

@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'user', 'start_time', 'duration', 'page_views', 'is_converted']
    list_filter = ['start_time', 'is_converted', 'conversion_type']
    search_fields = ['session_id', 'user__username']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'start_time'

@admin.register(BusinessMetrics)
class BusinessMetricsAdmin(admin.ModelAdmin):
    list_display = ['metric_type', 'metric_value', 'date', 'period_type']
    list_filter = ['metric_type', 'date', 'period_type']
    search_fields = ['metric_type']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'date'
