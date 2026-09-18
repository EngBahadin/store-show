"use client";

import { Check, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { WhatsAppIcon } from "@/components/common/floating-whatsapp";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { site } from "@/lib/site";

export function StoreSettings() {
  const { locale } = useI18n();
  const router = useRouter();
  const [langSheetOpen, setLangSheetOpen] = useState(false);

  // Read-only for now: the real values live in src/lib/site.ts.
  const storeName = site.name;
  const whatsapp = site.phone;
  const address = site.address[locale];

  const switchLocale = (newLocale: Locale) => {
    try {
      localStorage.setItem("raven.locale", newLocale);
    } catch {
      // Private mode / blocked site-data: the switch still works, it just
      // won't be remembered by the root language gate.
    }
    router.push(`/${newLocale}/admin/`);
  };

  return (
    <div className="space-y-5 pb-24 text-foreground transition-colors max-w-2xl">
      <div className="border border-border rounded-2xl bg-card divide-y divide-border overflow-hidden shadow-xs">
        {/* Store Name */}
        <div className="p-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {locale === "ku" ? "ناوی فرۆشگا" : "Store Name"}
          </span>
          <span className="text-sm font-bold text-foreground font-mono tracking-wider">
            {storeName}
          </span>
        </div>

        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {locale === "ku" ? "لۆگۆ" : "Logo"}
          </span>
          <div className="relative w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center p-1.5 dark:invert-0 invert">
            <Image
              src="/brand/raven-mark-white.png"
              alt="Logo"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
        </div>

        {/* WhatsApp Number */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
            <span className="text-xs">
              {locale === "ku" ? "ژمارەی واتسئاپ" : "WhatsApp Number"}
            </span>
          </div>
          <span className="text-xs text-foreground font-mono font-semibold" dir="ltr">
            {whatsapp}
          </span>
        </div>

        {/* Address */}
        <div className="p-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {locale === "ku" ? "ناونیشان" : "Address"}
          </span>
          <span className="text-xs text-foreground text-end truncate max-w-[200px]">
            {address}
          </span>
        </div>

        {/* Language Row */}
        <button
          type="button"
          onClick={() => setLangSheetOpen(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-secondary transition-colors cursor-pointer"
        >
          <span className="text-xs text-muted-foreground">
            {locale === "ku" ? "زمان" : "Language"}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-foreground font-medium">
              {locale === "ku"
                ? "کوردی"
                : locale === "ar"
                  ? "العربية"
                  : "English"}
            </span>
            <ChevronRight className="w-4 h-4 text-muted-foreground rtl:rotate-180" />
          </div>
        </button>
      </div>

      {/* Language Sheet */}
      <Sheet open={langSheetOpen} onOpenChange={setLangSheetOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl border-t border-border bg-card p-0 text-foreground max-w-md mx-auto"
        >
          <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3.5 mb-2" />
          <SheetHeader className="px-5 pb-3 text-start">
            <SheetTitle className="text-base font-bold text-foreground">
              {locale === "ku" ? "زمان" : "Language"}
            </SheetTitle>
          </SheetHeader>

          <div className="divide-y divide-border border-t border-border pb-6">
            {[
              { id: "ku", label: "کوردی" },
              { id: "ar", label: "عربي" },
              { id: "en", label: "English" },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => switchLocale(l.id as Locale)}
                className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium hover:bg-secondary transition-colors cursor-pointer"
              >
                <span className={locale === l.id ? "font-bold text-foreground" : "text-muted-foreground"}>
                  {l.label}
                </span>
                {locale === l.id && <Check className="w-4 h-4 text-foreground stroke-[2.5]" />}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
