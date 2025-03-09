import os
import shutil
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import CreateAPIView
from .models import ProcessedImage
from .serializers import UploadMultipleImagesSerializer, ProcessedImageSerializer
from .yolo_model import predict


class UploadImageView(CreateAPIView):
    serializer_class = UploadMultipleImagesSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)  # Обработчики для multipart/form-data

    def create(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        images = serializer.validated_data['images']
        uploaded_images = []

        # Папка для медиа (для сохранения оригинальных изображений)
        media_dir = os.path.join(settings.MEDIA_ROOT, 'images')
        os.makedirs(media_dir, exist_ok=True)

        # Папка для обработанных изображений
        processed_dir = settings.PROCESSED_IMAGES_ROOT
        os.makedirs(processed_dir, exist_ok=True)

        for image in images:
            # Сохраняем изображение в папку media/images
            image_path = os.path.join(media_dir, image.name)
            with open(image_path, 'wb') as f:
                for chunk in image.chunks():
                    f.write(chunk)

            # Запускаем нейросеть для обработки изображения
            processed_image_path, _ = predict(image_path)

            # Перемещаем результат в папку processed_images
            processed_image_name = os.path.basename(processed_image_path)
            processed_image_path_new = os.path.join(processed_dir, processed_image_name)
            shutil.move(processed_image_path, processed_image_path_new)

            # Удаляем временное изображение из папки media
            if os.path.exists(image_path):
                os.remove(image_path)

            # Сохраняем обработанное изображение в базе данных
            uploaded_image = ProcessedImage.objects.create(
                user=user,
                image=processed_image_path_new,  # Путь к результату в папке processed_images
            )
            uploaded_images.append(uploaded_image)

        # Сериализуем обработанные изображения
        serialized_images = ProcessedImageSerializer(uploaded_images, many=True)

        return Response({
            "message": "Images processed",
            "results": serialized_images.data  # Возвращаем сериализованные данные
        }, status=201)
