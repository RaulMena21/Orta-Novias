from rest_framework import viewsets
from .models import BrideTestimonial
from .serializers import BrideTestimonialSerializer

class BrideTestimonialViewSet(viewsets.ModelViewSet):
    queryset = BrideTestimonial.objects.all()
    serializer_class = BrideTestimonialSerializer
