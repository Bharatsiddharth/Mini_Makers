"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { apiFetchWithFallback } from "@/lib/api";
import { SalesByCategoryPoint } from "@/lib/types";
import { salesByCategory as fallbackSalesByCategory } from "@/lib/data";

const COLORS = ["#7a2b3f", "#b34a5c", "#c79a3e", "#77836a", "#e0d3ea"];

export default function CategoryPie() {
  const [data, setData] = useState<SalesByCategoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetchWithFallback<SalesByCategoryPoint[]>("/admin/analytics/categories/", fallbackSalesByCategory)
      .then(setData)
      .catch((err) => console.error("Failed to load sales by category:", err))
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
      <h3 className="font-display text-lg">Sales by category</h3>
      <p className="mb-2 text-xs text-ink-soft">Share of revenue, last 30 days</p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="category"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid rgba(122,43,63,0.15)", fontSize: 13 }}
            formatter={(value) => `${value}%`}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-xs text-ink-soft">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}