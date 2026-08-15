from django.db import models


class Collection(models.Model):
    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=120)
    tagline = models.CharField(max_length=255, blank=True)
    gradient_start = models.CharField(max_length=7, default="#f1cdd2")
    gradient_end = models.CharField(max_length=7, default="#7a2b3f")

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    class Badge(models.TextChoices):
        NONE = "", "None"
        SALE = "Sale", "Sale"
        NEW = "New", "New"
        BESTSELLER = "Bestseller", "Bestseller"
        SOLD_OUT = "Sold out", "Sold out"

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_at = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    category = models.CharField(max_length=120)
    collections = models.ManyToManyField(Collection, related_name="products", blank=True)

    # Placeholder visual, mirroring the frontend's gradient+icon ProductVisual
    # (no real photography stored/scraped) — swap for an ImageField once
    # real product photos exist.
    image_key = models.CharField(
        max_length=40,
        default="box",
        help_text="Icon key used by the frontend's ProductVisual component.",
    )
    gradient_start = models.CharField(max_length=7, default="#f1cdd2")
    gradient_end = models.CharField(max_length=7, default="#7a2b3f")

    badge = models.CharField(max_length=20, choices=Badge.choices, blank=True)
    description = models.TextField(blank=True)
    stock = models.PositiveIntegerField(default=0)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0)
    reviews_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    @property
    def sold_out(self) -> bool:
        return self.stock <= 0
