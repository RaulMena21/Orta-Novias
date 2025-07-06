from rest_framework import serializers
from .models import BrideTestimonial

class BrideTestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrideTestimonial
        fields = '__all__'
