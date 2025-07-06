from django.contrib import admin
from .models import BrideTestimonial

@admin.register(BrideTestimonial)
class BrideTestimonialAdmin(admin.ModelAdmin):
    list_display = ('bride_name', 'wedding_date', 'created_at')
    search_fields = ('bride_name',)
    # Si da problemas, se puede quitar 'created_at' de list_filter sin afectar el funcionamiento
    list_filter = ('wedding_date', 'created_at')
