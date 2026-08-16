"""
Diagnostic command — generates a tiny 1x1 PNG in memory and uploads it via
the same upload_product_image() helper the admin endpoint uses, so you can
verify SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / bucket setup in isolation,
without going through the frontend.

Usage:
    python manage.py test_image_upload
"""

import base64
import io

from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.management.base import BaseCommand

from catalog.storage import ImageUploadError, upload_product_image

# A valid, minimal 1x1 red pixel PNG, base64-encoded.
_TINY_PNG_B64 = (
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
)


class Command(BaseCommand):
    help = "Upload a tiny test image to Supabase Storage to verify config end-to-end."

    def handle(self, *args, **options):
        self.stdout.write("Current storage settings:")
        self.stdout.write(f"  SUPABASE_URL              = {settings.SUPABASE_URL or '(empty)'}")
        key = settings.SUPABASE_SERVICE_ROLE_KEY
        self.stdout.write(
            f"  SUPABASE_SERVICE_ROLE_KEY = {'(empty)' if not key else f'{key[:6]}...{key[-4:]} ({len(key)} chars)'}"
        )
        self.stdout.write(f"  SUPABASE_STORAGE_BUCKET   = {settings.SUPABASE_STORAGE_BUCKET}")
        self.stdout.write("")

        png_bytes = base64.b64decode(_TINY_PNG_B64)
        file_obj = InMemoryUploadedFile(
            file=io.BytesIO(png_bytes),
            field_name="image",
            name="test-pixel.png",
            content_type="image/png",
            size=len(png_bytes),
            charset=None,
        )

        self.stdout.write("Attempting upload...")
        try:
            url = upload_product_image(file_obj)
        except ImageUploadError as exc:
            self.stderr.write(self.style.ERROR(f"Upload failed: {exc}"))
            return

        self.stdout.write(self.style.SUCCESS(f"Uploaded successfully: {url}"))
        self.stdout.write("Open that URL in a browser — you should see a tiny red square.")
