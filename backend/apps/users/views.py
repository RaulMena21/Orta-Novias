from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User
from .serializers import UserSerializer
from .simple_serializers import SimpleUserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_serializer_class(self):
        if self.action == 'create':
            return SimpleUserSerializer
        return UserSerializer
    
    def get_permissions(self):
        """
        Permisos personalizados por acción
        """
        if self.action == 'create':
            # Permitir registro sin autenticación
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        """
        Obtener datos del usuario autenticado
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
