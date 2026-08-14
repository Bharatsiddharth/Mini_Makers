import Link from "next/link";
import { IndianRupee, ShoppingCart, Users, Package } from "lucide-react";
import TopBar from "@/components/admin/TopBar";
import KpiCard from "@/components/admin/KpiCard";
import RevenueChart from "@/components/admin/RevenueChart";
import CategoryPie from "@/components/admin/CategoryPie";
import TrafficBar from "@/components/admin/TrafficBar";
import StatusBadge from "@/components/admin/StatusBadge";
import { orders, products, revenueByDay } from "@/lib/data";

export default function AdminOverviewPage() {
  const weekRevenue = revenueByDay.reduce((sum, d) => sum + d.revenue, 0);
  const weekOrders = revenueByDay.reduce((sum, d) => sum + d.orders, 0);
  const aov = Math.round(weekRevenue / weekOrders);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 15).length;

  return (
    <>
      <TopBar title="Overview" subtitle="Here's how the store is doing this week" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Revenue (7d)" value={`₹${weekRevenue.toLocaleString("en-IN")}`} delta={12.4} icon={IndianRupee} />
        <KpiCard label="Orders (7d)" value={weekOrders.toString()} delta={8.1} icon={ShoppingCart} />
        <KpiCard label="Avg. order value" value={`₹${aov.toLocaleString("en-IN")}`} delta={3.6} icon={Package} />
        <KpiCard label="New customers (7d)" value="46" delta={-2.3} icon={Users} />
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
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-b border-plum/5 last:border-0">
                    <td className="py-2.5 font-medium text-plum">{o.id}</td>
                    <td className="py-2.5 text-ink-soft">{o.customer}</td>
                    <td className="py-2.5">₹{o.total.toLocaleString("en-IN")}</td>
                    <td className="py-2.5">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {lowStock > 0 && (
        <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-sm text-ink">
          <span className="font-medium">{lowStock} products</span> are running low on stock (15 units or
          fewer).{" "}
          <Link href="/admin/products" className="font-medium text-plum hover:underline">
            Review inventory →
          </Link>
        </div>
      )}
    </>
  );
}
