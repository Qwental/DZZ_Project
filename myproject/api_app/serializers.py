from rest_framework import serializers
from .models import ProcessedImage


class ProcessedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessedImage
        fields = ['id', 'image', 'created_at']
        read_only_fields = ['id', 'created_at']
