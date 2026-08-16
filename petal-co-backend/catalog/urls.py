from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CollectionViewSet, ProductViewSet

router = DefaultRouter()
router.register("collections", CollectionViewSet, basename="collection")
router.register("products", ProductViewSet, basename="product")

# The Next.js rewrite may deliver requests with our without a trailing slash
# (browsers/proxies can normalise away "/products/" -> "/products", and the
# backend has APPEND_SLASH=False so there is no auto-redirect).
# These plain "path" entries make BOTH variants resolve to the same viewset
# actions, so adding a product never 404s because of a missing slash.
urlpatterns = [
    path(
        "products",
        ProductViewSet.as_view(
            {"get": "list", "post": "create"}
        ),
        name="product-list-no-slash",
    ),
    path(
        "products/<slug:slug>",
        ProductViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
        name="product-detail-no-slash",
    ),
    path(
        "collections",
        CollectionViewSet.as_view({"get": "list", "post": "create"}),
        name="collection-list-no-slash",
    ),
    path(
        "collections/<slug:slug>",
        CollectionViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
        name="collection-detail-no-slash",
    ),
] + router.urls