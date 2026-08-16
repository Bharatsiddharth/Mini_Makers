"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { CustomerOrder } from "@/lib/types";
import { ArrowLeft, CheckCircle2, MapPin, PackageCheck, Phone, XCircle } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canceling, setCanceling] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCancelOrder = async () => {
    if (!order) return;
    setCanceling(true);
    try {
      const updatedOrder = await apiFetch<CustomerOrder>(`/orders/${order.id}/cancel/`, { method: "POST" });
      setOrder({ ...order, status: updatedOrder.status });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to cancel this order.");
    } finally {
      setCanceling(false);
      setConfirmOpen(false);
    }
  };

  useEffect(() => {
    if (!user || !params?.id) return;

    apiFetch<CustomerOrder>(`/orders/${params.id}/`)
      .then((data) => setOrder(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load your order."))
      .finally(() => setLoading(false));
  }, [params?.id, user]);

  if (!user) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-ink-soft">Please sign in to view the order.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-plum border-t-transparent" />
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-rose/20 bg-rose/5 p-6 text-rose">
          {error || "Order not found."}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/orders" className="mb-6 inline-flex items-center gap-2 text-sm text-plum hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to orders
      </Link>

      <div className="rounded-3xl border border-plum/10 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-plum/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">Order {order.id}</p>
            <h1 className="mt-2 font-display text-3xl">Thank you for your order</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              {order.status}
            </div>
            {order.status === "Pending" && (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={canceling}
                className="inline-flex items-center gap-2 rounded-full border border-rose/20 bg-rose/5 px-3 py-1.5 text-sm font-medium text-rose transition hover:bg-rose/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <XCircle className="h-4 w-4" />
                {canceling ? "Cancelling..." : "Cancel order"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="rounded-2xl bg-cream/60 p-4">
              <div className="mb-3 flex items-center gap-2 font-medium text-ink">
                <PackageCheck className="h-4 w-4 text-plum" />
                Order items
              </div>
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 border-b border-plum/10 py-3 last:border-0 last:pb-0 first:pt-0">
                  <div>
                    <p className="font-medium text-ink">{item.product_name}</p>
                    <p className="text-sm text-ink-soft">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-plum">₹{(item.price_at_purchase * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl bg-cream/60 p-4 text-sm text-ink-soft">
            <div className="flex items-center gap-2 font-medium text-ink">
              <MapPin className="h-4 w-4 text-plum" />
              Shipping details
            </div>
            <p>{order.shipping_name}</p>
            <p>{order.shipping_address}</p>
            <p>{order.city}, {order.state} {order.postal_code}</p>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-plum" />
              {order.phone}
            </div>
            <div className="rounded-xl border border-plum/10 bg-white px-3 py-2">
              <p className="font-medium text-ink">Payment</p>
              <p>{order.payment_method}</p>
            </div>
            <div className="rounded-xl border border-plum/10 bg-white px-3 py-2">
              <p className="font-medium text-ink">Order total</p>
              <p className="text-lg font-semibold text-plum">₹{Number(order.total).toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Cancel this order?"
        description={`Order ${order.id} will be cancelled and can't be reactivated. This can't be undone.`}
        confirmLabel="Yes, cancel order"
        cancelLabel="Keep order"
        loading={canceling}
        onConfirm={handleCancelOrder}
        onCancel={() => setConfirmOpen(false)}
      />
    </section>
  );
}
