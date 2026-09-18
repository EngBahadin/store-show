"use client";

import { Flame, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { ProductCard } from "@/components/commerce/product-card";
import { PromoCarousel } from "@/components/commerce/promo-carousel";
import { SortSheet, type SortOption } from "@/components/commerce/sort-sheet";
import { allProducts } from "@/data/products";
import { useI18n } from "@/lib/i18n/provider";

type FilterTab = "all" | "men" | "women" | "running" | "lifestyle" | "sale";

export default function StorefrontPage() {
  const { locale } = useI18n();

  const [sortOpen, setSortOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>("newest");
  const [filter, setFilter] = useState<FilterTab>("all");

  const rawProducts = allProducts();

  const filteredProducts = useMemo(() => {
    let list = [...rawProducts];

    if (filter === "men") {
      list = list.filter((p) => p.gender === "men" || p.gender === "unisex");
    } else if (filter === "women") {
      list = list.filter((p) => p.gender === "women" || p.gender === "unisex");
    } else if (filter === "running") {
      list = list.filter((p) => p.category === "running");
    } else if (filter === "lifestyle") {
      list = list.filter((p) => p.category === "lifestyle");
    } else if (filter === "sale") {
      list = list.filter((p) => p.compareAt && p.compareAt > p.price);
    }

    switch (currentSort) {
      case "price-asc":
        return list.sort((a, b) => (a.price || 999999) - (b.price || 999999));
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "popular":
        return list.sort((a, b) => b.popularity - a.popularity);
      case "newest":
      default:
        return list.sort(
          (a, b) =>
            new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
        );
    }
  }, [rawProducts, currentSort, filter]);

  const filterTabs: { id: FilterTab; label: string; isSale?: boolean }[] = [
    { id: "all", label: locale === "ku" ? "هەموو" : locale === "ar" ? "الكل" : "All" },
    { id: "men", label: locale === "ku" ? "پیاوان" : locale === "ar" ? "رجال" : "Men" },
    { id: "women", label: locale === "ku" ? "ژنان" : locale === "ar" ? "نساء" : "Women" },
    { id: "running", label: locale === "ku" ? "ڕاکردن" : locale === "ar" ? "جري" : "Running" },
    { id: "lifestyle", label: locale === "ku" ? "شێوازی ژیان" : locale === "ar" ? "لايف ستايل" : "Lifestyle" },
    { id: "sale", label: locale === "ku" ? "داشکاندن" : locale === "ar" ? "تخفيضات" : "Sale", isSale: true },
  ];

  // Men/Women get their own brand colour (blue / pink) instead of the
  // generic primary accent; every other tab keeps the default styling.
  const tabClassName = (tab: (typeof filterTabs)[number]) => {
    const active = filter === tab.id;
    if (tab.isSale) {
      return active
        ? "bg-[#E01B24] text-white shadow-xs"
        : "border border-[#E01B24]/40 text-[#E01B24] hover:bg-[#E01B24]/10";
    }
    if (tab.id === "men") {
      return active
        ? "bg-blue-600 text-white border border-blue-600 shadow-xs"
        : "border border-blue-500/50 bg-card text-blue-600 dark:text-blue-400 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30";
    }
    if (tab.id === "women") {
      return active
        ? "bg-pink-600 text-white border border-pink-600 shadow-xs"
        : "border border-pink-500/50 bg-card text-pink-600 dark:text-pink-400 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/30";
    }
    return active
      ? "bg-primary text-primary-foreground border border-primary shadow-xs"
      : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
      <PromoCarousel />

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex-none px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${tabClassName(tab)}`}
          >
            {tab.isSale && <Flame className="w-3.5 h-3.5" />}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Collection Header: title on the left, pairs count + sort together on the right */}
      <div className="flex items-center justify-between pt-1 gap-3">
        <h1 className="text-sm font-bold text-foreground uppercase tracking-wider">
          {filter === "all"
            ? locale === "ku"
              ? "کۆلێکشن"
              : locale === "ar"
                ? "التشكيلة"
                : "Collection"
            : filterTabs.find((t) => t.id === filter)?.label}
        </h1>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-muted-foreground">
            {filteredProducts.length}{" "}
            {locale === "ku" ? "جووت" : locale === "ar" ? "زوج" : "pairs"}
          </span>
          <button
            onClick={() => setSortOpen(true)}
            className="h-8 px-3 rounded-full border border-border bg-card flex items-center gap-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{locale === "ku" ? "ڕیزکردن" : locale === "ar" ? "ترتيب" : "Sort"}</span>
          </button>
        </div>
      </div>

      {/* Full Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {filteredProducts.map((product, idx) => (
          <ProductCard key={product.slug} product={product} priority={idx < 4} />
        ))}
      </div>

      {/* Sort Sheet Drawer */}
      <SortSheet
        open={sortOpen}
        onOpenChange={setSortOpen}
        currentSort={currentSort}
        onSelectSort={setCurrentSort}
      />
    </div>
  );
}

