"use client";

import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/common/floating-whatsapp";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getProduct, isLifestylePhoto } from "@/data/products";
import { formatPrice, formatSize } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import { site } from "@/lib/site";
import { useCart } from "@/lib/store/cart";
import { buildCartWhatsAppUrl } from "@/lib/whatsapp";

export function CartSheet() {
  const { href, locale, t } = useI18n();
  const {
    items,
    isOpen,
    setIsOpen,
    setQty,
    remove,
    clear,
    subtotal,
    deliveryFee,
    total,
    note,
    setNote,
  } = useCart();

  const currency = locale === "en" ? "IQD" : "د.ع";
  const progressToFreeDelivery = Math.min(
    100,
    Math.round((subtotal / site.freeDeliveryFrom) * 100),
  );

  const handleCheckout = () => {
    if (items.length === 0) return;
    const url = buildCartWhatsAppUrl(
      items,
      subtotal,
      deliveryFee,
      total,
      note,
      locale,
    );
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side={locale === "en" ? "right" : "left"}
        showCloseButton={false}
        className="w-full sm:w-[440px] sm:max-w-md bg-card border-none sm:border-s sm:border-border text-card-foreground p-0 flex flex-col h-full shadow-2xl transition-all"
      >
        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b border-border flex flex-row items-center justify-between">
          <SheetTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-foreground" />
            <span>{t("cart.title") || "سەبەتەی کڕین"}</span>
            {items.length > 0 && (
              <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full font-semibold">
                {items.reduce((sum, i) => sum + i.qty, 0)}
              </span>
            )}
          </SheetTitle>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clear}
                className="text-xs text-muted-foreground hover:text-[#E01B24] transition-colors font-medium px-2 py-1 rounded hover:bg-secondary cursor-pointer"
              >
                {t("cart.clear") || "بەتاڵکردن"}
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close cart"
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </SheetHeader>

        {/* Free delivery bar */}
        {subtotal > 0 && (
          <div className="bg-secondary/70 px-5 py-3 border-b border-border">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-foreground/90 font-medium">
                {subtotal >= site.freeDeliveryFrom
                  ? locale === "ku"
                    ? "پیرۆزە! گەیاندنی بەخۆڕاییت بەدەستهێنا"
                    : locale === "ar"
                      ? "مبروك! حصلت على توصيل مجاني"
                      : "You qualified for free delivery!"
                  : locale === "ku"
                    ? `${formatPrice(site.freeDeliveryFrom - subtotal, currency)} ماوە بۆ گەیاندنی بەخۆڕایی`
                    : locale === "ar"
                      ? `تبقى ${formatPrice(site.freeDeliveryFrom - subtotal, currency)} للشحن المجاني`
                      : `Add ${formatPrice(site.freeDeliveryFrom - subtotal, currency)} more for free delivery`}
              </span>
              <span className="font-bold text-foreground">{progressToFreeDelivery}%</span>
            </div>
            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E01B24] transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeDelivery}%` }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border px-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-3">
              <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                {t("cart.empty") || "سەبەتەکەت بەتاڵە"}
              </p>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                {t("cart.emptyLead") ||
                  "سەیری پێڵاوەکانمان بکە و دانەیەک هەڵبژێرە."}
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-2 bg-primary text-primary-foreground font-bold text-xs px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
              >
                {t("cart.continue") || "گەڕان لە فرۆشگا"}
              </button>
            </div>
          ) : (
            items.map((item) => {
              const p = getProduct(item.slug);
              if (!p) return null;
              const itemTotal = p.price * item.qty;

              return (
                <div
                  key={`${item.slug}-${item.size}`}
                  className="py-4 flex gap-3.5 items-start"
                >
                  <Link
                    href={href(`/product/${p.slug}`)}
                    onClick={() => setIsOpen(false)}
                    className="relative w-16 h-16 rounded-lg overflow-hidden border border-border/80 bg-white dark:bg-card shrink-0 shadow-xs"
                  >
                    <Image
                      src={`/products/${p.slug}.webp`}
                      alt={p.name}
                      fill
                      sizes="64px"
                      className={
                        isLifestylePhoto(p)
                          ? "object-cover object-center"
                          : "object-contain p-1.5"
                      }
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={href(`/product/${p.slug}`)}
                      onClick={() => setIsOpen(false)}
                      className="text-xs font-bold text-foreground hover:underline truncate block"
                    >
                      {p.name}
                    </Link>

                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {locale === "ku" ? "قەبارە" : locale === "ar" ? "المقاس" : "Size"}:{" "}
                      <span className="text-foreground font-semibold">
                        {formatSize(item.size)}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-foreground mt-1">
                      {p.price > 0
                        ? formatPrice(itemTotal, currency)
                        : locale === "ku"
                          ? "داوای نرخ"
                          : locale === "ar"
                            ? "طلب السعر"
                            : "Ask price"}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-border rounded-md bg-secondary">
                        <button
                          onClick={() => setQty(item.slug, item.size, item.qty - 1)}
                          className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-foreground">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => setQty(item.slug, item.size, item.qty + 1)}
                          className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => remove(item.slug, item.size)}
                        className="text-muted-foreground hover:text-[#E01B24] p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-border bg-card space-y-3">
            {/* Customer note */}
            <div>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  locale === "ku"
                    ? "تێبینی بۆ داواکاری (شار، گەڕەک، کاتی گەیاندن...)"
                    : locale === "ar"
                      ? "ملاحظات إضافية (المدينة، الحي...)"
                      : "Order notes (address, delivery time...)"
                }
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            {/* Totals */}
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>{locale === "ku" ? "کۆی گشتی" : locale === "ar" ? "المجموع" : "Subtotal"}</span>
                <span className="text-foreground font-medium">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{locale === "ku" ? "گەیاندن" : locale === "ar" ? "التوصيل" : "Delivery"}</span>
                <span className="text-foreground font-medium">
                  {deliveryFee === 0
                    ? locale === "ku"
                      ? "بەخۆڕایی"
                      : locale === "ar"
                        ? "مجاناً"
                        : "Free"
                    : formatPrice(deliveryFee, currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-foreground pt-1.5 border-t border-border">
                <span>{locale === "ku" ? "کۆی سەرجەم" : locale === "ar" ? "الإجمالي" : "Total"}</span>
                <span>{formatPrice(total, currency)}</span>
              </div>
            </div>

            {/* WhatsApp Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              <span>
                {locale === "ku"
                  ? "داواکردن لە واتسئاپ"
                  : locale === "ar"
                    ? "إتمام الطلب عبر واتساب"
                    : "Checkout on WhatsApp"}
              </span>
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
