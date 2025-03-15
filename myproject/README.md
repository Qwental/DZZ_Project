# Backend - Документация по установке и развертыванию

## Зависимости
1. Python >= 3.12
   [Сайт python (пособие по установке)](https://www.python.org/downloads/)
   Проверить установку можно через 
   ```bash
   python -V
   ```
2. [uv](https://docs.astral.sh/uv/getting-started/installation/)
3. [VSCode](https://code.visualstudio.com/) (для разработки)

## Запуск в режиме разработки
1. (этот шаг выполняется только один раз!) Рекомендуется создать виртуальное окружение ```uv venv``` и установить зависимости ```uv pip install -e .```
2. Запуск в режиме разработки осуществляется через ```uv run manage.py runserver```

## Построение (building) проекта в production-режиме
1. Подразумевается, что выполнен шаг 1 пункта выше
2. Запуск production-версии проекта: ```gunicorn myproject.wsgi:application```

## Для чего докер?
Докер сразу запускает и фронтенд часть, и бэкенд, ставит между контейнерами зависимость и сеть, благодаря чему данные находяться в безопасности.

## Запуск с помощью Docker и DockerCompose
1. Проверить, что установлен docker и docker-compose [установить докер при его отсутствии](https://docs.docker.com/get-started/get-docker/)
2. Перейти в корневую папку проекта, где есть compose.yaml. Там с помощью ```docker compose up --build``` запустить его.