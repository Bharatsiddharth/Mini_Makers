from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Product
from catalog.permissions import IsAdmin
from orders.models import Order

from .models import Visit

User = get_user_model()


class TrackVisitView(APIView):
    """POST /api/analytics/track/ — body: {source, path}. Open to anyone (fires from the storefront)."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        Visit.objects.create(
            source=request.data.get("source", "Direct")[:50],
            path=request.data.get("path", "")[:255],
        )
        return Response(status=204)


# Orders in these statuses never became real, fulfilled business — they should
# never be counted toward revenue, order counts, or AOV on the dashboard.
EXCLUDED_STATUSES = [Order.Status.CANCELLED, Order.Status.REFUNDED]


class OverviewView(APIView):
    """GET /api/admin/analytics/overview/ — KPI cards on the dashboard home."""

    permission_classes = [IsAdmin]

    def get(self, request):
        since = timezone.now() - timedelta(days=7)
        prev_since = since - timedelta(days=7)

        valid_orders = Order.objects.exclude(status__in=EXCLUDED_STATUSES)
        week_orders = valid_orders.filter(created_at__gte=since)
        prev_week_orders = valid_orders.filter(created_at__gte=prev_since, created_at__lt=since)

        week_revenue = week_orders.aggregate(total=Sum("total"))["total"] or 0
        prev_revenue = prev_week_orders.aggregate(total=Sum("total"))["total"] or 0
        week_count = week_orders.count()
        prev_count = prev_week_orders.count()

        aov = round(week_revenue / week_count, 2) if week_count else 0
        prev_aov = round(prev_revenue / prev_count, 2) if prev_count else 0

        new_customers = User.objects.filter(date_joined__gte=since, is_staff=False).count()
        prev_new_customers = User.objects.filter(
            date_joined__gte=prev_since, date_joined__lt=since, is_staff=False
        ).count()

        def pct_change(curr, prev):
            if prev == 0:
                return 100.0 if curr > 0 else 0.0
            return round(((curr - prev) / prev) * 100, 1)

        return Response({
            "revenue7d": float(week_revenue),
            "revenueDelta": pct_change(week_revenue, prev_revenue),
            "orders7d": week_count,
            "ordersDelta": pct_change(week_count, prev_count),
            "aov": float(aov),
            "aovDelta": pct_change(aov, prev_aov),
            "newCustomers7d": new_customers,
            "newCustomersDelta": pct_change(new_customers, prev_new_customers),
        })


class RevenueByDayView(APIView):
    """GET /api/admin/analytics/revenue/ — last 7 days, for the area chart."""

    permission_classes = [IsAdmin]

    def get(self, request):
        today = timezone.localdate()
        results = []
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            day_orders = Order.objects.exclude(status__in=EXCLUDED_STATUSES).filter(created_at__date=day)
            agg = day_orders.aggregate(total=Sum("total"), count=Count("id"))
            results.append({
                "day": day.strftime("%a"),
                "date": day.isoformat(),
                "revenue": float(agg["total"] or 0),
                "orders": agg["count"] or 0,
            })
        return Response(results)


class SalesByCategoryView(APIView):
    """GET /api/admin/analytics/categories/ — revenue share by product category, last 30 days."""

    permission_classes = [IsAdmin]

    def get(self, request):
        since = timezone.now() - timedelta(days=30)
        rows = (
            Order.objects.exclude(status__in=EXCLUDED_STATUSES)
            .filter(created_at__gte=since)
            .values("items__product__category")
            .annotate(total=Sum("items__price_at_purchase"))
            .order_by("-total")
        )
        grand_total = sum((r["total"] or 0) for r in rows) or 1
        return Response([
            {
                "category": r["items__product__category"] or "Other",
                "value": round(float((r["total"] or 0) / grand_total) * 100, 1),
            }
            for r in rows if r["items__product__category"]
        ])


class TrafficBySourceView(APIView):
    """GET /api/admin/analytics/traffic/ — sessions by source, last 7 days, from real Visit logs."""

    permission_classes = [IsAdmin]

    def get(self, request):
        since = timezone.now() - timedelta(days=7)
        rows = (
            Visit.objects.filter(created_at__gte=since)
            .values("source")
            .annotate(visits=Count("id"))
            .order_by("-visits")
        )
        return Response([{"source": r["source"], "visits": r["visits"]} for r in rows])
