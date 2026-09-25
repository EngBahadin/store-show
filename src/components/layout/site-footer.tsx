"use client";

import { Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { WhatsAppIcon } from "@/components/common/floating-whatsapp";
import { InstagramIcon } from "@/components/common/instagram-icon";
import { useI18n } from "@/lib/i18n/provider";
import { site } from "@/lib/site";
import { buildContactWhatsAppUrl } from "@/lib/whatsapp";

export function SiteFooter() {
  const { href, locale } = useI18n();

  const whatsappContactUrl = buildContactWhatsAppUrl(locale);

  return (
    <footer className="w-full bg-card border-t border-border text-foreground pt-10 pb-24 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-border">
          {/* Col 1: Brand Statement */}
          <div className="space-y-3">
            <Logo variant="wordmark" className="h-7 sm:h-8" />
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              {site.tagline[locale]}
            </p>
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
              {site.branches.map((branch) => (
                <a
                  key={branch.maps}
                  href={branch.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-foreground transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-foreground" />
                  <span>
                    {branch.name[locale]} ·{" "}
                    {locale === "ku" ? "سلێمانی" : locale === "ar" ? "السليمانية" : "Sulaymaniyah"}
                  </span>
                </a>
              ))}
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 shrink-0 text-foreground" />
                <span>{site.hours[locale]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0 text-foreground" />
                <span dir="ltr">{site.phone}</span>
              </div>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5 shrink-0 text-foreground" />
                <span dir="ltr">@{site.instagram.handle}</span>
              </a>
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
