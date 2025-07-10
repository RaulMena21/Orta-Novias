from django.contrib import admin
from .models import BrideTestimonial, TestimonialImage

class TestimonialImageInline(admin.TabularInline):
    model = TestimonialImage
    extra = 3  # Número de formularios vacíos para agregar imágenes adicionales
    fields = ('image', 'order')

@admin.register(BrideTestimonial)
class BrideTestimonialAdmin(admin.ModelAdmin):
    list_display = ('bride_name', 'wedding_date', 'created_at')
    search_fields = ('bride_name',)
    list_filter = ('wedding_date', 'created_at')
    inlines = [TestimonialImageInline]

@admin.register(TestimonialImage)
class TestimonialImageAdmin(admin.ModelAdmin):
    list_display = ('testimonial', 'order', 'created_at')
    list_filter = ('testimonial', 'created_at')
