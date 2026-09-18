"use client";

import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Plus,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { useI18n } from "@/lib/i18n/provider";
import { useSeller } from "@/lib/store/seller-store";

interface SellerDashboardProps {
  onOpenAddProduct: () => void;
  onOpenDiscountModal: () => void;
  onNavigateToInventory: () => void;
}

export function SellerDashboard({
  onOpenAddProduct,
  onOpenDiscountModal,
  onNavigateToInventory,
}: SellerDashboardProps) {
  const { locale } = useI18n();
  const { products, healthScore, staleCount, unpricedCount, soldOutCount } =
    useSeller();
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");

  const totalProducts = products.length;
  const updatedCount = Math.max(0, totalProducts - staleCount);

  // Mock period stats matching design Screen 08
  const stats = {
    "7d": { visits: "1,240", views: "3,810", waClicks: "146", shares: "28" },
    "30d": { visits: "5,420", views: "14,300", waClicks: "580", shares: "112" },
    "90d": { visits: "18,600", views: "46,200", waClicks: "1,940", shares: "340" },
  }[period];

  const topProducts = products.slice(0, 5);

  return (
    <div className="space-y-6 pb-24 md:pb-6 text-foreground transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Health, Needs Action, Traffic Stats (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Store Health Card */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
            <div className="text-xs text-muted-foreground font-medium">
              {locale === "ku"
                ? "تەندروستی فرۆشگا"
                : locale === "ar"
                  ? "صحة المتجر"
                  : "Store Health"}
              {healthScore >= 90
                ? " — باش"
                : healthScore >= 60
                  ? " — مامناوەند"
                  : " — پێویستی بە سەرنجە"}
            </div>

            <div className="text-4xl font-extrabold tracking-tight text-foreground">
              {healthScore}%
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  healthScore >= 85
                    ? "bg-primary"
                    : healthScore >= 60
                      ? "bg-muted-foreground"
                      : "bg-[#E01B24]"
                }`}
                style={{ width: `${healthScore}%` }}
              />
            </div>

            <div className="text-xs text-muted-foreground leading-relaxed">
              {locale === "ku"
                ? `${updatedCount} لە ${totalProducts} کاڵا لە 14 ڕۆژی ڕابردوودا نوێکراونەتەوە`
                : locale === "ar"
                  ? `${updatedCount} من أصل ${totalProducts} منتج تم تحديثها خلال آخر 14 يوماً`
                  : `${updatedCount} of ${totalProducts} products updated in the last 14 days`}
            </div>
          </div>

          {/* 2. Needs Action */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="p-4 border-b border-border text-xs font-bold uppercase tracking-wider text-foreground">
              {locale === "ku"
                ? "پێویستی بە چارەسەرە"
                : locale === "ar"
                  ? "يحتاج إلى إجراء"
                  : "Needs Action"}
            </div>

            <div className="divide-y divide-border">
              <button
                onClick={onNavigateToInventory}
                className="w-full flex items-center gap-3.5 p-4 text-start hover:bg-secondary transition-colors cursor-pointer"
              >
                <span className="text-base font-extrabold w-6 text-center text-foreground">
                  {staleCount}
                </span>
                <span className="flex-1 text-xs text-foreground/80">
                  {locale === "ku"
                    ? "کاڵا 30 ڕۆژە نوێ نەکراونەتەوە"
                    : locale === "ar"
                      ? "منتجات لم يتم تحديثها منذ 30 يوماً"
                      : "products not updated for 30 days"}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground rtl:rotate-180" />
              </button>

              <button
                onClick={onNavigateToInventory}
                className="w-full flex items-center gap-3.5 p-4 text-start hover:bg-secondary transition-colors cursor-pointer"
              >
                <span className="text-base font-extrabold w-6 text-center text-foreground">
                  {unpricedCount}
                </span>
                <span className="flex-1 text-xs text-foreground/80">
                  {locale === "ku"
                    ? "کاڵا نرخیان نییە (داوای نرخ)"
                    : locale === "ar"
                      ? "منتجات بلا سعر محدد"
                      : "products have no fixed price"}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground rtl:rotate-180" />
              </button>

              <button
                onClick={onNavigateToInventory}
                className="w-full flex items-center gap-3.5 p-4 text-start hover:bg-secondary transition-colors cursor-pointer"
              >
                <span className="text-base font-extrabold w-6 text-center text-foreground">
                  {soldOutCount}
                </span>
                <span className="flex-1 text-xs text-foreground/80">
                  {locale === "ku"
                    ? "کاڵا هەموو قەبارەکانیان فرۆشراوە"
                    : locale === "ar"
                      ? "منتجات نفدت كل مقاساتها"
                      : "products have all sizes sold out"}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* 3. Views & Orders */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                {locale === "ku"
                  ? "چاولێکردن و داواکاری"
                  : locale === "ar"
                    ? "المشاهدات والطلبات"
                    : "Traffic & Orders"}
              </span>
              <div className="flex gap-1.5">
                {(["7d", "30d", "90d"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                      period === p
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "border border-border bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p === "7d"
                      ? locale === "ku"
                        ? "7 ڕۆژ"
                        : "7d"
                      : p === "30d"
                        ? locale === "ku"
                          ? "30 ڕۆژ"
                          : "30d"
                        : locale === "ku"
                          ? "90 ڕۆژ"
                          : "90d"}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
              <div className="border border-border bg-card rounded-2xl p-3.5 space-y-1 shadow-xs">
                <div className="text-[11px] text-muted-foreground">
                  {locale === "ku"
                    ? "سەردانی فرۆشگا"
                    : locale === "ar"
                      ? "زيارات المتجر"
                      : "Store Visits"}
                </div>
                <div className="text-xl font-extrabold text-foreground">{stats.visits}</div>
                <div className="flex items-center gap-1 text-[#27C06A] text-[10px] font-bold">
                  <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                  <span>18%</span>
                </div>
              </div>

              <div className="border border-border bg-card rounded-2xl p-3.5 space-y-1 shadow-xs">
                <div className="text-[11px] text-muted-foreground">
                  {locale === "ku"
                    ? "چاولێکردنی کاڵا"
                    : locale === "ar"
                      ? "مشاهدات المنتجات"
                      : "Product Views"}
                </div>
                <div className="text-xl font-extrabold text-foreground">{stats.views}</div>
                <div className="flex items-center gap-1 text-[#27C06A] text-[10px] font-bold">
                  <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                  <span>9%</span>
                </div>
              </div>

              <div className="border border-border bg-card rounded-2xl p-3.5 space-y-1 shadow-xs">
                <div className="text-[11px] text-muted-foreground">
                  {locale === "ku"
                    ? "کرتە لە واتسئاپ"
                    : locale === "ar"
                      ? "نقرات واتساب"
                      : "WhatsApp Clicks"}
                </div>
                <div className="text-xl font-extrabold text-foreground">{stats.waClicks}</div>
                <div className="flex items-center gap-1 text-[#E01B24] text-[10px] font-bold">
                  <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                  <span>6%</span>
                </div>
              </div>

              <div className="border border-border bg-card rounded-2xl p-3.5 space-y-1 shadow-xs">
                <div className="text-[11px] text-muted-foreground">
                  {locale === "ku"
                    ? "هاوبەشکردن"
                    : locale === "ar"
                      ? "المشاركات"
                      : "Shares"}
                </div>
                <div className="text-xl font-extrabold text-foreground">{stats.shares}</div>
                <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-bold">
                  <span className="w-2 h-0.5 bg-muted-foreground" />
                  <span>0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Today Summary, Most Viewed, Action CTAs (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Today Summary */}
          <div className="space-y-2.5">
            <div className="text-xs text-muted-foreground font-semibold">
              {locale === "ku" ? "چالاکییەکانی ئەمڕۆ" : locale === "ar" ? "نشاط اليوم" : "Today's Pulse"}
            </div>
            <div className="border border-border rounded-2xl bg-card flex items-center divide-x divide-border rtl:divide-x-reverse shadow-xs">
              <div className="flex-1 py-3.5 text-center">
                <div className="text-lg font-extrabold text-foreground">15</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {locale === "ku" ? "زیادکراو" : locale === "ar" ? "أُضيف" : "Added"}
                </div>
              </div>
              <div className="flex-1 py-3.5 text-center">
                <div className="text-lg font-extrabold text-foreground">3</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {locale === "ku" ? "فرۆشراو" : locale === "ar" ? "بيع" : "Sold"}
                </div>
              </div>
              <div className="flex-1 py-3.5 text-center">
                <div className="text-lg font-extrabold text-foreground">12</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {locale === "ku" ? "ماوە" : locale === "ar" ? "متبقي" : "Remaining"}
                </div>
              </div>
            </div>
          </div>

          {/* Most Viewed Ranking */}
          <div className="border border-border rounded-2xl bg-card p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-bold text-foreground">
                {locale === "ku"
                  ? "زۆرترین سەیرکراو"
                  : locale === "ar"
                    ? "الأكثر مشاهدة"
                    : "Most Viewed Pairs"}
              </span>
              <button
                onClick={onNavigateToInventory}
                className="text-[11px] text-muted-foreground hover:text-foreground font-semibold cursor-pointer"
              >
                {locale === "ku" ? "تەواوی ببینە" : "View all"}
              </button>
            </div>

            <div className="divide-y divide-border">
              {topProducts.map((p, idx) => (
                <div
                  key={p.slug}
                  className="py-2.5 flex items-center gap-3 text-xs"
                >
                  <span className="w-4 text-center text-muted-foreground font-bold">
                    {idx + 1}
                  </span>
                  <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-secondary shrink-0 border border-border">
                    <Image
                      src={`/products/${p.slug}.webp`}
                      alt={p.name}
                      fill
                      sizes="36px"
                      className="object-contain p-0.5"
                    />
                  </div>
                  <span className="flex-1 truncate font-medium text-foreground">
                    {p.name}
                  </span>
                  <span className="font-bold text-foreground">
                    {Math.round(p.popularity * 8.5)}
                  </span>
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#27C06A] shrink-0 w-10 justify-end">
                    <ArrowUp className="w-2.5 h-2.5 stroke-[3]" />
                    {Math.round(p.popularity / 5)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={onOpenAddProduct}
              className="w-full h-12 bg-primary text-primary-foreground rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>
                {locale === "ku"
                  ? "زیادکردنی پێڵاوی نوێ"
                  : locale === "ar"
                    ? "إضافة منتج جديد"
                    : "Add New Product"}
              </span>
            </button>

            <button
              onClick={onOpenDiscountModal}
              className="w-full h-12 border border-[#E01B24] text-[#E01B24] hover:bg-[#E01B24]/10 rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Tag className="w-4 h-4" />
              <span>
                {locale === "ku"
                  ? "داشکاندنی سەرجەم فرۆشگا"
                  : locale === "ar"
                    ? "تخفيض شامل"
                    : "Store-Wide Discount"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
