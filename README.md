# Petal & Co. 🌸

A full-stack e-commerce storefront + admin dashboard for a gifting/jewelry
boutique — hampers, pendants, bracelets, earrings, jhumkas, rings,
keychains, scrunchies, claw clips, and custom packaging.

The repo is a two-service monorepo:

| Service | Path | Stack |
|---|---|---|
| **Frontend** | `/` (repo root) | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 |
| **Backend**  | `/petal-co-backend` | Django 6 + Django REST Framework + Supabase (Postgres + Storage) |

> **Note:** `package.json`'s `name` field still says `mini-makers` — that's
> a leftover from an earlier project name and is safe to rename, but it's
> the same app as "Petal & Co." everywhere else (routes, DB, emails, docs).

---

## Table of contents

- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Data model](#data-model)
- [Auth & admin access](#auth--admin-access)
- [Design system](#design-system)
- [Known gaps / roadmap](#known-gaps--roadmap)
- [Security notes before deploying](#security-notes-before-deploying)

---

## Architecture

```
┌─────────────────────────┐        /api/*  (Next.js rewrite)        ┌──────────────────────────┐
│   Next.js frontend       │ ─────────────────────────────────────▶ │   Django REST API          │
│   (App Router, RSC)      │ ◀───────────────────────────────────── │   (petal-co-backend)        │
│   localhost:3000         │        JSON + JWT bearer tokens         │   localhost:8000             │
└─────────────────────────┘                                        └──────────────┬───────────────┘
                                                                                     │
                                                                     ┌───────────────┼────────────────┐
                                                                     ▼               ▼                ▼
                                                              Supabase Postgres  Supabase Storage   SMTP (order
                                                              (primary DB)       (product photos)    confirmation
                                                                                                       emails)
```

- The **frontend never talks to Supabase directly**. `next.config.ts`
  rewrites any request to `/api/:path*` to the Django backend
  (`NEXT_PUBLIC_API_URL`, default `http://localhost:8000`), so the browser
  only ever calls same-origin `/api/...` paths — no CORS headaches, no
  API base URL hardcoded into client bundles.
- The **backend owns the database** (Django ORM → Supabase Postgres) and is
  the only thing holding the Supabase service-role key, used server-side to
  upload product photos to Supabase Storage.
- Auth is **JWT** (access + refresh via `djangorestframework-simplejwt`).
  The frontend persists tokens in `localStorage` and attaches
  `Authorization: Bearer <access>` on authenticated calls, refreshing
  transparently on a `401` (see `lib/api.ts`).
- The frontend is resilient to the API being down: most data-fetching goes
  through `apiFetchWithFallback()`, which falls back to static mock data in
  `lib/data.ts` if a request fails or returns nothing — useful for local UI
  work without the backend running, and used as the current fallback data
  itself (the mock catalog mirrors the seeded DB catalog 1:1).

## Tech stack

**Frontend**
- [Next.js 16](https://nextjs.org/) — App Router, Server + Client Components, TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) — CSS-variable-driven design tokens (no `tailwind.config` needed)
- [Recharts](https://recharts.org/) — admin analytics charts (revenue area chart, category pie, traffic bars)
- [lucide-react](https://lucide.dev/) — icon set
- React Context for cart (`lib/cart-context.tsx`) and auth (`lib/auth-context.tsx`) state — no external state library

**Backend**
- [Django 6](https://www.djangoproject.com/) + [Django REST Framework](https://www.django-rest-framework.org/)
- [djangorestframework-simplejwt](https://github.com/jazzband/djangorestframework-simplejwt) — JWT auth (1h access / 14d refresh, rotating)
- [django-filter](https://django-filter.readthedocs.io/) — product search/filter query params
- [django-cors-headers](https://github.com/adamchainz/django-cors-headers) — CORS for the frontend origin
- [psycopg 3](https://www.psycopg.org/psycopg3/) — Postgres driver (Supabase)
- [django-environ](https://django-environ.readthedocs.io/) — `.env` config
- Supabase Postgres (primary DB) + Supabase Storage (product images, via signed/public URLs — see `catalog/storage.py`)
- Console/SMTP email backend for order-confirmation + admin-notification emails

## Project structure

```
petal-co/
├── app/
│   ├── (site)/                  Storefront route group (shared Navbar/Footer via its own layout.tsx)
│   │   ├── page.tsx               Home
│   │   ├── collections/           Collection index + /[slug] listing
│   │   ├── products/              All-products (filter/sort) + /[slug] detail
│   │   ├── cart/                  Cart page
│   │   ├── login/, register/      Auth pages
│   │   ├── orders/                Customer's own order history + /[id] detail
│   │   └── about/, contact/
│   ├── admin/                    Admin dashboard — separate shell, no storefront nav
│   │   ├── layout.tsx              Sidebar shell
│   │   ├── page.tsx                Analytics overview (KPIs + charts)
│   │   ├── orders/                 Orders table (search + status filter)
│   │   ├── products/               Products table (create/edit/remove + image upload)
│   │   └── customers/              Customers table (search)
│   ├── layout.tsx                Root layout (fonts, AuthProvider, CartProvider)
│   └── globals.css               Design tokens (colors, type, signature styles)
│
├── components/                   Storefront UI (Navbar, Footer, ProductCard, Hero, CartDrawer, ...)
│   └── admin/                     Admin UI (Sidebar, TopBar, KpiCard, RevenueChart, CategoryPie, TrafficBar, StatusBadge)
│
├── lib/
│   ├── types.ts                   Shared TypeScript types (Product, Order, User, CartData, analytics points, ...)
│   ├── data.ts                    Mock catalog/orders/customers/analytics — used as fallback data & local seed reference
│   ├── api.ts                     Typed fetch wrapper: JWT header injection, 401 → refresh-and-retry, apiFetchWithFallback()
│   ├── auth-context.tsx            AuthProvider — login/register/logout, session restore via /auth/me/
│   ├── cart-context.tsx            CartProvider — localStorage-persisted cart, synced to /api/cart/* when logged in
│   └── theme-context.tsx           Theme/UI context
│
├── next.config.ts                /api/:path* → NEXT_PUBLIC_API_URL rewrite
│
└── petal-co-backend/
    ├── petal_backend/             Django project: settings.py, urls.py, wsgi/asgi
    ├── accounts/                  Custom User model (email login, is_staff = admin), auth views, admin customer list
    ├── catalog/                   Collection & Product models, viewsets, permissions, Supabase image upload
    ├── orders/                    Cart, CartItem, Order, OrderItem, checkout logic, order emails
    ├── analytics/                 Visit tracking + admin analytics endpoints
    ├── requirements.txt
    ├── .env.example
    └── README.md                  Backend-specific setup notes
```

## Getting started

You need **two terminals** — one for each service.

### 1. Backend (Django API)

```bash
cd petal-co-backend
python -m venv venv
venv\Scripts\activate          # macOS/Linux: source venv/bin/activate
pip install -r requirements.txt

copy .env.example .env         # macOS/Linux: cp .env.example .env
# then edit .env — see "Environment variables" below

python manage.py migrate
python manage.py seed_data     # populates 10 collections + 24 products, plus 2 test logins
python manage.py runserver
```

API is now live at `http://localhost:8000/api/`. Django's own built-in
admin site (data management, separate from the frontend's `/admin`
dashboard) is at `http://localhost:8000/django-admin/`.

Seeded test accounts (**rotate/remove before any public deploy**):

| Role     | Email                       | Password        |
|----------|------------------------------|------------------|
| Admin    | `admin@petalandco.test`     | `AdminPetal123!` |
| Customer | `customer@petalandco.test`  | `Customer123!`   |

### 2. Frontend (Next.js)

```bash
# from the repo root
npm install
npm run dev
```

- Storefront: `http://localhost:3000`
- Admin dashboard: `http://localhost:3000/admin`

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

The frontend will work with **no backend running** — pages fall back to
the mock data in `lib/data.ts` — but auth, checkout, cart persistence,
and live admin data all require the Django API to be up.

## Environment variables

### Frontend — `.env.local` (repo root)

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Base URL the `/api/:path*` rewrite proxies to. Set to your deployed backend URL in production. |

### Backend — `petal-co-backend/.env`

| Variable | Default | Purpose |
|---|---|---|
| `DJANGO_SECRET_KEY` | insecure dev default | **Must** be a long random string in any non-local environment. |
| `DEBUG` | `False` | Keep `True` for local dev only. |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated hosts Django will serve. |
| `DATABASE_URL` | SQLite fallback | Supabase Postgres connection string. `@` in the password must be URL-encoded as `%40`. |
| `DB_SSLMODE` | `require` | SSL mode for the Postgres connection. |
| `USE_SQLITE_FALLBACK` | `False` | If `True`, silently falls back to local SQLite when Postgres is unreachable, instead of failing to boot. |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` | Frontend origin(s) allowed to call the API. |
| `CSRF_TRUSTED_ORIGINS` | *(empty)* | Add your deployed frontend origin here in production. |
| `EMAIL_BACKEND` | console backend | Switch to `django.core.mail.backends.smtp.EmailBackend` to send real mail. |
| `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_USE_TLS` / `EMAIL_HOST_USER` / `EMAIL_HOST_PASSWORD` | — | SMTP credentials (order confirmation + admin notification emails). |
| `DEFAULT_FROM_EMAIL` | — | "From" address on outgoing mail. |
| `SUPPORT_EMAIL` | falls back to `EMAIL_HOST_USER` | Recipient for new-order admin notifications. |
| `SUPABASE_URL` | — | Your Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | — | **Secret.** Server-side only — used to upload product images to Supabase Storage. Never expose to the frontend. |
| `SUPABASE_STORAGE_BUCKET` | `product-images` | Bucket product photos are uploaded to. |

> ⚠️ **`petal-co-backend/.env.example` currently contains a live-looking
> Supabase connection string, publishable key, and DB password.** If this
> repo has ever been pushed to a public remote with those values in place,
> treat them as compromised: rotate the DB password and regenerate the
> Supabase keys from the Supabase dashboard, then keep `.env.example`
> filled with placeholder values only (`.env` — which is gitignored — is
> where real values belong).

## API reference

All routes are prefixed with `/api/`. DRF endpoints accept requests with
or without a trailing slash (both are wired explicitly since
`APPEND_SLASH` is disabled — POST bodies would otherwise be dropped on a
redirect).

**Auth** (`accounts`)

| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/auth/register/` | Public | Creates a standard (non-admin) account |
| POST | `/auth/login/` | Public | `{email, password}` → `{access, refresh, user}` |
| POST | `/auth/refresh/` | Public | `{refresh}` → new `{access}` |
| GET | `/auth/me/` | Authenticated | Current user's profile |

**Catalog** (`catalog`)

| Method | Path | Access | Notes |
|---|---|---|---|
| GET | `/collections/`, `/collections/{slug}/` | Public | |
| GET | `/products/`, `/products/{slug}/` | Public | Supports `?collection=`, `?category=`, `?search=`, `?min_price=`, `?max_price=`, `?ordering=` |
| POST / PUT / PATCH / DELETE | same paths | Admin only | |
| POST | `/products/upload-image/` | Admin only | Multipart upload → Supabase Storage, returns the image URL |

**Cart & orders** (`orders`)

| Method | Path | Access | Notes |
|---|---|---|---|
| GET | `/cart/` | Authenticated | Current user's cart |
| POST | `/cart/items/` | Authenticated | `{productId, quantity}` |
| PATCH / DELETE | `/cart/items/{id}/` | Authenticated | Update quantity / remove line |
| POST | `/cart/checkout/` | Authenticated | Cart → Order, decrements stock, fires confirmation + admin-notification emails |
| GET | `/orders/` | Authenticated | Caller's own order history |
| GET | `/orders/{order_number}/` | Authenticated | Order detail |
| POST | `/orders/{order_number}/cancel/` | Authenticated | Cancels + restocks |
| GET | `/admin/orders/`, `/admin/orders/{id}/` | Admin only | Full order list |
| PATCH | `/admin/orders/{id}/` | Admin only | Update `status` — auto restocks/re-reserves inventory as needed (`Order.apply_status`) |

**Customers & analytics** (`accounts` + `analytics`)

| Method | Path | Access | Notes |
|---|---|---|---|
| GET | `/admin/customers/` | Admin only | Every customer with order count & lifetime spend |
| POST | `/analytics/track/` | Public | `{source, path}` — fire from the frontend on page load |
| GET | `/admin/analytics/overview/` | Admin only | KPI cards (revenue, orders, AOV, new customers — 7-day deltas) |
| GET | `/admin/analytics/revenue/` | Admin only | Last 7 days, for the area chart |
| GET | `/admin/analytics/categories/` | Admin only | Revenue share by category, last 30 days |
| GET | `/admin/analytics/traffic/` | Admin only | Real sessions-by-source data from tracked visits, last 7 days |

## Data model

```
User (accounts)                Collection (catalog)         Product (catalog)
├─ email (login)                ├─ slug, name, tagline        ├─ slug, name, price, compare_at
├─ is_staff  ──▶ is_admin       └─ gradient_start/end          ├─ category, collections (M2M)
├─ phone, city, state                                          ├─ image_key (placeholder) / image_url (uploaded)
└─ 1:1 → Cart                                                  ├─ badge, stock, rating, reviews_count
                                                                └─ sold_out  (computed: stock <= 0)

Cart (orders)                  Order (orders)                 Visit (analytics)
├─ user (1:1)                   ├─ order_number (auto: PC-1042...)   ├─ source
└─ items → CartItem             ├─ user, status, total                └─ path, created_at
     ├─ product                 ├─ shipping_* / contact fields
     └─ quantity                ├─ payment_method, referral_source
                                 ├─ apply_status() keeps stock in sync
                                 └─ items → OrderItem (product_name snapshot, survives product deletion)
```

Key design choices worth knowing:

- **`is_staff` doubles as "is admin"** — no separate role table. Login
  returns it as `user.isAdmin`; the frontend uses that to decide whether
  to route to `/admin`, but the *real* enforcement is server-side: every
  `/api/admin/...` view uses the `IsAdmin` permission class
  (`catalog/permissions.py`), so a non-admin JWT gets a `403` even if they
  hit the URL directly.
- **Stock stays consistent through status changes.** `Order.apply_status()`
  restocks inventory when an order moves to `Cancelled`/`Refunded`, and
  re-reserves it if it moves back out — this is used instead of writing to
  `order.status` directly anywhere the status can change post-checkout.
- **`OrderItem.product_name` is a snapshot**, not a live join — so past
  orders still display correctly even if a product is later deleted.
- **Product photos are optional.** `image_url` (Supabase Storage) is used
  when present; otherwise the frontend renders a gradient + icon
  placeholder (`ProductVisual.tsx`) from `image_key`, `gradient_start`,
  and `gradient_end` — so the storefront never shows a broken image.

## Auth & admin access

- JWT access tokens last **1 hour**, refresh tokens **14 days** and rotate
  on use (`SIMPLE_JWT` in `settings.py`).
- The frontend stores both tokens in `localStorage` (`lib/api.ts`) and
  transparently retries a request once after refreshing on a `401`.
- `AuthProvider` (`lib/auth-context.tsx`) restores a session on page load
  by calling `/auth/me/` if tokens are present, so a refresh doesn't log
  the user out.
- **There is currently no route guard on `/admin` in the Next.js
  middleware** — the frontend only *hides the link* for non-admins; a
  logged-out or non-admin user who navigates to `/admin` directly will hit
  a page that then gets `403`s from every admin API call. Fine for an
  internal tool today, but worth adding `middleware.ts`-based route
  protection before this is customer-facing.

## Design system

Defined in `app/globals.css`:

- **Palette** — cream base, blush pink, deep plum/rose accents, muted gold,
  sage green — as CSS variables (`--color-plum`, `--color-rose`, etc.),
  exposed to Tailwind via `@theme inline` (Tailwind v4's CSS-first config,
  so there's no `tailwind.config.js`).
- **Type** — Fraunces (display serif, italic for editorial moments) + Sora
  (body sans), loaded via a Google Fonts `<link>` in `app/layout.tsx`.
- **Signature elements** — a dashed "stitch" divider (`.stitch-divider`)
  and a scalloped section edge (`.scallop-top`), nodding to ribbon/gift-box
  packaging without relying on stock icons or photography.
- **Product visuals** — gradient tiles + category icon
  (`components/ProductVisual.tsx`) as a placeholder until real product
  photography is uploaded via the admin dashboard.

## Known gaps / roadmap

- [ ] **Route-protect `/admin`** in `middleware.ts` (server-side redirect
      for non-admins, not just a hidden nav link).
- [ ] **Payments** — checkout currently supports Cash on Delivery only;
      no Razorpay/Stripe integration yet.
- [ ] **Real product photography** at scale — upload flow exists
      (`/products/upload-image/` → Supabase Storage), but most seeded
      products still use the gradient/icon placeholder.
- [ ] **Rate limiting** on `/api/auth/login/` and `/api/analytics/track/`
      (both are public, unauthenticated endpoints) — consider
      `django-ratelimit` or DRF throttling before any public deploy.
- [ ] **Tests** — `tests.py` exists in each Django app but is currently
      near-empty; the JWT/admin-gating behavior described above was
      verified manually, not with an automated suite.
- [ ] Reconcile `package.json`'s `"name": "mini-makers"` with the
      project's actual name.

## Security notes before deploying

1. Set `DEBUG=False` and a real, random `DJANGO_SECRET_KEY`.
2. Rotate the seeded admin/customer passwords (or delete those accounts).
3. Rotate the Supabase DB password and service-role key if they've ever
   been committed with real values (see the warning under
   [Environment variables](#environment-variables)).
4. Run the API behind a real WSGI server — `gunicorn petal_backend.wsgi`
   behind Nginx/Caddy/your platform's proxy — not `manage.py runserver`.
5. Lock down `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` to your
   actual deployed frontend origin.
6. Add the `/admin` route guard mentioned above before this is anything
   other than an internal/demo tool.
