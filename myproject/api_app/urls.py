from django.urls import path
from .views import UploadImageView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('upload/', UploadImageView.as_view(), name='upload_image'),
]
