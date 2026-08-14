import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

export default function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta: number;
  icon: LucideIcon;
}) {
  const positive = delta >= 0;
  return (
    <div className="rounded-2xl border border-plum/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft">{label}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blush-soft text-plum">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
      </div>
      <p className="mt-3 font-display text-2xl text-ink">{value}</p>
      <div
        className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${
          positive ? "text-sage" : "text-rose"
        }`}
      >
        {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
        {Math.abs(delta)}% vs last week
      </div>
    </div>
  );
}
