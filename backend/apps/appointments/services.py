"""
Servicios de notificación para citas
"""
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
import requests
from twilio.rest import Client
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    
    @staticmethod
    def send_email_confirmation(appointment):
        """Envía confirmación por email"""
        try:
            if not appointment.email:
                logger.warning(f"No email provided for appointment {appointment.id}")
                return False
                
            subject = f'Confirmación de cita - Orta Novias'
            
            # Mensaje en texto plano
            message = f"""
¡Hola {appointment.name}!

Tu cita ha sido registrada exitosamente:

📅 Fecha: {appointment.date.strftime('%d de %B de %Y')}
⏰ Hora: {appointment.time.strftime('%H:%M')}
📱 Teléfono: {appointment.phone}
📝 Comentarios: {appointment.comment or 'Ninguno'}

Te contactaremos pronto para confirmar tu cita.

¡Esperamos verte pronto!

Atentamente,
El equipo de Orta Novias
            """
            
            # Enviar email
            send_mail(
                subject=subject,
                message=message,
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@ortanovias.com'),
                recipient_list=[appointment.email],
                fail_silently=False,
            )
            
            logger.info(f"Email sent successfully to {appointment.email}")
            return True
            
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return False
    
    @staticmethod
    def send_whatsapp_confirmation(appointment):
        """Envía confirmación por WhatsApp usando Twilio"""
        try:
            if not appointment.phone:
                logger.warning(f"No phone provided for appointment {appointment.id}")
                return False
            
            # Configurar Twilio (necesitarás configurar estas variables en settings)
            account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', None)
            auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', None)
            from_whatsapp = getattr(settings, 'TWILIO_WHATSAPP_FROM', None)
            
            if not all([account_sid, auth_token, from_whatsapp]):
                logger.warning("Twilio credentials not configured")
                return False
            
            client = Client(account_sid, auth_token)
            
            # Formatear número de teléfono (agregar código de país si no lo tiene)
            phone = appointment.phone
            if not phone.startswith('+'):
                phone = f'+34{phone}' if phone.startswith('6') or phone.startswith('7') else f'+{phone}'
            
            message_body = f"""
¡Hola {appointment.name}! 👋

Tu cita en *Orta Novias* ha sido registrada:

📅 *Fecha:* {appointment.date.strftime('%d de %B de %Y')}
⏰ *Hora:* {appointment.time.strftime('%H:%M')}
📝 *Comentarios:* {appointment.comment or 'Ninguno'}

Te contactaremos pronto para confirmar tu cita.

¡Esperamos verte pronto! 💍✨
            """
            
            message = client.messages.create(
                from_=from_whatsapp,
                body=message_body,
                to=f'whatsapp:{phone}'
            )
            
            logger.info(f"WhatsApp sent successfully to {phone}, SID: {message.sid}")
            return True
            
        except Exception as e:
            logger.error(f"Error sending WhatsApp: {str(e)}")
            return False
    
    @staticmethod
    def send_confirmation(appointment):
        """Envía confirmación según el método preferido"""
        success = False
        
        if appointment.confirmation_method == 'email':
            success = NotificationService.send_email_confirmation(appointment)
        elif appointment.confirmation_method == 'whatsapp':
            success = NotificationService.send_whatsapp_confirmation(appointment)
        else:
            # Por defecto, intentar email si está disponible
            if appointment.email:
                success = NotificationService.send_email_confirmation(appointment)
            elif appointment.phone:
                success = NotificationService.send_whatsapp_confirmation(appointment)
        
        return success
