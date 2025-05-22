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

# Выводим список классов, загруженных в модель
print("Модель содержит классы:", model.names)

# Словарь соответствия ID → Название класса
# Можно заменить на model.names, если уверены в соответствии
CLASS_NAMES = {
    1: "felling",
    2: "forest",
    3: "plow"
}

# Цвета для рисования боксов
CLASS_COLORS = {
    1: (255, 0, 0),       # felling
    2: (34, 139, 34),     # forest
    3: (19, 69, 139)      # plow
}


def predict(image_path, processed_dir):
    # Загружаем изображение
    image = cv2.imread(image_path)

    if image is None:
        print(f"Ошибка загрузки изображения: {image_path}")
        return None, []

    # Запускаем детекцию
    results = model(image)
    result = results[0]

    # Рисуем bounding boxes
    for box in result.boxes.data:
        x1, y1, x2, y2, confidence, class_id = box.tolist()
        class_id = int(class_id)

        class_name = CLASS_NAMES.get(class_id, "unknown")
        color = CLASS_COLORS.get(class_id, (255, 255, 255))

        # Рисуем прямоугольник и текст
        cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)
        label = f"{class_name} {confidence:.2f}"
        cv2.putText(image, label, (int(x1), int(y1) - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    # Сохраняем изображение с разметкой
    processed_image_name = os.path.basename(image_path)
    processed_image_path = os.path.join(processed_dir, f'{uuid.uuid4()}_{processed_image_name}')
    cv2.imwrite(processed_image_path, image)

    if not os.path.exists(processed_image_path):
        print(f"Ошибка: файл {processed_image_path} не был сохранён!")
    else:
        print(f"Файл сохранён: {processed_image_path}")

    # Сбор информации о детекциях
    detections = []
    for box in result.boxes.data:
        x1, y1, x2, y2, confidence, class_id = box.tolist()
        class_id = int(class_id)
        class_name = CLASS_NAMES.get(class_id, "unknown")
        detections.append({
            "x1": x1,
            "y1": y1,
            "x2": x2,
            "y2": y2,
            "confidence": confidence,
            "class_id": class_id,
            "class_name": class_name
        })

    # Возвращаем относительный путь для Django и список объектов
    relative_path = os.path.relpath(processed_image_path, settings.MEDIA_ROOT)
    return relative_path, detections
