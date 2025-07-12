from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from backend.apps.appointments.models import Appointment
from .models import ReminderSchedule
from .services_adapted import AppointmentNotificationService
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# Variable global para tracking
HAS_MODEL_UTILS = False


@receiver(post_save, sender=Appointment)
def appointment_created_handler(sender, instance, created, **kwargs):
    """Manejar creación de nueva cita"""
    if created:
        logger.info(f"Nueva cita creada: {instance.id}")
        
        # Enviar confirmación inmediata
        try:
            AppointmentNotificationService.send_appointment_confirmation(instance)
            logger.info(f"Confirmación enviada para cita: {instance.id}")
        except Exception as e:
            logger.error(f"Error enviando confirmación para cita {instance.id}: {str(e)}")
        
        # Programar recordatorios automáticos
        try:
            schedule_appointment_reminders(instance)
            logger.info(f"Recordatorios programados para cita: {instance.id}")
        except Exception as e:
            logger.error(f"Error programando recordatorios para cita {instance.id}: {str(e)}")


@receiver(post_save, sender=Appointment)
def appointment_updated_handler(sender, instance, created, **kwargs):
    """Manejar actualización de cita existente"""
    if not created:
        logger.info(f"Cita actualizada: {instance.id}")
        
        # Si cambió la fecha/hora, reprogramar recordatorios
        # Solo verificar cambios si tenemos model_utils disponible
        date_changed = False
        if HAS_MODEL_UTILS and hasattr(instance, 'tracker'):
            date_changed = instance.tracker.has_changed('appointment_date')
        else:
            # Sin tracker, asumir que la fecha cambió para ser conservadores
            date_changed = True
        
        if date_changed:
            logger.info(f"Fecha de cita cambió para: {instance.id}")
            
            # Eliminar recordatorios anteriores que no se hayan enviado
            ReminderSchedule.objects.filter(
                appointment=instance,
                is_sent=False
            ).delete()
            
            # Programar nuevos recordatorios
            try:
                schedule_appointment_reminders(instance)
                logger.info(f"Recordatorios reprogramados para cita: {instance.id}")
            except Exception as e:
                logger.error(f"Error reprogramando recordatorios para cita {instance.id}: {str(e)}")


@receiver(post_delete, sender=Appointment)
def appointment_deleted_handler(sender, instance, **kwargs):
    """Manejar eliminación de cita"""
    logger.info(f"Cita eliminada: {instance.id}")
    
    # Los recordatorios se eliminarán automáticamente por CASCADE
    # Aquí podríamos enviar notificación de cancelación si fuera necesario


def schedule_appointment_reminders(appointment):
    """Programar recordatorios para una cita"""
    # Lista de recordatorios a programar
    reminders_config = [
        {'hours_before': 24, 'type': 'email'},
        {'hours_before': 24, 'type': 'whatsapp'},
        {'hours_before': 2, 'type': 'email'},  # Recordatorio adicional 2h antes
    ]
    
    # Combinar fecha y hora de la cita
    appointment_datetime = datetime.combine(appointment.date, appointment.time)
    
    for reminder_config in reminders_config:
        hours_before = reminder_config['hours_before']
        reminder_type = reminder_config['type']
        
        # Calcular tiempo de envío
        scheduled_time = appointment_datetime - timedelta(hours=hours_before)
        
        # Solo programar si el tiempo de envío es en el futuro
        if scheduled_time > timezone.now():
            # Verificar si ya existe este recordatorio
            existing_reminder = ReminderSchedule.objects.filter(
                appointment=appointment,
                reminder_type=reminder_type,
                hours_before=hours_before
            ).first()
            
            if not existing_reminder:
                ReminderSchedule.objects.create(
                    appointment=appointment,
                    reminder_type=reminder_type,
                    hours_before=hours_before,
                    scheduled_time=scheduled_time
                )
                logger.info(f"Recordatorio programado: {reminder_type} {hours_before}h antes para cita {appointment.id}")
            else:
                # Actualizar tiempo si cambió
                if existing_reminder.scheduled_time != scheduled_time:
                    existing_reminder.scheduled_time = scheduled_time
                    existing_reminder.save()
                    logger.info(f"Recordatorio reprogramado: {reminder_type} {hours_before}h antes para cita {appointment.id}")


# Tracking de cambios en modelos
try:
    from model_utils import FieldTracker
    # Agregar tracker al modelo Appointment si no existe
    if not hasattr(Appointment, 'tracker'):
        Appointment.add_to_class('tracker', FieldTracker())
    HAS_MODEL_UTILS = True
except ImportError:
    logger.warning("model_utils no está instalado. El tracking de cambios en citas no estará disponible.")
    HAS_MODEL_UTILS = False
    
    # Crear una clase mock para evitar errores
    class MockTracker:
        def has_changed(self, field):
            return True  # Siempre retornar True si no hay tracker
    
    if not hasattr(Appointment, 'tracker'):
        Appointment.add_to_class('tracker', MockTracker())
