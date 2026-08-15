"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { apiFetchWithFallback } from "@/lib/api";
import { RevenueByDayPoint } from "@/lib/types";
import { revenueByDay as fallbackRevenue } from "@/lib/data";

export default function RevenueChart() {
  const [data, setData] = useState<RevenueByDayPoint[]>(fallbackRevenue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetchWithFallback<RevenueByDayPoint[]>("/admin/analytics/revenue/", fallbackRevenue)
      .then((newData) => setData(newData.length ? newData : fallbackRevenue))
      .catch((err) => console.error("Failed to load revenue chart:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-plum/10 bg-white p-5">
        <div className="flex h-[260px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-plum border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-plum/10 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg">Revenue this week</h3>
          <p className="text-xs text-ink-soft">Gross revenue by day, in ₹</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7a2b3f" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#7a2b3f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#7a2b3f" strokeOpacity={0.08} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: "#6b5f58" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b5f58" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(122,43,63,0.15)",
              fontSize: 13,
            }}
            formatter={(value, name) => [
              name === "revenue" ? `₹${Number(value).toLocaleString("en-IN")}` : String(value),
              name === "revenue" ? "Revenue" : "Orders",
            ]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#7a2b3f"
            strokeWidth={2}
            fill="url(#revFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}