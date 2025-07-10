from django.db import models

class BrideTestimonial(models.Model):
    bride_name = models.CharField(max_length=100)
    testimonial = models.TextField()
    image = models.ImageField(upload_to='testimonials/')  # Imagen principal
    wedding_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bride_name} - {self.wedding_date}"

class TestimonialImage(models.Model):
    """Imágenes adicionales para cada testimonio"""
    testimonial = models.ForeignKey(BrideTestimonial, related_name='additional_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='testimonials/additional/')
    order = models.PositiveIntegerField(default=0)  # Para ordenar las imágenes
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.testimonial.bride_name} - Imagen {self.order}"
