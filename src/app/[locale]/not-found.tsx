"use client";

import Link from "next/link";

import { EmptyState } from "@/components/commerce/empty-state";
import { useI18n } from "@/lib/i18n/provider";

export default function NotFound() {
  const { href, locale } = useI18n();

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
      <EmptyState
        type="empty-store"
        title={
          locale === "ku"
            ? "پەڕەکە نەدۆزرایەوە (404)"
            : locale === "ar"
              ? "الصفحة غير موجودة (404)"
              : "Page Not Found (404)"
        }
        subtitle={
          locale === "ku"
            ? "ئەم بەستەرە بوونی نییە یان گوێزراوەتەوە."
            : "The page you are looking for does not exist."
        }
      />
      <Link
        href={href("/")}
        className="inline-block bg-white text-[#0A0A0A] font-bold text-xs px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
      >
        {locale === "ku" ? "گەڕانەوە بۆ سەرەکی" : "Back to Store"}
      </Link>
    </div>
  );
}
