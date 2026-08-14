export const metadata = { title: "Contact — mini makers" };

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl">Contact us</h1>
      <p className="mt-2 text-ink-soft">We usually reply within a day.</p>
      <form className="mt-8 flex flex-col gap-4">
        <input
          placeholder="Your name"
          className="rounded-xl border border-plum/15 bg-white px-4 py-3 text-sm outline-none focus:border-plum"
        />
        <input
          placeholder="Email address"
          type="email"
          className="rounded-xl border border-plum/15 bg-white px-4 py-3 text-sm outline-none focus:border-plum"
        />
        <textarea
          placeholder="How can we help?"
          rows={5}
          className="rounded-xl border border-plum/15 bg-white px-4 py-3 text-sm outline-none focus:border-plum"
        />
        <button className="self-start rounded-full bg-plum px-6 py-3 text-sm font-medium text-white hover:bg-plum-deep">
          Send message
        </button>
      </form>
    </section>
  );
}
