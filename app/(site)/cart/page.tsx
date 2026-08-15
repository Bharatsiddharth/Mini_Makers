"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, getAccessToken } from "@/lib/api";
import ProductVisual from "@/components/ProductVisual";
import { Minus, Plus, X, ShoppingBag, Loader2 } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { lines, setQty, removeItem, subtotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 79;

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login?redirect=/cart");
      return;
    }
    if (!getAccessToken()) return;
    setCheckingOut(true);
    setError("");
    try {
      await apiFetch("/cart/checkout/", {
        method: "POST",
        body: JSON.stringify({}),
      });
      // Clear local cart after checkout
      localStorage.removeItem("petal_cart");
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (lines.length === 0) {
    return (
      <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="h-12 w-12 text-plum/30" strokeWidth={1.5} />
        <h1 className="mt-4 font-display text-2xl">Your bag is empty</h1>
        <p className="mt-2 text-ink-soft">Let's find something worth wrapping.</p>
        <Link
          href="/products"
          className="mt-6 rounded-full bg-plum px-6 py-3 text-sm font-medium text-white hover:bg-plum-deep"
        >
          Browse products
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl">Your bag</h1>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-10">
        <ul className="flex flex-col gap-4 sm:gap-5 lg:col-span-2">
          {lines.map(({ product, qty }) => (
            <li key={product.id} className="flex gap-3 rounded-2xl border border-plum/10 bg-white p-3 sm:gap-4 sm:p-4">
              <Link href={`/products/${product.slug}`} className="shrink-0">
                <ProductVisual
                  image={product.image}
                  gradient={product.gradient}
                  className="h-20 w-20 rounded-xl sm:h-24 sm:w-24"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link href={`/products/${product.slug}`}>
                      <p className="truncate font-display text-sm hover:text-plum sm:text-base">
                        {product.name}
                      </p>
                    </Link>
                    <p className="text-xs text-ink-soft">{product.category}</p>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="shrink-0 text-ink-soft/60 hover:text-rose"
                    aria-label={`Remove ${product.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                  <div className="flex items-center rounded-full border border-plum/20">
                    <button
                      onClick={() => setQty(product.id, qty - 1)}
                      className="flex h-7 w-7 items-center justify-center text-plum hover:bg-blush-soft sm:h-8 sm:w-8"
                      aria-label={`Decrease quantity of ${product.name}`}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center text-sm sm:w-6">{qty}</span>
                    <button
                      onClick={() => setQty(product.id, qty + 1)}
                      className="flex h-7 w-7 items-center justify-center text-plum hover:bg-blush-soft sm:h-8 sm:w-8"
                      aria-label={`Increase quantity of ${product.name}`}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="font-medium text-plum">
                    ₹{(product.price * qty).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-2xl border border-plum/10 bg-white p-5 sm:p-6">
          <h2 className="font-display text-lg">Order summary</h2>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
          </div>
          <div className="stitch-divider my-4" />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>₹{(subtotal + shipping).toLocaleString("en-IN")}</span>
          </div>
          {error && (
            <div className="mt-3 rounded-xl bg-rose/10 px-4 py-2.5 text-xs text-rose">
              {error}
            </div>
          )}
          <button
            onClick={handleCheckout}
            disabled={checkingOut}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-plum px-6 py-3.5 text-sm font-medium text-white hover:bg-plum-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checkingOut && <Loader2 className="h-4 w-4 animate-spin" />}
            {checkingOut ? "Processing..." : user ? "Checkout" : "Sign in to checkout"}
          </button>
          <p className="mt-3 text-center text-xs text-ink-soft/70">
            {user
              ? "Checkout requires a signed-in account."
              : "You'll be asked to sign in to complete your order."}
          </p>
        </div>
      </div>
    </section>
  );
}