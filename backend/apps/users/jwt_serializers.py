from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework import serializers
from backend.apps.users.models import User

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'login'  # Cambiamos el nombre del campo
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Reemplazamos el campo username por login
        self.fields['login'] = serializers.CharField()
        self.fields.pop('username', None)
    
    def validate(self, attrs):
        login = attrs.get('login')
        password = attrs.get('password')
        
        if login and password:
            # Intentar autenticar con email
            user = None
            if '@' in login:
                # Si contiene @, asumir que es email
                try:
                    user_obj = User.objects.get(email=login)
                    user = authenticate(username=user_obj.username, password=password)
                except User.DoesNotExist:
                    pass
            else:
                # Si no contiene @, asumir que es username
                user = authenticate(username=login, password=password)
            
            if user:
                if not user.is_active:
                    raise serializers.ValidationError('Usuario desactivado.')
                
                refresh = self.get_token(user)
                data = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
                
                update_last_login(None, user)
                return data
            else:
                raise serializers.ValidationError('Credenciales inválidas.')
        else:
            raise serializers.ValidationError('Debe proporcionar email/username y contraseña.')
