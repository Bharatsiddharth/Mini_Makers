"use client";

import { useEffect, useMemo, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import StatusBadge from "@/components/admin/StatusBadge";
import { apiFetchWithFallback } from "@/lib/api";
import { Order } from "@/lib/types";
import { orders as fallbackOrders } from "@/lib/data";

const STATUSES: (Order["status"] | "All")[] = ["All", "Pending", "Fulfilled", "Shipped", "Refunded"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(fallbackOrders);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetchWithFallback<Order[]>("/admin/orders/", fallbackOrders)
      .then((data) => setOrders(data.length ? data : fallbackOrders))
      .catch((err) => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = status === "All" || o.status === status;
      const matchesQuery =
        query.trim() === "" ||
        o.id.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [status, query, orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-plum border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <TopBar title="Orders" subtitle={`${orders.length} total orders`} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${
                status === s
                  ? "border-plum bg-plum text-white"
                  : "border-plum/20 bg-white text-ink-soft hover:bg-blush-soft"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search order ID or customer..."
          className="w-64 rounded-full border border-plum/20 bg-white px-4 py-2 text-sm outline-none focus:border-plum"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-plum/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-plum/10 text-xs text-ink-soft">
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Items</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-plum/5 last:border-0 hover:bg-blush-soft/40">
                <td className="px-5 py-3 font-medium text-plum">{o.id}</td>
                <td className="px-5 py-3">
                  <p>{o.customer}</p>
                  <p className="text-xs text-ink-soft">{o.email}</p>
                </td>
                <td className="px-5 py-3 text-ink-soft">{o.date}</td>
                <td className="px-5 py-3 text-ink-soft">{o.items}</td>
                <td className="px-5 py-3 font-medium">₹{o.total.toLocaleString("en-IN")}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={o.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-ink-soft">
                  No orders match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}