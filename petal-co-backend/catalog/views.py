from django_filters import rest_framework as filters
from rest_framework import viewsets

from .models import Collection, Product
from .permissions import IsAdminOrReadOnly
from .serializers import CollectionSerializer, ProductSerializer, ProductWriteSerializer


class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"


class ProductFilter(filters.FilterSet):
    collection = filters.CharFilter(field_name="collections__slug")
    category = filters.CharFilter(field_name="category", lookup_expr="iexact")
    search = filters.CharFilter(method="filter_search")
    min_price = filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = filters.NumberFilter(field_name="price", lookup_expr="lte")

    class Meta:
        model = Product
        fields = ["collection", "category", "search", "min_price", "max_price"]

    def filter_search(self, queryset, name, value):
        return queryset.filter(name__icontains=value)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().prefetch_related("collections")
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"
    filterset_class = ProductFilter
    ordering_fields = ["price", "created_at", "rating"]

    def get_serializer_class(self):
        if self.request.method in ("POST", "PUT", "PATCH"):
            return ProductWriteSerializer
        return ProductSerializer
