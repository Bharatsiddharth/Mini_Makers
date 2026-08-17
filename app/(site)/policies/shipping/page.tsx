import { Truck } from "lucide-react";

export const metadata = { title: "Shipping Policy — mini makers" };

export default function ShippingPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Truck className="h-6 w-6 text-gold" />
      <h1 className="mt-4 font-display text-4xl italic text-plum">Shipping policy</h1>
      <div className="mt-6 space-y-6 text-ink-soft leading-relaxed">
        <p>
          Every order is packed by hand at our studio, so please allow 1–2 business
          days for us to prepare your gift before it ships. You&apos;ll get a
          confirmation email the moment your order is placed, and another once it
          leaves us.
        </p>

        <div>
          <h2 className="font-display text-xl text-ink">Delivery timelines</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Metro cities: 2–4 business days after dispatch</li>
            <li>Rest of India: 4–7 business days after dispatch</li>
            <li>Custom or made-to-order pieces may take 1–2 extra days to prepare</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl text-ink">Shipping charges</h2>
          <p className="mt-2">
            We offer free shipping on prepaid orders above ₹999. Orders below this
            amount, and all Cash on Delivery orders, carry a flat shipping fee shown
            at checkout before you confirm payment.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl text-ink">Tracking your order</h2>
          <p className="mt-2">
            Once your order ships, you can track its status any time from{" "}
            <span className="text-plum">My orders</span> in your account. You&apos;ll
            also get a shipping confirmation email with tracking details, where
            available.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl text-ink">Delays</h2>
          <p className="mt-2">
            Occasionally, weather, courier network issues, or high festive-season
            volume can push delivery beyond the estimates above. If your order is
            running late, reach out to us and we&apos;ll look into it right away.
          </p>
        </div>

        <p>
          Questions about a specific order? <a href="/contact" className="text-plum hover:underline">Contact us</a> and
          we&apos;ll help sort it out.
        </p>
      </div>
    </section>
  );
}
