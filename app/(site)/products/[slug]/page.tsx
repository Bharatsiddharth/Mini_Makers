"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Star, Truck, Undo2, ShieldCheck } from "lucide-react";
import { apiFetchWithFallback } from "@/lib/api";
import { Product } from "@/lib/types";
import { getProductBySlug, getProductsByCollection } from "@/lib/data";
import ProductVisual from "@/components/ProductVisual";
import ProductCard from "@/components/ProductCard";
import AddToCartPanel from "@/components/AddToCartPanel";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const fallbackProduct = getProductBySlug(slug);
  const fallbackRelatedInitial = fallbackProduct
    ? getProductsByCollection(fallbackProduct.collectionSlugs[0] || "")
        .filter((fp) => fp.id !== fallbackProduct.id)
        .slice(0, 4)
    : [];
  const [product, setProduct] = useState<Product | null>(fallbackProduct ?? null);
  const [related, setRelated] = useState<Product[]>(fallbackRelatedInitial);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fbProduct = getProductBySlug(slug);
    const fbRelated = fbProduct
      ? getProductsByCollection(fbProduct.collectionSlugs[0] || "")
          .filter((fp) => fp.id !== fbProduct.id)
          .slice(0, 4)
      : [];

    let chosenId = "";
    apiFetchWithFallback<Product>(`/products/${slug}/`, fbProduct as Product)
      .then((p) => {
        const chosen = p && (p as any).id ? p : fbProduct;
        setProduct(chosen ?? null);
        chosenId = chosen?.id ?? "";
        const category = chosen ? chosen.category : undefined;
        return apiFetchWithFallback<Product[]>(`/products/?category=${category || ""}`, fbRelated);
      })
      .then((prods) => {
        const list = prods && Array.isArray(prods) && prods.length ? prods : fbRelated;
        setRelated(list.filter((rp) => rp.id !== chosenId).slice(0, 4));
      })
      .catch((err) => {
        console.error("Failed to load product:", err);
        if (!fbProduct) notFound();
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-plum border-t-transparent" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-1 text-xs text-ink-soft">
        <Link href="/products" className="hover:text-plum">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductVisual
          image={product.image}
          gradient={product.gradient}
          className="aspect-square w-full rounded-3xl"
        />

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-rose">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
            <div className="flex items-center gap-0.5 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5"
                  fill={i < Math.round(product.rating) ? "currentColor" : "none"}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span>{product.rating} ({product.reviews} reviews)</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-display text-2xl text-plum">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.compareAt && (
              <span className="text-ink-soft/60 line-through">
                ₹{product.compareAt.toLocaleString("en-IN")}
              </span>
            )}
            {product.compareAt && (
              <span className="rounded-full bg-rose/10 px-2 py-0.5 text-xs font-medium text-rose">
                Save ₹{(product.compareAt - product.price).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <AddToCartPanel product={product} />

          <div className="stitch-divider my-8" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-2.5">
              <Truck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-plum" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium">Free shipping</p>
                <p className="text-xs text-ink-soft">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Undo2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-plum" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium">7-day returns</p>
                <p className="text-xs text-ink-soft">Easy exchange on all items</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-plum" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium">Quality checked</p>
                <p className="text-xs text-ink-soft">Every piece inspected by hand</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 font-display text-2xl">You might also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}