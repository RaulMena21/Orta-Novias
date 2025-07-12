from django.core.management.base import BaseCommand
from backend.apps.notifications.models import EmailTemplate


class Command(BaseCommand):
    help = 'Crea plantillas de email por defecto'

    def handle(self, *args, **options):
        # Plantilla de confirmación de cita
        confirmation_template, created = EmailTemplate.objects.get_or_create(
            name='appointment_confirmation',
            defaults={
                'subject': 'Confirmación de Cita - Orta Novias',
                'html_content': '''
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #e91e63;">¡Cita Confirmada!</h2>
                    <p>Hola {{ user.first_name }},</p>
                    <p>Tu cita ha sido confirmada exitosamente.</p>
                    <div style="background: #f5f5f5; padding: 15px; margin: 20px 0;">
                        <strong>Detalles:</strong><br>
                        Fecha: {{ formatted_date }}<br>
                        Hora: {{ formatted_time }}<br>
                        Servicio: {{ appointment.service_type }}
                    </div>
                    <p>¡Te esperamos!</p>
                </div>
                ''',
                'text_content': '''
                ¡Cita Confirmada!
                
                Hola {{ user.first_name }},
                Tu cita ha sido confirmada exitosamente.
                
                Detalles:
                Fecha: {{ formatted_date }}
                Hora: {{ formatted_time }}
                Servicio: {{ appointment.service_type }}
                
                ¡Te esperamos!
                '''
            }
        )
        
        if created:
            self.stdout.write(
                self.style.SUCCESS('Plantilla de confirmación creada')
            )
        
        # Plantilla de recordatorio
        reminder_template, created = EmailTemplate.objects.get_or_create(
            name='appointment_reminder',
            defaults={
                'subject': 'Recordatorio: Tu cita es mañana - Orta Novias',
                'html_content': '''
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ff9800;">🔔 Recordatorio de Cita</h2>
                    <p>Hola {{ user.first_name }},</p>
                    <p>Te recordamos que tienes una cita {% if hours_before == 24 %}mañana{% else %}en {{ hours_before }} horas{% endif %}.</p>
                    <div style="background: #fff3e0; padding: 15px; margin: 20px 0; border-left: 4px solid #ff9800;">
                        <strong>Detalles:</strong><br>
                        Fecha: {{ formatted_date }}<br>
                        Hora: {{ formatted_time }}<br>
                        Servicio: {{ appointment.service_type }}
                    </div>
                    <p>¡No olvides asistir!</p>
                </div>
                ''',
                'text_content': '''
                🔔 Recordatorio de Cita
                
                Hola {{ user.first_name }},
                Te recordamos que tienes una cita {% if hours_before == 24 %}mañana{% else %}en {{ hours_before }} horas{% endif %}.
                
                Detalles:
                Fecha: {{ formatted_date }}
                Hora: {{ formatted_time }}
                Servicio: {{ appointment.service_type }}
                
                ¡No olvides asistir!
                '''
            }
        )
        
        if created:
            self.stdout.write(
                self.style.SUCCESS('Plantilla de recordatorio creada')
            )
        
        self.stdout.write(
            self.style.SUCCESS('Plantillas de email configuradas exitosamente')
        )
