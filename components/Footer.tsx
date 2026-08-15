import Link from "next/link";
import { AtSign, MessageCircle, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-plum/10 bg-cream-deep">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="font-display text-xl text-plum">
              mini makers
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink-soft">
              Handpicked gifting for the people who notice the wrapping as much as what's inside.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Instagram" className="text-ink-soft hover:text-plum">
                <AtSign className="h-4.5 w-4.5" />
              </a>
              <a href="#" aria-label="WhatsApp" className="text-ink-soft hover:text-plum">
                <MessageCircle className="h-4.5 w-4.5" />
              </a>
              <a href="#" aria-label="Email" className="text-ink-soft hover:text-plum">
                <Mail className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm text-ink">Shop</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li><Link href="/collections" className="hover:text-plum">All collections</Link></li>
              <li><Link href="/products" className="hover:text-plum">All products</Link></li>
              <li><Link href="/collections/hampers" className="hover:text-plum">Gift hampers</Link></li>
              <li><Link href="/collections/pendants" className="hover:text-plum">Pendants</Link></li>
              <li><Link href="/collections/bracelets" className="hover:text-plum">Bracelets</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm text-ink">Help</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li><Link href="/contact" className="hover:text-plum">Contact us</Link></li>
              <li><Link href="/about" className="hover:text-plum">About us</Link></li>
              <li><Link href="/policies/shipping" className="hover:text-plum">Shipping policy</Link></li>
              <li><Link href="/policies/refunds" className="hover:text-plum">Refund policy</Link></li>
              <li><Link href="/policies/privacy" className="hover:text-plum">Privacy policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm text-ink">Stay in the loop</h3>
            <p className="mt-3 text-sm text-ink-soft">New drops, festive edits, and quiet sales.</p>
            <form className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full min-w-0 rounded-full border border-plum/15 bg-white px-4 py-2 text-sm outline-none focus:border-plum"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-plum px-4 py-2 text-sm font-medium text-white hover:bg-plum-deep"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="stitch-divider my-10" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-ink-soft sm:flex-row">
          <p>© 2026 mini makers. All rights reserved.</p>
          <p>Made with care, one gift at a time.</p>
        </div>
      </div>
    </footer>
  );
}