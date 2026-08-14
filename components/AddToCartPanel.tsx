"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

export default function AddToCartPanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  if (product.soldOut) {
    return (
      <div className="mt-6">
        <button
          disabled
          className="w-full cursor-not-allowed rounded-full bg-ink-soft/30 px-6 py-3.5 text-sm font-medium text-ink-soft sm:w-auto sm:min-w-64"
        >
          Sold out
        </button>
        <p className="mt-2 text-xs text-ink-soft">
          This one&apos;s out of stock — check back soon or explore similar pieces below.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-full border border-plum/20">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex h-11 w-11 items-center justify-center text-plum hover:bg-blush-soft"
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-8 text-center text-sm">{qty}</span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="flex h-11 w-11 items-center justify-center text-plum hover:bg-blush-soft"
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <button
        onClick={() => addItem(product, qty)}
        className="min-w-64 flex-1 rounded-full bg-plum px-6 py-3.5 text-sm font-medium text-white hover:bg-plum-deep sm:flex-none"
      >
        Add to bag — ₹{(product.price * qty).toLocaleString("en-IN")}
      </button>
    </div>
  );
}
