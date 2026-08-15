"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import { apiFetchWithFallback } from "@/lib/api";
import { Collection } from "@/lib/types";
import { collections as fallbackCollections } from "@/lib/data";
import Link from "next/link";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>(fallbackCollections);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetchWithFallback<Collection[]>("/collections/", fallbackCollections)
      .then((data) => setCollections(data.length ? data : fallbackCollections))
      .catch((err) => console.error("Failed to load collections:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-plum border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Browse" title="All collections" subtitle="Find your category" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {collections.map((c) => (
          <Link key={c.slug} href={`/collections/${c.slug}`} className="group hover-lift">
            <div
              className="relative aspect-[4/5] rounded-2xl"
              style={{ backgroundImage: `linear-gradient(150deg, ${c.gradient[0]}, ${c.gradient[1]})` }}
            >
              <div className="absolute inset-0 flex flex-col justify-end rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent p-4">
                <p className="font-display text-lg text-white">{c.name}</p>
                <p className="text-xs text-white/80">{c.tagline}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}