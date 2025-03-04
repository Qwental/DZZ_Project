from django.urls import include, path

from django.conf import settings
from django.conf.urls.static import static

from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api_app.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.PROCESSED_IMAGES_URL, document_root=settings.PROCESSED_IMAGES_ROOT)