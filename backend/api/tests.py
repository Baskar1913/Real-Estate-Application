from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import Category


class AuthenticationTests(APITestCase):
    def test_registration_creates_normal_user(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "name": "Test User",
                "email": "test@example.com",
                "password": "StrongTestPass@123",
                "confirm_password": "StrongTestPass@123",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["user"]["role"], "user")
        self.assertFalse(User.objects.get(email="test@example.com").is_staff)

    def test_me_requires_token(self):
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 401)

    def test_admin_login_rejects_non_organization_email(self):
        User.objects.create_user(
            "outside@example.com",
            "outside@example.com",
            "StrongPass@123",
            is_staff=True,
        )
        response = self.client.post(
            "/api/auth/login/",
            {"email": "outside@example.com", "password": "StrongPass@123", "role": "admin"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_staff_account_must_use_admin_login(self):
        User.objects.create_user(
            "admin@ssintern.in",
            "admin@ssintern.in",
            "StrongPass@123",
            is_staff=True,
        )
        response = self.client.post(
            "/api/auth/login/",
            {"email": "admin@ssintern.in", "password": "StrongPass@123", "role": "user"},
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_public_registration_cannot_create_admin(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "name": "Organization Admin",
                "email": "admin@ssintern.in",
                "password": "StrongPass@123",
                "confirm_password": "StrongPass@123",
                "role": "admin",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertFalse(User.objects.filter(email="admin@ssintern.in").exists())

    def test_user_can_reset_password_directly(self):
        user = User.objects.create_user("member@example.com", "member@example.com", "OldPass@123")
        response = self.client.post(
            "/api/auth/forgot-password/",
            {
                "email": "member@example.com",
                "role": "user",
                "step": "reset",
                "password": "NewStrongPass@123",
                "confirm_password": "NewStrongPass@123",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.check_password("NewStrongPass@123"))

    def test_admin_reset_requires_admin_role_and_domain(self):
        User.objects.create_user(
            "admin@ssintern.in",
            "admin@ssintern.in",
            "OldPass@123",
            is_staff=True,
        )
        response = self.client.post(
            "/api/auth/forgot-password/",
            {
                "email": "admin@ssintern.in",
                "role": "user",
                "step": "reset",
                "password": "NewStrongPass@123",
                "confirm_password": "NewStrongPass@123",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_password_verify_step_does_not_change_password(self):
        user = User.objects.create_user("verify@example.com", "verify@example.com", "OldPass@123")
        response = self.client.post(
            "/api/auth/forgot-password/",
            {"email": "verify@example.com", "role": "user", "step": "verify"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.check_password("OldPass@123"))


class PermissionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user("user@example.com", "user@example.com", "StrongPass@123")
        self.admin = User.objects.create_user("admin@example.com", "admin@example.com", "StrongPass@123", is_staff=True)

    def authenticate(self, user):
        token, _ = Token.objects.get_or_create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

    def test_user_cannot_create_category(self):
        self.authenticate(self.user)
        response = self.client.post("/api/categories/", {"name": "Villa", "app_id": 1}, format="json")
        self.assertEqual(response.status_code, 403)

    def test_admin_can_create_category(self):
        self.authenticate(self.admin)
        response = self.client.post("/api/categories/", {"name": "Villa", "app_id": 1}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Category.objects.filter(name="Villa").exists())

    def test_public_can_read_categories(self):
        Category.objects.create(name="Plot", app_id=1)
        self.client.credentials()
        self.assertEqual(self.client.get("/api/categories/").status_code, 200)
