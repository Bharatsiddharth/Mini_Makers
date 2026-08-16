"""
Uploads product photos to Supabase Storage using the service role key
(server-side only — never expose that key to the frontend).

Supports both PUBLIC and PRIVATE buckets:
- PUBLIC bucket: Returns public URL (no auth required)
- PRIVATE bucket: Returns signed URL (works for 1 year with service role key)
"""

import mimetypes
import uuid
from datetime import timedelta

import requests
from django.conf import settings

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "gif"}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5 MB


class ImageUploadError(Exception):
    """Raised for any expected failure — caller turns this into a 400/503 response."""


def upload_product_image(uploaded_file) -> str:
    """
    uploaded_file: a Django UploadedFile (from request.FILES).
    Returns the public or signed URL of the stored object.
    
    If bucket is PUBLIC: returns public URL
    If bucket is PRIVATE: returns signed URL (valid for 1 year)
    """
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        raise ImageUploadError(
            "Image storage isn't configured on the server "
            "(SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in .env)."
        )

    original_name = uploaded_file.name or "upload"
    ext = original_name.rsplit(".", 1)[-1].lower() if "." in original_name else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise ImageUploadError("Unsupported file type. Use JPG, PNG, WEBP, or GIF.")

    if uploaded_file.size > MAX_UPLOAD_BYTES:
        raise ImageUploadError("Image is too large — please keep it under 5MB.")

    content_type = uploaded_file.content_type or mimetypes.guess_type(original_name)[0] or "application/octet-stream"
    object_path = f"{uuid.uuid4().hex}.{ext}"
    bucket = settings.SUPABASE_STORAGE_BUCKET

    upload_url = f"{settings.SUPABASE_URL}/storage/v1/object/{bucket}/{object_path}"
    try:
        response = requests.post(
            upload_url,
            headers={
                "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
                "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
                "Content-Type": content_type,
                "x-upsert": "true",
            },
            data=uploaded_file.read(),
            timeout=20,
        )
    except requests.RequestException as exc:
        raise ImageUploadError(f"Could not reach Supabase Storage: {exc}") from exc

    if response.status_code not in (200, 201):
        raise ImageUploadError(
            f"Supabase Storage rejected the upload ({response.status_code}): {response.text[:300]}"
        )

    # First, try to return a public URL (for PUBLIC buckets)
    public_url = f"{settings.SUPABASE_URL}/storage/v1/object/public/{bucket}/{object_path}"
    
    # Check if the public URL is accessible
    try:
        head_response = requests.head(public_url, timeout=5)
        if head_response.status_code == 200:
            return public_url
    except requests.RequestException:
        pass
    
    # If public URL fails, generate a signed URL (for PRIVATE buckets)
    # Signed URLs work for the configured expiration time with no additional auth needed
    try:
        signed_url = _generate_signed_url(object_path, bucket)
        return signed_url
    except Exception:
        # Fallback: return public URL anyway and let the frontend handle it
        return public_url


def _generate_signed_url(object_path: str, bucket: str, expires_in_hours: int = 24 * 365) -> str:
    """
    Generate a signed URL for private Supabase bucket objects.
    Signed URLs work without authentication for the specified duration.
    """
    signed_url_endpoint = f"{settings.SUPABASE_URL}/storage/v1/object/sign/{bucket}/{object_path}"
    
    try:
        response = requests.post(
            signed_url_endpoint,
            headers={
                "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
                "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
            },
            json={"expiresIn": expires_in_hours * 3600},
            timeout=10,
        )
        
        if response.status_code == 200:
            data = response.json()
            signed_path = data.get("signedURL", "")
            if signed_path:
                return f"{settings.SUPABASE_URL}{signed_path}"
    except requests.RequestException:
        pass
    
    raise ImageUploadError("Could not generate signed URL for private bucket")

