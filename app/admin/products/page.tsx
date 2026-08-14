"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import TopBar from "@/components/admin/TopBar";
import ProductVisual from "@/components/ProductVisual";
import { products as initialProducts } from "@/lib/data";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      ),
    [products, query]
  );

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      <TopBar title="Products" subtitle={`${products.length} products in catalog`} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products or category..."
          className="w-64 rounded-full border border-plum/20 bg-white px-4 py-2 text-sm outline-none focus:border-plum"
        />
        <button className="flex items-center gap-2 rounded-full bg-plum px-4 py-2 text-sm font-medium text-white hover:bg-plum-deep">
          <Plus className="h-4 w-4" />
          Add product
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-plum/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-plum/10 text-xs text-ink-soft">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium">Rating</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-plum/5 last:border-0 hover:bg-blush-soft/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <ProductVisual image={p.image} gradient={p.gradient} className="h-10 w-10 rounded-lg" />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-ink-soft">{p.category}</td>
                <td className="px-5 py-3">₹{p.price.toLocaleString("en-IN")}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.stock === 0
                        ? "bg-rose/10 text-rose"
                        : p.stock <= 15
                        ? "bg-gold/15 text-gold"
                        : "bg-sage/10 text-sage"
                    }`}
                  >
                    {p.stock === 0 ? "Out of stock" : `${p.stock} in stock`}
                  </span>
                </td>
                <td className="px-5 py-3 text-ink-soft">{p.rating}★ ({p.reviews})</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-blush-soft"
                      aria-label={`Edit ${p.name}`}
                    >
                      <Pencil className="h-3.5 w-3.5 text-ink-soft" />
                    </button>
                    <button
                      onClick={() => removeProduct(p.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-rose/10"
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-ink-soft">
                  No products match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
