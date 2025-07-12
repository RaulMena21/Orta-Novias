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

@app.task(bind=True, max_retries=2)
def send_notification(self, notification_data):
    """Enviar notificación push/email/SMS"""
    try:
        notification_type = notification_data.get('type', 'email')
        
        if notification_type == 'email':
            return send_appointment_email.delay(notification_data)
        elif notification_type == 'whatsapp':
            return send_appointment_whatsapp.delay(notification_data)
        elif notification_type == 'push':
            # Implementar notificaciones push aquí
            logger.info(f"Push notification enviada a {notification_data.get('user_id')}")
            return True
            
    except Exception as exc:
        logger.error(f"Error enviando notificación: {exc}")
        raise self.retry(exc=exc, countdown=120)

@app.task(bind=True)
def cleanup_old_appointments(self):
    """Limpiar citas antiguas y datos innecesarios"""
    try:
        from django.utils import timezone
        from datetime import timedelta
        from backend.apps.appointments.models import Appointment
        
        # Eliminar citas canceladas de más de 30 días
        cutoff_date = timezone.now() - timedelta(days=30)
        deleted_count = Appointment.objects.filter(
            status='cancelled',
            created_at__lt=cutoff_date
        ).delete()[0]
        
        logger.info(f"Limpieza completada: {deleted_count} citas eliminadas")
        return deleted_count
        
    except Exception as exc:
        logger.error(f"Error en limpieza de citas: {exc}")
        raise

@app.task(bind=True)
def send_daily_summary(self):
    """Enviar resumen diario de citas a administradores"""
    try:
        from django.utils import timezone
        from datetime import timedelta
        from backend.apps.appointments.models import Appointment
        from django.contrib.auth import get_user_model
        
        User = get_user_model()
        today = timezone.now().date()
        
        # Estadísticas del día
        appointments_today = Appointment.objects.filter(date=today)
        total_today = appointments_today.count()
        confirmed_today = appointments_today.filter(status='confirmed').count()
        pending_today = appointments_today.filter(status='pending').count()
        
        # Preparar email para administradores
        admin_users = User.objects.filter(is_staff=True)
        
        for admin in admin_users:
            email_data = {
                'name': admin.get_full_name() or admin.username,
                'email': admin.email,
                'subject': f'Resumen diario - {today.strftime("%d/%m/%Y")}',
                'total_appointments': total_today,
                'confirmed_appointments': confirmed_today,
                'pending_appointments': pending_today,
            }
            
            subject = f"Resumen diario Orta Novias - {today.strftime('%d/%m/%Y')}"
            message = f"""
            Hola {admin.get_full_name() or admin.username},
            
            📊 RESUMEN DEL DÍA {today.strftime('%d/%m/%Y')}:
            
            📅 Total de citas: {total_today}
            ✅ Confirmadas: {confirmed_today}
            ⏳ Pendientes: {pending_today}
            
            {f"❗ Tienes {pending_today} citas pendientes de confirmar" if pending_today > 0 else "✅ Todas las citas están gestionadas"}
            
            Dashboard: https://ortanovias.com/admin/
            
            Saludos,
            Sistema Orta Novias
            """
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[admin.email],
                fail_silently=False,
            )
        
        logger.info(f"Resumen diario enviado a {admin_users.count()} administradores")
        return True
        
    except Exception as exc:
        logger.error(f"Error enviando resumen diario: {exc}")
        raise

@app.task(bind=True, max_retries=1)
def send_appointment_reminder(self, appointment_id):
    """Enviar recordatorio de cita 24h antes"""
    try:
        from backend.apps.appointments.models import Appointment
        
        appointment = Appointment.objects.get(id=appointment_id)
        
        # Email recordatorio
        subject = "Recordatorio de cita - Orta Novias"
        message = f"""
        Hola {appointment.name},
        
        Te recordamos que tienes una cita mañana:
        
        📅 Fecha: {appointment.date.strftime('%d/%m/%Y')}
        🕐 Hora: {appointment.time.strftime('%H:%M')}
        📍 Ubicación: Orta Novias
        
        Si necesitas modificar o cancelar tu cita, contáctanos lo antes posible.
        
        ¡Te esperamos!
        
        Equipo Orta Novias
        📞 Teléfono: [TU_TELEFONO]
        📧 Email: [TU_EMAIL]
        """
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[appointment.email],
            fail_silently=False,
        )
        
        # WhatsApp recordatorio si hay teléfono
        if appointment.phone:
            whatsapp_data = {
                'name': appointment.name,
                'phone': appointment.phone,
                'date': appointment.date.strftime('%d/%m/%Y'),
                'time': appointment.time.strftime('%H:%M')
            }
            send_appointment_whatsapp.delay(whatsapp_data)
        
        logger.info(f"Recordatorio enviado para cita {appointment_id}")
        return True
        
    except Appointment.DoesNotExist:
        logger.warning(f"Cita {appointment_id} no encontrada para recordatorio")
        return False
    except Exception as exc:
        logger.error(f"Error enviando recordatorio: {exc}")
        raise self.retry(exc=exc, countdown=300)

@app.task(bind=True)
def generate_monthly_report(self):
    """Generar reporte mensual de estadísticas"""
    try:
        from django.utils import timezone
        from datetime import timedelta
        from backend.apps.appointments.models import Appointment
        from backend.apps.store.models import Dress
        from django.db.models import Count, Q
        import json
        
        # Fecha del mes pasado
        today = timezone.now().date()
        first_day_this_month = today.replace(day=1)
        last_day_last_month = first_day_this_month - timedelta(days=1)
        first_day_last_month = last_day_last_month.replace(day=1)
        
        # Estadísticas de citas
        appointments_last_month = Appointment.objects.filter(
            created_at__date__gte=first_day_last_month,
            created_at__date__lte=last_day_last_month
        )
        
        stats = {
            'month': last_day_last_month.strftime('%B %Y'),
            'total_appointments': appointments_last_month.count(),
            'confirmed_appointments': appointments_last_month.filter(status='confirmed').count(),
            'cancelled_appointments': appointments_last_month.filter(status='cancelled').count(),
            'most_popular_dress_types': list(
                Dress.objects.values('dress_type').annotate(
                    count=Count('id')
                ).order_by('-count')[:5]
            ),
            'appointments_by_day': [
                appointments_last_month.filter(
                    created_at__week_day=day
                ).count() for day in range(1, 8)
            ]
        }
        
        # Guardar reporte (aquí podrías guardarlo en base de datos o enviar por email)
        logger.info(f"Reporte mensual generado: {json.dumps(stats)}")
        return stats
        
    except Exception as exc:
        logger.error(f"Error generando reporte mensual: {exc}")
        raise
