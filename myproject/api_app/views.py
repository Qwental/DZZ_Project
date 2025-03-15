import os
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from .models import ProcessedImage
from .serializers import ProcessedImageSerializer, UploadImageSerializer
from drf_yasg.utils import swagger_auto_schema
from .yolo_model import predict
from drf_yasg import openapi


class UploadImageView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)


    @swagger_auto_schema(
        operation_description="""
        Загрузка изображений для обработки.

        Принимает список файлов изображений в формате `multipart/form-data`.
        Изображения загружаются, обрабатываются нейронной сетью,
        и обработанные изображения сохраняются в базе данных.

        **Тело запроса:**

        - `images`: Список файлов изображений для загрузки и обработки.
          Максимальное количество изображений - 1000.
          Каждый файл изображения должен быть валидным.
          Пустые файлы не допускаются.

        **Ответы:**

        *   201 Created:
            Успешная обработка изображений. Возвращает JSON объект с:
            - `message`: "Images processed"
            - `results`: Список сериализованных объектов,
              содержащих идентификаторы (ID), URL-адреса изображений (относительно MEDIA_URL)
              и временные метки создания обработанных изображений.

        *   400 Bad Request:
            Некорректный ввод. Возможные причины:
            - Файлы не были загружены.
            - Тело запроса не является валидным `multipart/form-data`.
            - Один или несколько файлов недействительны или пусты.

        **Аутентификация:**
        Требуется действительный JWT токен в заголовке `Authorization`.
        """,
        operation_summary="Upload images",
        parser_classes=[MultiPartParser],
        manual_parameters=[
            openapi.Parameter(
                name='images', in_=openapi.IN_FORM, type=openapi.TYPE_ARRAY,
                items=openapi.Items(type=openapi.TYPE_FILE),
                description="List of image files to upload.",
                required=True,
            ),
        ],
        consumes=['multipart/form-data'],
        responses={
            status.HTTP_201_CREATED: ProcessedImageSerializer(many=True),
            status.HTTP_400_BAD_REQUEST: 'Bad Request'
        }
    )
    def post(self, request: Request, *args, **kwargs):
        user = request.user
        uploaded_images = []

        serializer = UploadImageSerializer(data=request.data)
        

        if not serializer.is_valid():
            return Response({"error": "No files were uploaded."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Папка для медиа (для сохранения оригинальных изображений)
        media_dir = os.path.join(settings.MEDIA_ROOT, 'images')
        os.makedirs(media_dir, exist_ok=True)

        # Папка для обработанных изображений
        processed_dir = os.path.join(
            settings.MEDIA_ROOT, settings.PROCESSED_IMAGES_ROOT)
        os.makedirs(processed_dir, exist_ok=True)

        for image_file in serializer.validated_data['images']:
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
            'message': 'Images processed',
            'results': serialized_images.data  # Возвращаем сериализованные данные
        }, status=status.HTTP_201_CREATED)
