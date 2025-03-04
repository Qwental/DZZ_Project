from django.urls import path
from .views import RegisterView, UserDetailView, LogoutView

app_name = 'users'

urlpatterns = [
    path('detail/', UserDetailView.as_view()),
    path('auth/register/', RegisterView.as_view()),
    path('auth/logout/', LogoutView.as_view())
]
