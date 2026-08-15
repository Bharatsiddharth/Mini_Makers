"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Search, ShoppingBag, User, LogOut } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { apiFetchWithFallback } from "@/lib/api";
import { Collection } from "@/lib/types";
import { collections as fallbackCollections } from "@/lib/data";

const navLinks = [
  { href: "/collections", label: "Collections" },
  { href: "/products", label: "All Products" },
  { href: "/about", label: "Our Story" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>(fallbackCollections);
  const { count, open } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    apiFetchWithFallback<Collection[]>("/collections/", fallbackCollections)
      .then((data) => setCollections(data.length ? data : fallbackCollections))
      .catch(() => setCollections(fallbackCollections));
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-plum/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-blush-soft md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="font-display text-xl tracking-tight text-plum sm:text-2xl">
          mini makers
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <div className="group relative">
            <button className="text-sm font-medium text-ink hover:text-plum">Collections</button>
            <div className="invisible absolute left-1/2 top-full grid w-[560px] -translate-x-1/2 grid-cols-2 gap-x-6 gap-y-2 rounded-2xl border border-plum/10 bg-white p-4 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100">
              {collections.map((c) => (
                <Link
                  key={c.slug}
                  href={`/collections/${c.slug}`}
                  className="rounded-lg px-3 py-2 text-sm text-ink hover:bg-blush-soft hover:text-plum"
                >
                  {c.name}
                  <span className="block text-xs text-ink-soft">{c.tagline}</span>
                </Link>
              ))}
            </div>
          </div>
          <Link href="/products" className="text-sm font-medium text-ink hover:text-plum">
            All Products
          </Link>
          <Link href="/about" className="text-sm font-medium text-ink hover:text-plum">
            Our Story
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <button
            className="hidden h-9 w-9 items-center justify-center rounded-full hover:bg-blush-soft sm:flex"
            aria-label="Search"
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          {user ? (
            <>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className="hidden h-9 w-9 items-center justify-center rounded-full hover:bg-blush-soft sm:flex"
                  aria-label="Admin dashboard"
                  title="Admin dashboard"
                >
                  <User className="h-4.5 w-4.5" />
                </Link>
              )}
              <button
                onClick={logout}
                className="hidden h-9 w-9 items-center justify-center rounded-full hover:bg-blush-soft sm:flex"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden h-9 w-9 items-center justify-center rounded-full hover:bg-blush-soft sm:flex"
              aria-label="Sign in"
              title="Sign in"
            >
              <User className="h-4.5 w-4.5" />
            </Link>
          )}

          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-blush-soft"
            onClick={open}
            aria-label="Open cart"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose text-[10px] font-medium text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-plum/10 bg-cream px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink hover:bg-blush-soft"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink hover:bg-blush-soft"
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="rounded-lg px-2 py-2.5 text-left text-sm font-medium text-ink hover:bg-blush-soft"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink hover:bg-blush-soft"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}