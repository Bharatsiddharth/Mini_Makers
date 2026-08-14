"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { trafficBySource } from "@/lib/data";

const COLORS = ["#7a2b3f", "#b34a5c", "#c79a3e", "#77836a", "#e0d3ea"];

export default function TrafficBar() {
  return (
    <div className="rounded-2xl border border-plum/10 bg-white p-5">
      <h3 className="font-display text-lg">Traffic by source</h3>
      <p className="mb-2 text-xs text-ink-soft">Sessions, last 7 days</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={trafficBySource} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid horizontal={false} stroke="#7a2b3f" strokeOpacity={0.08} />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="source"
            tick={{ fontSize: 12, fill: "#6b5f58" }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid rgba(122,43,63,0.15)", fontSize: 13 }}
          />
          <Bar dataKey="visits" radius={[0, 8, 8, 0]} barSize={16}>
            {trafficBySource.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
