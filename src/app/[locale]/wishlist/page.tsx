"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { EmptyState } from "@/components/commerce/empty-state";
import { ProductCard } from "@/components/commerce/product-card";
import { allProducts } from "@/data/products";
import { useI18n } from "@/lib/i18n/provider";
import { useWishlist } from "@/lib/store/wishlist";

export default function WishlistPage() {
  const { href, locale } = useI18n();
  const { items, hydrated } = useWishlist();

  const products = allProducts();

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => items.includes(p.slug));
  }, [products, items]);

  if (!hydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-xs text-[#8A8A8A]">
        Loading wishlist...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24 text-foreground transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#E01B24] fill-[#E01B24]" />
          <span>
            {locale === "ku"
              ? "دڵخوازەکان"
              : locale === "ar"
                ? "قائمة الرغبات"
                : "My Wishlist"}
          </span>
        </h1>
        <span className="text-xs text-muted-foreground">
          {wishlistProducts.length}{" "}
          {locale === "ku" ? "کاڵا" : "items"}
        </span>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <EmptyState
            type="empty-store"
            title={
              locale === "ku"
                ? "هیچ کاڵایەکت لە دڵخوازەکان دانەناوە"
                : "No saved items in your wishlist"
            }
            subtitle={
              locale === "ku"
                ? "کرتە لە ئایکۆنی دڵ بکە لەسەر هەر پێڵاوێک بۆ هەڵگرتنی."
                : "Click the heart icon on any pair to save it here."
            }
          />
          <Link
            href={href("/shop")}
            className="inline-block bg-primary text-primary-foreground font-bold text-xs px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            {locale === "ku" ? "گەڕان لە پێڵاوەکان" : "Explore Sneakers"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {wishlistProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
