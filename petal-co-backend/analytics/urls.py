from django.urls import path

from .views import (
    OverviewView,
    RevenueByDayView,
    SalesByCategoryView,
    TrackVisitView,
    TrafficBySourceView,
)

urlpatterns = [
    path("analytics/track", TrackVisitView.as_view(), name="analytics-track-no-slash"),
    path("analytics/track/", TrackVisitView.as_view(), name="analytics-track"),
    path("admin/analytics/overview", OverviewView.as_view(), name="admin-analytics-overview-no-slash"),
    path("admin/analytics/overview/", OverviewView.as_view(), name="admin-analytics-overview"),
    path("admin/analytics/revenue", RevenueByDayView.as_view(), name="admin-analytics-revenue-no-slash"),
    path("admin/analytics/revenue/", RevenueByDayView.as_view(), name="admin-analytics-revenue"),
    path("admin/analytics/categories", SalesByCategoryView.as_view(), name="admin-analytics-categories-no-slash"),
    path("admin/analytics/categories/", SalesByCategoryView.as_view(), name="admin-analytics-categories"),
    path("admin/analytics/traffic", TrafficBySourceView.as_view(), name="admin-analytics-traffic-no-slash"),
    path("admin/analytics/traffic/", TrafficBySourceView.as_view(), name="admin-analytics-traffic"),
]
