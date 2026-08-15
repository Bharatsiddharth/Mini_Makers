"use client";

import { useEffect, useMemo, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import { apiFetchWithFallback } from "@/lib/api";
import { Product, Collection } from "@/lib/types";
import { products as fallbackProducts, collections as fallbackCollections } from "@/lib/data";

const SORTS = ["Featured", "Price: low to high", "Price: high to low"] as const;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [collections, setCollections] = useState<Collection[]>(fallbackCollections);
  const [activeCollection, setActiveCollection] = useState<string>("all");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Featured");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetchWithFallback<Product[]>("/products/", fallbackProducts),
      apiFetchWithFallback<Collection[]>("/collections/", fallbackCollections),
    ])
      .then(([prods, colls]) => {
        setProducts(prods.length ? prods : fallbackProducts);
        setCollections(colls.length ? colls : fallbackCollections);
      })
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list =
      activeCollection === "all"
        ? products
        : products.filter((p) => p.collectionSlugs.includes(activeCollection));
    list = [...list];
    if (sort === "Price: low to high") list.sort((a, b) => a.price - b.price);
    if (sort === "Price: high to low") list.sort((a, b) => b.price - a.price);
    return list;
  }, [activeCollection, sort, products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-plum border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Shop" title="All products" subtitle={`${filtered.length} items`} />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCollection("all")}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${
              activeCollection === "all"
                ? "border-plum bg-plum text-white"
                : "border-plum/20 bg-white text-ink-soft hover:bg-blush-soft"
            }`}
          >
            All
          </button>
          {collections.map((c) => (
            <button
              key={c.slug}
              onClick={() => setActiveCollection(c.slug)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${
                activeCollection === c.slug
                  ? "border-plum bg-plum text-white"
                  : "border-plum/20 bg-white text-ink-soft hover:bg-blush-soft"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
          className="rounded-full border border-plum/20 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-soft outline-none"
        >
          {SORTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}