"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { isNewArrival, type Product } from "@/data/products";
import { discountPercent, formatPrice } from "@/lib/format";
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

  const isSoldOut =
    product.stock === 0 ||
    (product.soldOutSizes &&
      product.soldOutSizes.length >= product.sizes.length);

  const isNew = isNewArrival(product);

  const discount =
    product.compareAt && product.compareAt > product.price
      ? discountPercent(product.compareAt, product.price)
      : null;

  return (
    <div className="group relative flex flex-col gap-2">
      {/* Image container */}
      <Link
        href={href(`/product/${product.slug}`)}
        className="relative w-full aspect-[3/4] bg-secondary rounded-xl border border-border overflow-hidden block shadow-xs"
      >
        <Image
          src={`/products/${product.slug}.webp`}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
            isSoldOut ? "opacity-40" : ""
          }`}
        />

        {/* Badges */}
        <div className="absolute top-2.5 start-2.5 flex flex-col gap-1.5 z-10">
          {isNew && !isSoldOut && (
            <span className="bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {locale === "ku" ? "نوێ" : locale === "ar" ? "جديد" : "NEW"}
            </span>
          )}
          {discount && !isSoldOut && (
            <span className="bg-[#E01B24] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {`-${discount}%`}
            </span>
          )}
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
        <Link
          href={href(`/product/${product.slug}`)}
          className="text-xs sm:text-[13px] text-foreground font-medium line-clamp-2 leading-snug hover:underline transition-colors"
        >
          {product.name}
        </Link>

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
