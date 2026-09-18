"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { createPersistedStore, usePersistedStore } from "@/lib/store/persisted";

type WishlistState = {
  items: string[];
};

type WishlistContextValue = {
  items: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  clear: () => void;
  count: number;
  hydrated: boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

const store = createPersistedStore<WishlistState>({
  key: "raven.wishlist",
  version: 1,
  initial: { items: [] },
  parse: (payload) =>
    Array.isArray(payload.items) ? { items: payload.items as string[] } : null,
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { value: state, hydrated } = usePersistedStore(store);
  const items = state.items;

  const has = useCallback((slug: string) => items.includes(slug), [items]);

  const toggle = useCallback((slug: string) => {
    store.update((prev) => ({
      items: prev.items.includes(slug)
        ? prev.items.filter((s) => s !== slug)
        : [...prev.items, slug],
    }));
  }, []);

  const clear = useCallback(() => {
    store.update(() => ({ items: [] }));
  }, []);

  const value = useMemo(
    () => ({
      items,
      has,
      toggle,
      clear,
      count: items.length,
      hydrated,
    }),
    [items, has, toggle, clear, hydrated],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
