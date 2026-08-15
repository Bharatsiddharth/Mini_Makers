from django.test import TestCase
from rest_framework.test import APIClient


class AuthRouteCompatibilityTests(TestCase):
    def test_register_route_without_trailing_slash_is_not_404(self):
        client = APIClient()
        response = client.post(
            "/api/auth/register",
            {
                "email": "newuser@example.com",
                "first_name": "New",
                "last_name": "User",
                "phone": "1234567890",
                "password": "StrongPass123!",
            },
            format="json",
        )
        self.assertNotEqual(response.status_code, 404)

    def test_login_route_without_trailing_slash_is_not_404(self):
        client = APIClient()
        response = client.post(
            "/api/auth/login",
            {"email": "newuser@example.com", "password": "StrongPass123!"},
            format="json",
        )
        self.assertNotEqual(response.status_code, 404)
