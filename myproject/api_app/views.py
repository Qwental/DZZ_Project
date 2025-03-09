import os
import shutil
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from .models import ProcessedImage
from .serializers import ProcessedImageSerializer
from .yolo_model import predict


class UploadImageView(APIView):
    permission_classes = [IsAuthenticated]
    # Обработчики для multipart/form-data
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request: Request, *args, **kwargs):
        user = request.user
        uploaded_images = []

        if not request.FILES:
            return Response({"error": "No files were uploaded."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Папка для медиа (для сохранения оригинальных изображений)
        media_dir = os.path.join(settings.MEDIA_ROOT, 'images')
        os.makedirs(media_dir, exist_ok=True)

        # Папка для обработанных изображений
        processed_dir = os.path.join(
            settings.MEDIA_ROOT, settings.PROCESSED_IMAGES_ROOT)
        os.makedirs(processed_dir, exist_ok=True)

        for image_field_name in request.FILES:
            image_file = request.FILES[image_field_name]

            image_path = os.path.join(media_dir, image_file.name)
            with open(image_path, 'wb') as f:
                for chunk in image_file.chunks():
                    f.write(chunk)

            # Запускаем нейросеть для обработки изображения
            relative_path, _ = predict(image_path, processed_dir)

            # Удаляем временное изображение из папки media
            if os.path.exists(image_path):
                os.remove(image_path)

            # Сохраняем обработанное изображение в базе данных
            uploaded_image = ProcessedImage.objects.create(
                user=user,
                image=relative_path,
            )
            uploaded_images.append(uploaded_image)

        # Сериализуем обработанные изображения
        serialized_images = ProcessedImageSerializer(
            uploaded_images, many=True, context={'request': request})

        return Response({
            "message": "Images processed",
            "results": serialized_images.data  # Возвращаем сериализованные данные
        }, status=201)
