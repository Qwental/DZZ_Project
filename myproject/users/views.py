from rest_framework import permissions, viewsets, generics, status
from .serializers import (
    UserSerializer, RegisterSerializer,
    ChangePasswordSerializer, LogoutSerializer, MyTokenObtainPairSerializer)
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from .permissions import IsSelf
from rest_framework.decorators import action


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy', 'change_password']:
            permission_classes = [permissions.IsAuthenticated, IsSelf]
        elif self.action == 'list':
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_object(self):
        if self.action in ['retrieve', 'update', 'partial_update', 'change_password']:
            return self.request.user
        return super().get_object()

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], serializer_class=ChangePasswordSerializer, url_path='change-password')
    def change_password(self, request):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if not user.check_password(serializer.validated_data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data.get("new_password"))
            user.save()
            return Response({'status': 'password changed'}, status=status.HTTP_204_NO_CONTENT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user != request.user and not request.user.is_staff:
            return Response({"detail": "You do not have permission to delete this user."}, status=status.HTTP_403_FORBIDDEN)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def create(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class RegisterView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LogoutSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            refresh_token = serializer.validated_data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
