from ultralytics import YOLO
import os
import cv2
from PIL import Image

# Загружаем YOLO модель
model_path = os.path.join(os.path.dirname(__file__), '..', 'best.pt')
model = YOLO(model_path)

# Папка для обработанных изображений
processed_images_dir = os.path.join(os.path.dirname(__file__), '..', 'processed_images')
os.makedirs(processed_images_dir, exist_ok=True)  # Создаём папку, если её нет

def predict(image_path):
    """
    Запускает изображение через YOLOv8, сохраняет обработанное изображение и возвращает данные.
    """
    # Загружаем изображение
    image = Image.open(image_path)

    # Запускаем детекцию
    results = model(image)

    # Получаем первое изображение с детекциями
    result = results[0]
    processed_img = result.plot()  # Получаем изображение с выделенными объектами

    # Генерируем путь для сохранённого изображения
    processed_image_name = os.path.basename(image_path)
    processed_image_path = os.path.join(processed_images_dir, processed_image_name)

    # Сохраняем обработанное изображение
    cv2.imwrite(processed_image_path, processed_img)

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
            "confidence": confidence, "class_id": int(class_id)
        })

    return processed_image_path, detections
