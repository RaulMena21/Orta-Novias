from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import datetime, timedelta
import json

from .models import AnalyticsEvent, ConversionEvent, UserSession, BusinessMetrics
from .serializers import (
    AnalyticsEventSerializer, 
    ConversionEventSerializer, 
    UserSessionSerializer,
    BusinessMetricsSerializer,
    AnalyticsReportSerializer
)

class AnalyticsEventViewSet(viewsets.ModelViewSet):
    """ViewSet for tracking analytics events"""
    queryset = AnalyticsEvent.objects.all()
    serializer_class = AnalyticsEventSerializer
    permission_classes = [AllowAny]  # For now, allow anonymous tracking
    
    def create(self, request, *args, **kwargs):
        """Create a new analytics event"""
        # Add client IP and user agent if not provided
        if not request.data.get('ip_address'):
            request.data['ip_address'] = self.get_client_ip(request)
        if not request.data.get('user_agent'):
            request.data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')
        
        # Add user if authenticated
        if request.user.is_authenticated:
            request.data['user'] = request.user.id
        
        return super().create(request, *args, **kwargs)
    
    def get_client_ip(self, request):
        """Extract client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """Create multiple analytics events in one request"""
        events_data = request.data.get('events', [])
        created_events = []
        
        for event_data in events_data:
            # Add common data to each event
            if not event_data.get('ip_address'):
                event_data['ip_address'] = self.get_client_ip(request)
            if not event_data.get('user_agent'):
                event_data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')
            if request.user.is_authenticated:
                event_data['user'] = request.user.id
            
            serializer = self.get_serializer(data=event_data)
            if serializer.is_valid():
                event = serializer.save()
                created_events.append(event)
        
        return Response({
            'created_count': len(created_events),
            'events': AnalyticsEventSerializer(created_events, many=True).data
        }, status=status.HTTP_201_CREATED)

class ConversionEventViewSet(viewsets.ModelViewSet):
    """ViewSet for tracking conversion events"""
    queryset = ConversionEvent.objects.all()
    serializer_class = ConversionEventSerializer
    permission_classes = [AllowAny]

class UserSessionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing user sessions"""
    queryset = UserSession.objects.all()
    serializer_class = UserSessionSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def start_session(self, request):
        """Start a new user session"""
        session_data = {
            'session_id': request.data.get('session_id'),
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            'ip_address': self.get_client_ip(request),
            'referrer': request.data.get('referrer', ''),
        }
        
        if request.user.is_authenticated:
            session_data['user'] = request.user.id
        
        serializer = self.get_serializer(data=session_data)
        if serializer.is_valid():
            session = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'])
    def end_session(self, request, pk=None):
        """End a user session"""
        try:
            session = self.get_object()
            session.end_time = timezone.now()
            session.duration = session.end_time - session.start_time
            
            # Calculate engagement metrics
            page_views = AnalyticsEvent.objects.filter(
                session_id=session.session_id,
                event_category='page_view'
            ).count()
            session.page_views = page_views
            session.bounce_rate = 1.0 if page_views <= 1 else 0.0
            
            # Check for conversions
            conversions = ConversionEvent.objects.filter(
                analytics_event__session_id=session.session_id
            )
            if conversions.exists():
                session.is_converted = True
                session.conversion_type = conversions.first().conversion_type
            
            session.save()
            return Response(UserSessionSerializer(session).data)
        except UserSession.DoesNotExist:
            return Response(
                {'error': 'Session not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    def get_client_ip(self, request):
        """Extract client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class AnalyticsReportViewSet(viewsets.ViewSet):
    """ViewSet for generating analytics reports"""
    permission_classes = [AllowAny]  # Adjust permissions as needed
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get dashboard analytics data"""
        # Get date range (default to last 30 days)
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)
        
        # Override with query parameters if provided
        if request.query_params.get('start_date'):
            start_date = datetime.strptime(request.query_params['start_date'], '%Y-%m-%d').date()
        if request.query_params.get('end_date'):
            end_date = datetime.strptime(request.query_params['end_date'], '%Y-%m-%d').date()
        
        # Get key metrics
        total_visitors = UserSession.objects.filter(
            start_time__date__range=[start_date, end_date]
        ).count()
        
        total_page_views = AnalyticsEvent.objects.filter(
            event_category='page_view',
            timestamp__date__range=[start_date, end_date]
        ).count()
        
        total_conversions = ConversionEvent.objects.filter(
            timestamp__date__range=[start_date, end_date]
        ).count()
        
        total_revenue = ConversionEvent.objects.filter(
            timestamp__date__range=[start_date, end_date]
        ).aggregate(total=Sum('conversion_value'))['total'] or 0
        
        # Calculate rates
        conversion_rate = (total_conversions / total_visitors * 100) if total_visitors > 0 else 0
        
        avg_session_duration = UserSession.objects.filter(
            start_time__date__range=[start_date, end_date],
            duration__isnull=False
        ).aggregate(avg=Avg('duration'))['avg']
        
        # Get popular pages
        popular_pages = AnalyticsEvent.objects.filter(
            event_category='page_view',
            timestamp__date__range=[start_date, end_date]
        ).values('page_url').annotate(
            views=Count('id')
        ).order_by('-views')[:10]
        
        # Get conversion types breakdown
        conversion_breakdown = ConversionEvent.objects.filter(
            timestamp__date__range=[start_date, end_date]
        ).values('conversion_type').annotate(
            count=Count('id'),
            revenue=Sum('conversion_value')
        ).order_by('-count')
        
        # Get daily trends
        daily_trends = []
        current_date = start_date
        while current_date <= end_date:
            daily_visitors = UserSession.objects.filter(
                start_time__date=current_date
            ).count()
            
            daily_conversions = ConversionEvent.objects.filter(
                timestamp__date=current_date
            ).count()
            
            daily_revenue = ConversionEvent.objects.filter(
                timestamp__date=current_date
            ).aggregate(total=Sum('conversion_value'))['total'] or 0
            
            daily_trends.append({
                'date': current_date.isoformat(),
                'visitors': daily_visitors,
                'conversions': daily_conversions,
                'revenue': float(daily_revenue),
                'conversion_rate': (daily_conversions / daily_visitors * 100) if daily_visitors > 0 else 0
            })
            
            current_date += timedelta(days=1)
        
        return Response({
            'summary': {
                'total_visitors': total_visitors,
                'total_page_views': total_page_views,
                'total_conversions': total_conversions,
                'total_revenue': float(total_revenue),
                'conversion_rate': round(conversion_rate, 2),
                'avg_session_duration': str(avg_session_duration) if avg_session_duration else None,
            },
            'popular_pages': list(popular_pages),
            'conversion_breakdown': list(conversion_breakdown),
            'daily_trends': daily_trends,
            'date_range': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            }
        })
    
    @action(detail=False, methods=['get'])
    def business_insights(self, request):
        """Get business-specific insights"""
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)
        
        # Appointment-related metrics
        appointment_events = AnalyticsEvent.objects.filter(
            event_name__icontains='appointment',
            timestamp__date__range=[start_date, end_date]
        )
        
        appointment_conversions = ConversionEvent.objects.filter(
            conversion_type='appointment_scheduled',
            timestamp__date__range=[start_date, end_date]
        ).count()
        
        # Dress-related metrics
        dress_inquiries = AnalyticsEvent.objects.filter(
            event_name__icontains='dress',
            timestamp__date__range=[start_date, end_date]
        ).count()
        
        # Testimonial engagement
        testimonial_views = AnalyticsEvent.objects.filter(
            event_name__icontains='testimonial',
            timestamp__date__range=[start_date, end_date]
        ).count()
        
        # Traffic sources analysis
        traffic_sources = AnalyticsEvent.objects.filter(
            event_category='page_view',
            timestamp__date__range=[start_date, end_date]
        ).values('custom_parameters__referrer').annotate(
            count=Count('id')
        ).order_by('-count')[:5]
        
        return Response({
            'business_metrics': {
                'appointment_conversions': appointment_conversions,
                'dress_inquiries': dress_inquiries,
                'testimonial_engagement': testimonial_views,
            },
            'traffic_sources': list(traffic_sources),
            'period': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            }
        })
