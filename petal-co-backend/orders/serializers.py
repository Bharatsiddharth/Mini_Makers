from rest_framework import serializers

from accounts.serializers import UserSerializer
from catalog.serializers import ProductSerializer

from .models import Cart, CartItem, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    productId = serializers.PrimaryKeyRelatedField(
        source="product", queryset=CartItem._meta.get_field("product").related_model.objects.all(),
        write_only=True,
    )
    lineTotal = serializers.DecimalField(source="line_total", max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "product", "productId", "quantity", "lineTotal"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "items", "subtotal", "count"]


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "quantity", "price_at_purchase"]


class OrderSerializer(serializers.ModelSerializer):
    """Used for a user's own order history."""

    items = OrderItemSerializer(many=True, read_only=True)
    id = serializers.CharField(source="order_number", read_only=True)

    class Meta:
        model = Order
        fields = ["id", "status", "total", "items", "created_at"]


class AdminOrderSerializer(serializers.ModelSerializer):
    """Used by the admin Orders table — includes the customer, matching the frontend's Order type."""

    id = serializers.CharField(source="order_number", read_only=True)
    customer = serializers.SerializerMethodField()
    email = serializers.EmailField(source="user.email", read_only=True)
    items = serializers.IntegerField(source="items_count", read_only=True)
    date = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ["id", "customer", "email", "date", "items", "total", "status", "referral_source"]

    def get_customer(self, obj):
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name or obj.user.email

    def get_date(self, obj):
        return obj.created_at.date().isoformat()
