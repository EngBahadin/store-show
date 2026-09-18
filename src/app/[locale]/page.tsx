"use client";

import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { WhatsAppIcon } from "@/components/common/floating-whatsapp";
import { NewArrivalsCarousel } from "@/components/commerce/new-arrivals-carousel";
import { ProductCard } from "@/components/commerce/product-card";
import { SortSheet, type SortOption } from "@/components/commerce/sort-sheet";
import { allProducts, newArrivals as getNewArrivals } from "@/data/products";
import { useI18n } from "@/lib/i18n/provider";
import { buildContactWhatsAppUrl } from "@/lib/whatsapp";

export default function StorefrontPage() {
  const { href, locale } = useI18n();

  const [sortOpen, setSortOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const rawProducts = allProducts();
  const newArrivalList = useMemo(() => getNewArrivals().slice(0, 6), []);

  const sortedProducts = useMemo(() => {
    const list = [...rawProducts];
    if (searchQuery.trim()) {
      return list.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.code.toLowerCase().includes(searchQuery.toLowerCase()),
      );
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
  }, [rawProducts, currentSort, searchQuery]);

  const whatsappContactUrl = buildContactWhatsAppUrl(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      {/* 1. Search Bar (Screen 01) */}
      <div className="relative">
        <div className="flex items-center gap-2.5 bg-card border border-border rounded-full px-4 h-12 shadow-xs transition-colors">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === "ku"
                ? "گەڕان بۆ هۆکا، جۆردان، نایکی، ئەدیداس..."
                : locale === "ar"
                  ? "ابحث عن هوكا، جوردان، نايكي، أديداس..."
                  : "Search for Hoka, Jordan, Nike, Adidas..."
            }
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      {/* 2. Category Cards Grid (Responsive: 2 cols on mobile, 4 cols on tablet/desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Men */}
        <Link
          href={href("/shop?gender=men")}
          className="relative h-[92px] sm:h-[120px] md:h-[140px] lg:h-[160px] rounded-xl sm:rounded-2xl overflow-hidden border border-border group block shadow-xs"
        >
          <Image
            src="/products/adidas-x9000-l4-black-red.webp"
            alt="Men"
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover opacity-60 dark:opacity-55 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <span className="absolute bottom-2.5 sm:bottom-4 start-3 sm:start-4 text-sm sm:text-base font-bold text-white tracking-tight">
            {locale === "ku" ? "پیاوان" : locale === "ar" ? "رجال" : "Men"}
          </span>
        </Link>

        {/* Women */}
        <Link
          href={href("/shop?gender=women")}
          className="relative h-[92px] sm:h-[120px] md:h-[140px] lg:h-[160px] rounded-xl sm:rounded-2xl overflow-hidden border border-border group block shadow-xs"
        >
          <Image
            src="/products/skechers-arch-fit-olive.webp"
            alt="Women"
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover opacity-60 dark:opacity-55 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <span className="absolute bottom-2.5 sm:bottom-4 start-3 sm:start-4 text-sm sm:text-base font-bold text-white tracking-tight">
            {locale === "ku" ? "ژنان" : locale === "ar" ? "نساء" : "Women"}
          </span>
        </Link>

        {/* Kids / Lifestyle */}
        <Link
          href={href("/shop?category=lifestyle")}
          className="relative h-[92px] sm:h-[120px] md:h-[140px] lg:h-[160px] rounded-xl sm:rounded-2xl overflow-hidden border border-border group block shadow-xs"
        >
          <Image
            src="/products/adidas-runfalcon-black.webp"
            alt="Kids"
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover opacity-60 dark:opacity-55 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <span className="absolute bottom-2.5 sm:bottom-4 start-3 sm:start-4 text-sm sm:text-base font-bold text-white tracking-tight">
            {locale === "ku" ? "منداڵان" : locale === "ar" ? "أطفال" : "Kids"}
          </span>
        </Link>

        {/* Sale / Discounts */}
        <Link
          href={href("/shop?sale=true")}
          className="relative h-[92px] sm:h-[120px] md:h-[140px] lg:h-[160px] rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-border flex items-end p-3 sm:p-4 group block shadow-xs"
        >
          <div className="absolute top-1 sm:top-2 end-1 sm:end-2 w-14 sm:w-20 h-14 sm:h-20 opacity-90 transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/misc/sale-tags.avif"
              alt="Sale"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm sm:text-base font-extrabold text-[#0A0A0A] relative z-10">
            {locale === "ku" ? "داشکاندن" : locale === "ar" ? "تخفيضات" : "Sale"}
          </span>
        </Link>
      </div>

      {/* 3. New Arrivals Header & Horizontal Carousel (Screen 01) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-foreground" />
            <h2 className="text-base font-bold text-foreground tracking-tight">
              {locale === "ku"
                ? "نوێهاتووەکان"
                : locale === "ar"
                  ? "وصل حديثاً"
                  : "New Arrivals"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={href("/new-arrivals")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {locale === "ku" ? "تەواوی بینینی" : locale === "ar" ? "عرض الكل" : "View all"}
            </Link>

            <button
              onClick={() => setSortOpen(true)}
              className="text-xs font-semibold text-foreground border border-border rounded-full px-3 py-1 flex items-center gap-1.5 hover:bg-secondary transition-colors"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>
                {locale === "ku" ? "ڕیزکردن" : locale === "ar" ? "ترتيب" : "Sort"}
              </span>
            </button>
          </div>
        </div>

        <NewArrivalsCarousel products={newArrivalList} />
      </div>

      {/* 4. Full Products Grid (Screen 01, responsive 2 to 4 columns) */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
            {locale === "ku" ? "هەموو کۆلێکشنەکە" : locale === "ar" ? "كل التشكيلة" : "Full Collection"}
          </h2>
          <span className="text-xs text-muted-foreground">
            {sortedProducts.length}{" "}
            {locale === "ku" ? "جووت" : locale === "ar" ? "زوج" : "pairs"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {sortedProducts.map((product, idx) => (
            <ProductCard key={product.slug} product={product} priority={idx < 4} />
          ))}
        </div>
      </div>

      {/* 5. Official WhatsApp Contact Banner (Screen 01) */}
      <div className="pt-2">
        <a
          href={whatsappContactUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-14 bg-card border border-border rounded-xl sm:rounded-2xl flex items-center justify-center gap-3 text-foreground font-bold text-sm hover:bg-secondary transition-all shadow-xs group"
        >
          <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-110">
            <WhatsAppIcon className="w-5 h-5 fill-white" />
          </div>
          <span className="text-sm font-bold">
            {locale === "ku"
              ? "پەیوەندیمان پێوە بکە لە واتسئاپ"
              : locale === "ar"
                ? "تواصل معنا مباشرة عبر واتساب"
                : "Contact us on WhatsApp"}
          </span>
        </a>
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
