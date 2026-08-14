"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import ProductVisual from "./ProductVisual";
import { useCart } from "@/lib/cart-context";
import { Plus } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="group relative flex flex-col hover-lift">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] rounded-2xl">
          <ProductVisual
            image={product.image}
            gradient={product.gradient}
            className="h-full w-full rounded-2xl"
          />
          {product.badge && (
            <span
              className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide text-white shadow-sm ${
                product.badge === "Sale"
                  ? "bg-rose"
                  : product.badge === "New"
                  ? "bg-sage"
                  : product.badge === "Sold out"
                  ? "bg-ink-soft"
                  : "bg-gold"
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link href={`/products/${product.slug}`}>
            <h3 className="truncate font-display text-[15px] text-ink hover:text-plum">
              {product.name}
            </h3>
          </Link>
          <div className="mt-1 flex items-baseline gap-2 text-sm">
            <span className="font-medium text-plum">₹{product.price.toLocaleString("en-IN")}</span>
            {product.compareAt && (
              <span className="text-ink-soft/60 line-through">
                ₹{product.compareAt.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => !product.soldOut && addItem(product)}
          disabled={product.soldOut}
          aria-label={product.soldOut ? "Sold out" : `Add ${product.name} to cart`}
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-plum/20 bg-white text-plum transition-colors hover:bg-plum hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-plum"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
