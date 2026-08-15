from django.db import transaction
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Product
from catalog.permissions import IsAdmin

from .models import Cart, CartItem, Order, OrderItem
from .serializers import AdminOrderSerializer, CartSerializer, OrderSerializer


def _get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart


class CartView(APIView):
    """GET /api/cart/ — the logged-in user's cart."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart = _get_or_create_cart(request.user)
        return Response(CartSerializer(cart).data)


class CartAddItemView(APIView):
    """POST /api/cart/items/ — body: {productId, quantity}. Adds or increments a line."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart = _get_or_create_cart(request.user)
        product_id = request.data.get("productId")
        quantity = int(request.data.get("quantity", 1))
        product = Product.objects.filter(id=product_id).first()
        if not product:
            return Response({"detail": "Product not found."}, status=404)

        item, created = CartItem.objects.get_or_create(cart=cart, product=product, defaults={"quantity": quantity})
        if not created:
            item.quantity += quantity
            item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)


class CartItemDetailView(APIView):
    """PATCH /api/cart/items/{id}/ — body: {quantity}. DELETE removes the line."""

    permission_classes = [permissions.IsAuthenticated]

    def _get_item(self, request, pk):
        return CartItem.objects.filter(pk=pk, cart__user=request.user).first()

    def patch(self, request, pk):
        item = self._get_item(request, pk)
        if not item:
            return Response({"detail": "Not found."}, status=404)
        quantity = int(request.data.get("quantity", item.quantity))
        if quantity <= 0:
            item.delete()
        else:
            item.quantity = quantity
            item.save()
        return Response(CartSerializer(item.cart if quantity > 0 else _get_or_create_cart(request.user)).data)

    def delete(self, request, pk):
        item = self._get_item(request, pk)
        if not item:
            return Response({"detail": "Not found."}, status=404)
        cart = item.cart
        item.delete()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class CheckoutView(APIView):
    """
    POST /api/cart/checkout/ — turns the current cart into an Order,
    snapshotting product name/price and decrementing stock, then empties the cart.
    Body may include {referralSource}.
    """

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        cart = _get_or_create_cart(request.user)
        items = list(cart.items.select_related("product"))
        if not items:
            return Response({"detail": "Cart is empty."}, status=400)

        for item in items:
            if item.quantity > item.product.stock:
                return Response(
                    {"detail": f"Not enough stock for {item.product.name}."}, status=400
                )

        total = sum((item.line_total for item in items), start=0)
        order = Order.objects.create(
            user=request.user,
            total=total,
            referral_source=request.data.get("referralSource", "Direct"),
        )
        for item in items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                quantity=item.quantity,
                price_at_purchase=item.product.price,
            )
            item.product.stock -= item.quantity
            item.product.save()

        cart.items.all().delete()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class MyOrdersView(generics.ListAPIView):
    """GET /api/orders/ — the logged-in user's own order history."""

    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items")


class AdminOrderViewSet(viewsets.ModelViewSet):
    """
    /api/admin/orders/ — full order list for the dashboard, with status
    filtering/search handled client-side (list is small); PATCH updates status.
    """

    queryset = Order.objects.select_related("user").prefetch_related("items").all()
    serializer_class = AdminOrderSerializer
    permission_classes = [IsAdmin]
    http_method_names = ["get", "patch", "head", "options"]
