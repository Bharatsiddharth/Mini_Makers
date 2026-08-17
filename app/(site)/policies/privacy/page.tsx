import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Privacy Policy — mini makers" };

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <ShieldCheck className="h-6 w-6 text-gold" />
      <h1 className="mt-4 font-display text-4xl italic text-plum">Privacy policy</h1>
      <div className="mt-6 space-y-6 text-ink-soft leading-relaxed">
        <p>
          This policy explains what information we collect when you shop with mini
          makers, how we use it, and the choices you have.
        </p>

        <div>
          <h2 className="font-display text-xl text-ink">Information we collect</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>Account details you provide — name, email, phone, shipping address</li>
            <li>Order history and cart contents tied to your account</li>
            <li>
              Basic visit data (like which page referred you to us) used to
              understand how people find the store
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl text-ink">How we use it</h2>
          <p className="mt-2">
            We use your information to process and ship orders, send order and
            shipping confirmation emails, respond to support requests, and improve
            the store. We don&apos;t sell your personal information to third parties.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl text-ink">Payment information</h2>
          <p className="mt-2">
            We don&apos;t store your card or payment details ourselves — payments are
            processed securely by our payment partner, and Cash on Delivery orders
            involve no card details at all.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl text-ink">Cookies</h2>
          <p className="mt-2">
            We use essential cookies to keep you signed in and to remember your
            cart. We don&apos;t use third-party advertising trackers.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl text-ink">Your choices</h2>
          <p className="mt-2">
            You can review or update your account details at any time, and you can
            reach out to request a copy or deletion of your data, subject to what
            we&apos;re required to keep for order and tax records.
          </p>
        </div>

        <p>
          Questions about this policy? <a href="/contact" className="text-plum hover:underline">Contact us</a> —
          we&apos;re happy to walk through it with you.
        </p>
      </div>
    </section>
  );
}
