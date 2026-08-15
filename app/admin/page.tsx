"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IndianRupee, ShoppingCart, Users, Package } from "lucide-react";
import TopBar from "@/components/admin/TopBar";
import KpiCard from "@/components/admin/KpiCard";
import RevenueChart from "@/components/admin/RevenueChart";
import CategoryPie from "@/components/admin/CategoryPie";
import TrafficBar from "@/components/admin/TrafficBar";
import StatusBadge from "@/components/admin/StatusBadge";
import { apiFetchWithFallback } from "@/lib/api";
import { OverviewData, Order } from "@/lib/types";
import { orders as fallbackOrders } from "@/lib/data";

const fallbackOverview: OverviewData = {
  revenue7d: 178400,
  revenueDelta: 12.4,
  orders7d: 236,
  ordersDelta: 8.1,
  aov: 756,
  aovDelta: 3.2,
  newCustomers7d: 42,
  newCustomersDelta: 5.6,
};

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState<OverviewData>(fallbackOverview);
  const [recentOrders, setRecentOrders] = useState<Order[]>(fallbackOrders.slice(0, 5));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetchWithFallback<OverviewData>("/admin/analytics/overview/", fallbackOverview),
      apiFetchWithFallback<Order[]>("/admin/orders/", fallbackOrders),
    ])
      .then(([ov, orders]) => {
        setOverview(ov);
        setRecentOrders(orders.length ? orders.slice(0, 5) : fallbackOrders.slice(0, 5));
      })
      .catch((err) => console.error("Failed to load admin data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-plum border-t-transparent" />
      </div>
    );
  }

  const weekRevenue = overview?.revenue7d ?? 0;
  const weekOrders = overview?.orders7d ?? 0;
  const aov = overview?.aov ?? 0;
  const newCustomers = overview?.newCustomers7d ?? 0;

  return (
    <>
      <TopBar title="Overview" subtitle="Here's how the store is doing this week" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Revenue (7d)" value={`₹${weekRevenue.toLocaleString("en-IN")}`} delta={overview?.revenueDelta ?? 0} icon={IndianRupee} />
        <KpiCard label="Orders (7d)" value={weekOrders.toString()} delta={overview?.ordersDelta ?? 0} icon={ShoppingCart} />
        <KpiCard label="Avg. order value" value={`₹${aov.toLocaleString("en-IN")}`} delta={overview?.aovDelta ?? 0} icon={Package} />
        <KpiCard label="New customers (7d)" value={newCustomers.toString()} delta={overview?.newCustomersDelta ?? 0} icon={Users} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <CategoryPie />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <TrafficBar />

        <div className="rounded-2xl border border-plum/10 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg">Recent orders</h3>
              <p className="text-xs text-ink-soft">Latest activity across the store</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-medium text-plum hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-plum/10 text-xs text-ink-soft">
                  <th className="py-2 font-medium">Order</th>
                  <th className="py-2 font-medium">Customer</th>
                  <th className="py-2 font-medium">Total</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-plum/5 last:border-0">
                    <td className="py-2.5 font-medium text-plum">{o.id}</td>
                    <td className="py-2.5 text-ink-soft">{o.customer}</td>
                    <td className="py-2.5">₹{o.total.toLocaleString("en-IN")}</td>
                    <td className="py-2.5">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-ink-soft">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}