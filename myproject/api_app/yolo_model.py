import uuid
from ultralytics import YOLO
import os
import cv2
import numpy as np
from PIL import Image
from django.conf import settings

# Загружаем YOLO модель
model_path = os.path.join(os.path.dirname(__file__), '..', 'best.pt')
model = YOLO(model_path)

# Словарь соответствия ID → Название класса
CLASS_NAMES = {
    0: "felling",
    1: "forest",
    2: "plow"
}

# Определяем цвета для классов
CLASS_COLORS = {
    0: (255, 0, 0),
    1: (34, 139, 34),
    2: (19, 69, 139)
}


def predict(image_path, processed_dir):
    # Загружаем изображение
    image = cv2.imread(image_path)

    # Запускаем детекцию
    results = model(image)

    # Получаем первое изображение с детекциями
    result = results[0]

    # Извлекаем bounding box'ы и рисуем их вручную
    for box in result.boxes.data:
        x1, y1, x2, y2, confidence, class_id = box.tolist()
        class_id = int(class_id)

        # Получаем название класса (если не найден - "unknown")
        class_name = CLASS_NAMES.get(class_id, "unknown")

        # Выбираем цвет для класса (по умолчанию белый)
        color = CLASS_COLORS.get(class_id, (255, 255, 255))

        # Рисуем bounding box
        cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)

        # Добавляем подпись (Название класса + Уверенность)
        label = f"{class_name} {confidence:.2f}"
        cv2.putText(image, label, (int(x1), int(y1) - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    # Генерируем путь для сохранённого изображения
    processed_image_name = os.path.basename(image_path)
    processed_image_path = os.path.join(processed_dir, f'{uuid.uuid4()}_{processed_image_name}')

    # Сохраняем обработанное изображение
    cv2.imwrite(processed_image_path, image)

    # Проверяем, сохранился ли файл
    if not os.path.exists(processed_image_path):
        print(f"Ошибка: файл {processed_image_path} не был сохранён!")
    else:
        print(f"Файл сохранён: {processed_image_path}")

    # Извлекаем информацию о детекциях
    detections = []
    for box in result.boxes.data:
        x1, y1, x2, y2, confidence, class_id = box.tolist()
        detections.append({
            "x1": x1, "y1": y1, "x2": x2, "y2": y2,
            "confidence": confidence,
            "class_id": class_id,
            "class_name": class_name  # Теперь JSON содержит название класса
        })

    relative_path = os.path.relpath(processed_image_path, settings.MEDIA_ROOT)

    return relative_path, detections
