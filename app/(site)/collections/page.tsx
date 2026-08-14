import SectionHeading from "@/components/SectionHeading";
import { collections } from "@/lib/data";
import Link from "next/link";

export const metadata = { title: "Collections — mini makers" };

export default function CollectionsPage() {
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
