from django.db import models

class Dress(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='dresses/')  # Imagen principal
    style = models.CharField(max_length=50)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class DressImage(models.Model):
    """Imágenes adicionales para cada vestido"""
    dress = models.ForeignKey(Dress, related_name='additional_images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='dresses/additional/')
    order = models.PositiveIntegerField(default=0)  # Para ordenar las imágenes
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.dress.name} - Imagen {self.order}"
