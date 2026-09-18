import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { allProducts, getProduct } from "@/data/products";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";

import { ProductDetailClient } from "./product-detail-client";

export function generateStaticParams() {
  const products = allProducts();
  const params: { locale: Locale; slug: string }[] = [];

  for (const locale of locales) {
    for (const product of products) {
      params.push({ locale, slug: product.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const product = getProduct(slug);
  if (!product) return {};

  const title = `${product.name} — RAVEN Sulaymaniyah`;
  const description = product.description[locale];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `/products/${product.slug}.webp`,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) notFound();

  const product = getProduct(slug);
  if (!product) notFound();

  return <ProductDetailClient product={product} locale={locale} />;
}
