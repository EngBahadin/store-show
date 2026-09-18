"use client";

import { Check, Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { locales, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);

  const switchLocale = (targetLocale: Locale) => {
    if (targetLocale === locale) {
      setSheetOpen(false);
      return;
    }

    try {
      localStorage.setItem("raven.locale", targetLocale);
    } catch {
      // ignore
    }

    // Replace current locale segment in pathname e.g. /ku/product/x -> /en/product/x
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
      segments[0] = targetLocale;
    } else {
      segments.unshift(targetLocale);
    }

    const newPath = `/${segments.join("/")}${segments.length > 0 ? "/" : ""}`;
    setSheetOpen(false);
    router.push(newPath);
  };

  const languages: { id: Locale; label: string }[] = [
    { id: "ku", label: "کوردی" },
    { id: "ar", label: "عربي" },
    { id: "en", label: "English" },
  ];

  return (
    <>
      {/* 1. Mobile Trigger (opens bottom sheet) */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label="Change language"
          className={`h-9 px-2.5 rounded-full flex items-center gap-1.5 border border-border text-foreground hover:bg-secondary text-xs font-semibold transition-colors ${className}`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>
            {locale === "ku" ? "کوردی" : locale === "ar" ? "عربي" : "EN"}
          </span>
        </button>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent
            side="bottom"
            className="rounded-t-2xl border-t border-border bg-card p-0 text-card-foreground max-w-md mx-auto"
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3.5 mb-2" />
            <SheetHeader className="px-5 pb-3 text-start">
              <SheetTitle className="text-base font-bold text-foreground">
                {t("lang.label")}
              </SheetTitle>
            </SheetHeader>

            <div className="divide-y divide-border border-t border-border">
              {languages.map((lang) => {
                const isSelected = lang.id === locale;
                return (
                  <button
                    key={lang.id}
                    onClick={() => switchLocale(lang.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    <span
                      className={
                        isSelected ? "font-bold text-foreground" : "text-muted-foreground"
                      }
                    >
                      {lang.label}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-foreground stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* 2. Desktop Dropdown Menu (compact popover right under the button) */}
      <div className="hidden sm:block">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`h-9 px-3 rounded-full flex items-center gap-1.5 border border-border text-foreground hover:bg-secondary text-xs font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-ring ${className}`}
            aria-label="Change language"
          >
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            <span>
              {locale === "ku" ? "کوردی" : locale === "ar" ? "عربي" : "English"}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-40 bg-popover border border-border text-popover-foreground shadow-xl rounded-xl p-1 z-50"
          >
            {languages.map((lang) => {
              const isSelected = lang.id === locale;
              return (
                <DropdownMenuItem
                  key={lang.id}
                  onClick={() => switchLocale(lang.id)}
                  className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                    isSelected ? "font-bold bg-secondary" : "text-muted-foreground"
                  }`}
                >
                  <span>{lang.label}</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 stroke-[2.5] text-primary" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
