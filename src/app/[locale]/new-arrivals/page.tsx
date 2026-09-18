"use client";

import { ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { ProductCard } from "@/components/commerce/product-card";
import { newArrivals as getNewArrivals } from "@/data/products";
import { useI18n } from "@/lib/i18n/provider";

export default function NewArrivalsPage() {
  const router = useRouter();
  const { locale } = useI18n();

  const products = useMemo(() => getNewArrivals(), []);

  // Group products by drop date matching Screen 05
  const dropGroupA = products.slice(0, 4);
  const dropGroupB = products.slice(4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 pb-24 text-foreground transition-colors">
      {/* Top Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="p-1.5 -ms-1.5 hover:bg-secondary rounded-full text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </button>

        <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#E01B24]" />
          <span>
            {locale === "ku"
              ? "نوێهاتووەکان"
              : locale === "ar"
                ? "وصل حديثاً"
                : "New Arrivals"}
          </span>
        </h1>
      </div>

      {/* Date Drop 1: 14 September */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between pb-2 border-b border-border">
          <span className="text-base sm:text-lg font-extrabold text-foreground">
            {locale === "ku" ? "14 ئەیلوول" : locale === "ar" ? "14 أيلول" : "14 September"}
          </span>
          <span className="text-xs text-muted-foreground">
            {dropGroupA.length} {locale === "ku" ? "کاڵا" : "items"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {dropGroupA.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>

      {/* Date Drop 2: 11 September */}
      <div className="space-y-4 pt-4">
        <div className="flex items-baseline justify-between pb-2 border-b border-border">
          <span className="text-base sm:text-lg font-extrabold text-foreground">
            {locale === "ku" ? "11 ئەیلوول" : locale === "ar" ? "11 أيلول" : "11 September"}
          </span>
          <span className="text-xs text-muted-foreground">
            {dropGroupB.length} {locale === "ku" ? "کاڵا" : "items"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {dropGroupB.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
