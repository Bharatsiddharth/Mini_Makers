from rest_framework.routers import DefaultRouter

from .views import CollectionViewSet, ProductViewSet

router = DefaultRouter()
router.register("collections", CollectionViewSet, basename="collection")
router.register("products", ProductViewSet, basename="product")

urlpatterns = router.urls
