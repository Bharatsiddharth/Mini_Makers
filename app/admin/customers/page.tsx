"use client";

import { useEffect, useMemo, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import { apiFetchWithFallback } from "@/lib/api";
import { Customer } from "@/lib/types";
import { customers as fallbackCustomers } from "@/lib/data";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(fallbackCustomers);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetchWithFallback<Customer[]>("/admin/customers/", fallbackCustomers)
      .then((data) => setCustomers(data.length ? data : fallbackCustomers))
      .catch((err) => console.error("Failed to load customers:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase())
      ),
    [query, customers]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-plum border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <TopBar title="Customers" subtitle={`${customers.length} customers on record`} />

      <div className="mb-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-full border border-plum/20 bg-white px-4 py-2 text-sm outline-none focus:border-plum sm:w-64"
        />
      </div>

      <div className="-mx-4 overflow-x-auto sm:mx-0 sm:rounded-2xl sm:border sm:border-plum/10 sm:bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-plum/10 text-xs text-ink-soft">
              <th className="px-3 py-2.5 font-medium sm:px-5 sm:py-3">Customer</th>
              <th className="px-3 py-2.5 font-medium sm:px-5 sm:py-3">Location</th>
              <th className="px-3 py-2.5 font-medium sm:px-5 sm:py-3">Orders</th>
              <th className="px-3 py-2.5 font-medium sm:px-5 sm:py-3">Lifetime spend</th>
              <th className="px-3 py-2.5 font-medium sm:px-5 sm:py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-plum/5 last:border-0 hover:bg-blush-soft/40">
                <td className="px-3 py-2.5 sm:px-5 sm:py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-plum/10 text-xs font-medium text-plum">
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-ink-soft">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-ink-soft sm:px-5 sm:py-3">{c.location}</td>
                <td className="px-3 py-2.5 sm:px-5 sm:py-3">{c.orders}</td>
                <td className="px-3 py-2.5 font-medium sm:px-5 sm:py-3">₹{c.spent.toLocaleString("en-IN")}</td>
                <td className="px-3 py-2.5 text-ink-soft sm:px-5 sm:py-3">{c.joined}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-ink-soft sm:px-5">
                  No customers match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}