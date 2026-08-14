"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { salesByCategory } from "@/lib/data";

const COLORS = ["#7a2b3f", "#b34a5c", "#c79a3e", "#77836a", "#e0d3ea"];

export default function CategoryPie() {
  return (
    <div className="rounded-2xl border border-plum/10 bg-white p-5">
      <h3 className="font-display text-lg">Sales by category</h3>
      <p className="mb-2 text-xs text-ink-soft">Share of revenue, last 30 days</p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={salesByCategory}
            dataKey="value"
            nameKey="category"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
          >
            {salesByCategory.map((_, i) => (
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
