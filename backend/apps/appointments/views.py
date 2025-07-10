from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer
from .services import NotificationService
import logging

logger = logging.getLogger(__name__)

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    
    def get_permissions(self):
        """
        Permitir crear citas sin autenticación,
        pero requerir autenticación para ver/editar
        """
        if self.action == 'create':
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
