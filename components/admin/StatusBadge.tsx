const STYLES: Record<string, string> = {
  Pending: "bg-gold/15 text-gold",
  Cancelled: "bg-rose/15 text-rose",
  Fulfilled: "bg-sage/15 text-sage",
  Shipped: "bg-plum/10 text-plum",
  Refunded: "bg-rose/10 text-rose",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status] ?? "bg-ink-soft/10 text-ink-soft"}`}>
      {status}
    </span>
  );
}
