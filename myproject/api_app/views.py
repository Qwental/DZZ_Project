import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .yolo_model import predict

@csrf_exempt
def upload_image(request):
    if request.method == 'POST' and request.FILES.get('image'):
        # Убедимся, что папка media существует
        if not os.path.exists(settings.MEDIA_ROOT):
            os.makedirs(settings.MEDIA_ROOT)

        # Сохраняем загруженное изображение
        image = request.FILES['image']
        image_name = image.name
        image_path = os.path.join(settings.MEDIA_ROOT, image_name)

        with open(image_path, 'wb') as f:
            for chunk in image.chunks():
                f.write(chunk)

        # Проверяем, сохранился ли файл
        if not os.path.exists(image_path):
            return JsonResponse({"error": "File not saved correctly"}, status=500)

        # Запускаем YOLO и получаем обработанное изображение
        processed_image_path, detections = predict(image_path)

        # Относительный путь к обработанному изображению
        processed_image_url = os.path.join(settings.MEDIA_URL, 'processed_images', os.path.basename(processed_image_path))

        return JsonResponse({
            "processed_image_url": request.build_absolute_uri(processed_image_url),
            "detections": detections
        }, status=200)

    return JsonResponse({"error": "No image provided"}, status=400)
