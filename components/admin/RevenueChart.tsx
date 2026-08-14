"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { revenueByDay } from "@/lib/data";

export default function RevenueChart() {
  return (
    <div className="rounded-2xl border border-plum/10 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg">Revenue this week</h3>
          <p className="text-xs text-ink-soft">Gross revenue by day, in ₹</p>
        </div>
        <span className="rounded-full bg-sage/10 px-2.5 py-1 text-xs font-medium text-sage">
          +12.4% WoW
        </span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={revenueByDay} margin={{ left: -18, right: 8, top: 8 }}>
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
