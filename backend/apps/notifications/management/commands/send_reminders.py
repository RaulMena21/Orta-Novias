from django.core.management.base import BaseCommand
from django.utils import timezone
from backend.apps.notifications.models import ReminderSchedule, NotificationStatus
from backend.apps.notifications.services_adapted import AppointmentNotificationService
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Envía recordatorios de citas programados'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Mostrar qué recordatorios se enviarían sin enviarlos realmente',
        )
        parser.add_argument(
            '--hours-ahead',
            type=int,
            default=1,
            help='Procesar recordatorios programados en las próximas X horas (default: 1)',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        hours_ahead = options['hours_ahead']
        
        self.stdout.write(
            self.style.SUCCESS(f'Procesando recordatorios programados...')
        )
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING('MODO DRY-RUN: No se enviarán recordatorios realmente')
            )
        
        # Obtener recordatorios que deben enviarse
        now = timezone.now()
        cutoff_time = now + timezone.timedelta(hours=hours_ahead)
        
        pending_reminders = ReminderSchedule.objects.filter(
            is_sent=False,
            scheduled_time__lte=cutoff_time,
            scheduled_time__gte=now - timezone.timedelta(minutes=30)  # Ventana de 30 min hacia atrás
        ).select_related('appointment', 'appointment__user').order_by('scheduled_time')
        
        if not pending_reminders.exists():
            self.stdout.write(
                self.style.SUCCESS('No hay recordatorios pendientes para enviar.')
            )
            return
        
        self.stdout.write(
            f'Encontrados {pending_reminders.count()} recordatorios para procesar:'
        )
        
        successful_count = 0
        failed_count = 0
        
        for reminder in pending_reminders:
            appointment = reminder.appointment
            user = appointment.user
            
            self.stdout.write(
                f'  - {reminder.reminder_type} para {user.email} '
                f'({reminder.hours_before}h antes de {appointment.appointment_date})'
            )
            
            if dry_run:
                self.stdout.write(
                    self.style.WARNING('    [DRY-RUN] Recordatorio no enviado')
                )
                continue
            
            try:
                # Enviar recordatorio
                AppointmentNotificationService.send_appointment_reminder(
                    appointment, 
                    reminder.hours_before
                )
                
                # Marcar como enviado
                reminder.is_sent = True
                reminder.sent_at = timezone.now()
                reminder.save()
                
                successful_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'    ✓ Recordatorio enviado exitosamente')
                )
                logger.info(f'Recordatorio enviado: {reminder.id} para cita {appointment.id}')
                
            except Exception as e:
                failed_count += 1
                error_msg = str(e)
                self.stdout.write(
                    self.style.ERROR(f'    ✗ Error al enviar recordatorio: {error_msg}')
                )
                logger.error(f'Error enviando recordatorio {reminder.id}: {error_msg}')
        
        # Resumen final
        if not dry_run:
            self.stdout.write('\n' + '='*50)
            self.stdout.write(
                self.style.SUCCESS(
                    f'Recordatorios procesados: {pending_reminders.count()}'
                )
            )
            self.stdout.write(
                self.style.SUCCESS(f'Enviados exitosamente: {successful_count}')
            )
            if failed_count > 0:
                self.stdout.write(
                    self.style.ERROR(f'Fallidos: {failed_count}')
                )
            
            # Limpiar recordatorios antiguos (más de 7 días)
            old_reminders = ReminderSchedule.objects.filter(
                scheduled_time__lt=now - timezone.timedelta(days=7)
            )
            deleted_count = old_reminders.count()
            if deleted_count > 0:
                old_reminders.delete()
                self.stdout.write(
                    self.style.SUCCESS(f'Limpiados {deleted_count} recordatorios antiguos')
                )
        
        self.stdout.write(
            self.style.SUCCESS('Comando completado.')
        )
