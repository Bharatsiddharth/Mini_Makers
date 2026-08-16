"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import ProductVisual from "./ProductVisual";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";

export default function CartDrawer() {
  const { lines, isOpen, close, setQty, removeItem, subtotal, count } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-plum/10 px-4 py-4 sm:px-5">
          <h2 className="font-display text-lg">Your bag ({count})</h2>
          <button
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-blush-soft"
            aria-label="Close cart"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-plum/30" strokeWidth={1.5} />
            <p className="text-ink-soft">Your bag is empty right now.</p>
            <button
              onClick={close}
              className="rounded-full bg-plum px-5 py-2 text-sm font-medium text-white hover:bg-plum-deep"
            >
              Keep browsing
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
              <ul className="flex flex-col gap-4">
                {lines.map(({ product, qty }) => (
                  <li key={product.id} className="flex gap-3">
                    <ProductVisual
                      image={product.image}
                      imageUrl={product.imageUrl}
                      gradient={product.gradient}
                      className="h-16 w-16 shrink-0 rounded-xl sm:h-20 sm:w-20"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-display text-sm leading-snug">{product.name}</p>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="shrink-0 text-ink-soft/60 hover:text-rose"
                          aria-label={`Remove ${product.name}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-sm text-plum">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                      <div className="mt-auto flex items-center gap-2 pt-2">
                        <button
                          onClick={() => setQty(product.id, qty - 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-plum/20 hover:bg-blush-soft"
                          aria-label={`Decrease quantity of ${product.name}`}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-4 text-center text-sm">{qty}</span>
                        <button
                          onClick={() => setQty(product.id, qty + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-plum/20 hover:bg-blush-soft"
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-plum/10 px-4 py-4 sm:px-5">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-ink-soft">Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <Link
                href="/cart"
                onClick={close}
                className="block w-full rounded-full bg-plum px-5 py-3 text-center text-sm font-medium text-white hover:bg-plum-deep"
              >
                View bag & checkout
              </Link>
              <p className="mt-2 text-center text-xs text-ink-soft/70">
                Free shipping on orders above ₹999
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}