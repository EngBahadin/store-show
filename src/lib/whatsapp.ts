import { getProduct, type Product } from "@/data/products";
import { formatPrice, formatSize } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import { site } from "@/lib/site";
import type { CartItem } from "@/lib/store/cart";

/**
 * Builds a direct WhatsApp order link for a single product and selected size.
 */
export function buildProductWhatsAppUrl(
  product: Product,
  size: number,
  locale: Locale,
): string {
  const currency = locale === "en" ? "IQD" : "د.ع";
  const sizeFormatted = formatSize(size);
  const priceFormatted =
    product.price > 0
      ? formatPrice(product.price, currency)
      : locale === "ku"
        ? "داوای نرخ بکە"
        : locale === "ar"
          ? "طلب السعر"
          : "Price on request";

  const greeting =
    locale === "ku"
      ? "سڵاو RAVEN! حەز دەکەم ئەم پێڵاوە داوا بکەم:"
      : locale === "ar"
        ? "مرحباً RAVEN! أود طلب هذا الحذاء:"
        : "Hello RAVEN! I would like to order this pair:";

  const itemDetails = `${product.name} (${product.code})
• ${locale === "ku" ? "قەبارە" : locale === "ar" ? "المقاس" : "Size"}: ${sizeFormatted}
• ${locale === "ku" ? "نرخ" : locale === "ar" ? "السعر" : "Price"}: ${priceFormatted}`;

  const link = `${site.url}/${locale}/product/${product.slug}/`;

  const message = `${greeting}\n\n${itemDetails}\n\n${link}`;

  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds a WhatsApp order manifest URL for entire cart contents.
 */
export function buildCartWhatsAppUrl(
  items: CartItem[],
  subtotal: number,
  deliveryFee: number,
  total: number,
  note: string,
  locale: Locale,
): string {
  const currency = locale === "en" ? "IQD" : "د.ع";

  const header =
    locale === "ku"
      ? "سڵاو RAVEN! دەمەوێت ئەم داواکارییە تۆمار بکەم:"
      : locale === "ar"
        ? "مرحباً RAVEN! أود تأكيد هذا الطلب:"
        : "Hello RAVEN! I would like to place this order:";

  const lines = items
    .map((item) => {
      const p = getProduct(item.slug);
      if (!p) return null;
      const sizeStr = formatSize(item.size);
      const priceStr =
        p.price > 0
          ? formatPrice(p.price * item.qty, currency)
          : locale === "ku"
            ? "داوای نرخ"
            : locale === "ar"
              ? "طلب السعر"
              : "Ask price";

      return `• ${p.name} — ${sizeStr} × ${item.qty} (${priceStr})`;
    })
    .filter(Boolean)
    .join("\n");

  const subtotalStr = formatPrice(subtotal, currency);
  const deliveryStr =
    deliveryFee === 0
      ? locale === "ku"
        ? "بەخۆڕایی"
        : locale === "ar"
          ? "مجاناً"
          : "Free"
      : formatPrice(deliveryFee, currency);
  const totalStr = formatPrice(total, currency);

  const summary = `
${locale === "ku" ? "کۆی گشتی کاڵاکان" : locale === "ar" ? "المجموع الفرعي" : "Subtotal"}: ${subtotalStr}
${locale === "ku" ? "گەیاندن" : locale === "ar" ? "التوصيل" : "Delivery"}: ${deliveryStr}
${locale === "ku" ? "کۆی سەرجەم" : locale === "ar" ? "المجموع الكلي" : "Total"}: ${totalStr}`;

  const customerNote = note.trim()
    ? `\n\n${locale === "ku" ? "تێبینی" : locale === "ar" ? "ملاحظة" : "Note"}: ${note.trim()}`
    : "";

  const fullText = `${header}\n\n${lines}\n${summary}${customerNote}`;

  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(fullText)}`;
}

/**
 * Builds a WhatsApp direct message URL for store inquiries.
 */
export function buildContactWhatsAppUrl(locale: Locale): string {
  const greeting =
    locale === "ku"
      ? "سڵاو RAVEN! پرسیارێکم هەیە دەربارەی پێڵاوەکانتان:"
      : locale === "ar"
        ? "مرحباً RAVEN! لدي استفسار بخصوص المنتجات:"
        : "Hello RAVEN! I have an inquiry about your store:";

  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(greeting)}`;
}
