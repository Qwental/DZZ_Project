from rest_framework import serializers
from .models import ProcessedImage

class ProcessedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessedImage
        fields = ['id', 'image', 'created_at']
        read_only_fields = ['id', 'created_at']


class UploadMultipleImagesSerializer(serializers.Serializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        allow_empty=False
    )

    def create(self, validated_data):
        user = self.context["request"].user
        images = validated_data.get("images")
        processed_images = []

        for image in images:
            processed_image = ProcessedImage.objects.create(image=image, user=user)
            processed_images.append(processed_image)

        return processed_images
