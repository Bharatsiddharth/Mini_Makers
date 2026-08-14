import Link from "next/link";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  viewAllHref,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  viewAllHref?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.18em] text-rose">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl text-ink sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-sm font-medium text-plum underline decoration-plum/30 underline-offset-4 hover:decoration-plum"
        >
          View all
        </Link>
      )}
    </div>
  );
}
