from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Puedes agregar campos personalizados aquí si lo necesitas
    # ejemplo: phone = models.CharField(max_length=20, blank=True, null=True)
    pass
