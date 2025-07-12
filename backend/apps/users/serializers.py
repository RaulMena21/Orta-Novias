from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'phone', 'birth_date', 'wedding_date', 'notes',
            'is_staff', 'is_active', 'date_joined', 'last_login',
            'password', 'password_confirm'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': False},
        }

    def validate(self, attrs):
        if 'password_confirm' in attrs:
            if attrs['password'] != attrs['password_confirm']:
                raise serializers.ValidationError({"password_confirm": "Las contraseñas no coinciden"})
        return attrs

    def create(self, validated_data):
        # Remover password_confirm antes de crear
        validated_data.pop('password_confirm', None)
        
        # Usar email como username si no se proporciona username
        if not validated_data.get('username'):
            validated_data['username'] = validated_data['email']
        
        # Extraer password
        password = validated_data.pop('password')
        
        # Crear usuario
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        # Manejar actualización de contraseña por separado
        password = validated_data.pop('password', None)
        validated_data.pop('password_confirm', None)
        
        # Actualizar otros campos
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Actualizar contraseña si se proporciona
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance
