from django.contrib import admin
from .models import Dress

@admin.register(Dress)
class DressAdmin(admin.ModelAdmin):
    list_display = ('name', 'style', 'available', 'created_at')
    search_fields = ('name', 'style')
    # Si da problemas, se puede quitar 'created_at' de list_filter sin afectar el funcionamiento
    list_filter = ('available', 'style', 'created_at')
