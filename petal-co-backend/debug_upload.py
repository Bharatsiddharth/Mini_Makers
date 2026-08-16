#!/usr/bin/env python
"""
Debug script to test the image upload functionality.
Run this to check:
1. If there are any admin users
2. If authentication is working
3. If Supabase storage is configured
4. If the upload endpoint works
"""

import os
import sys
import django

sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "petal_backend.settings")
django.setup()

from accounts.models import User
from catalog.storage import upload_product_image, ImageUploadError
from django.conf import settings

print("=" * 70)
print("IMAGE UPLOAD DEBUG SCRIPT")
print("=" * 70)

# Check 1: Admin users
print("\n1. Checking for admin users...")
admin_users = User.objects.filter(is_staff=True)
if admin_users.exists():
    print(f"   ✓ Found {admin_users.count()} admin user(s):")
    for user in admin_users:
        print(f"     - {user.email} (is_staff={user.is_staff}, is_superuser={user.is_superuser})")
else:
    print("   ✗ NO ADMIN USERS FOUND!")
    print("   Create an admin user with: python manage.py createsuperuser")

# Check 2: Supabase configuration
print("\n2. Checking Supabase configuration...")
if settings.SUPABASE_URL:
    print(f"   ✓ SUPABASE_URL: {settings.SUPABASE_URL}")
else:
    print("   ✗ SUPABASE_URL not configured")

if settings.SUPABASE_SERVICE_ROLE_KEY:
    key_preview = settings.SUPABASE_SERVICE_ROLE_KEY[:20] + "***"
    print(f"   ✓ SUPABASE_SERVICE_ROLE_KEY: {key_preview}")
else:
    print("   ✗ SUPABASE_SERVICE_ROLE_KEY not configured")

if settings.SUPABASE_STORAGE_BUCKET:
    print(f"   ✓ SUPABASE_STORAGE_BUCKET: {settings.SUPABASE_STORAGE_BUCKET}")
else:
    print("   ✗ SUPABASE_STORAGE_BUCKET not configured")

# Check 3: Test file upload (create a dummy file)
print("\n3. Testing file upload with Supabase...")
try:
    from io import BytesIO
    from django.core.files.uploadedfile import InMemoryUploadedFile
    
    # Create a small test image (1x1 pixel PNG)
    test_image_data = (
        b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01'
        b'\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00'
        b'\x00\x01\x01\x00\x058\xcb\xaf\x00\x00\x00\x00IEND\xaeB`\x82'
    )
    
    test_file = InMemoryUploadedFile(
        file=BytesIO(test_image_data),
        field_name="image",
        name="test.png",
        content_type="image/png",
        size=len(test_image_data),
        charset=None,
    )
    
    url = upload_product_image(test_file)
    print(f"   ✓ Test upload succeeded!")
    print(f"   ✓ Image URL: {url}")
except ImageUploadError as e:
    print(f"   ✗ Upload failed: {e}")
except Exception as e:
    print(f"   ✗ Unexpected error: {type(e).__name__}: {e}")

print("\n" + "=" * 70)
print("DEBUGGING COMPLETE")
print("=" * 70)
