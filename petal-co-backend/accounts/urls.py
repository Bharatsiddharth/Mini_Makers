from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import AdminCustomerListView, LoginView, MeView, RegisterView

urlpatterns = [
    path("auth/register", RegisterView.as_view(), name="auth-register-no-slash"),
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login", LoginView.as_view(), name="auth-login-no-slash"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/refresh", TokenRefreshView.as_view(), name="auth-refresh-no-slash"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="auth-refresh"),
    path("auth/me", MeView.as_view(), name="auth-me-no-slash"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("admin/customers", AdminCustomerListView.as_view(), name="admin-customers-no-slash"),
    path("admin/customers/", AdminCustomerListView.as_view(), name="admin-customers"),
]
