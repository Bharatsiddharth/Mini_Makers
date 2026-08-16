"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import TopBar from "@/components/admin/TopBar";
import ProductVisual from "@/components/ProductVisual";
import { apiFetch, apiFetchWithFallback } from "@/lib/api";
import { Product } from "@/lib/types";
import { products as fallbackProducts } from "@/lib/data";

const EMPTY_FORM = {
  name: "",
  slug: "",
  price: "",
  compare_at: "",
  category: "",
  description: "",
  stock: "0",
  image_key: "box",
  badge: "",
  collection_slugs: [] as string[],
};

type ProductForm = typeof EMPTY_FORM;

const BADGE_OPTIONS = ["", "Sale", "New", "Bestseller", "Sold out"];
const COLLECTION_SLUGS = [
  "hampers", "pendants", "bracelets", "earrings", "jhumkas",
  "rings", "keychains", "scrunchies", "claw-clips", "packaging",
];
const IMAGE_KEYS = ["box", "hamper", "pendant", "bracelet", "earring", "jhumka", "ring", "keychain", "scrunchie", "clip", "card"];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetchWithFallback<Product[]>("/products/", fallbackProducts)
      .then((data) => setProducts(data.length ? data : fallbackProducts))
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      ),
    [products, query]
  );

  const removeProduct = async (id: string) => {
    if (!confirm("Delete this product from the catalog?")) return;
    try {
      await apiFetch(`/products/${id}/`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.slug !== id && p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Check that you're logged in as an admin.");
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (p: Product) => {
    setEditingId(p.slug);
    setForm({
      name: p.name,
      slug: p.slug,
      price: String(p.price),
      compare_at: p.compareAt ? String(p.compareAt) : "",
      category: p.category,
      description: p.description,
      stock: String(p.stock),
      image_key: p.image,
      badge: p.badge ?? "",
      collection_slugs: p.collectionSlugs,
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const slug = form.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (!slug) {
        setFormError("Slug is required (auto-generated from name if left blank).");
        return;
      }
      const payload = {
        slug,
        name: form.name.trim(),
        price: form.price,
        compare_at: form.compare_at || null,
        category: form.category.trim(),
        image_key: form.image_key,
        gradient_start: "#f1cdd2",
        gradient_end: "#7a2b3f",
        badge: form.badge,
        description: form.description,
        stock: Number(form.stock) || 0,
        rating: "4.5",
        reviews_count: 0,
        collection_slugs: form.collection_slugs,
      };

      if (editingId) {
        await apiFetch(`/products/${editingId}/`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/products/", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      // Refresh the list from Supabase
      const data = await apiFetchWithFallback<Product[]>("/products/", fallbackProducts);
      setProducts(data.length ? data : fallbackProducts);
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-plum border-t-transparent" />
      </div>
    );
  }

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
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 rounded-full bg-plum px-4 py-2 text-sm font-medium text-white hover:bg-plum-deep"
        >
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
              <tr key={p.slug} className="border-b border-plum/5 last:border-0 hover:bg-blush-soft/40">
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
                      onClick={() => openEditForm(p)}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-blush-soft"
                      aria-label={`Edit ${p.name}`}
                    >
                      <Pencil className="h-3.5 w-3.5 text-ink-soft" />
                    </button>
                    <button
                      onClick={() => removeProduct(p.slug)}
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-xl">{editingId ? "Edit product" : "Add product"}</h2>
              <button
                onClick={() => setShowForm(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-blush-soft"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-xl bg-rose/10 px-4 py-3 text-sm text-rose">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink">Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setForm((f) => ({
                        ...f,
                        name,
                        slug: editingId ? f.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                      }));
                    }}
                    className="w-full rounded-xl border border-plum/20 bg-cream/50 px-3 py-2 text-sm outline-none focus:border-plum"
                    placeholder="Amber Bloom Hamper"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink">Slug / URL</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    className="w-full rounded-xl border border-plum/20 bg-cream/50 px-3 py-2 text-sm outline-none focus:border-plum"
                    placeholder="amber-bloom-hamper"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink">Price (₹) *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full rounded-xl border border-plum/20 bg-cream/50 px-3 py-2 text-sm outline-none focus:border-plum"
                    placeholder="1899"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink">Compare-at</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.compare_at}
                    onChange={(e) => setForm((f) => ({ ...f, compare_at: e.target.value }))}
                    className="w-full rounded-xl border border-plum/20 bg-cream/50 px-3 py-2 text-sm outline-none focus:border-plum"
                    placeholder="2399"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink">Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    className="w-full rounded-xl border border-plum/20 bg-cream/50 px-3 py-2 text-sm outline-none focus:border-plum"
                    placeholder="18"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink">Category *</label>
                  <input
                    required
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-xl border border-plum/20 bg-cream/50 px-3 py-2 text-sm outline-none focus:border-plum"
                    placeholder="Hampers"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink">Badge</label>
                  <select
                    value={form.badge}
                    onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                    className="w-full rounded-xl border border-plum/20 bg-cream/50 px-3 py-2 text-sm outline-none focus:border-plum"
                  >
                    {BADGE_OPTIONS.map((b) => (
                      <option key={b || "none"} value={b}>
                        {b || "None"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-ink">Image key</label>
                <div className="flex flex-wrap gap-1.5">
                  {IMAGE_KEYS.map((key) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setForm((f) => ({ ...f, image_key: key }))}
                      className={`rounded-full border px-2.5 py-1 text-xs ${
                        form.image_key === key
                          ? "border-plum bg-plum text-white"
                          : "border-plum/20 bg-white text-ink-soft hover:bg-blush-soft"
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-ink">Collections</label>
                <div className="flex flex-wrap gap-1.5">
                  {COLLECTION_SLUGS.map((slug) => (
                    <button
                      type="button"
                      key={slug}
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          collection_slugs: f.collection_slugs.includes(slug)
                            ? f.collection_slugs.filter((s) => s !== slug)
                            : [...f.collection_slugs, slug],
                        }))
                      }
                      className={`rounded-full border px-2.5 py-1 text-xs ${
                        form.collection_slugs.includes(slug)
                          ? "border-plum bg-plum text-white"
                          : "border-plum/20 bg-white text-ink-soft hover:bg-blush-soft"
                      }`}
                    >
                      {slug}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-ink">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-xl border border-plum/20 bg-cream/50 px-3 py-2 text-sm outline-none focus:border-plum"
                  placeholder="A layered keepsake box with a scented candle..."
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-plum px-6 py-3 text-sm font-medium text-white hover:bg-plum-deep disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Save changes" : "Create product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}