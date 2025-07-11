from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.dateparse import parse_date
from .models import Appointment
from .serializers import AppointmentSerializer
from .services import NotificationService
from .business_hours import BusinessHoursService
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
        """Crear cita y enviar notificación"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Guardar la cita
        appointment = serializer.save()
        
        # Enviar notificación
        try:
            notification_sent = NotificationService.send_confirmation(appointment)
            if notification_sent:
                logger.info(f"Notification sent for appointment {appointment.id}")
            else:
                logger.warning(f"Failed to send notification for appointment {appointment.id}")
        except Exception as e:
            logger.error(f"Error sending notification: {str(e)}")
        
        # Responder con los datos de la cita creada
        headers = self.get_success_headers(serializer.data)
        response_data = serializer.data.copy()
        response_data['notification_sent'] = notification_sent if 'notification_sent' in locals() else False
        
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
        """Validar si una fecha es válida para citas"""
        date_param = request.query_params.get('date')
        logger.info(f"Validating date: {date_param}")
        
        if not date_param:
            return Response({'error': 'Parámetro date requerido'}, status=400)
        
        try:
            parsed_date = parse_date(date_param)
            logger.info(f"Parsed date: {parsed_date}")
            
            if not parsed_date:
                return Response({'error': 'Formato de fecha inválido'}, status=400)
            
            is_valid = BusinessHoursService.is_working_day(parsed_date)
            logger.info(f"Is working day: {is_valid}, weekday: {parsed_date.weekday()}")
            
            next_working_day = BusinessHoursService.get_next_working_day(parsed_date)
            
            response_data = {
                'is_valid': is_valid,
                'date': date_param,
                'is_working_day': is_valid,
                'next_working_day': next_working_day.isoformat(),
                'message': 'Fecha válida para citas' if is_valid else 'Esta fecha no está disponible para citas'
            }
            logger.info(f"Response data: {response_data}")
            
            return Response(response_data)
        except Exception as e:
            logger.error(f"Error validating date: {str(e)}")
            return Response({'error': str(e)}, status=400)
