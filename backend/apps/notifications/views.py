from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q, Count, Case, When, IntegerField, FloatField
from django.contrib.auth import get_user_model

from .models import Notification, EmailTemplate, ReminderSchedule, NotificationStatus, NotificationType
from .serializers import (
    NotificationSerializer, NotificationListSerializer, EmailTemplateSerializer,
    ReminderScheduleSerializer, MarkNotificationAsReadSerializer,
    ResendNotificationSerializer, NotificationStatsSerializer,
    SendTestNotificationSerializer
)
from .services import NotificationService, AppointmentNotificationService

User = get_user_model()


class NotificationViewSet(viewsets.ModelViewSet):
    """ViewSet para manejar notificaciones"""
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filtrar notificaciones según el usuario"""
        queryset = super().get_queryset()
        
        if self.request.user.is_staff:
            # Staff puede ver todas las notificaciones
            pass
        else:
            # Usuarios normales solo ven sus notificaciones
            queryset = queryset.filter(user=self.request.user)
        
        # Filtros opcionales
        notification_type = self.request.query_params.get('type')
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        unread_only = self.request.query_params.get('unread_only')
        if unread_only and unread_only.lower() == 'true':
            queryset = queryset.filter(read_at__isnull=True)
        
        return queryset.order_by('-created_at')
    
    def get_serializer_class(self):
        """Usar serializer simplificado para listas"""
        if self.action == 'list':
            return NotificationListSerializer
        return NotificationSerializer
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Marcar una notificación como leída"""
        notification = self.get_object()
        
        # Verificar permisos
        if not request.user.is_staff and notification.user != request.user:
            return Response(
                {'error': 'No tienes permiso para marcar esta notificación'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        notification.mark_as_read()
        
        return Response({
            'message': 'Notificación marcada como leída',
            'read_at': notification.read_at
        })
    
    @action(detail=False, methods=['post'])
    def mark_multiple_as_read(self, request):
        """Marcar múltiples notificaciones como leídas"""
        serializer = MarkNotificationAsReadSerializer(data=request.data)
        if serializer.is_valid():
            notification_ids = serializer.validated_data['notification_ids']
            
            # Filtrar notificaciones según permisos
            queryset = Notification.objects.filter(id__in=notification_ids)
            if not request.user.is_staff:
                queryset = queryset.filter(user=request.user)
            
            # Marcar como leídas
            updated_count = 0
            for notification in queryset:
                if not notification.read_at:
                    notification.mark_as_read()
                    updated_count += 1
            
            return Response({
                'message': f'{updated_count} notificaciones marcadas como leídas',
                'updated_count': updated_count
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def resend(self, request, pk=None):
        """Reenviar una notificación"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Solo el staff puede reenviar notificaciones'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ResendNotificationSerializer(data=request.data)
        if serializer.is_valid():
            notification = self.get_object()
            force_resend = serializer.validated_data.get('force_resend', False)
            
            # Verificar si ya fue enviada
            if notification.status == NotificationStatus.SENT and not force_resend:
                return Response({
                    'error': 'La notificación ya fue enviada. Use force_resend=true para reenviar.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Resetear estado y reenviar
            notification.status = NotificationStatus.PENDING
            notification.sent_at = None
            notification.error_message = ''
            notification.save()
            
            success = NotificationService.send_notification(notification.id)
            
            if success:
                return Response({'message': 'Notificación reenviada exitosamente'})
            else:
                return Response({
                    'error': 'Error al reenviar la notificación'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Obtener estadísticas de notificaciones"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Solo el staff puede ver estadísticas'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        queryset = Notification.objects.all()
        
        # Estadísticas básicas
        total = queryset.count()
        stats = queryset.aggregate(
            sent_count=Count(Case(When(status=NotificationStatus.SENT, then=1), output_field=IntegerField())),
            failed_count=Count(Case(When(status=NotificationStatus.FAILED, then=1), output_field=IntegerField())),
            pending_count=Count(Case(When(status=NotificationStatus.PENDING, then=1), output_field=IntegerField())),
            unread_count=Count(Case(When(read_at__isnull=True, then=1), output_field=IntegerField())),
            email_count=Count(Case(When(notification_type=NotificationType.EMAIL, then=1), output_field=IntegerField())),
            whatsapp_count=Count(Case(When(notification_type=NotificationType.WHATSAPP, then=1), output_field=IntegerField())),
            internal_count=Count(Case(When(notification_type=NotificationType.INTERNAL, then=1), output_field=IntegerField())),
        )
        
        # Calcular tasa de éxito
        sent_count = stats['sent_count'] or 0
        success_rate = (sent_count / total * 100) if total > 0 else 0
        
        data = {
            'total_notifications': total,
            'success_rate': round(success_rate, 2),
            **stats
        }
        
        serializer = NotificationStatsSerializer(data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def send_test(self, request):
        """Enviar notificación de prueba"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Solo el staff puede enviar notificaciones de prueba'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = SendTestNotificationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = User.objects.get(id=serializer.validated_data['user_id'])
                
                # Preparar datos del email si es necesario
                email_data = None
                if (serializer.validated_data['notification_type'] == 'email' and 
                    serializer.validated_data.get('template_name')):
                    email_data = {
                        'template_name': serializer.validated_data['template_name'],
                        'context': {
                            'test_mode': True,
                            'sent_by': request.user.get_full_name()
                        }
                    }
                
                # Crear notificación
                notification = NotificationService.create_notification(
                    user=user,
                    title=f"[PRUEBA] {serializer.validated_data['title']}",
                    message=serializer.validated_data['message'],
                    notification_type=serializer.validated_data['notification_type'],
                    email_data=email_data
                )
                
                # Enviar notificación
                success = NotificationService.send_notification(notification.id)
                
                if success:
                    return Response({
                        'message': 'Notificación de prueba enviada exitosamente',
                        'notification_id': notification.id
                    })
                else:
                    return Response({
                        'error': 'Error al enviar la notificación de prueba'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
            except User.DoesNotExist:
                return Response({
                    'error': 'Usuario no encontrado'
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmailTemplateViewSet(viewsets.ModelViewSet):
    """ViewSet para plantillas de email"""
    queryset = EmailTemplate.objects.all()
    serializer_class = EmailTemplateSerializer
    permission_classes = [permissions.IsAdminUser]  # Solo admins pueden gestionar plantillas
    
    def get_queryset(self):
        """Filtrar plantillas activas si se solicita"""
        queryset = super().get_queryset()
        
        active_only = self.request.query_params.get('active_only')
        if active_only and active_only.lower() == 'true':
            queryset = queryset.filter(is_active=True)
        
        return queryset.order_by('name')


class ReminderScheduleViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para ver recordatorios programados"""
    queryset = ReminderSchedule.objects.all()
    serializer_class = ReminderScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filtrar recordatorios según el usuario"""
        queryset = super().get_queryset()
        
        if not self.request.user.is_staff:
            # Usuarios normales solo ven sus recordatorios
            queryset = queryset.filter(appointment__user=self.request.user)
        
        # Filtros opcionales
        pending_only = self.request.query_params.get('pending_only')
        if pending_only and pending_only.lower() == 'true':
            queryset = queryset.filter(is_sent=False)
        
        reminder_type = self.request.query_params.get('type')
        if reminder_type:
            queryset = queryset.filter(reminder_type=reminder_type)
        
        return queryset.order_by('scheduled_time')
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Obtener recordatorios próximos a enviar"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Solo el staff puede ver recordatorios próximos'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Recordatorios en las próximas 2 horas
        upcoming_time = timezone.now() + timezone.timedelta(hours=2)
        upcoming_reminders = ReminderSchedule.objects.filter(
            is_sent=False,
            scheduled_time__lte=upcoming_time,
            scheduled_time__gte=timezone.now()
        ).order_by('scheduled_time')
        
        serializer = self.get_serializer(upcoming_reminders, many=True)
        return Response({
            'count': upcoming_reminders.count(),
            'reminders': serializer.data
        })
