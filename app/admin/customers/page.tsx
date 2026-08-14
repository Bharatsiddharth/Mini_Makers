"use client";

import { useMemo, useState } from "react";
import TopBar from "@/components/admin/TopBar";
import { customers } from "@/lib/data";

export default function AdminCustomersPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <>
      <TopBar title="Customers" subtitle={`${customers.length} customers on record`} />

      <div className="mb-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-64 rounded-full border border-plum/20 bg-white px-4 py-2 text-sm outline-none focus:border-plum"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-plum/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-plum/10 text-xs text-ink-soft">
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">Orders</th>
              <th className="px-5 py-3 font-medium">Lifetime spend</th>
              <th className="px-5 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-plum/5 last:border-0 hover:bg-blush-soft/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-plum/10 text-xs font-medium text-plum">
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-ink-soft">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-ink-soft">{c.location}</td>
                <td className="px-5 py-3">{c.orders}</td>
                <td className="px-5 py-3 font-medium">₹{c.spent.toLocaleString("en-IN")}</td>
                <td className="px-5 py-3 text-ink-soft">{c.joined}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-ink-soft">
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
