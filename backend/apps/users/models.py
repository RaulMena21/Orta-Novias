from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Campos adicionales para el usuario
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono")
    birth_date = models.DateField(blank=True, null=True, verbose_name="Fecha de nacimiento")
    wedding_date = models.DateField(blank=True, null=True, verbose_name="Fecha de boda")
    notes = models.TextField(blank=True, verbose_name="Notas")
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}" if self.first_name else self.username
    
    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
