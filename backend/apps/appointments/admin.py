from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'time', 'status', 'auto_confirmed', 'created_at')
    search_fields = ('name', 'email', 'phone')
    # Si da problemas, se puede quitar 'created_at' de list_filter sin afectar el funcionamiento
    list_filter = ('status', 'auto_confirmed', 'date', 'created_at')
