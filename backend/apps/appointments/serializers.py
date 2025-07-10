from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
    
    def validate(self, data):
        """Validación personalizada para el serializer"""
        # Validar que tenga al menos email o teléfono
        if not data.get('email') and not data.get('phone'):
            raise serializers.ValidationError(
                'Debe proporcionar al menos un email o un teléfono.'
            )
        
        # Validar que el método de confirmación coincida con los datos disponibles
        confirmation_method = data.get('confirmation_method')
        if confirmation_method == 'email' and not data.get('email'):
            raise serializers.ValidationError(
                'Para confirmación por email, debe proporcionar un email.'
            )
        if confirmation_method == 'whatsapp' and not data.get('phone'):
            raise serializers.ValidationError(
                'Para confirmación por WhatsApp, debe proporcionar un teléfono.'
            )
        
        return data
