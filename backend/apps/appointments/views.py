from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.dateparse import parse_date
from django.utils import timezone
from .models import Appointment
from .serializers import AppointmentSerializer
from .services import NotificationService
from .business_hours import BusinessHoursService
from .validators import AppointmentValidator, DataValidator
# from .security_monitor import SecurityMonitor
import logging

logger = logging.getLogger(__name__)

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    
    def get_queryset(self):
        """
        Filtrar las citas por parámetros de consulta
        """
        queryset = Appointment.objects.all()
        
        # Filtrar por fecha
        date_param = self.request.query_params.get('date', None)
        if date_param:
            try:
                parsed_date = parse_date(date_param)
                if parsed_date:
                    queryset = queryset.filter(date=parsed_date)
            except ValueError:
                pass  # Ignorar fechas malformadas
        
        # Filtrar por estado
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        return queryset.order_by('date', 'time')
    
    def get_permissions(self):
        """
        Permitir crear citas sin autenticación,
        pero requerir autenticación para ver/editar (excepto para consultas específicas)
        """
        if self.action == 'create' or (self.action == 'list' and self.request.query_params.get('date')):
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def create(self, request, *args, **kwargs):
        """Crear cita con validación de seguridad avanzada"""
        
        # Obtener IP del cliente para logging
        client_ip = self._get_client_ip(request)
        logger.info(f"Appointment creation attempt from IP: {client_ip}")
        
        # Validar y sanitizar datos usando nuestro validador personalizado
        is_valid, sanitized_data, validation_errors = AppointmentValidator.validate_appointment_data(
            request.data, 
            client_ip
        )
        
        if not is_valid:
            logger.warning(f"Appointment validation failed from IP {client_ip}: {validation_errors}")
            return Response(validation_errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Validaciones adicionales de negocio
        # Verificar disponibilidad de la fecha/hora
        if 'date' in sanitized_data and 'time' in sanitized_data:
            existing_appointment = Appointment.objects.filter(
                date=sanitized_data['date'],
                time=sanitized_data['time'],
                status__in=['pending', 'confirmed']
            ).first()
            
            if existing_appointment:
                logger.warning(f"Time slot conflict for {sanitized_data['date']} {sanitized_data['time']} from IP {client_ip}")
                return Response({
                    'time': 'Esta hora ya está ocupada. Por favor, selecciona otra hora.'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Crear el serializer con datos sanitizados
        serializer = self.get_serializer(data=sanitized_data)
        serializer.is_valid(raise_exception=True)
        
        # Guardar la cita
        appointment = serializer.save()
        logger.info(f"Appointment {appointment.id} created successfully from IP {client_ip}")
        
        # Enviar notificación
        notification_sent = False
        try:
            notification_sent = NotificationService.send_confirmation(appointment)
            if notification_sent:
                logger.info(f"Notification sent for appointment {appointment.id}")
            else:
                logger.warning(f"Failed to send notification for appointment {appointment.id}")
        except Exception as e:
            logger.error(f"Error sending notification for appointment {appointment.id}: {str(e)}")
        
        # Responder con los datos de la cita creada
        headers = self.get_success_headers(serializer.data)
        response_data = serializer.data.copy()
        response_data['notification_sent'] = notification_sent
        
        return Response(
            response_data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def business_hours(self, request):
        """Obtener información sobre horarios de negocio"""
        info = BusinessHoursService.get_business_hours_info()
        return Response(info)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def validate_date(self, request):
        """Validar si una fecha es válida para citas con validación mejorada"""
        date_param = request.query_params.get('date')
        client_ip = self._get_client_ip(request)
        
        logger.info(f"Date validation request from IP {client_ip}: {date_param}")
        
        if not date_param:
            return Response({'error': 'Parámetro date requerido'}, status=400)
        
        # Usar nuestro validador personalizado
        is_valid, validated_date = DataValidator.validate_date(date_param, client_ip)
        
        if not is_valid:
            logger.warning(f"Invalid date validation from IP {client_ip}: {validated_date}")
            return Response({
                'is_valid': False,
                'error': validated_date,
                'message': validated_date
            }, status=400)
        
        try:
            parsed_date = parse_date(validated_date)
            is_working_day = BusinessHoursService.is_working_day(parsed_date)
            next_working_day = BusinessHoursService.get_next_working_day(parsed_date)
            
            response_data = {
                'is_valid': is_working_day,
                'date': validated_date,
                'is_working_day': is_working_day,
                'next_working_day': next_working_day.isoformat(),
                'message': 'Fecha válida para citas' if is_working_day else 'Esta fecha no está disponible para citas'
            }
            
            logger.info(f"Date validation successful from IP {client_ip}: {response_data}")
            return Response(response_data)
            
        except Exception as e:
            logger.error(f"Error in date validation from IP {client_ip}: {str(e)}")
            return Response({'error': 'Error interno del servidor'}, status=500)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def security_status(self, request):
        """
        Endpoint para consultar el estado de seguridad (solo para administradores)
        """
        if not request.user.is_staff:
            return Response(
                {'error': 'Acceso denegado'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        ip = request.query_params.get('ip')
        if not ip:
            return Response(
                {'error': 'Parámetro IP requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Obtener reputación de la IP
        # reputation = SecurityMonitor.get_ip_reputation(ip)
        reputation = {'risk_level': 'low', 'failed_validations': 0}
        
        # Verificar si está bloqueada
        # is_blocked = SecurityMonitor.is_ip_blocked(ip)
        is_blocked = False
        
        return Response({
            'ip': ip,
            'reputation': reputation,
            'is_blocked': is_blocked,
            'timestamp': timezone.now().isoformat()
        })
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def security_summary(self, request):
        """
        Endpoint para obtener resumen de seguridad (solo para administradores)
        """
        if not request.user.is_staff:
            return Response(
                {'error': 'Acceso denegado'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        hours = int(request.query_params.get('hours', 24))
        
        # Obtener resumen de seguridad
        # from .security_monitor import SecurityReporter
        # summary = SecurityReporter.generate_security_summary(hours)
        summary = {'period_hours': hours, 'total_alerts': 0, 'blocked_ips': [], 'recommendations': []}
        
        return Response(summary)

    def _get_client_ip(self, request):
        """Obtener IP real del cliente"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
