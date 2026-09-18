import Image from "next/image";

import { useI18n } from "@/lib/i18n/provider";

interface EmptyStateProps {
  type?: "empty-store" | "no-results" | "loading" | "image-fallback";
  query?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function EmptyState({
  type = "empty-store",
  query = "",
  title,
  subtitle,
  className = "",
}: EmptyStateProps) {
  const { locale } = useI18n();

  if (type === "loading") {
    return (
      <div
        className={`w-full min-h-[360px] flex items-center justify-center p-8 ${className}`}
      >
        <div className="relative w-28 h-28 animate-rvpulse">
          <Image
            src="/brand/raven-mark-white.png"
            alt="Loading RAVEN..."
            fill
            sizes="112px"
            className="object-contain"
          />
        </div>
      </div>
    );
  }

  if (type === "no-results") {
    return (
      <div
        className={`w-full min-h-[380px] bg-card border border-border rounded-2xl flex flex-col items-center justify-center p-8 text-center gap-3 transition-colors ${className}`}
      >
        <div className="relative w-20 h-20 opacity-20 mb-2 dark:invert-0 invert">
          <Image
            src="/brand/raven-mark-white.png"
            alt="RAVEN"
            fill
            sizes="80px"
            className="object-contain"
          />
        </div>
        <h3 className="text-base font-bold text-foreground">
          {title ||
            (locale === "ku"
              ? "هیچ ئەنجامێک نەدۆزرایەوە"
              : locale === "ar"
                ? "لم يتم العثور على نتائج"
                : "No results found")}
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          {subtitle ||
            (locale === "ku"
              ? query
                ? `هیچ پێڵاوێک نەدۆزرایەوە بۆ "${query}". وشەیەکی تر تاقی بکەرەوە.`
                : "وشەیەکی تر تاقی بکەرەوە یان پاڵاوتنەکان لابدە."
              : locale === "ar"
                ? "جرب البحث بكلمات أخرى أو تغيير الفلاتر."
                : "Try adjusting your search terms or filters.")}
        </p>
      </div>
    );
  }

  // Default: Empty store
  return (
    <div
      className={`w-full min-h-[400px] bg-card border border-border rounded-2xl flex flex-col items-center justify-center p-8 text-center gap-3 transition-colors ${className}`}
    >
      <div className="relative w-24 h-24 opacity-20 mb-2 dark:invert-0 invert">
        <Image
          src="/brand/raven-mark-white.png"
          alt="RAVEN"
          fill
          sizes="96px"
          className="object-contain"
        />
      </div>
      <h3 className="text-base font-bold text-foreground">
        {title ||
          (locale === "ku"
            ? "هیچ کاڵایەک نییە"
            : locale === "ar"
              ? "لا توجد منتجات حالياً"
              : "No products available")}
      </h3>
      <p className="text-xs text-muted-foreground max-w-sm">
        {subtitle ||
          (locale === "ku"
            ? "پێڵاوی نوێ بەمزووانە زیاد دەکرێت."
            : locale === "ar"
              ? "سيتم إضافة أحذية جديدة قريباً."
              : "New drops arriving soon.")}
      </p>
    </div>
  );
}
