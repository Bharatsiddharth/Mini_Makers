from django.contrib import admin

from .models import Collection, Product


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "tagline")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "category", "price", "stock", "badge")
    list_filter = ("category", "badge", "collections")
    search_fields = ("name", "slug", "category")
    prepopulated_fields = {"slug": ("name",)}
