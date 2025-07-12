"""
Tareas asíncronas para WhatsApp usando Celery
"""
from celery import shared_task
from django.utils import timezone
from datetime import datetime, timedelta
import logging

from backend.apps.appointments.models import Appointment
from .whatsapp_service import send_whatsapp_notification

logger = logging.getLogger(__name__)


@shared_task
def send_appointment_confirmation_task(appointment_id: int):
    """
    Enviar confirmación de cita automáticamente
    """
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        
        if not appointment.client_phone:
            logger.warning(f"Cita {appointment_id} sin teléfono")
            return False
        
        data = {
            'client_name': appointment.client_name,
            'date': appointment.date.strftime('%d/%m/%Y'),
            'time': appointment.time.strftime('%H:%M'),
            'consultant': getattr(appointment.consultant, 'name', 'Nuestro equipo'),
            'address': 'C/ Tu Dirección, Ciudad'  # Actualizar con dirección real
        }
        
        success = send_whatsapp_notification(
            appointment.client_phone,
            'confirmation',
            data
        )
        
        if success:
            appointment.confirmation_sent = True
            appointment.confirmation_sent_at = timezone.now()
            appointment.save()
            logger.info(f"Confirmación enviada para cita {appointment_id}")
        
        return success
        
    except Appointment.DoesNotExist:
        logger.error(f"Cita {appointment_id} no encontrada")
        return False
    except Exception as e:
        logger.error(f"Error enviando confirmación {appointment_id}: {e}")
        return False


@shared_task
def send_appointment_reminders():
    """
    Enviar recordatorios de citas (ejecutar cada hora)
    """
    try:
        # Citas para mañana (24h antes)
        tomorrow = timezone.now().date() + timedelta(days=1)
        
        appointments = Appointment.objects.filter(
            date=tomorrow,
            reminder_sent=False,
            status='confirmed'
        ).exclude(client_phone__isnull=True).exclude(client_phone='')
        
        sent_count = 0
        for appointment in appointments:
            try:
                data = {
                    'client_name': appointment.client_name,
                    'time': appointment.time.strftime('%H:%M'),
                    'address': 'C/ Tu Dirección, Ciudad'  # Actualizar
                }
                
                success = send_whatsapp_notification(
                    appointment.client_phone,
                    'reminder',
                    data
                )
                
                if success:
                    appointment.reminder_sent = True
                    appointment.reminder_sent_at = timezone.now()
                    appointment.save()
                    sent_count += 1
                    logger.info(f"Recordatorio enviado para cita {appointment.id}")
                
            except Exception as e:
                logger.error(f"Error enviando recordatorio {appointment.id}: {e}")
                continue
        
        logger.info(f"Recordatorios enviados: {sent_count}")
        return sent_count
        
    except Exception as e:
        logger.error(f"Error en tarea de recordatorios: {e}")
        return 0


@shared_task
def send_follow_ups():
    """
    Enviar seguimientos post-cita (ejecutar cada hora)
    """
    try:
        # Citas completadas hace 2 horas
        cutoff_time = timezone.now() - timedelta(hours=2)
        
        appointments = Appointment.objects.filter(
            datetime__lt=cutoff_time,
            status='completed',
            follow_up_sent=False
        ).exclude(client_phone__isnull=True).exclude(client_phone='')
        
        sent_count = 0
        for appointment in appointments:
            try:
                data = {
                    'client_name': appointment.client_name
                }
                
                success = send_whatsapp_notification(
                    appointment.client_phone,
                    'follow_up',
                    data
                )
                
                if success:
                    appointment.follow_up_sent = True
                    appointment.follow_up_sent_at = timezone.now()
                    appointment.save()
                    sent_count += 1
                    logger.info(f"Seguimiento enviado para cita {appointment.id}")
                
            except Exception as e:
                logger.error(f"Error enviando seguimiento {appointment.id}: {e}")
                continue
        
        logger.info(f"Seguimientos enviados: {sent_count}")
        return sent_count
        
    except Exception as e:
        logger.error(f"Error en tarea de seguimientos: {e}")
        return 0


@shared_task
def send_custom_whatsapp_message(phone: str, message: str):
    """
    Enviar mensaje personalizado
    """
    try:
        data = {'message': message}
        success = send_whatsapp_notification(phone, 'custom', data)
        
        if success:
            logger.info(f"Mensaje personalizado enviado a {phone}")
        
        return success
        
    except Exception as e:
        logger.error(f"Error enviando mensaje personalizado a {phone}: {e}")
        return False


@shared_task
def test_whatsapp_service():
    """
    Tarea para probar el servicio WhatsApp
    """
    try:
        from .whatsapp_service import WhatsAppService
        
        service = WhatsAppService()
        
        # Probar con tu número (actualizar)
        test_phone = "+34600000000"  # CAMBIAR POR TU NÚMERO
        test_message = "🧪 Test desde Orta Novias - Sistema funcionando correctamente ✅"
        
        result = service.send_message(test_phone, test_message)
        
        if result.get('success'):
            logger.info("Test WhatsApp exitoso")
            return True
        else:
            logger.error(f"Test WhatsApp falló: {result.get('error')}")
            return False
            
    except Exception as e:
        logger.error(f"Error en test WhatsApp: {e}")
        return False
