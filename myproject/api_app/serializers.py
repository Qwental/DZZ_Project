from rest_framework import serializers
from .models import ProcessedImage


class ProcessedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessedImage
        fields = ['id', 'image', 'created_at']
        read_only_fields = ['id', 'created_at']


class UploadImageSerializer(serializers.Serializer):
    images = serializers.ListField(allow_empty=False, max_length=1000, 
                                   child=serializers.ImageField(use_url=False, allow_empty_file=False))