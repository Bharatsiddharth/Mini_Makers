#!/usr/bin/env python
"""
Test if Supabase image URLs are publicly accessible and check CORS headers.
"""

import requests
import sys

# Test image URL from our database
test_url = "https://ohcvwbsvvmquihdanrwb.supabase.co/storage/v1/object/public/product-images/fa0566823adc4f2ea1b8bb853d2a745e.jpg"

print("=" * 70)
print("SUPABASE IMAGE ACCESS TEST")
print("=" * 70)

print(f"\nTesting URL: {test_url}")

try:
    response = requests.head(test_url, timeout=10)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response Headers:")
    for key, value in response.headers.items():
        if key.lower() in ('content-type', 'access-control-allow-origin', 'cache-control', 'content-length'):
            print(f"  {key}: {value}")
    
    if response.status_code == 200:
        print("\n✓ Image URL is publicly accessible!")
    elif response.status_code == 403:
        print("\n✗ 403 Forbidden: Bucket or object is not public!")
        print("  FIX: Make the product-images bucket PUBLIC in Supabase dashboard")
    elif response.status_code == 404:
        print("\n✗ 404 Not Found: File may have been deleted or URL is wrong")
    else:
        print(f"\n✗ Unexpected status: {response.status_code}")
        
except requests.RequestException as e:
    print(f"\n✗ Connection error: {e}")

print("\n" + "=" * 70)
