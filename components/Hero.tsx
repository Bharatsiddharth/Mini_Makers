import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blush-soft to-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
        <div className="order-2 lg:order-1">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-rose">
            Free shipping over ₹999
          </p>
          <h1 className="font-display text-4xl leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
            Gifts that feel
            <br />
            <span className="italic text-plum">handpicked</span>, always.
          </h1>
          <p className="mt-5 max-w-md text-ink-soft">
            Curated hampers, everyday jewelry, and little keepsakes — wrapped
            like you made the trip to find them yourself.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/collections/hampers"
              className="inline-flex items-center gap-2 rounded-full bg-plum px-6 py-3 text-sm font-medium text-white hover:bg-plum-deep"
            >
              Shop hampers
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-plum/20 bg-white px-6 py-3 text-sm font-medium text-plum hover:bg-blush-soft"
            >
              Browse everything
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
            <div>
              <p className="font-display text-2xl text-plum">2,000+</p>
              <p className="text-xs text-ink-soft">happy customers</p>
            </div>
            <div>
              <p className="font-display text-2xl text-plum">28</p>
              <p className="text-xs text-ink-soft">states delivered to</p>
            </div>
            <div>
              <p className="font-display text-2xl text-plum">4.7★</p>
              <p className="text-xs text-ink-soft">average rating</p>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-4 rounded-[2.5rem] bg-gradient-to-br from-rose via-plum to-plum-deep opacity-90 shadow-2xl" />
            <div className="absolute inset-4 rounded-[2.5rem] bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.35),transparent_45%)]" />
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-gold/80 shadow-lg sm:h-28 sm:w-28" />
            <div className="absolute -bottom-6 -right-4 h-20 w-20 rotate-12 rounded-2xl bg-blush shadow-lg sm:h-24 sm:w-24" />
          </div>
        </div>
      </div>
      <div className="h-6 w-full bg-cream scallop-top" />
    </section>
  );
}