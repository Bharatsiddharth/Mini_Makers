from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from catalog.models import Product
from orders.models import Cart, CartItem, Order

User = get_user_model()


class OrderFlowTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="customer@example.com",
            email="customer@example.com",
            password="StrongPass123!",
            first_name="Aarav",
            last_name="Patel",
            phone="9876543210",
            city="Mumbai",
            state="Maharashtra",
        )
        self.product = Product.objects.create(
            name="Bloom Basket",
            slug="bloom-basket",
            price=Decimal("1299.00"),
            category="Hampers",
            stock=5,
            description="Test product",
        )
        self.cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(cart=self.cart, product=self.product, quantity=2)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_checkout_creates_order_with_shipping_details(self):
        payload = {
            "shipping_name": "Aarav Patel",
            "email": "customer@example.com",
            "phone": "9876543210",
            "shipping_address": "12 Garden Lane, Bandra",
            "city": "Mumbai",
            "state": "Maharashtra",
            "postal_code": "400051",
            "payment_method": "Cash on Delivery",
            "notes": "Leave at the security desk",
        }

        response = self.client.post("/api/cart/checkout/", payload, format="json")

        self.assertEqual(response.status_code, 201)
        order = Order.objects.get(user=self.user)
        self.assertEqual(order.shipping_name, "Aarav Patel")
        self.assertEqual(order.shipping_address, "12 Garden Lane, Bandra")
        self.assertEqual(order.payment_method, "Cash on Delivery")
        self.assertEqual(order.total, Decimal("2598.00"))
        self.assertEqual(order.items.count(), 1)

    def test_next_order_number_uses_highest_existing_number_regardless_of_id_order(self):
        Order.objects.create(
            user=self.user,
            total=Decimal("100.00"),
            shipping_name="First",
            email="first@example.com",
            phone="1111111111",
            shipping_address="A",
            city="Mumbai",
            state="Maharashtra",
            order_number="PC-5000",
        )
        Order.objects.create(
            user=self.user,
            total=Decimal("200.00"),
            shipping_name="Second",
            email="second@example.com",
            phone="2222222222",
            shipping_address="B",
            city="Mumbai",
            state="Maharashtra",
            order_number="PC-1000",
        )

        next_order = Order.objects.create(
            user=self.user,
            total=Decimal("300.00"),
            shipping_name="Third",
            email="third@example.com",
            phone="3333333333",
            shipping_address="C",
            city="Mumbai",
            state="Maharashtra",
        )

        self.assertEqual(next_order.order_number, "PC-5001")

    def test_customer_can_fetch_order_history_and_detail(self):
        order = Order.objects.create(
            user=self.user,
            total=Decimal("2598.00"),
            shipping_name="Aarav Patel",
            email="customer@example.com",
            phone="9876543210",
            shipping_address="12 Garden Lane, Bandra",
            city="Mumbai",
            state="Maharashtra",
            postal_code="400051",
            payment_method="Cash on Delivery",
        )

        list_response = self.client.get("/api/orders/")
        detail_response = self.client.get(f"/api/orders/{order.order_number}/")

        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(detail_response.status_code, 200)
        self.assertEqual(detail_response.data["shipping_name"], "Aarav Patel")
        self.assertEqual(detail_response.data["city"], "Mumbai")
        self.assertEqual(detail_response.data["payment_method"], "Cash on Delivery")

    def test_customer_can_cancel_pending_order(self):
        order = Order.objects.create(
            user=self.user,
            total=Decimal("2598.00"),
            shipping_name="Aarav Patel",
            email="customer@example.com",
            phone="9876543210",
            shipping_address="12 Garden Lane, Bandra",
            city="Mumbai",
            state="Maharashtra",
            postal_code="400051",
            payment_method="Cash on Delivery",
        )

        response = self.client.post(f"/api/orders/{order.order_number}/cancel/")

        self.assertEqual(response.status_code, 200)
        order.refresh_from_db()
        self.assertEqual(order.status, "Cancelled")
        self.assertEqual(response.data["status"], "Cancelled")
