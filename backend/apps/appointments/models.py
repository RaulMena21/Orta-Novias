from django.db import models
from django.core.exceptions import ValidationError
from datetime import datetime, time as datetime_time

class Appointment(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    confirmation_method = models.CharField(max_length=10, choices=[('whatsapp', 'WhatsApp'), ('email', 'Email')])
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=[('pending', 'Pendiente'), ('confirmed', 'Confirmada'), ('cancelled', 'Cancelada')], default='pending')
    comment = models.TextField(blank=True, null=True)
    auto_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        """Validación personalizada: debe tener al menos email o teléfono y horarios de negocio"""
        super().clean()
        if not self.email and not self.phone:
            raise ValidationError('Debe proporcionar al menos un email o un teléfono.')
        
        # Validar que el método de confirmación coincida con los datos disponibles
        if self.confirmation_method == 'email' and not self.email:
            raise ValidationError('Para confirmación por email, debe proporcionar un email.')
        if self.confirmation_method == 'whatsapp' and not self.phone:
            raise ValidationError('Para confirmación por WhatsApp, debe proporcionar un teléfono.')
        
        # Validar horarios de negocio
        if self.date:
            # No permitir fines de semana (sábado=5, domingo=6)
            if self.date.weekday() >= 5:
                raise ValidationError('No se pueden programar citas los fines de semana. Por favor, selecciona un día entre lunes y viernes.')
            
            # No permitir fechas pasadas
            if self.date < datetime.now().date():
                raise ValidationError('No se pueden programar citas en fechas pasadas.')
        
        # Validar horarios de trabajo
        if self.time:
            # Horario matutino: 09:00 - 13:30
            # Horario vespertino: 17:00 - 20:30
            morning_start = datetime_time(9, 0)
            morning_end = datetime_time(13, 30)
            evening_start = datetime_time(17, 0)
            evening_end = datetime_time(20, 30)
            
            if not ((morning_start <= self.time <= morning_end) or (evening_start <= self.time <= evening_end)):
                raise ValidationError('La hora seleccionada está fuera del horario de atención. Horarios disponibles: 09:00-13:30 y 17:00-20:30.')

    def __str__(self):
        return f"{self.name} - {self.date} {self.time}"
