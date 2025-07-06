from django.db import models

class BrideTestimonial(models.Model):
    bride_name = models.CharField(max_length=100)
    testimonial = models.TextField()
    image = models.ImageField(upload_to='testimonials/')
    wedding_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bride_name} - {self.wedding_date}"
