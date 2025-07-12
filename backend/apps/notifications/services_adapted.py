from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from django.contrib.auth import get_user_model
from twilio.rest import Client
from twilio.base.exceptions import TwilioException
import logging
from datetime import datetime, timedelta

from .models import Notification, EmailLog, WhatsAppLog, EmailTemplate, NotificationStatus

logger = logging.getLogger(__name__)
User = get_user_model()


class EmailService:
    """Servicio para envío de emails"""
    
    @staticmethod
    def send_email_notification(notification_id):
        """Enviar notificación por email"""
        try:
            notification = Notification.objects.get(id=notification_id)
            
            # Crear log de email
            email_log = EmailLog.objects.create(
                notification=notification,
                to_email=notification.user.email,
                from_email=settings.DEFAULT_FROM_EMAIL,
                subject=notification.title,
                template_name=notification.email_data.get('template_name', '') if notification.email_data else ''
            )
            
            # Preparar el contenido del email
            if notification.email_data and notification.email_data.get('template_name'):
                # Usar plantilla HTML
                template_name = notification.email_data['template_name']
                context = notification.email_data.get('context', {})
                context.update({
                    'user': notification.user,
                    'appointment': notification.appointment,
                    'notification': notification
                })
                
                html_content = render_to_string(f'notifications/emails/{template_name}.html', context)
                text_content = render_to_string(f'notifications/emails/{template_name}.txt', context)
                
                # Enviar email con plantilla
                msg = EmailMultiAlternatives(
                    subject=notification.title,
                    body=text_content,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[notification.user.email]
                )
                msg.attach_alternative(html_content, "text/html")
                msg.send()
            else:
                # Enviar email simple
                send_mail(
                    subject=notification.title,
                    message=notification.message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[notification.user.email],
                    fail_silently=False
                )
            
            # Actualizar estado de la notificación
            notification.status = NotificationStatus.SENT
            notification.sent_at = timezone.now()
            notification.save()
            
            # Actualizar log
            email_log.success = True
            email_log.save()
            
            logger.info(f"Email enviado exitosamente a {notification.user.email}")
            return True
            
        except Exception as e:
            logger.error(f"Error enviando email: {str(e)}")
            
            # Actualizar estado de error
            notification.status = NotificationStatus.FAILED
            notification.error_message = str(e)
            notification.retry_count += 1
            notification.save()
            
            # Actualizar log
            if 'email_log' in locals():
                email_log.success = False
                email_log.error_message = str(e)
                email_log.save()
            
            return False


class WhatsAppService:
    """Servicio para envío de mensajes de WhatsApp usando Twilio"""
    
    @staticmethod
    def send_whatsapp_notification(notification_id):
        """Enviar notificación por WhatsApp"""
        if not all([settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN, settings.TWILIO_WHATSAPP_FROM]):
            logger.warning("Configuración de Twilio incompleta")
            return False
            
        try:
            notification = Notification.objects.get(id=notification_id)
            
            # Obtener número de teléfono del usuario
            phone_number = notification.whatsapp_data.get('phone_number') if notification.whatsapp_data else None
            if not phone_number and hasattr(notification.user, 'phone'):
                phone_number = notification.user.phone
                
            if not phone_number:
                raise ValueError("Número de teléfono no disponible")
            
            # Crear log de WhatsApp
            whatsapp_log = WhatsAppLog.objects.create(
                notification=notification,
                to_phone=phone_number
            )
            
            # Inicializar cliente de Twilio
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            
            # Formatear número de teléfono para WhatsApp
            if not phone_number.startswith('whatsapp:'):
                phone_number = f"whatsapp:{phone_number}"
            
            # Enviar mensaje
            message = client.messages.create(
                body=notification.message,
                from_=settings.TWILIO_WHATSAPP_FROM,
                to=phone_number
            )
            
            # Actualizar estado de la notificación
            notification.status = NotificationStatus.SENT
            notification.sent_at = timezone.now()
            notification.save()
            
            # Actualizar log
            whatsapp_log.success = True
            whatsapp_log.message_sid = message.sid
            whatsapp_log.save()
            
            logger.info(f"WhatsApp enviado exitosamente a {phone_number}")
            return True
            
        except TwilioException as e:
            logger.error(f"Error de Twilio: {str(e)}")
            
            # Actualizar estado de error
            notification.status = NotificationStatus.FAILED
            notification.error_message = f"Twilio Error: {str(e)}"
            notification.retry_count += 1
            notification.save()
            
            # Actualizar log
            if 'whatsapp_log' in locals():
                whatsapp_log.success = False
                whatsapp_log.error_message = str(e)
                whatsapp_log.save()
            
            return False
            
        except Exception as e:
            logger.error(f"Error enviando WhatsApp: {str(e)}")
            
            # Actualizar estado de error
            notification.status = NotificationStatus.FAILED
            notification.error_message = str(e)
            notification.retry_count += 1
            notification.save()
            
            # Actualizar log
            if 'whatsapp_log' in locals():
                whatsapp_log.success = False
                whatsapp_log.error_message = str(e)
                whatsapp_log.save()
            
            return False


class NotificationService:
    """Servicio principal para manejar notificaciones"""
    
    @staticmethod
    def create_notification(user, title, message, notification_type, appointment=None, **kwargs):
        """Crear una nueva notificación"""
        notification = Notification.objects.create(
            user=user,
            appointment=appointment,
            title=title,
            message=message,
            notification_type=notification_type,
            email_data=kwargs.get('email_data'),
            whatsapp_data=kwargs.get('whatsapp_data')
        )
        
        logger.info(f"Notificación creada: {notification.id} - {notification.title}")
        return notification
    
    @staticmethod
    def send_notification(notification_id):
        """Enviar notificación según su tipo"""
        try:
            notification = Notification.objects.get(id=notification_id)
            
            if notification.notification_type == 'email':
                return EmailService.send_email_notification(notification_id)
            elif notification.notification_type == 'whatsapp':
                return WhatsAppService.send_whatsapp_notification(notification_id)
            elif notification.notification_type == 'internal':
                # Para mensajes internos, solo marcar como enviado
                notification.status = NotificationStatus.SENT
                notification.sent_at = timezone.now()
                notification.save()
                return True
            else:
                logger.warning(f"Tipo de notificación no soportado: {notification.notification_type}")
                return False
                
        except Notification.DoesNotExist:
            logger.error(f"Notificación no encontrada: {notification_id}")
            return False
    
    @staticmethod
    def retry_failed_notifications():
        """Reintentar notificaciones fallidas"""
        from django.db.models import F
        
        failed_notifications = Notification.objects.filter(
            status=NotificationStatus.FAILED,
            retry_count__lt=F('max_retries')
        )
        
        success_count = 0
        for notification in failed_notifications:
            if NotificationService.send_notification(notification.id):
                success_count += 1
        
        logger.info(f"Reintentadas {failed_notifications.count()} notificaciones, {success_count} exitosas")
        return success_count


class AppointmentNotificationService:
    """Servicio específico para notificaciones de citas (adaptado al modelo actual)"""
    
    @staticmethod
    def get_user_from_appointment(appointment):
        """Obtener o crear usuario desde los datos de la cita"""
        if appointment.email:
            # Intentar encontrar usuario existente por email
            try:
                user = User.objects.get(email=appointment.email)
                return user
            except User.DoesNotExist:
                # Crear usuario temporal si no existe
                user = User.objects.create(
                    email=appointment.email,
                    username=appointment.email,
                    first_name=appointment.name.split()[0] if appointment.name else 'Cliente',
                    last_name=' '.join(appointment.name.split()[1:]) if len(appointment.name.split()) > 1 else '',
                    is_active=False  # Usuario temporal
                )
                return user
        return None
    
    @staticmethod
    def get_appointment_datetime(appointment):
        """Combinar fecha y hora de la cita"""
        return datetime.combine(appointment.date, appointment.time)
    
    @staticmethod
    def send_appointment_confirmation(appointment):
        """Enviar confirmación de cita creada"""
        user = AppointmentNotificationService.get_user_from_appointment(appointment)
        if not user:
            logger.warning(f"No se pudo crear usuario para cita {appointment.id}")
            return
        
        appointment_datetime = AppointmentNotificationService.get_appointment_datetime(appointment)
        
        # Email de confirmación
        if appointment.email and appointment.confirmation_method == 'email':
            email_notification = NotificationService.create_notification(
                user=user,
                title=f"Confirmación de cita - {appointment.date.strftime('%d/%m/%Y')}",
                message=f"Tu cita ha sido confirmada para el {appointment.date.strftime('%d/%m/%Y')} a las {appointment.time.strftime('%H:%M')}.",
                notification_type='email',
                appointment=appointment,
                email_data={
                    'template_name': 'appointment_confirmation',
                    'context': {
                        'appointment': appointment,
                        'appointment_datetime': appointment_datetime,
                        'formatted_date': appointment.date.strftime('%d de %B de %Y'),
                        'formatted_time': appointment.time.strftime('%H:%M'),
                        'service_type': 'Prueba de vestido',  # Valor por defecto
                    }
                }
            )
            
            # Enviar email
            EmailService.send_email_notification(email_notification.id)
        
        # WhatsApp de confirmación
        if appointment.phone and appointment.confirmation_method == 'whatsapp':
            whatsapp_notification = NotificationService.create_notification(
                user=user,
                title="Confirmación de cita",
                message=f"¡Hola {appointment.name}! Tu cita ha sido confirmada para el {appointment.date.strftime('%d/%m/%Y')} a las {appointment.time.strftime('%H:%M')}. ¡Te esperamos! 👗✨",
                notification_type='whatsapp',
                appointment=appointment,
                whatsapp_data={
                    'phone_number': appointment.phone
                }
            )
            
            WhatsAppService.send_whatsapp_notification(whatsapp_notification.id)
    
    @staticmethod
    def send_appointment_reminder(appointment, hours_before=24):
        """Enviar recordatorio de cita"""
        user = AppointmentNotificationService.get_user_from_appointment(appointment)
        if not user:
            logger.warning(f"No se pudo crear usuario para cita {appointment.id}")
            return
        
        appointment_datetime = AppointmentNotificationService.get_appointment_datetime(appointment)
        reminder_time = appointment_datetime - timedelta(hours=hours_before)
        
        if timezone.now() >= reminder_time:
            # Email de recordatorio
            if appointment.email:
                email_notification = NotificationService.create_notification(
                    user=user,
                    title=f"Recordatorio: Cita {'mañana' if hours_before >= 24 else 'hoy'} - {appointment.date.strftime('%d/%m/%Y')}",
                    message=f"Te recordamos que tienes una cita {'mañana' if hours_before >= 24 else 'hoy'} a las {appointment.time.strftime('%H:%M')}.",
                    notification_type='email',
                    appointment=appointment,
                    email_data={
                        'template_name': 'appointment_reminder',
                        'context': {
                            'appointment': appointment,
                            'appointment_datetime': appointment_datetime,
                            'hours_before': hours_before,
                            'formatted_date': appointment.date.strftime('%d de %B de %Y'),
                            'formatted_time': appointment.time.strftime('%H:%M'),
                            'service_type': 'Prueba de vestido',  # Valor por defecto
                        }
                    }
                )
                
                EmailService.send_email_notification(email_notification.id)
            
            # WhatsApp de recordatorio
            if appointment.phone:
                whatsapp_notification = NotificationService.create_notification(
                    user=user,
                    title="Recordatorio de cita",
                    message=f"¡Hola {appointment.name}! Te recordamos que tienes una cita {'mañana' if hours_before >= 24 else 'hoy'} a las {appointment.time.strftime('%H:%M')}. ¡No olvides asistir! 💍",
                    notification_type='whatsapp',
                    appointment=appointment,
                    whatsapp_data={
                        'phone_number': appointment.phone
                    }
                )
                
                WhatsAppService.send_whatsapp_notification(whatsapp_notification.id)
