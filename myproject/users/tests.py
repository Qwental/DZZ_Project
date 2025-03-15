from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserViewSetApiTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='TestUser', password='Testpass')
        self.admin = User.objects.create_superuser(username='Admin', password='Adminpass')
        self.refresh = RefreshToken.for_user(self.user)
        self.admin_refresh = RefreshToken.for_user(self.admin)
        self.access_token = str(self.refresh.access_token)
        self.admin_access_token = str(self.admin_refresh.access_token)
    
    def test_list_users_admin(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.admin_access_token)
        response = self.client.get(reverse('users:users-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_list_users_non_admin(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        response = self.client.get(reverse('users:users-list'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_users_unauthenticated(self):
        response = self.client.get(reverse('users:users-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_user(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        response = self.client.get(reverse('users:users-detail',kwargs={'pk': self.user.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'TestUser')

    def test_retrieve_user_unauth(self):
        response = self.client.get(reverse('users:users-detail',kwargs={'pk': self.user.pk}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_update_user(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        data = {'first_name': 'NewName', 'last_name': 'NewLastName', 'email': 'test@test.ru'}
        response = self.client.patch(reverse('users:users-detail', kwargs={'pk': self.user.pk}), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'NewName')
        self.assertEqual(self.user.last_name, 'NewLastName')
        self.assertEqual(self.user.email, 'test@test.ru')

    def test_update_user_unauth(self):
        data = {'first_name': 'Updated', 'last_name': 'User'}
        response = self.client.patch(reverse('users:users-detail', kwargs={'pk': self.user.pk}), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_change_password(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        data = {'old_password': 'Testpass', 'new_password': 'newpass_1212_Bededeswe939testpass'}
        response = self.client.post(reverse('users:users-change-password'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpass_1212_Bededeswe939testpass'))

    def test_delete_user(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        response = self.client.delete(reverse('users:users-detail', kwargs={'pk': self.user.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(pk=self.user.pk).exists())

    def test_delete_user_unauth(self):
        response = self.client.delete(reverse('users:users-detail', kwargs={'pk': self.user.pk}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_user_admin(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.admin_access_token)
        response = self.client.delete(reverse('users:users-detail', kwargs={'pk': self.user.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(pk=self.user.pk).exists())

    
class RegisterViewTest(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('users:register')

    def test_register_user(self):
        data = {'username': 'newuser', 'password': '3e3jFdwsfDrj421djd2',
                'password2': '3e3jFdwsfDrj421djd2', 'email': 'newuser@example.com'}
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_register_user_invalid_data(self):
        data = {'username': '', 'password': '3e3jFdwsfDrj421djd2', 'password2': '3e3jFdwsfDrj421djd2', 'email': 'newuser@example.com'}
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(username='').exists())

    def test_register_user_missing_fields(self):
        data = {'username': 'newuser', 'password': '3e3jFdwsfDrj421djd2', 'password2': '3e3jFdwsfDrj421djd2'}
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(username='newuser').exists())

    def test_register_user_existing_username(self):
        User.objects.create_user(username='existinguser', password='existingpass')
        data = {'username': 'existinguser', 'password': '3e3jFdwsfDrj421djd2', 'password2': '3e3jFdwsfDrj421djd2', 'email': 'newuser@example.com'}
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
    

class LogoutViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='Testname', password='Testpass')
        self.refresh = RefreshToken.for_user(self.user)
        self.access_token = str(self.refresh.access_token)
        self.refresh_token = str(self.refresh)

    def test_logout(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        data = {'refresh_token': self.refresh_token}
        response = self.client.post(reverse('users:logout'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

    def test_logout_invalid_token(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        data = {'refresh_token': 'invalid_token'}
        response = self.client.post(reverse('users:logout'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout_unauth(self):
        data = {'refresh_token': self.refresh_token}
        response = self.client.post(reverse('users:logout'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_missing_token(self):
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        response = self.client.post(reverse('users:logout'), {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)