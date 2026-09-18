"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import {
  catalogueDate,
  FRESHNESS_WINDOW_DAYS,
  products as initialProducts,
  type Product,
} from "@/data/products";
import {
  createPersistedStore,
  useMountTime,
  usePersistedStore,
} from "@/lib/store/persisted";

export type DiscountCampaign = {
  active: boolean;
  percentage: number;
  scope: "all" | "category" | "selected";
  category?: string;
  selectedSlugs?: string[];
  durationDays: number;
  startDate: string;
};

type SellerState = {
  products: Product[];
  campaign: DiscountCampaign;
};

type SellerContextValue = {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (slug: string, updates: Partial<Product>) => void;
  deleteProduct: (slug: string) => void;
  toggleSizeSoldOut: (slug: string, size: number) => void;
  markAllSoldOut: (slug: string) => void;
  bulkMarkSoldOut: (slugs: string[]) => void;
  bulkDelete: (slugs: string[]) => void;
  campaign: DiscountCampaign;
  updateCampaign: (campaign: DiscountCampaign) => void;
  healthScore: number;
  staleCount: number;
  unpricedCount: number;
  soldOutCount: number;
  hydrated: boolean;
};

const SellerContext = createContext<SellerContextValue | null>(null);

const defaultCampaign: DiscountCampaign = {
  active: true,
  percentage: 20,
  scope: "all",
  durationDays: 3,
  startDate: "2026-09-15T00:00:00Z",
};

const store = createPersistedStore<SellerState>({
  key: "raven.seller",
  version: 1,
  initial: { products: initialProducts, campaign: defaultCampaign },
  parse: (payload) =>
    Array.isArray(payload.products)
      ? {
          products: payload.products as Product[],
          campaign: (payload.campaign as DiscountCampaign) ?? defaultCampaign,
        }
      : null,
});

export function SellerProvider({ children }: { children: ReactNode }) {
  const { value: state, hydrated } = usePersistedStore(store);
  const { products, campaign } = state;

  // "Stale" means old in real time, so this needs the browser's clock — but not
  // until the prerendered markup has been hydrated.
  const now = useMountTime(new Date(catalogueDate).getTime());

  const addProduct = useCallback((product: Product) => {
    store.update((prev) => ({ ...prev, products: [product, ...prev.products] }));
  }, []);

  const updateProduct = useCallback(
    (slug: string, updates: Partial<Product>) => {
      store.update((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.slug === slug ? { ...p, ...updates } : p,
        ),
      }));
    },
    [],
  );

  const deleteProduct = useCallback((slug: string) => {
    store.update((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.slug !== slug),
    }));
  }, []);

  const toggleSizeSoldOut = useCallback((slug: string, size: number) => {
    store.update((prev) => ({
      ...prev,
      products: prev.products.map((p) => {
        if (p.slug !== slug) return p;
        const currentSoldOut = p.soldOutSizes || [];
        const isSoldOut = currentSoldOut.includes(size);
        const updatedSoldOut = isSoldOut
          ? currentSoldOut.filter((s) => s !== size)
          : [...currentSoldOut, size];
        return {
          ...p,
          soldOutSizes: updatedSoldOut,
          stock: p.sizes.length - updatedSoldOut.length,
        };
      }),
    }));
  }, []);

  const markAllSoldOut = useCallback((slug: string) => {
    store.update((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.slug === slug ? { ...p, soldOutSizes: [...p.sizes], stock: 0 } : p,
      ),
    }));
  }, []);

  const bulkMarkSoldOut = useCallback((slugs: string[]) => {
    store.update((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        slugs.includes(p.slug)
          ? { ...p, soldOutSizes: [...p.sizes], stock: 0 }
          : p,
      ),
    }));
  }, []);

  const bulkDelete = useCallback((slugs: string[]) => {
    store.update((prev) => ({
      ...prev,
      products: prev.products.filter((p) => !slugs.includes(p.slug)),
    }));
  }, []);

  const updateCampaign = useCallback((newCampaign: DiscountCampaign) => {
    store.update((prev) => ({ ...prev, campaign: newCampaign }));
  }, []);

  // Compute Store Health Metrics (matches Screen 08 & 09)
  const unpricedCount = useMemo(
    () => products.filter((p) => p.price <= 0).length,
    [products],
  );

  const soldOutCount = useMemo(
    () =>
      products.filter(
        (p) =>
          p.stock === 0 ||
          (p.soldOutSizes && p.soldOutSizes.length === p.sizes.length),
      ).length,
    [products],
  );

  const staleCount = useMemo(() => {
    const cutoff = now - FRESHNESS_WINDOW_DAYS * 24 * 60 * 60 * 1000;
    return products.filter((p) => new Date(p.addedAt).getTime() <= cutoff)
      .length;
  }, [products, now]);

  const healthScore = useMemo(() => {
    if (products.length === 0) return 100;
    const penalty =
      unpricedCount * 8 + soldOutCount * 6 + Math.min(staleCount * 2, 20);
    return Math.max(10, Math.min(100, Math.round(100 - penalty)));
  }, [products.length, unpricedCount, soldOutCount, staleCount]);

  const value = useMemo(
    () => ({
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleSizeSoldOut,
      markAllSoldOut,
      bulkMarkSoldOut,
      bulkDelete,
      campaign,
      updateCampaign,
      healthScore,
      staleCount,
      unpricedCount,
      soldOutCount,
      hydrated,
    }),
    [
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleSizeSoldOut,
      markAllSoldOut,
      bulkMarkSoldOut,
      bulkDelete,
      campaign,
      updateCampaign,
      healthScore,
      staleCount,
      unpricedCount,
      soldOutCount,
      hydrated,
    ],
  );

  return (
    <SellerContext.Provider value={value}>{children}</SellerContext.Provider>
  );
}

export function useSeller() {
  const ctx = useContext(SellerContext);
  if (!ctx) throw new Error("useSeller must be used inside <SellerProvider>");
  return ctx;
}
