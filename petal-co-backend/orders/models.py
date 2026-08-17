from django.conf import settings
from django.db import models, transaction

from catalog.models import Product


class Cart(models.Model):
    """One cart per user — mirrors the frontend's CartProvider, persisted server-side."""

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def subtotal(self):
        return sum((item.line_total for item in self.items.all()), start=0)

    @property
    def count(self):
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("cart", "product")

    @property
    def line_total(self):
        return self.product.price * self.quantity


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "Pending", "Pending"
        CANCELLED = "Cancelled", "Cancelled"
        FULFILLED = "Fulfilled", "Fulfilled"
        SHIPPED = "Shipped", "Shipped"
        REFUNDED = "Refunded", "Refunded"

    order_number = models.CharField(max_length=20, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_name = models.CharField(max_length=120, blank=True, default="")
    email = models.EmailField(max_length=254, blank=True, default="")
    phone = models.CharField(max_length=20, blank=True, default="")
    shipping_address = models.CharField(max_length=255, blank=True, default="")
    city = models.CharField(max_length=120, blank=True, default="")
    state = models.CharField(max_length=120, blank=True, default="")
    postal_code = models.CharField(max_length=20, blank=True, default="")
    payment_method = models.CharField(max_length=80, default="Cash on Delivery")
    notes = models.TextField(blank=True, default="")
    # Where the order came from — powers the admin "traffic/sales by source" view.
    referral_source = models.CharField(max_length=50, default="Direct")
    created_at = models.DateTimeField(auto_now_add=True)

    # Statuses that mean the order never shipped / was reversed — the stock
    # reserved for it at checkout should be released back to inventory.
    RESTOCK_STATUSES = {Status.CANCELLED, Status.REFUNDED}

    class Meta:
        ordering = ["-created_at"]

    @transaction.atomic
    def apply_status(self, new_status):
        """
        Change status and keep product stock in sync:
        - moving INTO Cancelled/Refunded releases the reserved stock back.
        - moving OUT of Cancelled/Refunded (e.g. admin reactivates an order)
          re-reserves it, so stock stays correct either direction.
        Use this instead of setting `.status` directly whenever an order's
        status can change after checkout (cancellation, admin edits, etc).
        """
        old_status = self.status
        if old_status == new_status:
            return

        was_restocked = old_status in self.RESTOCK_STATUSES
        will_be_restocked = new_status in self.RESTOCK_STATUSES

        if will_be_restocked and not was_restocked:
            for item in self.items.select_related("product"):
                if item.product:
                    item.product.stock += item.quantity
                    item.product.save(update_fields=["stock"])
        elif was_restocked and not will_be_restocked:
            for item in self.items.select_related("product"):
                if item.product:
                    item.product.stock -= item.quantity
                    item.product.save(update_fields=["stock"])

        self.status = new_status
        self.save(update_fields=["status"])

    def save(self, *args, **kwargs):
        if not self.order_number:
            # Derive the next number from the highest existing PC-#### value,
            # not from the row id. IDs can drift from the order numbering scheme
            # (seed data, manual imports, deleted rows), so scanning by the
            # numerical suffix itself is the only reliable way to keep the
            # sequence unique and monotonic.
            max_number = 0
            for order_number in Order.objects.exclude(order_number="").values_list("order_number", flat=True):
                try:
                    suffix = int(order_number.rsplit("-", 1)[-1])
                    max_number = max(max_number, suffix)
                except (TypeError, ValueError):
                    continue

            next_id = max_number + 1 if max_number else 1042

            # Guard against lingering collisions if an old row was inserted with
            # the next number already taken; keep nudging until a free value is found.
            while Order.objects.filter(order_number=f"PC-{next_id}").exists():
                next_id += 1

            self.order_number = f"PC-{next_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.order_number

    @property
    def items_count(self):
        return sum(i.quantity for i in self.items.all())


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=200)  # snapshot, survives product deletion
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
