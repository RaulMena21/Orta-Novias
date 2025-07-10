from rest_framework import serializers
from .models import Dress, DressImage
import os
from django.conf import settings

class DressImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = DressImage
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
        return "https://picsum.photos/400/600?random=1"

class DressSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    additional_images = DressImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Dress
        fields = ['id', 'name', 'description', 'image', 'additional_images', 'style', 'available', 'created_at']
    
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
        return "https://picsum.photos/400/600?random=1"
