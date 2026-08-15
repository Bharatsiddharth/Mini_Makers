from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model. `is_staff` doubles as the "is this an admin"
    flag the frontend checks to decide whether /admin is reachable —
    this is standard Django practice rather than a bespoke role field,
    so Django's built-in admin site and `createsuperuser` work as-is.
    """

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    city = models.CharField(max_length=120, blank=True)
    state = models.CharField(max_length=120, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

    @property
    def is_admin(self) -> bool:
        return self.is_staff
