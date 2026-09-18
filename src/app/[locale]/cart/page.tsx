"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/common/floating-whatsapp";
import { getProduct } from "@/data/products";
import { formatPrice, formatSize } from "@/lib/format";
import { useI18n } from "@/lib/i18n/provider";
import { site } from "@/lib/site";
import { useCart } from "@/lib/store/cart";
import { buildCartWhatsAppUrl } from "@/lib/whatsapp";

export default function CartPage() {
  const { href, locale } = useI18n();
  const {
    items,
    setQty,
    remove,
    clear,
    subtotal,
    deliveryFee,
    total,
    note,
    setNote,
    hydrated,
  } = useCart();

  const currency = locale === "en" ? "IQD" : "د.ع";
  const progressToFreeDelivery = Math.min(
    100,
    Math.round((subtotal / site.freeDeliveryFrom) * 100),
  );

  if (!hydrated) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-xs text-muted-foreground">
        Loading cart...
      </div>
    );
  }

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 text-foreground transition-colors">
      <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-foreground" />
          <span>
            {locale === "ku"
              ? "سەبەتەی کڕین"
              : locale === "ar"
                ? "سلة المشتريات"
                : "Shopping Cart"}
          </span>
          {items.length > 0 && (
            <span className="text-xs bg-secondary text-muted-foreground px-2.5 py-0.5 rounded-full font-bold">
              {items.reduce((sum, i) => sum + i.qty, 0)}
            </span>
          )}
        </h1>
        {items.length > 0 && (
          <button
            onClick={clear}
            className="text-xs text-muted-foreground hover:text-[#E01B24] transition-colors cursor-pointer"
          >
            {locale === "ku" ? "بەتاڵکردن" : "Clear all"}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 space-y-4 bg-card border border-border rounded-2xl p-8 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            {locale === "ku" ? "سەبەتەکەت بەتاڵە" : "Your cart is empty"}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            {locale === "ku"
              ? "سەیری پێڵاوەکانمان بکە و دانەیەک هەڵبژێرە."
              : "Discover authentic sneakers directly from Erbil shelves."}
          </p>
          <div className="pt-2">
            <Link
              href={href("/shop")}
              className="inline-block bg-primary text-primary-foreground font-bold text-xs px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              {locale === "ku" ? "گەڕان لە فرۆشگا" : "Browse Shop"}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Column (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="border border-border rounded-2xl bg-card divide-y divide-border overflow-hidden shadow-xs">
              {items.map((item) => {
                const p = getProduct(item.slug);
                if (!p) return null;
                const itemTotal = p.price * item.qty;

                return (
                  <div
                    key={`${item.slug}-${item.size}`}
                    className="p-4 sm:p-5 flex gap-4 items-start"
                  >
                    <Link
                      href={href(`/product/${p.slug}`)}
                      className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-border bg-secondary shrink-0 group"
                    >
                      <Image
                        src={`/products/${p.slug}.webp`}
                        alt={p.name}
                        fill
                        sizes="96px"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={href(`/product/${p.slug}`)}
                        className="text-xs sm:text-sm font-bold text-foreground hover:underline truncate block"
                      >
                        {p.name}
                      </Link>

                      <div className="text-[11px] text-muted-foreground mt-1">
                        {locale === "ku" ? "قەبارە" : "Size"}:{" "}
                        <span className="text-foreground font-semibold">
                          {formatSize(item.size)}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm font-extrabold text-foreground mt-1.5">
                        {p.price > 0
                          ? formatPrice(itemTotal, currency)
                          : locale === "ku"
                            ? "داوای نرخ"
                            : "Ask price"}
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-border rounded-lg bg-secondary">
                          <button
                            onClick={() => setQty(item.slug, item.size, item.qty - 1)}
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-foreground">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => setQty(item.slug, item.size, item.qty + 1)}
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => remove(item.slug, item.size)}
                          className="text-muted-foreground hover:text-[#E01B24] p-1.5 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary & WhatsApp Checkout Column (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Free Delivery Tracker */}
            {subtotal > 0 && (
              <div className="bg-card border border-border rounded-2xl p-4 space-y-2 shadow-xs">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-foreground">
                    {subtotal >= site.freeDeliveryFrom
                      ? locale === "ku"
                        ? "پیرۆزە! گەیاندنی بەخۆڕاییت بەدەستهێنا"
                        : "Qualified for free delivery!"
                      : locale === "ku"
                        ? `${formatPrice(site.freeDeliveryFrom - subtotal, currency)} ماوە بۆ گەیاندنی بەخۆڕایی`
                        : `Add ${formatPrice(site.freeDeliveryFrom - subtotal, currency)} more for free delivery`}
                  </span>
                  <span className="font-bold text-foreground">{progressToFreeDelivery}%</span>
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E01B24] transition-all duration-500 rounded-full"
                    style={{ width: `${progressToFreeDelivery}%` }}
                  />
                </div>
              </div>
            )}

            {/* Note Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">
                {locale === "ku" ? "تێبینی بۆ گەیاندن (شار، ناونیشان)" : "Delivery Address & Notes"}
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  locale === "ku"
                    ? "شار، گەڕەک، نزیکترین خاڵ..."
                    : "City, neighborhood, landmark..."
                }
                className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
              />
            </div>

            {/* Totals card */}
            <div className="border border-border rounded-2xl bg-card p-5 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border">
                {locale === "ku" ? "کورتەی داواکاری" : "Order Summary"}
              </h3>

              <div className="space-y-2.5 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>{locale === "ku" ? "کۆی کاڵاکان" : "Subtotal"}</span>
                  <span className="text-foreground font-semibold">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{locale === "ku" ? "کرێی گەیاندن" : "Delivery"}</span>
                  <span className="text-foreground font-semibold">
                    {deliveryFee === 0
                      ? locale === "ku"
                        ? "بەخۆڕایی"
                        : "Free"
                      : formatPrice(deliveryFee, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-foreground pt-3 border-t border-border">
                  <span>{locale === "ku" ? "کۆی کۆتایی" : "Total"}</span>
                  <span>{formatPrice(total, currency)}</span>
                </div>
              </div>

              {/* Official Green WhatsApp Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full h-13 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-lg hover:shadow-xl cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                <span>
                  {locale === "ku"
                    ? "داواکردن لە ڕێگەی واتسئاپ"
                    : locale === "ar"
                      ? "إتمام الطلب عبر واتساب"
                      : "Checkout via WhatsApp"}
                </span>
              </button>

              <p className="text-[10px] text-center text-muted-foreground">
                {locale === "ku"
                  ? "داواکارییەکەت ڕاستەوخۆ دەگاتە تیمی پشتیوانی فرۆشگا لە واتسئاپ"
                  : "Your order details will be sent directly to our Erbil WhatsApp support team."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
