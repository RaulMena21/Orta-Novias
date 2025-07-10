from rest_framework import serializers
from .models import BrideTestimonial, TestimonialImage
import os
from django.conf import settings

class TestimonialImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = TestimonialImage
        fields = ['id', 'image', 'order']
    
    def get_image(self, obj):
        """Devuelve la URL completa de la imagen o un placeholder si no existe"""
        if obj.image:
            # Verificar si el archivo existe físicamente
            image_path = os.path.join(settings.MEDIA_ROOT, str(obj.image))
            if os.path.exists(image_path):
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.image.url)
                return obj.image.url
        
        # Si no existe la imagen, devolver placeholder
        return "https://picsum.photos/400/400?random=1"

class BrideTestimonialSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    additional_images = TestimonialImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = BrideTestimonial
        fields = ['id', 'bride_name', 'testimonial', 'image', 'additional_images', 'wedding_date', 'created_at']
    
    def get_image(self, obj):
        """Devuelve la URL completa de la imagen principal o un placeholder si no existe"""
        if obj.image:
            # Verificar si el archivo existe físicamente
            image_path = os.path.join(settings.MEDIA_ROOT, str(obj.image))
            if os.path.exists(image_path):
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.image.url)
                return obj.image.url
        
        # Si no existe la imagen, devolver placeholder
        return "https://picsum.photos/400/400?random=1"
