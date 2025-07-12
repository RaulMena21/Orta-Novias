# Analytics Models for Orta Novias
from django.db import models
from django.conf import settings
from django.utils import timezone
import json

class AnalyticsEvent(models.Model):
    """Model to store analytics events for detailed business insights"""
    
    EVENT_CATEGORIES = [
        ('page_view', 'Page View'),
        ('user_interaction', 'User Interaction'),
        ('conversion', 'Conversion'),
        ('engagement', 'Engagement'),
        ('error', 'Error'),
        ('performance', 'Performance'),
        ('form_interaction', 'Form Interaction'),
        ('business_event', 'Business Event'),
    ]
    
    # Event identification
    event_name = models.CharField(max_length=100)
    event_category = models.CharField(max_length=50, choices=EVENT_CATEGORIES)
    event_label = models.CharField(max_length=200, blank=True, null=True)
    event_value = models.FloatField(blank=True, null=True)
    
    # User context
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True)
    session_id = models.CharField(max_length=100, blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    
    # Page context
    page_url = models.URLField(max_length=500)
    page_title = models.CharField(max_length=200, blank=True, null=True)
    referrer = models.URLField(max_length=500, blank=True, null=True)
    
    # Additional data (JSON field for flexibility)
    custom_parameters = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    timestamp = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'analytics_events'
        indexes = [
            models.Index(fields=['event_category', 'timestamp']),
            models.Index(fields=['event_name', 'timestamp']),
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['timestamp']),
        ]
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.event_name} - {self.timestamp}"

class ConversionEvent(models.Model):
    """Model specifically for tracking business conversions"""
    
    CONVERSION_TYPES = [
        ('appointment_scheduled', 'Appointment Scheduled'),
        ('dress_inquiry', 'Dress Inquiry'),
        ('contact_form', 'Contact Form Submission'),
        ('phone_call', 'Phone Call'),
        ('email_inquiry', 'Email Inquiry'),
        ('testimonial_submission', 'Testimonial Submission'),
    ]
    
    conversion_type = models.CharField(max_length=50, choices=CONVERSION_TYPES)
    conversion_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='EUR')
    
    # Related objects
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True)
    analytics_event = models.ForeignKey(AnalyticsEvent, on_delete=models.CASCADE, related_name='conversions')
    
    # Conversion context
    source = models.CharField(max_length=100, blank=True, null=True)  # Where the conversion came from
    medium = models.CharField(max_length=100, blank=True, null=True)  # How they arrived (organic, direct, etc.)
    campaign = models.CharField(max_length=100, blank=True, null=True)  # Marketing campaign if any
    
    # Additional conversion data
    conversion_data = models.JSONField(default=dict, blank=True)
    
    timestamp = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'analytics_conversions'
        indexes = [
            models.Index(fields=['conversion_type', 'timestamp']),
            models.Index(fields=['timestamp']),
        ]
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.conversion_type} - {self.conversion_value}{self.currency}"

class UserSession(models.Model):
    """Model to track user sessions for detailed analytics"""
    
    session_id = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True)
    
    # Session details
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(blank=True, null=True)
    duration = models.DurationField(blank=True, null=True)
    page_views = models.PositiveIntegerField(default=0)
    
    # User context
    user_agent = models.TextField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    referrer = models.URLField(max_length=500, blank=True, null=True)
    
    # Geographic data (if available)
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    
    # Engagement metrics
    bounce_rate = models.FloatField(blank=True, null=True)  # Single page session indicator
    engagement_score = models.FloatField(default=0)  # Calculated engagement score
    
    # Session classification
    is_converted = models.BooleanField(default=False)
    conversion_type = models.CharField(max_length=50, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'analytics_sessions'
        indexes = [
            models.Index(fields=['start_time']),
            models.Index(fields=['user']),
            models.Index(fields=['is_converted']),
        ]
        ordering = ['-start_time']
    
    def __str__(self):
        return f"Session {self.session_id} - {self.start_time}"

class BusinessMetrics(models.Model):
    """Model to store aggregated business metrics"""
    
    METRIC_TYPES = [
        ('daily_visitors', 'Daily Unique Visitors'),
        ('daily_page_views', 'Daily Page Views'),
        ('daily_conversions', 'Daily Conversions'),
        ('daily_revenue', 'Daily Revenue'),
        ('conversion_rate', 'Conversion Rate'),
        ('bounce_rate', 'Bounce Rate'),
        ('avg_session_duration', 'Average Session Duration'),
        ('popular_pages', 'Popular Pages'),
        ('traffic_sources', 'Traffic Sources'),
        ('device_types', 'Device Types'),
    ]
    
    metric_type = models.CharField(max_length=50, choices=METRIC_TYPES)
    metric_value = models.FloatField()
    metric_data = models.JSONField(default=dict, blank=True)  # Additional metric details
    
    # Time period
    date = models.DateField()
    period_type = models.CharField(max_length=20, default='daily')  # daily, weekly, monthly
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'analytics_business_metrics'
        unique_together = ['metric_type', 'date', 'period_type']
        indexes = [
            models.Index(fields=['metric_type', 'date']),
            models.Index(fields=['date']),
        ]
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.metric_type} - {self.date}: {self.metric_value}"
