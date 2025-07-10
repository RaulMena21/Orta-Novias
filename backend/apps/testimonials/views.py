from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import BrideTestimonial
from .serializers import BrideTestimonialSerializer

class BrideTestimonialViewSet(viewsets.ModelViewSet):
    queryset = BrideTestimonial.objects.all()
    serializer_class = BrideTestimonialSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Permitir lectura sin autenticación
