from django.contrib import admin
from .models import Dress, DressImage

class DressImageInline(admin.TabularInline):
    model = DressImage
    extra = 3  # Número de formularios vacíos para agregar imágenes adicionales
    fields = ('image', 'order')

@admin.register(Dress)
class DressAdmin(admin.ModelAdmin):
    list_display = ('name', 'style', 'available', 'created_at')
    search_fields = ('name', 'style')
    list_filter = ('available', 'style', 'created_at')
    inlines = [DressImageInline]

@admin.register(DressImage)
class DressImageAdmin(admin.ModelAdmin):
    list_display = ('dress', 'order', 'created_at')
    list_filter = ('dress', 'created_at')
