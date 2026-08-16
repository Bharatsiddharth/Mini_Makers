import logging

from django_filters import rest_framework as filters
from rest_framework import status, viewsets
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Collection, Product
from .permissions import IsAdmin, IsAdminOrReadOnly
from .serializers import CollectionSerializer, ProductSerializer, ProductWriteSerializer
from .storage import ImageUploadError, upload_product_image

logger = logging.getLogger(__name__)


class ProductImageUploadView(APIView):
    """
    POST /api/products/upload-image/ — admin-only. Body: multipart form with
    an 'image' file field. Uploads to Supabase Storage and returns the public
    URL, which the admin form then saves onto the product as image_url.
    """

    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser]

    def post(self, request):
        # Debug logging
        logger.info(f"Image upload request from user: {request.user}, is_staff: {getattr(request.user, 'is_staff', False)}")
        logger.info(f"Request FILES keys: {list(request.FILES.keys())}")
        logger.info(f"Request data keys: {list(request.data.keys()) if hasattr(request, 'data') else 'N/A'}")
        
        uploaded_file = request.FILES.get("image")
        if not uploaded_file:
            error_msg = f"No image file provided. Available files: {list(request.FILES.keys())}"
            logger.warning(error_msg)
            return Response({"detail": error_msg}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            logger.info(f"Uploading file: {uploaded_file.name}, size: {uploaded_file.size} bytes")
            url = upload_product_image(uploaded_file)
            logger.info(f"Successfully uploaded image to: {url}")
            return Response({"url": url}, status=status.HTTP_201_CREATED)
        except ImageUploadError as exc:
            error_msg = f"Image upload failed: {str(exc)}"
            logger.error(error_msg)
            return Response({"detail": error_msg}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            error_msg = f"Unexpected error during upload: {str(exc)}"
            logger.exception(error_msg)
            return Response({"detail": error_msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
