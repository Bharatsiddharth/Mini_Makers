from django.db import models


class Visit(models.Model):
    """
    A lightweight page-view log. The frontend calls POST /api/analytics/track/
    once per session/page with a `source` (e.g. utm_source, or 'Direct' if
    none), which powers the admin 'Traffic by source' chart with real data
    instead of a static mock.
    """

    source = models.CharField(max_length=50, default="Direct")
    path = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [models.Index(fields=["source", "created_at"])]
