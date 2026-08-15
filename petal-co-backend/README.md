# Petal & Co. — Backend API (Django + Supabase)

A Django REST Framework API for the Petal & Co. storefront: role-based auth
(customer vs. admin), a product/collection catalog, cart & checkout, and the
analytics endpoints the admin dashboard needs — all backed by a Supabase
Postgres database.

## How admin gating works

There's no separate "admin app" or role table. `is_staff` (Django's
built-in flag) *is* the admin flag. Login returns it as `isAdmin` in the
JSON body:

```json
{ "access": "...", "refresh": "...", "user": { "email": "...", "isAdmin": true } }
```

The frontend should store `user.isAdmin` after login and only route to
`/admin` when it's `true` — checking this client-side is a UX nicety, not
security. The actual enforcement is server-side: every `/api/admin/...`
endpoint uses the `IsAdmin` permission class (`catalog/permissions.py`),
so a non-admin's JWT gets a `403` even if they type the URL directly. This
was tested directly: a customer token gets `403` on `/api/admin/orders/`
and `/api/admin/customers/`; an admin token gets `200`.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Project Settings → Database → Connection string**, and copy the
   **URI** (use the "Session pooler" string if you're deploying somewhere
   serverless; the direct connection string is fine for a normal server/VM).
3. It looks like:
   `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## 2. Configure the backend

```bash
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# then edit .env and paste your Supabase DATABASE_URL
```

## 3. Migrate & seed

```bash
python manage.py migrate
python manage.py seed_data
```

`seed_data` populates the 10 collections and 24 products that mirror the
frontend's mock catalog, plus two logins to test with immediately:

| Role     | Email                        | Password         |
|----------|-------------------------------|-------------------|
| Admin    | admin@petalandco.test          | AdminPetal123!    |
| Customer | customer@petalandco.test       | Customer123!      |

**Change or remove these before deploying anywhere public.**

## 4. Run it

```bash
python manage.py runserver
```

API is at `http://localhost:8000/api/`. Django's own admin site (separate
from the frontend's `/admin` dashboard — this is Django's built-in
data-management UI) is at `http://localhost:8000/django-admin/`.

## Endpoints

**Auth** (`accounts` app)
| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/api/auth/register/` | Public | Creates a normal (non-admin) account |
| POST | `/api/auth/login/` | Public | Body: `{email, password}` → `{access, refresh, user}` |
| POST | `/api/auth/refresh/` | Public | Body: `{refresh}` → new `{access}` |
| GET | `/api/auth/me/` | Authenticated | Current user's profile |

**Catalog** (`catalog` app)
| Method | Path | Access |
|---|---|---|
| GET | `/api/collections/`, `/api/collections/{slug}/` | Public |
| GET | `/api/products/`, `/api/products/{slug}/` | Public — supports `?collection=`, `?category=`, `?search=`, `?min_price=`, `?max_price=`, `?ordering=` |
| POST/PUT/PATCH/DELETE | same paths | Admin only |

**Cart & orders** (`orders` app)
| Method | Path | Access | Notes |
|---|---|---|---|
| GET | `/api/cart/` | Authenticated | Current user's cart |
| POST | `/api/cart/items/` | Authenticated | Body: `{productId, quantity}` |
| PATCH/DELETE | `/api/cart/items/{id}/` | Authenticated | Update qty / remove line |
| POST | `/api/cart/checkout/` | Authenticated | Turns cart into an Order, decrements stock |
| GET | `/api/orders/` | Authenticated | Caller's own order history |
| GET/PATCH | `/api/admin/orders/`, `/api/admin/orders/{id}/` | Admin only | Full order list; PATCH updates `status` |

**Customers & analytics** (`accounts` + `analytics` apps)
| Method | Path | Access |
|---|---|---|
| GET | `/api/admin/customers/` | Admin only — every customer with order count & lifetime spend |
| POST | `/api/analytics/track/` | Public — body: `{source, path}`, fire this from the frontend on page load |
| GET | `/api/admin/analytics/overview/` | Admin only — KPI cards |
| GET | `/api/admin/analytics/revenue/` | Admin only — last 7 days, for the area chart |
| GET | `/api/admin/analytics/categories/` | Admin only — revenue share by category, last 30 days |
| GET | `/api/admin/analytics/traffic/` | Admin only — sessions by source, last 7 days (real data from tracked visits) |

## Connecting the Next.js frontend

The frontend currently runs entirely on local mock data (`lib/data.ts`) and
in-memory cart state — it isn't calling this API yet. To wire them together:

1. Set `CORS_ALLOWED_ORIGINS` in `.env` to wherever the frontend runs
   (defaults to `http://localhost:3000`).
2. On the frontend, add `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
   to its `.env.local`.
3. Replace the functions in `lib/data.ts` with `fetch` calls to the
   endpoints above, and swap `lib/cart-context.tsx`'s local state for
   calls to `/api/cart/...`.
4. Store the JWT (`access`/`refresh`) from `/api/auth/login/` — e.g. in an
   httpOnly cookie set by a Next.js route handler — and send
   `Authorization: Bearer <access>` on authenticated requests.
5. After login, check `user.isAdmin` before allowing navigation to
   `/admin`; also handle the `403` a non-admin will get if they hit an
   `/api/admin/...` endpoint directly.

Happy to do this wiring as a follow-up — it touches most of the frontend's
data-fetching code, so it's a distinct piece of work from standing up the
API itself.

## Project structure

```
petal_backend/        Django project settings & root urls
accounts/              Custom User model, auth views, admin customers list
catalog/                Collection & Product models, viewsets, permissions
orders/                  Cart, CartItem, Order, OrderItem, checkout logic
analytics/                Visit tracking + admin analytics endpoints
requirements.txt
.env.example
```

## Production notes

- `DEBUG=True` is fine for local dev only — set `DEBUG=False` and a real
  `DJANGO_SECRET_KEY` before deploying anywhere public.
- The dev server (`runserver`) isn't for production — use something like
  `gunicorn petal_backend.wsgi` behind a real web server.
- Consider adding rate limiting (`django-ratelimit` or DRF throttling) to
  `/api/auth/login/` and `/api/analytics/track/` before going live, since
  both are open endpoints.
