import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import ProductRow from "@/components/ProductRow";
import CollectionGrid from "@/components/CollectionGrid";
import Link from "next/link";
import { collections, homeSections, getProductsByCollection } from "@/lib/data";
import { Sparkle } from "lucide-react";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Trending"
          title="Our viral edit"
          subtitle="The pieces our customers keep re-ordering"
          viewAllHref="/collections/hampers"
        />
        <ProductRow products={getProductsByCollection("hampers")} />
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="stitch-divider" />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Browse"
          title="Shop by collection"
          subtitle="Every category, one tap away"
        />
        <CollectionGrid collections={collections} />
      </section>

      {homeSections.map((section) => (
        <section key={section.collectionSlug} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            title={section.title}
            subtitle={section.subtitle}
            viewAllHref={`/collections/${section.collectionSlug}`}
          />
          <ProductRow products={getProductsByCollection(section.collectionSlug)} />
        </section>
      ))}

      <section className="bg-plum">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <Sparkle className="h-6 w-6 text-gold" />
            <h2 className="mt-4 font-display text-3xl italic text-white sm:text-4xl">
              Our story
            </h2>
            <p className="mt-4 max-w-lg text-blush-soft/90">
              mini makers began with a simple dream — to make every gift feel personal,
              memorable, and full of heart. What started as one person hand-wrapping boxes
              at a kitchen table has grown into a small studio serving thousands of
              customers across the country, one thoughtfully packed order at a time.
            </p>
            <p className="mt-3 max-w-lg text-blush-soft/90">
              Whether it's a birthday, a festival, or just a Tuesday that deserves
              celebrating — we help you say it beautifully.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-plum hover:bg-blush-soft"
            >
              Read more
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {["2,000+", "28", "4.7★"].map((stat, i) => (
              <div key={i} className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur-sm sm:p-5">
                <p className="font-display text-xl text-white sm:text-2xl">{stat}</p>
                <p className="mt-1 text-[10px] text-blush-soft/80 sm:text-xs">
                  {i === 0 ? "happy customers" : i === 1 ? "states delivered" : "avg. rating"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}