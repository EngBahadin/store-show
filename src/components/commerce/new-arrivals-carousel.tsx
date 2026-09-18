"use client";

import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";

interface NewArrivalsCarouselProps {
  products: Product[];
}

export function NewArrivalsCarousel({ products }: NewArrivalsCarouselProps) {
  const { href, locale } = useI18n();
  const currency = locale === "en" ? "IQD" : "د.ع";

  return (
    <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-2 pt-1 px-4 -mx-4">
      {products.map((p) => (
        <Link
          key={p.slug}
          href={href(`/product/${p.slug}`)}
          className="flex-none w-[122px] sm:w-[136px] flex flex-col gap-1.5 group"
        >
          <div className="relative w-full aspect-[122/150] rounded-xl overflow-hidden border border-border bg-secondary shadow-xs">
            <Image
              src={`/products/${p.slug}.webp`}
              alt={p.name}
              fill
              sizes="136px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute top-2 end-2 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
              {locale === "ku" ? "نوێ" : locale === "ar" ? "جديد" : "NEW"}
            </span>
          </div>

          <div className="flex flex-col gap-0.5 px-0.5">
            <span className="text-[11px] font-semibold text-foreground line-clamp-1 group-hover:underline">
              {p.name}
            </span>
            <span className="text-xs font-bold text-foreground">
              {p.price > 0
                ? formatPrice(p.price, currency)
                : locale === "ku"
                  ? "داوای نرخ"
                  : locale === "ar"
                    ? "طلب السعر"
                    : "Ask price"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
