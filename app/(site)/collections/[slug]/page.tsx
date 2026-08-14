import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { collections, getCollectionBySlug, getProductsByCollection } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();
  const items = getProductsByCollection(slug);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-1 text-xs text-ink-soft">
        <Link href="/collections" className="hover:text-plum">Collections</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink">{collection.name}</span>
      </div>

      <div
        className="mb-10 flex items-end rounded-3xl px-6 py-12 sm:px-10"
        style={{ backgroundImage: `linear-gradient(140deg, ${collection.gradient[0]}, ${collection.gradient[1]})` }}
      >
        <div>
          <h1 className="font-display text-3xl text-white sm:text-4xl">{collection.name}</h1>
          <p className="mt-2 text-white/85">{collection.tagline}</p>
          <p className="mt-1 text-sm text-white/70">{items.length} items</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-ink-soft">No products in this collection yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
