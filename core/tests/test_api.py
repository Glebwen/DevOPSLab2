import pytest
from django.contrib.auth.models import User
from core.models import Client
from rest_framework.test import APIClient

@pytest.mark.django_db
class TestAPI:
    def test_clients_require_auth(self):
        client = APIClient()
        response = client.get('/api/clients/')
        assert response.status_code == 403 # Или 401

    def test_auth_can_view_clients(self):
        user = User.objects.create_user(username='test', password='test')
        Client.objects.create(name='Test Client', phone='123')
        
        client = APIClient()
        client.force_authenticate(user=user)
        response = client.get('/api/clients/')
        
        assert response.status_code == 200
        assert len(response.data) == 1