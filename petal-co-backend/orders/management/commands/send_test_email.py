"""
Diagnostic command — sends one plain email straight through Django's SMTP
backend with NO try/except, so whatever error Gmail returns prints in full.

Usage:
    python manage.py send_test_email you@example.com
"""

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.core.mail import send_mail


class Command(BaseCommand):
    help = "Send a single test email to verify SMTP settings are actually working."

    def add_arguments(self, parser):
        parser.add_argument("to_email", type=str, help="Address to send the test email to")

    def handle(self, *args, **options):
        to_email = options["to_email"]

        self.stdout.write("Current email settings:")
        self.stdout.write(f"  EMAIL_BACKEND       = {settings.EMAIL_BACKEND}")
        self.stdout.write(f"  EMAIL_HOST          = {settings.EMAIL_HOST}")
        self.stdout.write(f"  EMAIL_PORT          = {settings.EMAIL_PORT}")
        self.stdout.write(f"  EMAIL_USE_TLS       = {settings.EMAIL_USE_TLS}")
        self.stdout.write(f"  EMAIL_HOST_USER     = {settings.EMAIL_HOST_USER!r}")
        pw = settings.EMAIL_HOST_PASSWORD
        self.stdout.write(f"  EMAIL_HOST_PASSWORD = {'*' * len(pw)} ({len(pw)} chars, "
                           f"{'contains a space' if ' ' in pw else 'no spaces'})")
        self.stdout.write(f"  DEFAULT_FROM_EMAIL  = {settings.DEFAULT_FROM_EMAIL!r}")
        self.stdout.write(f"  SUPPORT_EMAIL       = {settings.SUPPORT_EMAIL!r}")
        self.stdout.write("")

        if settings.EMAIL_BACKEND.endswith("console.EmailBackend"):
            raise CommandError(
                "EMAIL_BACKEND is still the console backend — Django never touched SMTP. "
                "This means the .env values for EMAIL_BACKEND aren't being picked up at all "
                "(check .env is in petal-co-backend/ next to manage.py, and restart the server "
                "after editing it — env vars are only read once, at process start)."
            )

        self.stdout.write(f"Attempting to send to {to_email} ...")
        # No try/except here on purpose — let the real SMTPException surface.
        send_mail(
            subject="Petal & Co. — test email",
            message="If you're reading this, SMTP sending works.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            fail_silently=False,
        )
        self.stdout.write(self.style.SUCCESS(f"Sent successfully to {to_email}."))
