from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminOrderViewSet,
    CartAddItemView,
    CartItemDetailView,
    CartView,
    CheckoutView,
    MyOrdersView,
)

router = DefaultRouter()
router.register("admin/orders", AdminOrderViewSet, basename="admin-order")

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/items/", CartAddItemView.as_view(), name="cart-add-item"),
    path("cart/items/<int:pk>/", CartItemDetailView.as_view(), name="cart-item-detail"),
    path("cart/checkout/", CheckoutView.as_view(), name="cart-checkout"),
    path("orders/", MyOrdersView.as_view(), name="my-orders"),
] + router.urls

