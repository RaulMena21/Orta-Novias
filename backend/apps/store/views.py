from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Dress
from .serializers import DressSerializer

class DressViewSet(viewsets.ModelViewSet):
    queryset = Dress.objects.all()
    serializer_class = DressSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Permitir lectura sin autenticación
