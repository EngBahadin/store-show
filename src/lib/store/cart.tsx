"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getProduct } from "@/data/products";
import { site } from "@/lib/site";
import { createPersistedStore, usePersistedStore } from "@/lib/store/persisted";

export type CartItem = {
  slug: string;
  size: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
  note: string;
};

type CartContextValue = {
  items: CartItem[];
  add: (slug: string, size: number, qty?: number) => void;
  remove: (slug: string, size: number) => void;
  setQty: (slug: string, size: number, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  note: string;
  setNote: (note: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const store = createPersistedStore<CartState>({
  key: "raven.cart",
  version: 1,
  initial: { items: [], note: "" },
  parse: (payload) =>
    Array.isArray(payload.items)
      ? {
          items: payload.items as CartItem[],
          note: typeof payload.note === "string" ? payload.note : "",
        }
      : null,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const { value: state, hydrated } = usePersistedStore(store);
  const { items, note } = state;

  // Purely ephemeral — the cart sheet should never reopen itself on reload.
  const [isOpen, setIsOpen] = useState(false);

  const add = useCallback((slug: string, size: number, qty = 1) => {
    store.update((prev) => {
      const index = prev.items.findIndex(
        (i) => i.slug === slug && i.size === size,
      );
      if (index > -1) {
        const next = [...prev.items];
        next[index] = { ...next[index], qty: next[index].qty + qty };
        return { ...prev, items: next };
      }
      return { ...prev, items: [...prev.items, { slug, size, qty }] };
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((slug: string, size: number) => {
    store.update((prev) => ({
      ...prev,
      items: prev.items.filter((i) => !(i.slug === slug && i.size === size)),
    }));
  }, []);

  const setQty = useCallback(
    (slug: string, size: number, qty: number) => {
      if (qty <= 0) {
        remove(slug, size);
        return;
      }
      store.update((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.slug === slug && i.size === size ? { ...i, qty } : i,
        ),
      }));
    },
    [remove],
  );

  const clear = useCallback(() => {
    store.update(() => ({ items: [], note: "" }));
  }, []);

  const setNote = useCallback((note: string) => {
    store.update((prev) => ({ ...prev, note }));
  }, []);

  const count = useMemo(
    () => items.reduce((acc, item) => acc + item.qty, 0),
    [items],
  );

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const product = getProduct(item.slug);
      const price = product?.price || 0;
      return acc + price * item.qty;
    }, 0);
  }, [items]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= site.freeDeliveryFrom ? 0 : site.deliveryFee;
  }, [subtotal]);

  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  const value = useMemo(
    () => ({
      items,
      add,
      remove,
      setQty,
      clear,
      count,
      subtotal,
      deliveryFee,
      total,
      note,
      setNote,
      isOpen,
      setIsOpen,
      hydrated,
    }),
    [
      items,
      add,
      remove,
      setQty,
      clear,
      count,
      subtotal,
      deliveryFee,
      total,
      note,
      setNote,
      isOpen,
      hydrated,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
