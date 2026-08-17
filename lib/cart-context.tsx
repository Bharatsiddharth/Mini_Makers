"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Product } from "./types";
import { apiFetch, getAccessToken } from "./api";

type CartLine = { product: Product; qty: number; cartItemId?: number };

type CartContextValue = {
  lines: CartLine[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  syncWithBackend: () => Promise<void>;
};

const CART_KEY = "petal_cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(CART_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as CartLine[];
      if (Array.isArray(parsed)) {
        setLines(parsed);
      }
    } catch {
      localStorage.removeItem(CART_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines]);

  const syncWithBackend = useCallback(async () => {
    if (!getAccessToken()) return;
    try {
      const cart = await apiFetch<{ items: { id: number; product: Product; quantity: number }[] }>("/cart/");
      const syncedLines = cart.items.map((item) => ({
        product: item.product,
        qty: item.quantity,
        cartItemId: item.id,
      }));
      setLines(syncedLines);
    } catch {
      // Backend not available or not logged in — keep local state
    }
  }, []);

  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  const addItem = async (product: Product, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [...prev, { product, qty }];
    });
    setIsOpen(true);

    if (getAccessToken()) {
      try {
        const cart = await apiFetch<{ items: { id: number; product: Product; quantity: number }[] }>("/cart/items/", {
          method: "POST",
          body: JSON.stringify({ productId: Number(product.id), quantity: qty }),
        });
        // Capture real cart-item ids from the backend so subsequent
        // PATCH/DELETE calls use the CartItem pk, NOT the product id.
        setLines((prev) =>
          prev.map((l) => {
            const backendItem = cart.items.find((i) => i.product.id === product.id);
            return backendItem
              ? { ...l, qty: backendItem.quantity, cartItemId: backendItem.id }
              : l;
          })
        );
      } catch {
        // Local state works even if backend sync fails
      }
    }
  };

  const removeItem = async (productId: string) => {
    // Read the line BEFORE clearing it so we keep the real cart-item id.
    const line = lines.find((l) => l.product.id === productId);
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
    if (getAccessToken()) {
      try {
        const cartItemId = line?.cartItemId ?? Number(productId);
        await apiFetch(`/cart/items/${cartItemId}/`, { method: "DELETE" });
      } catch {
        // Ignore
      }
    }
  };

  const setQty = async (productId: string, qty: number) => {
    // Read the line BEFORE updating so we keep the real cart-item id.
    const line = lines.find((l) => l.product.id === productId);
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.product.id !== productId)
        : prev.map((l) => (l.product.id === productId ? { ...l, qty } : l))
    );
    if (getAccessToken()) {
      try {
        const cartItemId = line?.cartItemId ?? Number(productId);
        await apiFetch(`/cart/items/${cartItemId}/`, {
          method: "PATCH",
          body: JSON.stringify({ quantity: qty }),
        });
      } catch {
        // Ignore
      }
    }
  };

  const clear = () => {
    setLines([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_KEY);
    }
    if (getAccessToken()) {
      Promise.all(
        lines.map((l) => {
          const cartItemId = l.cartItemId ?? Number(l.product.id);
          return apiFetch(`/cart/items/${cartItemId}/`, { method: "DELETE" }).catch(() => {});
        })
      ).catch(() => {});
    }
  };

  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.qty * l.product.price, 0);

  return (
    <CartContext.Provider
      value={{
        lines,
        addItem,
        removeItem,
        setQty,
        clear,
        count,
        subtotal,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        syncWithBackend,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}