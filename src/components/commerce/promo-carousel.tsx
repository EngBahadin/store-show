"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  categories,
  getBlur,
  getProduct,
  isLifestylePhoto,
  newArrivals,
  type Product,
} from "@/data/products";
import { discountPercent } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/config";

type SlideId = "new" | "featured" | "running";

/**
 * Which pair fronts each slide. Change a slug here to swap the shoe on show;
 * drop a slide from the map and it falls back to picking from the catalogue.
 */
const PINNED: Partial<Record<SlideId, string>> = {
  featured: "nike-air-max-tavas-red",
};

type Slide = {
  id: SlideId;
  cta: Record<Locale, string>;
  href: string;
  product: Product;
};

/** How long each slide holds before the carousel advances itself. */
const AUTOPLAY_MS = 5000;

/** The pinned shoe for a slide, or the catalogue's own pick. */
function pick(id: SlideId, fallback: () => Product | undefined) {
  const pinned = PINNED[id];
  return (pinned ? getProduct(pinned) : undefined) ?? fallback();
}

/** Slides earn a discount badge from the shoe itself, never by hand. */
function discountBadge(product: Product) {
  return product.compareAt && product.compareAt > product.price
    ? `-${discountPercent(product.price, product.compareAt)}%`
    : undefined;
}

/** The shoe's category, in the reader's language. */
function categoryLabel(product: Product, locale: Locale) {
  return categories.find((c) => c.id === product.category)?.label[locale] ?? "";
}

/** Builds the slides from the catalogue, skipping any with nothing to show. */
function buildSlides(): Slide[] {
  const specs: { id: SlideId; href: string; cta: Record<Locale, string>; fallback: () => Product | undefined }[] = [
    {
      id: "new",
      href: "/new-arrivals",
      cta: { en: "Shop now", ku: "ئێستا بکڕە", ar: "تسوق الآن" },
      fallback: () => newArrivals()[0],
    },
    {
      id: "featured",
      href: "/shop",
      cta: { en: "See details", ku: "وردەکاری ببینە", ar: "عرض التفاصيل" },
      fallback: () => newArrivals().find((p) => p.category === "lifestyle"),
    },
    {
      id: "running",
      href: "/shop?category=running",
      cta: { en: "Explore", ku: "بگەڕێ", ar: "استكشف" },
      fallback: () => newArrivals().find((p) => p.category === "running"),
    },
  ];

  const slides: Slide[] = [];
  for (const spec of specs) {
    const product = pick(spec.id, spec.fallback);
    // Never show the same pair twice, and never show a slide with no shoe.
    if (!product || slides.some((s) => s.product.slug === product.slug)) continue;
    slides.push({
      id: spec.id,
      cta: spec.cta,
      href: spec.id === "featured" ? `/product/${product.slug}` : spec.href,
      product,
    });
  }
  return slides;
}

export function PromoCarousel() {
  const { locale, href, dir } = useI18n();
  const [slides] = useState(buildSlides);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  // Autoplay is a courtesy, not a carrier of meaning. A hovering pointer only
  // holds it while it rests there, but taking control — a swipe, a dot, a
  // keyboard focus — ends it for good. It never starts at all for a visitor
  // who has asked the system to reduce motion.
  const [hovering, setHovering] = useState(false);
  const [stopped, setStopped] = useState(false);

  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    // scrollLeft runs negative in RTL and is 0 on the first slide in both
    // directions, so the sign has to come from the locale, not from the value:
    // reading it live pinned ku/ar to slide 0 forever.
    const sign = dir === "rtl" ? -1 : 1;
    track.scrollTo({ left: sign * index * track.clientWidth, behavior: "smooth" });
  }, [dir]);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.clientWidth) return;
    setActive(Math.round(Math.abs(track.scrollLeft) / track.clientWidth));
  }, []);

  useEffect(() => {
    if (hovering || stopped || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => scrollTo((active + 1) % slides.length),
      AUTOPLAY_MS,
    );
    return () => clearInterval(id);
  }, [active, hovering, stopped, slides.length, scrollTo]);

  if (slides.length === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={
        locale === "ku" ? "بانگەشەکان" : locale === "ar" ? "العروض" : "Promotions"
      }
      onPointerDown={() => setStopped(true)}
      onFocusCapture={() => setStopped(true)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="space-y-2.5"
    >
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none rounded-2xl"
      >
        {slides.map((slide, i) => {
          const blur = getBlur(slide.product.slug);
          // Studio shots are cut out on white, so letting them fill the card
          // would slice the shoe in half; contained on a white card instead,
          // their own background blends into it and the slide still reads
          // edge to edge. A real photo has a real background and just fills.
          const lifestyle = isLifestylePhoto(slide.product);
          return (
            <Link
              key={slide.id}
              href={href(slide.href)}
              aria-hidden={i !== active}
              tabIndex={i === active ? undefined : -1}
              className="relative flex-none w-full snap-center overflow-hidden rounded-2xl bg-white"
            >
              <div className="relative h-[200px] sm:h-[260px] w-full">
                <Image
                  src={`/products/${slide.product.slug}.webp`}
                  alt=""
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  placeholder={blur ? "blur" : "empty"}
                  blurDataURL={blur}
                  priority={i === 0}
                  className={lifestyle ? "object-cover" : "object-contain"}
                />

                {/* The photo underneath can be a dark shop shot or a white
                    cutout, so the copy carries its own contrast either way. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/5"
                />

                <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-1.5 p-4 sm:p-5">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-xs">
                      {categoryLabel(slide.product, locale)}
                    </span>
                    {discountBadge(slide.product) && (
                      <span className="rounded-full bg-[#E01B24] px-2 py-0.5 text-[10px] font-bold text-white">
                        {discountBadge(slide.product)}
                      </span>
                    )}
                  </div>

                  {/* `name` already opens with the brand ("Nike Air Max Tavas"),
                      so printing brand and model separately would say it twice. */}
                  <h3 className="text-lg sm:text-2xl font-extrabold leading-tight text-white line-clamp-2 drop-shadow-md">
                    {slide.product.name}
                  </h3>

                  <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-white/85">
                    {slide.cta[locale]}
                    <span aria-hidden="true" className="rtl:-scale-x-100">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => {
                setStopped(true);
                scrollTo(i);
              }}
              aria-label={`${
                locale === "ku" ? "بانگەشەی" : locale === "ar" ? "عرض" : "Slide"
              } ${i + 1}`}
              aria-current={i === active}
              className={`h-1 rounded-full transition-all ${
                i === active
                  ? "w-6 bg-foreground"
                  : "w-2.5 bg-foreground/25 hover:bg-foreground/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
