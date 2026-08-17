import { Undo2 } from "lucide-react";

export const metadata = { title: "Refund Policy — mini makers" };

export default function RefundPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Undo2 className="h-6 w-6 text-gold" />
      <h1 className="mt-4 font-display text-4xl italic text-plum">Refund &amp; return policy</h1>
      <div className="mt-6 space-y-6 text-ink-soft leading-relaxed">
        <p>
          We want you to love what arrives. If something isn&apos;t right, here&apos;s how
          we handle returns, replacements, and refunds.
        </p>

        <div>
          <h2 className="font-display text-xl text-ink">Eligibility for return</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Request a return within 7 days of delivery</li>
            <li>Item must be unused, unworn, and in its original packaging</li>
            <li>
              Custom, personalized, or made-to-order items (including bespoke
              packaging) are final sale and not eligible for return, unless the
              piece arrives damaged or defective
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl text-ink">Damaged or incorrect items</h2>
          <p className="mt-2">
            If your order arrives damaged, defective, or different from what you
            ordered, contact us within 48 hours of delivery with a photo of the item
            and its packaging. We&apos;ll arrange a free replacement or a full refund —
            your choice.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl text-ink">How refunds work</h2>
          <p className="mt-2">
            Once we receive and inspect a returned item, we&apos;ll notify you by email.
            Approved refunds are issued to your original payment method and
            typically reflect within 5–7 business days, depending on your bank or
            payment provider. Cash on Delivery orders are refunded via bank transfer
            or store credit.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl text-ink">Cancellations</h2>
          <p className="mt-2">
            Orders can be cancelled free of charge as long as they&apos;re still marked{" "}
            <span className="font-medium text-ink">Pending</span> — before we&apos;ve
            started packing. Once an order has moved to processing or shipped, it
            can no longer be cancelled but may still be eligible for a return under
            the terms above.
          </p>
        </div>

        <p>
          Need to start a return or have a question about your order?{" "}
          <a href="/contact" className="text-plum hover:underline">Contact us</a> with
          your order number and we&apos;ll take it from there.
        </p>
      </div>
    </section>
  );
}
