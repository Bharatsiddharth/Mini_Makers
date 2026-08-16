"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, apiFetchWithFallback } from "@/lib/api";
import { CustomerOrder } from "@/lib/types";
import { PackageCheck, MapPin, Phone, ShoppingBag, XCircle } from "lucide-react";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const handleCancelOrder = async (orderId: string) => {
    setCancelingId(orderId);
    try {
      const updatedOrder = await apiFetch<CustomerOrder>(`/orders/${orderId}/cancel/`, {
        method: "POST",
      });

      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, status: updatedOrder.status } : order))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to cancel this order.");
    } finally {
      setCancelingId(null);
    }
  };

  useEffect(() => {
    if (!user) return;

    apiFetchWithFallback<CustomerOrder[]>("/orders/", [])
      .then((data) => setOrders(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load orders."))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="h-12 w-12 text-plum/30" strokeWidth={1.5} />
        <h1 className="mt-4 font-display text-2xl">Your orders</h1>
        <p className="mt-2 text-ink-soft">Please sign in to view your order history.</p>
        <Link
          href="/login?redirect=/orders"
          className="mt-6 rounded-full bg-plum px-6 py-3 text-sm font-medium text-white hover:bg-plum-deep"
        >
          Sign in
        </Link>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-plum border-t-transparent" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-rose/20 bg-rose/5 p-6 text-rose">{error}</div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-plum/70">Orders</p>
          <h1 className="font-display text-3xl">Your order history</h1>
        </div>
        <Link href="/products" className="rounded-full border border-plum/20 px-4 py-2 text-sm text-plum hover:bg-blush-soft">
          Continue shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-plum/10 bg-white p-8 text-center text-ink-soft">
          You haven’t placed any orders yet.
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-plum/10 bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-3 border-b border-plum/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">Order {order.id}</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blush-soft px-3 py-1 text-xs font-medium text-plum">
                    {order.status}
                  </div>
                  {order.status === "Pending" && (
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancelingId === order.id}
                      className="inline-flex items-center gap-2 rounded-full border border-rose/20 bg-rose/5 px-3 py-1.5 text-xs font-medium text-rose transition hover:bg-rose/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      {cancelingId === order.id ? "Cancelling..." : "Cancel"}
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-cream/60 p-3">
                      <div>
                        <p className="font-medium text-ink">{item.product_name}</p>
                        <p className="text-sm text-ink-soft">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-plum">₹{(item.price_at_purchase * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 rounded-2xl bg-cream/60 p-4 text-sm text-ink-soft">
                  <div className="flex items-center gap-2 font-medium text-ink">
                    <PackageCheck className="h-4 w-4 text-plum" />
                    Summary
                  </div>
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="font-medium text-ink">₹{Number(order.total).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-plum" />
                    <div>
                      <p>{order.shipping_name}</p>
                      <p>{order.shipping_address}</p>
                      <p>{order.city}, {order.state} {order.postal_code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-plum" />
                    {order.phone}
                  </div>
                  <p className="rounded-xl border border-plum/10 bg-white px-3 py-2">
                    Payment: {order.payment_method}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
