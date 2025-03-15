from rest_framework import routers
from django.urls import path, include
from .views import RegisterView, UserViewSet, LogoutView

app_name = 'users'


router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='users')


urlpatterns = [
    path('auth/register/', RegisterView.as_view()),
    path('auth/logout/', LogoutView.as_view(), name='logout '),
    path('', include(router.urls))
]
