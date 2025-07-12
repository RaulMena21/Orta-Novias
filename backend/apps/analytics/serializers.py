from rest_framework import serializers
from .models import AnalyticsEvent, ConversionEvent, UserSession, BusinessMetrics

class AnalyticsEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsEvent
        fields = '__all__'
        read_only_fields = ('created_at',)

class ConversionEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConversionEvent
        fields = '__all__'
        read_only_fields = ('created_at',)

class UserSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSession
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class BusinessMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessMetrics
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class AnalyticsReportSerializer(serializers.Serializer):
    """Serializer for analytics report generation"""
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    metric_types = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=['daily_visitors', 'daily_conversions', 'conversion_rate']
    )
    group_by = serializers.ChoiceField(
        choices=['day', 'week', 'month'],
        default='day'
    )
