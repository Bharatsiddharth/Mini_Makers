from django.db.models import Count, Sum
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from catalog.permissions import IsAdmin

from .models import User
from .serializers import (
    PetalTokenObtainPairSerializer,
    RegisterSerializer,
    UserSerializer,
)


class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — anyone can sign up as a normal (non-admin) user."""

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=201)


class LoginView(TokenObtainPairView):
    """
    POST /api/auth/login/ — accepts {email, password}, returns
    {access, refresh, user: {..., isAdmin}}. The frontend should
    route to /admin only if user.isAdmin is true; otherwise treat
    the person as a normal shopper regardless of what URL they typed.
    """

    serializer_class = PetalTokenObtainPairSerializer


class MeView(APIView):
    """GET /api/auth/me/ — current user's profile, used to re-check admin status on load."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class AdminCustomerListView(APIView):
    """
    GET /api/admin/customers/ — the admin dashboard's Customers table:
    every non-staff user with their order count and lifetime spend.
    """

    permission_classes = [IsAdmin]

    def get(self, request):
        customers = (
            User.objects.filter(is_staff=False)
            .annotate(order_count=Count("orders"), lifetime_spend=Sum("orders__total"))
            .order_by("-date_joined")
        )
        data = [
            {
                "id": c.id,
                "name": (f"{c.first_name} {c.last_name}".strip() or c.email),
                "email": c.email,
                "orders": c.order_count,
                "spent": float(c.lifetime_spend or 0),
                "joined": c.date_joined.date().isoformat(),
                "location": ", ".join(filter(None, [c.city, c.state])) or "—",
            }
            for c in customers
        ]
        return Response(data)
