"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { createPersistedStore, usePersistedStore } from "@/lib/store/persisted";

type RecentState = {
  items: string[];
};

type RecentlyViewedContextValue = {
  items: string[];
  addView: (slug: string) => void;
  clear: () => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(
  null,
);

const MAX_RECENT = 8;

const store = createPersistedStore<RecentState>({
  key: "raven.recent",
  version: 1,
  initial: { items: [] },
  parse: (payload) =>
    Array.isArray(payload.items) ? { items: payload.items as string[] } : null,
});

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const { value: state } = usePersistedStore(store);
  const items = state.items;

  const addView = useCallback((slug: string) => {
    store.update((prev) => ({
      items: [slug, ...prev.items.filter((s) => s !== slug)].slice(
        0,
        MAX_RECENT,
      ),
    }));
  }, []);

  const clear = useCallback(() => {
    store.update(() => ({ items: [] }));
  }, []);

  const value = useMemo(
    () => ({
      items,
      addView,
      clear,
    }),
    [items, addView, clear],
  );

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) {
    throw new Error(
      "useRecentlyViewed must be used inside <RecentlyViewedProvider>",
    );
  }
  return ctx;
}
