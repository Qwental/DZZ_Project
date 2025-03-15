FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0
COPY . .
RUN python manage.py makemigrations && python manage.py migrate
# RUN python manage.py collectstatic --noinput
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "myproject.wsgi:application"]
EXPOSE 8000