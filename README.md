# mini makers — Gifting Storefront + Admin Dashboard

An original Next.js + Tailwind CSS e-commerce front end for a gifting/jewelry
boutique (hampers, pendants, bracelets, earrings, jhumkas, rings, keychains,
scrunchies, claw clips, custom packaging) — plus a full admin dashboard for
orders, products, customers, and analytics.

This is a **front-end-only** build: all product, order, and customer data
lives in `lib/data.ts` as mock data. There is no database or payment
integration yet — see "Next steps" below for wiring up the back end.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Recharts** for admin analytics charts
- **lucide-react** for icons
- Cart state via React Context (`lib/cart-context.tsx`) — in-memory only,
  resets on page refresh

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the storefront and
`http://localhost:3000/admin` for the dashboard.

```bash
npm run build   # production build
npm run lint    # eslint
```

## Project structure

```
app/
  layout.tsx              Root layout (fonts, cart provider)
  globals.css              Design tokens (colors, type, signature styles)
  (site)/                  Storefront route group (shares Navbar/Footer)
    page.tsx                Home
    collections/             Collection index + [slug] listing pages
    products/                All-products (filter/sort) + [slug] detail
    cart/                    Cart page
    about/, contact/
  admin/                    Admin dashboard (separate shell, no storefront nav)
    layout.tsx               Sidebar shell
    page.tsx                  Analytics overview (KPIs + charts)
    orders/                   Orders table (search + status filter)
    products/                 Products table (search + remove row)
    customers/                Customers table (search)

components/                 Storefront UI (Navbar, Footer, ProductCard, Hero, CartDrawer, ...)
components/admin/           Admin UI (Sidebar, TopBar, KpiCard, charts, StatusBadge)

lib/
  types.ts                  Shared TypeScript types
  data.ts                   Mock products, collections, orders, customers, analytics
  cart-context.tsx           Cart state (add/remove/qty, drawer open state)
```

## Design system

Defined in `app/globals.css`:

- **Palette**: cream base, blush pink, deep plum/rose accents, muted gold,
  sage green — named as CSS variables (`--color-plum`, `--color-rose`, etc.)
  and exposed to Tailwind via `@theme inline`.
- **Type**: Fraunces (display serif, used italic for editorial moments) +
  Sora (body sans), loaded via a Google Fonts `<link>` tag in `app/layout.tsx`.
- **Signature elements**: a dashed "stitch" divider (`.stitch-divider`) and a
  scalloped section edge (`.scallop-top`) that nod to ribbon and gift-box
  packaging without leaning on stock icons or photography.
- Product "photos" are gradient tiles with a category icon
  (`components/ProductVisual.tsx`) — placeholders standing in for real
  product photography, so nothing here is a scraped or copied image.

## Next steps to make this a real store

1. **Swap mock data for a database** (e.g. Postgres + Prisma, or Shopify's
   own Storefront/Admin APIs) — replace the functions in `lib/data.ts` with
   real fetches.
2. **Real product photography** — swap `ProductVisual` for `next/image` once
   you have real assets.
3. **Auth** for `/admin` (e.g. NextAuth) — it's currently open to anyone who
   navigates to the URL.
4. **Checkout + payments** (Razorpay/Stripe) — the cart page has a
   "Checkout" button that's UI-only right now.
5. **Persist the cart** (localStorage or a server-side cart) so it survives
   a refresh.
