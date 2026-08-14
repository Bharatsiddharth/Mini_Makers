import { Sparkle } from "lucide-react";

export const metadata = { title: "Our Story — mini makers" };

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Sparkle className="h-6 w-6 text-gold" />
      <h1 className="mt-4 font-display text-4xl italic text-plum">Our story</h1>
      <div className="mt-6 space-y-4 text-ink-soft leading-relaxed">
        <p>
          mini makers began with a simple dream — to make every gift feel personal,
          memorable, and full of heart. What started as one person hand-wrapping boxes
          at a kitchen table has grown into a small studio serving thousands of
          customers across the country.
        </p>
        <p>
          Every hamper is packed by hand, every note card cut and folded on-site, and
          every jewelry piece checked twice before it leaves us. We believe the best
          gifts aren&apos;t the most expensive ones — they&apos;re the ones that show someone
          you paid attention.
        </p>
        <p>
          Whether you&apos;re celebrating a relationship, a friendship, or a Tuesday that
          deserves marking — we&apos;re glad you&apos;re here with us.
        </p>
      </div>
    </section>
  );
}
