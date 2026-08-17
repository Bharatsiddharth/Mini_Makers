"""Full order-flow smoke test against the hosted backend."""
import json
import sys
import urllib.request
import urllib.error

BASE = "https://mini-makers.onrender.com/api"
EMAIL = "orderflow.test.2026@gmail.com"
PASSWORD = "OrderFlowTest123!"
USERNAME = "orderflowtest2026"


def request(method, path, body=None, token=None):
    url = f"{BASE}{path}"
    data = json.dumps(body).encode() if body is not None else None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read().decode()
            print(f"\n=== {method} {path} -> {resp.status} ===")
            try:
                print(json.dumps(json.loads(raw), indent=2))
            except Exception:
                print(raw[:2000])
            return resp.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        print(f"\n=== {method} {path} -> {e.code} ===")
        try:
            print(json.dumps(json.loads(raw), indent=2))
        except Exception:
            print(raw[:2000])
        return e.code, raw


def main():
    status, _ = request("POST", "/auth/register/", {
        "email": EMAIL, "password": PASSWORD, "username": USERNAME,
    })

    status, body = request("POST", "/auth/login/", {
        "email": EMAIL, "password": PASSWORD,
    })
    if status != 200:
        print("\nLOGIN FAILED - cannot continue.", file=sys.stderr)
        return 1
    access = body["access"]

    status, body = request("GET", "/products/", token=access)
    products = body if isinstance(body, list) else body.get("results", [])
    if not products:
        print("\nNo products available.", file=sys.stderr)
        return 2
    product = next((p for p in products if p.get("stock", 0) > 0), products[0])
    print(f"\n>>> Product id={product['id']} name={product.get('name')} stock={product.get('stock')}")

    status, body = request("POST", "/cart/items/", {
        "productId": product["id"], "quantity": 1,
    }, token=access)
    if status >= 400:
        print("\nADD-TO-CART FAILED.", file=sys.stderr)
        return 3

    status, body = request("POST", "/cart/checkout/", {
        "shipping_name": "Order Flow Test",
        "email": EMAIL,
        "phone": "9876543210",
        "shipping_address": "42 Test Lane",
        "city": "Bangalore",
        "state": "Karnataka",
        "postal_code": "560001",
        "payment_method": "Cash on Delivery",
        "notes": "Automated smoke-test order",
        "referralSource": "Direct",
    }, token=access)
    if status >= 400:
        print("\nCHECKOUT FAILED - THIS IS THE BUG WE'RE TRACKING.", file=sys.stderr)
        return 4

    status, body = request("GET", "/orders/", token=access)
    orders = body if isinstance(body, list) else body.get("results", [])
    if orders:
        print(f"\n>>> Orders found: {len(orders)} - latest: {orders[0].get('id')}")
    else:
        print("\n>>> Order NOT saved to My Orders!", file=sys.stderr)
        return 5

    print("\nFULL ORDER FLOW PASSED")
    return 0


if __name__ == "__main__":
    sys.exit(main())