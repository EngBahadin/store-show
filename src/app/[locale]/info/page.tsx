"use client";

import { Clock, MapPin, RefreshCw, Truck } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { WhatsAppIcon } from "@/components/common/floating-whatsapp";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useI18n } from "@/lib/i18n/provider";
import { site } from "@/lib/site";
import { buildContactWhatsAppUrl } from "@/lib/whatsapp";

export default function InfoPage() {
  const { locale } = useI18n();

  const whatsappUrl = buildContactWhatsAppUrl(locale);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 text-foreground transition-colors">
      {/* Header */}
      <div className="text-center py-4 border-b border-border mb-8">
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
          {locale === "ku"
            ? "زانیاری فرۆشگا"
            : locale === "ar"
              ? "معلومات المتجر"
              : "Store Information"}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {locale === "ku"
            ? "هەموو وردەکارییەکان دەربارەی ناونیشان، گەیاندن و پەیوەندی"
            : "All details regarding location, delivery, and customer service"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Brand Story & WhatsApp CTA (5 cols on md) */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-card text-center space-y-4 shadow-xs">
            <div className="flex justify-center">
              <Logo variant="wordmark" className="h-10 w-36" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === "ku"
                ? "ڕەیڤن یەکەم فرۆشگای پێڵاوی ئەسڵی و کاتییە لە سلێمانی. ئێمە هەموو پێڵاوێک بە شێوەیەکی ڕاستەوخۆ لە ڕەفەکانەوە پێشکەش دەکەین."
                : locale === "ar"
                  ? "رايفن هو وجهتك الأولى للأحذية الأصلية والحصرية في السليمانية، مباشرة من الرفوف مع ضمان الأصالة 100%."
                  : "RAVEN is your premier destination for 100% authentic sneakers directly from retail shelves in Sulaymaniyah, Kurdistan Region."}
            </p>

            <div className="pt-2 border-t border-border flex justify-around text-start">
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase">
                  {locale === "ku" ? "شار" : "City"}
                </span>
                <p className="text-xs font-bold text-foreground">
                  {locale === "ku"
                    ? "سلێمانی، کوردستان"
                    : locale === "ar"
                      ? "السليمانية، كردستان"
                      : "Sulaymaniyah, Kurdistan"}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase">
                  {locale === "ku" ? "ڕەسەنایەتی" : "Authenticity"}
                </span>
                <p className="text-xs font-bold text-[#E01B24]">
                  100% Guaranteed
                </p>
              </div>
            </div>
          </div>

          {/* Official WhatsApp Chat CTA */}
          <div className="p-5 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#25D366]/15 flex items-center justify-center">
                <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-foreground">
                  {locale === "ku" ? "پشتیوانی ڕاستەوخۆی واتسئاپ" : "Live WhatsApp Support"}
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  {locale === "ku" ? "وەڵامدانەوەی خێرا" : "Fast responses daily"}
                </p>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>
                {locale === "ku"
                  ? "پەیوەندیمان پێوە بکە لە واتسئاپ"
                  : locale === "ar"
                    ? "تواصل معنا عبر واتساب"
                    : "Chat on WhatsApp"}
              </span>
            </a>
          </div>
        </div>

        {/* Right Column: Store Facts & Policies (7 cols on md) */}
        <div className="md:col-span-7 space-y-6">
          <div className="border border-border rounded-2xl bg-card divide-y divide-border overflow-hidden text-xs shadow-xs">
            {/* WhatsApp Phone */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
                <span>
                  {locale === "ku"
                    ? "ژمارەی واتسئاپ"
                    : locale === "ar"
                      ? "رقم واتساب"
                      : "WhatsApp Number"}
                </span>
              </div>
              <span className="text-foreground font-semibold" dir="ltr">
                {site.phone}
              </span>
            </div>

            {/* Address */}
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-muted-foreground shrink-0">
                <MapPin className="w-4 h-4 text-foreground" />
                <span>
                  {locale === "ku"
                    ? "ناونیشان"
                    : locale === "ar"
                      ? "العنوان"
                      : "Address"}
                </span>
              </div>
              <span className="text-foreground text-end font-medium">
                {site.address[locale]}
              </span>
            </div>

            {/* Hours */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-foreground" />
                <span>
                  {locale === "ku"
                    ? "کاتی کردنەوە"
                    : locale === "ar"
                      ? "ساعات العمل"
                      : "Opening Hours"}
                </span>
              </div>
              <span className="text-foreground font-semibold">{site.hours[locale]}</span>
            </div>

            {/* Delivery */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="w-4 h-4 text-foreground" />
                <span>
                  {locale === "ku"
                    ? "گەیاندن"
                    : locale === "ar"
                      ? "التوصيل"
                      : "Delivery"}
                </span>
              </div>
              <span className="text-foreground font-medium">
                {locale === "ku"
                  ? "بۆ هەموو شارەکان (بەخۆڕایی لەسەروو 100,000 د.ع)"
                  : locale === "ar"
                    ? "لكافة المحافظات (مجاناً فوق 100,000 د.ع)"
                    : "All cities in Iraq (Free over 100,000 IQD)"}
              </span>
            </div>

            {/* Return / Exchange */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="w-4 h-4 text-foreground" />
                <span>
                  {locale === "ku"
                    ? "گۆڕینەوە"
                    : locale === "ar"
                      ? "الاستبدال"
                      : "Exchange Policy"}
                </span>
              </div>
              <span className="text-foreground font-medium">
                {locale === "ku"
                  ? "تا 3 ڕۆژ دوای وەرگرتن"
                  : locale === "ar"
                    ? "خلال 3 أيام من الاستلام"
                    : "Within 3 days of delivery"}
              </span>
            </div>

            {/* Language Switcher row */}
            <div className="p-4 flex items-center justify-between">
              <span className="text-muted-foreground">
                {locale === "ku" ? "زمان" : locale === "ar" ? "اللغة" : "Language"}
              </span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
