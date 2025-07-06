from rest_framework import viewsets
from .models import Dress
from .serializers import DressSerializer

class DressViewSet(viewsets.ModelViewSet):
    queryset = Dress.objects.all()
    serializer_class = DressSerializer
