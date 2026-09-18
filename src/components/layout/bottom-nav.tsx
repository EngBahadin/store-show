"use client";

import { Flame, Home, Info, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useI18n } from "@/lib/i18n/provider";

export function BottomNav() {
  const { href, locale } = useI18n();
  const pathname = usePathname();

  // If on admin route, we render the admin bottom nav instead
  if (pathname.includes("/admin")) {
    return null;
  }

  const navItems = [
    {
      id: "store",
      label: locale === "ku" ? "فرۆشگا" : locale === "ar" ? "المتجر" : "Store",
      path: "/",
      icon: Home,
      exact: true,
    },
    {
      id: "new",
      label:
        locale === "ku" ? "نوێهاتووەکان" : locale === "ar" ? "وصل حديثاً" : "New",
      path: "/new-arrivals/",
      exact: false,
    },
    {
      id: "sale",
      label:
        locale === "ku" ? "داشکاندن" : locale === "ar" ? "تخفيضات" : "Sale",
      path: "/shop/?sale=true",
      exact: false,
    },
    {
      id: "info",
      label:
        locale === "ku" ? "زانیاری" : locale === "ar" ? "معلومات" : "Info",
      path: "/info/",
      exact: false,
    },
  ];

  const isCurrentActive = (itemPath: string, exact: boolean) => {
    const target = href(itemPath);
    const cleanTarget = target.split("?")[0].replace(/\/$/, "");
    const cleanPath = pathname.replace(/\/$/, "");

    if (cleanTarget === href("/").replace(/\/$/, "")) {
      return cleanPath === cleanTarget;
    }

    if (itemPath.includes("sale=true")) {
      const isBrowser = typeof window !== "undefined";
      return pathname.includes("/shop") && isBrowser && window.location?.search?.includes("sale");
    }

    return exact ? cleanPath === cleanTarget : cleanPath.startsWith(cleanTarget);
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border text-card-foreground sm:hidden h-[62px] px-2 flex items-center justify-around safe-area-bottom transition-colors"
    >
      {navItems.map((item) => {
        const Icon = item.icon || (item.id === "new" ? Sparkles : item.id === "sale" ? Flame : Info);
        const active = isCurrentActive(item.path, item.exact);

        return (
          <Link
            key={item.id}
            href={href(item.path)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 h-full transition-colors ${
              active ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className={`w-[18px] h-[18px] ${active ? "stroke-[2.2]" : "stroke-[1.6]"}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
