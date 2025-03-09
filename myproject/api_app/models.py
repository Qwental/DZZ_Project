from django.db import models
from django.conf import settings


class ProcessedImage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='processed_images/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Processed image by {self.user.username} at {self.created_at}"
