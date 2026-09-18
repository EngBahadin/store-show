"use client";

import {
  ArrowLeft,
  Heart,
  Play,
  Share2,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { toast } from "sonner";

import { WhatsAppIcon } from "@/components/common/floating-whatsapp";
import { SizeGuideDialog } from "@/components/commerce/size-guide-dialog";
import { SizePicker } from "@/components/commerce/size-picker";
import {
  brands,
  getBlur,
  isLifestylePhoto,
  relatedTo,
  type Product,
} from "@/data/products";
import { discountPercent, formatPrice, formatRelativeTime } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
// Cart is hidden for now, see the note near handleAddToCart below.
// import { useCart } from "@/lib/store/cart";
import { useMountTime } from "@/lib/store/persisted";
import { useRecentlyViewed } from "@/lib/store/recently-viewed";
import { useWishlist } from "@/lib/store/wishlist";
import { buildProductWhatsAppUrl } from "@/lib/whatsapp";

interface ProductDetailClientProps {
  product: Product;
  locale: Locale;
}

export function ProductDetailClient({
  product,
  locale,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { href } = useI18n();
  // const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { addView } = useRecentlyViewed();

  // No size is pre-selected. The seller's whole point is a WhatsApp message
  // that leaves nothing left to ask — so the order button stays visibly
  // inactive until the buyer has actually made a choice, and turning it on
  // is the moment that proves the mechanic works.
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    addView(product.slug);
  }, [addView, product.slug]);

  // Real clock, frozen at hydration (see useMountTime) — used only to render
  // an honest "added X ago" line straight from the product's own `addedAt`.
  // Never a fabricated view or click count.
  const now = useMountTime(new Date(product.addedAt).getTime());
  const addedLabel =
    locale === "ku"
      ? `زیادکراوە ${formatRelativeTime(product.addedAt, now, locale)}`
      : locale === "ar"
        ? `أُضيف ${formatRelativeTime(product.addedAt, now, locale)}`
        : `Added ${formatRelativeTime(product.addedAt, now, locale)}`;

  const currency = locale === "en" ? "IQD" : "د.ع";
  const isFavorited = has(product.slug);

  const availableCount =
    product.sizes.length - (product.soldOutSizes?.length || 0);

  const similarItems = useMemo(
    () => relatedTo(product, 4),
    [product],
  );

  const discount =
    product.compareAt && product.compareAt > product.price
      ? discountPercent(product.compareAt, product.price)
      : null;

  const handleWhatsAppOrder = () => {
    if (!selectedSize) return;
    const url = buildProductWhatsAppUrl(product, selectedSize, locale);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Cart is hidden for now — the primary "Order on WhatsApp" button above
  // already handles a single item/size end to end, so the secondary "Add to
  // Cart" button (and this handler) are commented out rather than deleted.
  // To bring the cart back: restore the useCart import/hook above, this
  // handler, and the button block below.
  // const handleAddToCart = () => {
  //   if (!selectedSize) return;
  //   add(product.slug, selectedSize, 1);
  //   toast.success(
  //     locale === "ku"
  //       ? `${product.name} خرایە سەبەتەوە`
  //       : locale === "ar"
  //         ? `تمت إضافة ${product.name} إلى السلة`
  //         : `${product.name} added to cart`,
  //   );
  // };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} — RAVEN`,
          text: product.description[locale],
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(
        locale === "ku"
          ? "لینکی کاڵاکە لەبەرگیرایەوە"
          : "Product link copied",
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 text-foreground transition-colors">
      {/* Top Breadcrumbs / Back navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            aria-label="Back"
            className="p-2 -ms-2 hover:bg-secondary rounded-full text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <Link href={href("/")} className="hover:text-foreground">
              {locale === "ku" ? "سەرەکی" : "Home"}
            </Link>
            <span>/</span>
            <Link href={href("/shop")} className="hover:text-foreground">
              {locale === "ku" ? "فرۆشگا" : "Shop"}
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold truncate max-w-[200px]">
              {product.name}
            </span>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full border border-border hover:bg-secondary"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{locale === "ku" ? "هاوبەشکردن" : locale === "ar" ? "مشاركة" : "Share"}</span>
        </button>
      </div>

      {/* Main Product Layout: 2 Columns on Desktop, Single Column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Showcase & Gallery (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full aspect-square bg-secondary/50 dark:bg-secondary/30 rounded-2xl overflow-hidden border border-border shadow-sm">
            <Image
              src={`/products/${product.slug}.webp`}
              alt={product.name}
              fill
              priority
              placeholder={getBlur(product.slug) ? "blur" : "empty"}
              blurDataURL={getBlur(product.slug)}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={
                isLifestylePhoto(product)
                  ? "object-cover object-center"
                  : "object-contain p-6 sm:p-10 drop-shadow-sm transition-transform duration-500 hover:scale-105"
              }
            />

            {/* Wishlist floating toggle */}
            <button
              onClick={() => toggle(product.slug)}
              aria-label="Save to Wishlist"
              className="absolute top-4 end-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center text-foreground hover:bg-background active:scale-95 transition-all shadow-md"
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorited ? "fill-[#E01B24] text-[#E01B24]" : "text-foreground"
                }`}
              />
            </button>

            {/* In stock badge */}
            <div className="absolute top-4 start-4">
              <span className="bg-background/80 backdrop-blur-md border border-border text-foreground text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                {locale === "ku" ? "بەردەستە لە سلێمانی" : locale === "ar" ? "متوفر في السليمانية" : "In Stock Sulaymaniyah"}
              </span>
            </div>

            {/* Video preview badge */}
            {product.videoUrl && (
              <a
                href={product.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 start-4 inline-flex items-center gap-2 bg-background/90 backdrop-blur-md border border-border rounded-full px-3.5 py-1.5 text-xs font-semibold hover:bg-background text-foreground transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-foreground text-foreground" />
                <span>{locale === "ku" ? "ڤیدیۆی کاڵا" : locale === "ar" ? "فيديو المنتج" : "Watch Video"}</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Details, Sizes, CTAs & Store Guarantees (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Brand & Item Code */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="uppercase tracking-wider font-bold text-foreground bg-secondary px-2.5 py-1 rounded-md">
              {brands.find((b) => b.id === product.brand)?.name ?? product.brand}
            </span>
            <span>
              {locale === "ku" ? "کۆدی کاڵا" : locale === "ar" ? "رمز المنتج" : "Code"}:{" "}
              <span className="font-mono text-foreground font-semibold">{product.code}</span>
            </span>
          </div>

          {/* Product Name */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-snug tracking-tight">
            {product.name}
          </h1>

          {/* Honest freshness line — real addedAt, not a claim */}
          <p className="text-[11px] text-muted-foreground -mt-3">{addedLabel}</p>

          {/* Pricing line */}
          {product.price === 0 ? (
            <div className="text-lg font-bold text-muted-foreground">
              {locale === "ku"
                ? "داوای نرخ بکە"
                : locale === "ar"
                  ? "طلب السعر"
                  : "Price on request"}
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl font-extrabold tracking-tight text-foreground">
                {formatPrice(product.price, currency)}
              </span>
              {product.compareAt && product.compareAt > product.price && (
                <>
                  <span className="text-base text-muted-foreground line-through">
                    {formatPrice(product.compareAt, "").trim()}
                  </span>
                  <span className="bg-[#E01B24] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {`-${discount}%`}
                  </span>
                </>
              )}
            </div>
          )}

          {/* Colorway & Short Details */}
          <div className="p-3.5 rounded-xl bg-secondary/50 border border-border text-xs leading-relaxed space-y-1">
            <p className="font-bold text-foreground">
              {product.colorway[locale]}
            </p>
            <p className="text-muted-foreground">{product.description[locale]}</p>
          </div>

          {/* Size Selection Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-foreground">
                {locale === "ku" ? "قەبارەی بەردەست (EU)" : locale === "ar" ? "المقاسات المتاحة (EU)" : "Select Size (EU)"}
              </span>

              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
              >
                {locale === "ku"
                  ? "ڕێنمایی قەبارە"
                  : locale === "ar"
                    ? "دليل المقاسات"
                    : "Size Guide"}
              </button>
            </div>

            {/* Scarcity note — true, derived from real sizes / soldOutSizes,
                promoted to a small badge so it isn't missed */}
            {availableCount > 0 && availableCount <= 2 && (
              <div className="inline-flex items-center gap-1.5 bg-[#E01B24]/10 border border-[#E01B24]/30 text-[#E01B24] text-[11px] font-bold px-2.5 py-1 rounded-full">
                {locale === "ku"
                  ? `تەنها ${availableCount} قەبارە ماوە`
                  : locale === "ar"
                    ? `تبقّى ${availableCount} مقاسات فقط`
                    : `Only ${availableCount} sizes left`}
              </div>
            )}

            {/* Size Picker with sold out diagonal slash */}
            <SizePicker
              sizes={product.sizes}
              soldOutSizes={product.soldOutSizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />

            {/* Self-explaining hint — replaces needing anyone to say why the
                button below is greyed out */}
            {!selectedSize && (
              <p className="text-[11px] text-muted-foreground pt-0.5">
                {locale === "ku"
                  ? "قەبارەیەک هەڵبژێرە بۆ ئەوەی پەیامی واتسئاپ ئامادە بێت"
                  : locale === "ar"
                    ? "اختر مقاساً لتجهيز رسالة واتساب"
                    : "Pick a size to prepare your WhatsApp message"}
              </p>
            )}
          </div>

          {/* CTA Buttons: Primary WhatsApp Checkout & Add to Cart */}
          <div className="space-y-3 pt-4">
            {/* Primary WhatsApp Order CTA with official branding — visibly
                inactive until a size is chosen, so tapping a size is what
                "unlocks" it and the mechanic proves itself without a word
                of explanation. */}
            <button
              onClick={handleWhatsAppOrder}
              disabled={!selectedSize}
              aria-disabled={!selectedSize}
              className={`w-full h-13 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                selectedSize
                  ? "bg-[#25D366] hover:bg-[#20bd5a] text-white active:scale-[0.98] hover:shadow-xl cursor-pointer"
                  : "bg-secondary text-muted-foreground shadow-none cursor-not-allowed"
              }`}
            >
              <WhatsAppIcon
                className={`w-5 h-5 ${selectedSize ? "fill-white" : "fill-muted-foreground"}`}
              />
              <span>
                {locale === "ku"
                  ? "داوای بکە لە واتسئاپ"
                  : locale === "ar"
                    ? "اطلب عبر واتساب"
                    : "Order on WhatsApp"}
              </span>
            </button>

            {/* Add to Cart secondary button — hidden for now, see the note
            near handleAddToCart above.
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              aria-disabled={!selectedSize}
              className={`w-full h-12 border rounded-full font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors ${
                selectedSize
                  ? "border-border bg-secondary text-foreground hover:bg-secondary/80 cursor-pointer"
                  : "border-border/50 bg-secondary/40 text-muted-foreground/60 cursor-not-allowed"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {locale === "ku"
                  ? "خستنە سەبەتە"
                  : locale === "ar"
                    ? "إضافة إلى السلة"
                    : "Add to Cart"}
              </span>
            </button>
            */}
          </div>

          {/* Store Guarantees Card */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border text-xs">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/40 border border-border">
              <ShieldCheck className="w-4 h-4 text-[#E01B24] shrink-0" />
              <div>
                <p className="font-bold text-foreground">
                  {locale === "ku" ? "100% ڕەسەن" : "100% Authentic"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {locale === "ku" ? "ڕاستەوخۆ لە ڕەفەوە" : "Direct from shelves"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary/40 border border-border">
              <Truck className="w-4 h-4 text-[#E01B24] shrink-0" />
              <div>
                <p className="font-bold text-foreground">
                  {locale === "ku" ? "گەیاندنی خێرا" : "Fast Delivery"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {locale === "ku"
                    ? "سلێمانی و تەواوی عێراق"
                    : locale === "ar"
                      ? "السليمانية وكل العراق"
                      : "Sulaymaniyah & all Iraq"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Items Section */}
      {similarItems.length > 0 && (
        <div className="mt-14 border-t border-border pt-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">
              {locale === "ku"
                ? "کاڵای هاوشێوە"
                : locale === "ar"
                  ? "منتجات مشابهة"
                  : "Similar Pairs"}
            </h2>
            <Link
              href={href("/shop")}
              className="text-xs text-muted-foreground hover:text-foreground font-semibold"
            >
              {locale === "ku" ? "هەموو ببینە" : "View all"}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {similarItems.map((item) => (
              <Link
                key={item.slug}
                href={href(`/product/${item.slug}`)}
                className="group flex flex-col space-y-2 p-2.5 rounded-xl border border-border/80 bg-white dark:bg-card hover:border-foreground/30 transition-all shadow-2xs"
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white dark:bg-secondary/20">
                  <Image
                    src={`/products/${item.slug}.webp`}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    placeholder={getBlur(item.slug) ? "blur" : "empty"}
                    blurDataURL={getBlur(item.slug)}
                    className={`${
                      isLifestylePhoto(item)
                        ? "object-cover object-center"
                        : "object-contain p-2.5 sm:p-3"
                    } transition-transform duration-300 group-hover:scale-105`}
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground line-clamp-1 group-hover:underline">
                    {item.name}
                  </div>
                  <div className="text-xs font-extrabold text-foreground mt-1">
                    {item.price > 0
                      ? formatPrice(item.price, currency)
                      : locale === "ku"
                        ? "داوای نرخ"
                        : "Ask price"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideDialog
        open={sizeGuideOpen}
        onOpenChange={setSizeGuideOpen}
      />
    </div>
  );
}
