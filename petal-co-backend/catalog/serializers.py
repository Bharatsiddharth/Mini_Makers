from rest_framework import serializers

from .models import Collection, Product


class CollectionSerializer(serializers.ModelSerializer):
    gradient = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = ["slug", "name", "tagline", "gradient"]

    def get_gradient(self, obj):
        return [obj.gradient_start, obj.gradient_end]


class ProductSerializer(serializers.ModelSerializer):
    gradient = serializers.SerializerMethodField()
    collectionSlugs = serializers.SlugRelatedField(
        source="collections", slug_field="slug", many=True, read_only=True
    )
    soldOut = serializers.BooleanField(source="sold_out", read_only=True)
    compareAt = serializers.DecimalField(
        source="compare_at", max_digits=10, decimal_places=2, required=False, allow_null=True
    )
    reviews = serializers.IntegerField(source="reviews_count", read_only=True)
    image = serializers.CharField(source="image_key")
    imageUrl = serializers.CharField(source="image_url", allow_blank=True, required=False)

    class Meta:
        model = Product
        fields = [
            "id", "slug", "name", "price", "compareAt", "category",
            "collectionSlugs", "image", "imageUrl", "gradient", "badge", "soldOut",
            "description", "stock", "rating", "reviews",
        ]

    def get_gradient(self, obj):
        return [obj.gradient_start, obj.gradient_end]


class ProductWriteSerializer(serializers.ModelSerializer):
    """Used for admin create/update, where collections are set by slug."""

    collection_slugs = serializers.SlugRelatedField(
        source="collections", slug_field="slug", many=True,
        queryset=Collection.objects.all(), required=False,
    )

    class Meta:
        model = Product
        fields = [
            "id", "slug", "name", "price", "compare_at", "category",
            "collection_slugs", "image_key", "image_url", "gradient_start", "gradient_end",
            "badge", "description", "stock", "rating", "reviews_count",
        ]
