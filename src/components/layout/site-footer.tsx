"use client";

import { Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/brand/logo";
import { WhatsAppIcon } from "@/components/common/floating-whatsapp";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useI18n } from "@/lib/i18n/provider";
import { site } from "@/lib/site";
import { buildContactWhatsAppUrl } from "@/lib/whatsapp";

export function SiteFooter() {
  const { href, locale } = useI18n();
  const [phoneInput, setPhoneInput] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim()) return;

    try {
      const subscribers = JSON.parse(
        localStorage.getItem("raven.newsletter") || "[]",
      );
      subscribers.push({ phone: phoneInput, date: new Date().toISOString() });
      localStorage.setItem("raven.newsletter", JSON.stringify(subscribers));
    } catch {
      // ignore
    }

    toast.success(
      locale === "ku"
        ? "سوپاس! ژمارەکەت تۆمارکرا بۆ ئاگاداربوون لە نوێترین پێڵاوەکان."
        : locale === "ar"
          ? "شكراً لك! تم حفظ رقمك لتصلك أحدث الأحذية."
          : "Thank you! You're subscribed to new drop alerts.",
    );
    setPhoneInput("");
  };

  const whatsappContactUrl = buildContactWhatsAppUrl(locale);

  return (
    <footer className="w-full bg-card border-t border-border text-foreground pt-12 pb-24 sm:pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-border">
          {/* Col 1: Brand Statement */}
          <div className="md:col-span-1 space-y-4">
            <Logo variant="wordmark" className="h-8" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {site.tagline[locale]}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {locale === "ku" ? "بەشەکان" : locale === "ar" ? "الأقسام" : "Categories"}
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href={href("/shop?gender=men")} className="hover:text-foreground transition-colors">
                  {locale === "ku" ? "پیاوان" : locale === "ar" ? "رجالي" : "Men"}
                </Link>
              </li>
              <li>
                <Link href={href("/shop?gender=women")} className="hover:text-foreground transition-colors">
                  {locale === "ku" ? "ژنان" : locale === "ar" ? "نسائي" : "Women"}
                </Link>
              </li>
              <li>
                <Link href={href("/shop?category=running")} className="hover:text-foreground transition-colors">
                  {locale === "ku" ? "پێڵاوی ڕاکردن" : locale === "ar" ? "أحذية جري" : "Running"}
                </Link>
              </li>
              <li>
                <Link href={href("/new-arrivals")} className="hover:text-foreground transition-colors">
                  {locale === "ku" ? "نوێهاتووەکان" : locale === "ar" ? "وصل حديثاً" : "New Arrivals"}
                </Link>
              </li>
              <li>
                <Link href={href("/shop?sale=true")} className="hover:text-foreground transition-colors text-[#E01B24] font-semibold">
                  {locale === "ku" ? "داشکاندنەکان" : locale === "ar" ? "التخفيضات" : "Sale Offers"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Visit */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {locale === "ku" ? "پەیوەندی و سەردان" : locale === "ar" ? "التواصل والزيارة" : "Contact & Visit"}
            </h3>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-foreground" />
                <span>{site.address[locale]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 shrink-0 text-foreground" />
                <span>{site.hours[locale]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0 text-foreground" />
                <span dir="ltr">{site.phone}</span>
              </div>
              <div className="pt-1">
                <a
                  href={whatsappContactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-emerald-500 transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
                  <span>{locale === "ku" ? "چاتی ڕاستەوخۆی واتسئاپ" : locale === "ar" ? "محادثة مباشرة واتساب" : "Direct WhatsApp"}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Drop Alerts */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {locale === "ku" ? "ئاگاداری پێڵاوی نوێ بە" : locale === "ar" ? "كن أول من يعلم" : "Drop Alerts"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === "ku"
                ? "ژمارەی مۆبایلەکەت بنووسە بۆ وەرگرتنی داشکاندن و پێڵاوە دەگمەنەکان."
                : locale === "ar"
                  ? "سجل رقمك لتصلك العروض الحصرية والأحذية النادرة."
                  : "Enter your phone to get VIP notification for rare sneaker drops."}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="0750 XXX XXXX"
                dir="ltr"
                className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-colors shrink-0"
              >
                {locale === "ku" ? "تۆمار" : locale === "ar" ? "اشتراك" : "Join"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright & seller link */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} RAVEN Sneakers. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href={href("/info")} className="hover:text-foreground transition-colors">
              {locale === "ku" ? "زانیاری فرۆشگا" : locale === "ar" ? "معلومات المتجر" : "Store Info"}
            </Link>
            <span>•</span>
            <Link href={href("/admin")} className="hover:text-foreground transition-colors">
              {locale === "ku" ? "داشبۆردی بەڕێوەبردن" : locale === "ar" ? "لوحة الإدارة" : "Seller Portal"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
