"""
Tareas de Celery para procesamiento asíncrono
"""
from celery import Celery
from django.conf import settings
from django.core.mail import send_mail
from twilio.rest import Client
import logging

logger = logging.getLogger(__name__)

app = Celery('ortanovias')
app.config_from_object('django.conf:settings', namespace='CELERY')

@app.task(bind=True, max_retries=3)
def send_appointment_email(self, appointment_data):
    """Enviar email de confirmación de cita"""
    try:
        subject = f"Confirmación de cita - Orta Novias"
        message = f"""
        Hola {appointment_data['name']},
        
        Tu cita ha sido registrada con éxito:
        
        📅 Fecha: {appointment_data['date']}
        🕐 Hora: {appointment_data['time']}
        📝 Comentarios: {appointment_data.get('comment', 'Sin comentarios')}
        
        Te contactaremos pronto para confirmar los detalles.
        
        ¡Esperamos verte pronto!
        
        Atentamente,
        Equipo Orta Novias
        """
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[appointment_data['email']],
            fail_silently=False,
        )
        
        logger.info(f"Email enviado exitosamente a {appointment_data['email']}")
        return True
        
    except Exception as exc:
        logger.error(f"Error enviando email: {exc}")
        raise self.retry(exc=exc, countdown=60 * (self.request.retries + 1))

@app.task(bind=True, max_retries=3)
def send_appointment_whatsapp(self, appointment_data):
    """Enviar WhatsApp de confirmación de cita"""
    try:
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        message_body = f"""
        🌟 *Orta Novias* 🌟
        
        Hola {appointment_data['name']},
        
        Tu cita ha sido registrada:
        📅 {appointment_data['date']} a las {appointment_data['time']}
        
        Te contactaremos pronto para confirmar.
        
        ¡Gracias por elegirnos! 💐
        """
        
        message = client.messages.create(
            body=message_body,
            from_=settings.TWILIO_WHATSAPP_FROM,
            to=f"whatsapp:{appointment_data['phone']}"
        )
        
        logger.info(f"WhatsApp enviado exitosamente a {appointment_data['phone']}")
        return message.sid
        
    except Exception as exc:
        logger.error(f"Error enviando WhatsApp: {exc}")
        raise self.retry(exc=exc, countdown=60 * (self.request.retries + 1))
