"use client";

import { Check, Plus, Search, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import type { Product } from "@/data/products";
import { formatPrice, formatSize } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import { useSeller } from "@/lib/store/seller-store";

interface InventoryManagerProps {
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
}

type InventoryFilter = "all" | "in-stock" | "sold-out" | "sale";

export function InventoryManager({
  onOpenAddProduct,
  onEditProduct,
}: InventoryManagerProps) {
  const { locale } = useI18n();
  const {
    products,
    toggleSizeSoldOut,
    bulkMarkSoldOut,
    bulkDelete,
  } = useSeller();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<InventoryFilter>("all");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

  const currency = locale === "en" ? "IQD" : "د.ع";

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery =
        search.trim() === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase());

      if (!matchQuery) return false;

      const isFullySoldOut =
        p.stock === 0 ||
        (p.soldOutSizes && p.soldOutSizes.length === p.sizes.length);

      if (filter === "in-stock") return !isFullySoldOut;
      if (filter === "sold-out") return isFullySoldOut;
      if (filter === "sale") return p.compareAt && p.compareAt > p.price;

      return true;
    });
  }, [products, search, filter]);

  const toggleSelect = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const handleBulkMarkSold = () => {
    bulkMarkSoldOut(selectedSlugs);
    toast.success(
      locale === "ku"
        ? `${selectedSlugs.length} کاڵا وەک فرۆشراو نیشانکران`
        : `${selectedSlugs.length} items marked as sold out`,
    );
    setSelectedSlugs([]);
  };

  const handleBulkDelete = () => {
    bulkDelete(selectedSlugs);
    toast.success(
      locale === "ku"
        ? `${selectedSlugs.length} کاڵا سڕانەوە`
        : `${selectedSlugs.length} items deleted`,
    );
    setSelectedSlugs([]);
  };

  return (
    <div className="space-y-4 pb-28 text-foreground transition-colors relative">
      {/* Header Info */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-bold text-foreground">
          {locale === "ku" ? "کاڵاکانم" : locale === "ar" ? "منتجاتي" : "My Products"}
        </span>
        <span className="text-xs text-muted-foreground">
          {filteredProducts.length}{" "}
          {locale === "ku" ? "کاڵا" : locale === "ar" ? "منتج" : "items"}
        </span>
      </div>

      {/* Stale items notice banner */}
      <div className="flex items-center gap-2 px-4 py-3 bg-secondary border border-border rounded-xl text-xs text-foreground/85">
        <span className="flex-1">
          {locale === "ku"
            ? "12 کاڵا 30 ڕۆژە نوێ نەکراوەتەوە — کرتە لە قەبارەکان بکە بۆ نوێکردنەوە"
            : locale === "ar"
              ? "12 منتجاً لم يتم تحديثها منذ 30 يوماً — اضغط لتحديث المقاسات"
              : "12 products need stock refresh — click size chips to toggle availability"}
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-muted-foreground absolute top-3.5 start-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            locale === "ku"
              ? "گەڕان بە ناو یان کۆد (RV-xxxx)..."
              : locale === "ar"
                ? "بحث بالاسم أو الكود..."
                : "Search name or code..."
          }
          className="w-full bg-card border border-border rounded-full ps-10 pe-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {([
          { id: "all", label: locale === "ku" ? "هەموو" : locale === "ar" ? "الكل" : "All" },
          { id: "in-stock", label: locale === "ku" ? "بەردەستە" : locale === "ar" ? "متوفر" : "In Stock" },
          { id: "sold-out", label: locale === "ku" ? "فرۆشراوە" : locale === "ar" ? "نفدت" : "Sold Out" },
          { id: "sale", label: locale === "ku" ? "داشکاندن" : locale === "ar" ? "تخفيض" : "Sale" },
        ] satisfies { id: InventoryFilter; label: string }[]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex-none px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              filter === tab.id
                ? "bg-primary text-primary-foreground shadow-xs"
                : tab.id === "sale"
                  ? "border border-[#E01B24] text-[#E01B24] hover:bg-[#E01B24]/10"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product Rows List */}
      <div className="border border-border rounded-2xl bg-card divide-y divide-border overflow-hidden shadow-xs">
        {filteredProducts.map((product) => {
          const isSelected = selectedSlugs.includes(product.slug);
          const isFullySoldOut =
            product.stock === 0 ||
            (product.soldOutSizes &&
              product.soldOutSizes.length === product.sizes.length);

          return (
            <div
              key={product.slug}
              className={`p-4 space-y-3 transition-colors ${
                isFullySoldOut ? "opacity-50" : ""
              } ${isSelected ? "bg-primary/5" : ""}`}
            >
              {/* Product summary header */}
              <div className="flex items-start gap-3">
                {/* Checkbox for bulk select */}
                <button
                  type="button"
                  onClick={() => toggleSelect(product.slug)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-1 transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border hover:border-foreground/50 text-transparent bg-card"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                {/* Thumbnail */}
                <div
                  onClick={() => onEditProduct(product)}
                  className="relative w-14 h-14 rounded-xl overflow-hidden border border-border bg-secondary shrink-0 cursor-pointer"
                >
                  <Image
                    src={`/products/${product.slug}.webp`}
                    alt={product.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div
                  onClick={() => onEditProduct(product)}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <div className="text-xs font-bold text-foreground truncate hover:underline">
                    {product.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {product.code}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-foreground">
                      {product.price > 0
                        ? formatPrice(product.price, currency)
                        : locale === "ku"
                          ? "داوای نرخ بکە"
                          : "Ask price"}
                    </span>
                    {product.compareAt && product.compareAt > product.price && (
                      <span className="bg-[#E01B24] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}%
                      </span>
                    )}
                  </div>
                </div>

                {isFullySoldOut && (
                  <span className="text-[10px] font-bold text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                    {locale === "ku" ? "فرۆشراوە" : "Sold Out"}
                  </span>
                )}
              </div>

              {/* Size Pills Row */}
              <div className="space-y-1.5 pt-1">
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((size) => {
                    const isSoldOut = product.soldOutSizes?.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSizeSoldOut(product.slug, size)}
                        title={
                          isSoldOut
                            ? locale === "ku"
                              ? "کرتە بکە بۆ دانانەوە بە بەردەست"
                              : "Click to mark in stock"
                            : locale === "ku"
                              ? "کرتە بکە بۆ نیشانکردن وەک فرۆشراو"
                              : "Click to mark sold out"
                        }
                        className={`w-8 h-8 rounded-lg border text-xs font-semibold flex items-center justify-center select-none transition-all cursor-pointer ${
                          isSoldOut
                            ? "slash-soldout border-border text-muted-foreground/40 bg-secondary/30"
                            : "border-border text-foreground hover:border-foreground/50 hover:bg-secondary"
                        }`}
                      >
                        {formatSize(size)}
                      </button>
                    );
                  })}
                </div>

                {product.soldOutSizes && product.soldOutSizes.length > 0 && (
                  <div className="text-[10px] text-muted-foreground pt-0.5">
                    {locale === "ku"
                      ? `${product.soldOutSizes.length} قەبارە فرۆشراوە · پاشەکەوت کرا`
                      : `${product.soldOutSizes.length} sizes sold out · saved`}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Add Product Round Button */}
      <button
        type="button"
        onClick={onOpenAddProduct}
        aria-label="Add Product"
        className="fixed bottom-20 start-6 z-30 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Bulk Select Action Bar */}
      {selectedSlugs.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border p-4 flex items-center justify-between gap-3 shadow-2xl safe-area-bottom">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">
              {selectedSlugs.length}{" "}
              {locale === "ku" ? "هەڵبژێردراو" : "selected"}
            </span>
            <button
              onClick={() => setSelectedSlugs([])}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkMarkSold}
              className="h-10 px-4 rounded-full bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
            >
              {locale === "ku" ? "نیشانکردن وەک فرۆشراو" : "Mark Sold"}
            </button>
            <button
              onClick={handleBulkDelete}
              className="h-10 px-3.5 rounded-full border border-[#E01B24] text-[#E01B24] font-semibold text-xs hover:bg-[#E01B24]/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
