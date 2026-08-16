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
    # cart
    path("cart", CartView.as_view(), name="cart-no-slash"),
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/items", CartAddItemView.as_view(), name="cart-add-item-no-slash"),
    path("cart/items/", CartAddItemView.as_view(), name="cart-add-item"),
    path("cart/items/<int:pk>", CartItemDetailView.as_view(), name="cart-item-detail-no-slash"),
    path("cart/items/<int:pk>/", CartItemDetailView.as_view(), name="cart-item-detail"),
    path("cart/checkout", CheckoutView.as_view(), name="cart-checkout-no-slash"),
    path("cart/checkout/", CheckoutView.as_view(), name="cart-checkout"),
    path("orders", MyOrdersView.as_view(), name="my-orders-no-slash"),
    path("orders/", MyOrdersView.as_view(), name="my-orders"),
    # admin orders - both slash variants
    path("admin/orders", AdminOrderViewSet.as_view({"get": "list"}), name="admin-order-list-no-slash"),
    path(
        "admin/orders/<int:pk>",
        AdminOrderViewSet.as_view(
            {"get": "retrieve", "patch": "partial_update", "delete": "destroy"}
        ),
        name="admin-order-detail-no-slash",
    ),
] + router.urls

