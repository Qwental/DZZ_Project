FROM python:3.12-slim
WORKDIR /app
RUN echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/no-check-valid-until && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN python manage.py makemigrations && python manage.py migrate
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "myproject.wsgi:application"]
EXPOSE 8000