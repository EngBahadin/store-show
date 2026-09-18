"use client";

import { Flame, Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { EmptyState } from "@/components/commerce/empty-state";
import { ProductCard } from "@/components/commerce/product-card";
import { SortSheet, type SortOption } from "@/components/commerce/sort-sheet";
import {
  allProducts,
  brands,
  categories,
  type BrandId,
  type CategoryId,
  type Gender,
} from "@/data/products";
import { useI18n } from "@/lib/i18n/provider";

function ShopContent() {
  const { locale } = useI18n();
  const searchParams = useSearchParams();

  const initialSale = searchParams.get("sale") === "true";
  const initialGender = searchParams.get("gender") as Gender | null;
  const initialCategory = searchParams.get("category") as CategoryId | null;

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "all">(
    initialCategory || "all",
  );
  const [selectedGender, setSelectedGender] = useState<Gender | "all">(
    initialGender || "all",
  );
  const [selectedBrand, setSelectedBrand] = useState<BrandId | "all">("all");
  const [onlySale, setOnlySale] = useState(initialSale);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);

  const rawProducts = allProducts();

  const filteredProducts = useMemo(() => {
    const result = rawProducts.filter((p) => {
      if (
        search.trim() &&
        !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.code.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }
      if (selectedGender !== "all" && p.gender !== selectedGender && p.gender !== "unisex") {
        return false;
      }
      if (selectedBrand !== "all" && p.brand !== selectedBrand) {
        return false;
      }
      if (onlySale && !(p.compareAt && p.compareAt > p.price)) {
        return false;
      }
      return true;
    });

    switch (sortOption) {
      case "price-asc":
        return result.sort((a, b) => (a.price || 999999) - (b.price || 999999));
      case "price-desc":
        return result.sort((a, b) => b.price - a.price);
      case "popular":
        return result.sort((a, b) => b.popularity - a.popularity);
      case "newest":
      default:
        return result.sort(
          (a, b) =>
            new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
        );
    }
  }, [
    rawProducts,
    search,
    selectedCategory,
    selectedGender,
    selectedBrand,
    onlySale,
    sortOption,
  ]);

  const hasActiveFilters =
    search !== "" ||
    selectedCategory !== "all" ||
    selectedGender !== "all" ||
    selectedBrand !== "all" ||
    onlySale;

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedGender("all");
    setSelectedBrand("all");
    setOnlySale(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5 pb-24 text-foreground transition-colors">
      {/* Top Search & Sort Controls */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute top-3.5 start-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              locale === "ku"
                ? "گەڕان بە ناو یان براند..."
                : locale === "ar"
                  ? "بحث بالاسم أو الماركة..."
                  : "Search sneakers..."
            }
            className="w-full bg-card border border-border rounded-full ps-10 pe-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
          />
        </div>

        <button
          onClick={() => setSortOpen(true)}
          className="h-10 px-3.5 rounded-full border border-border bg-card flex items-center gap-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors shrink-0 cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="hidden sm:inline">
            {locale === "ku" ? "ڕیزکردن" : "Sort"}
          </span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`flex-none px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground border border-primary shadow-xs"
              : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          {locale === "ku" ? "هەموو" : locale === "ar" ? "الكل" : "All"}
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`flex-none px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === c.id
                ? "bg-primary text-primary-foreground border border-primary shadow-xs"
                : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {c.label[locale]}
          </button>
        ))}

        {/* Sale Toggle Chip */}
        <button
          onClick={() => setOnlySale(!onlySale)}
          className={`flex-none px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            onlySale
              ? "bg-[#E01B24] text-white"
              : "border border-[#E01B24]/40 text-[#E01B24] hover:bg-[#E01B24]/10"
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>{locale === "ku" ? "داشکاندن" : "Sale"}</span>
        </button>
      </div>

      {/* Gender & Brand Secondary Filters */}
      <div className="flex flex-wrap gap-2 text-xs">
        {/* Gender Chips */}
        {(["men", "women"] as const).map((g) => (
          <button
            key={g}
            onClick={() =>
              setSelectedGender(selectedGender === g ? "all" : g)
            }
            className={`px-3 py-1 rounded-md border text-[11px] font-medium transition-colors cursor-pointer ${
              selectedGender === g
                ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            {g === "men"
              ? locale === "ku"
                ? "پیاوان"
                : "Men"
              : locale === "ku"
                ? "ژنان"
                : "Women"}
          </button>
        ))}

        {/* Brands Dropdown/Chips */}
        {brands.slice(0, 5).map((b) => (
          <button
            key={b.id}
            onClick={() =>
              setSelectedBrand(selectedBrand === b.id ? "all" : b.id)
            }
            className={`px-3 py-1 rounded-md border text-[11px] font-medium transition-colors cursor-pointer ${
              selectedBrand === b.id
                ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            {b.name}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-[11px] text-[#E01B24] px-2 py-1 hover:underline cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>{locale === "ku" ? "سڕینەوە" : "Clear"}</span>
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
        <span>
          {filteredProducts.length}{" "}
          {locale === "ku" ? "کاڵا دۆزرایەوە" : "pairs found"}
        </span>
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          type="no-results"
          query={search}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}

      {/* Sort Sheet Drawer */}
      <SortSheet
        open={sortOpen}
        onOpenChange={setSortOpen}
        currentSort={sortOption}
        onSelectSort={setSortOption}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#8A8A8A]">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
