"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getBlur, isLifestylePhoto, type Product } from "@/data/products";
import { discountPercent, formatPrice, formatSize } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import { useWishlist } from "@/lib/store/wishlist";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { href, locale } = useI18n();
  const { has, toggle } = useWishlist();

  const isFavorited = has(product.slug);
  const currency = locale === "en" ? "IQD" : "د.ع";
  const isLifestyle = isLifestylePhoto(product);
  const blur = getBlur(product.slug);

  const isSoldOut =
    product.stock === 0 ||
    (product.soldOutSizes &&
      product.soldOutSizes.length >= product.sizes.length);

  const discount =
    product.compareAt && product.compareAt > product.price
      ? discountPercent(product.price, product.compareAt)
      : null;

  // Most of the catalogue is one physical pair, not a size run — when only
  // one size is actually left, surface it on the card itself so the buyer
  // doesn't have to open the product just to find out it isn't their size.
  const availableSizes = product.sizes.filter(
    (s) => !(product.soldOutSizes || []).includes(s),
  );
  const onlySize = availableSizes.length === 1 ? availableSizes[0] : null;

  return (
    <div className="group relative flex flex-col gap-2">
      {/* Image container */}
      <Link
        href={href(`/product/${product.slug}`)}
        className="relative w-full aspect-square bg-white dark:bg-card rounded-xl border border-border/80 overflow-hidden block shadow-xs"
      >
        <Image
          src={`/products/${product.slug}.webp`}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          placeholder={blur ? "blur" : "empty"}
          blurDataURL={blur}
          className={`${
            isLifestyle
              ? "object-cover object-center"
              : "object-contain p-3 sm:p-4"
          } transition-transform duration-300 group-hover:scale-105 ${
            isSoldOut ? "opacity-40" : ""
          }`}
        />

        {/* Discount is the only badge: almost everything in the catalogue falls
            inside the freshness window, so a "new" badge marked nearly every
            card and stopped meaning anything. */}
        <div className="absolute top-2.5 start-2.5 flex flex-col gap-1.5 z-10">
          {discount && !isSoldOut ? (
            <span className="bg-[#E01B24] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {`-${discount}%`}
            </span>
          ) : null}
        </div>

        {/* Sold out overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <span className="text-xs font-bold text-white border border-white/80 px-3 py-1 rounded-full bg-black/70 backdrop-blur-xs">
              {locale === "ku"
                ? "فرۆشراوە"
                : locale === "ar"
                  ? "نفدت الكمية"
                  : "SOLD OUT"}
            </span>
          </div>
        )}
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggle(product.slug);
        }}
        aria-label="Wishlist"
        className="absolute top-2.5 end-2.5 z-20 w-7 h-7 rounded-full bg-background/80 backdrop-blur-xs border border-border flex items-center justify-center text-foreground transition-transform active:scale-90 shadow-xs"
      >
        <Heart
          className={`w-3.5 h-3.5 ${
            isFavorited ? "fill-[#E01B24] text-[#E01B24]" : "text-muted-foreground"
          }`}
        />
      </button>

      {/* Details */}
      <div className="flex flex-col gap-1 px-0.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <Link
            href={href(`/product/${product.slug}`)}
            className={`text-xs sm:text-[13px] text-foreground font-medium leading-snug hover:underline transition-colors min-w-0 ${
              onlySize ? "truncate" : "line-clamp-2"
            }`}
          >
            {product.name}
          </Link>

          {/* Last size left — beside the name so it doesn't cost the card an
              extra row; only shown when it's the single deciding factor. */}
          {onlySize && !isSoldOut && (
            <span className="shrink-0 whitespace-nowrap text-[9px] sm:text-[10px] font-bold text-[#E01B24] bg-[#E01B24]/10 px-1.5 py-0.5 rounded-full">
              {locale === "ku"
                ? `تەنها ${formatSize(onlySize)}`
                : locale === "ar"
                  ? `${formatSize(onlySize)} فقط`
                  : `Only ${formatSize(onlySize)}`}
            </span>
          )}
        </div>

        {/* Pricing */}
        {product.price === 0 ? (
          <div className="text-xs font-semibold text-muted-foreground">
            {locale === "ku"
              ? "داوای نرخ بکە"
              : locale === "ar"
                ? "طلب السعر"
                : "Ask for Price"}
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-foreground">
              {formatPrice(product.price, currency)}
            </span>
            {product.compareAt && product.compareAt > product.price && (
              <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAt, "").trim()}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
