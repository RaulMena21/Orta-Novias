from django.db import models
from django.core.exceptions import ValidationError

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
        """Validación personalizada: debe tener al menos email o teléfono"""
        super().clean()
        if not self.email and not self.phone:
            raise ValidationError('Debe proporcionar al menos un email o un teléfono.')
        
        # Validar que el método de confirmación coincida con los datos disponibles
        if self.confirmation_method == 'email' and not self.email:
            raise ValidationError('Para confirmación por email, debe proporcionar un email.')
        if self.confirmation_method == 'whatsapp' and not self.phone:
            raise ValidationError('Para confirmación por WhatsApp, debe proporcionar un teléfono.')

    def __str__(self):
        return f"{self.name} - {self.date} {self.time}"
