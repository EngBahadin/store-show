"use client";

import { Heart, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useI18n } from "@/lib/i18n/provider";
// Cart is hidden for now — every product page already has a direct "Order
// on WhatsApp" button, so the multi-item cart isn't needed yet. To bring it
// back: restore this import and the "Cart Button" block below.
// import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";

export function SiteHeader() {
  const { href, locale } = useI18n();
  const pathname = usePathname();
  // const { count: cartCount, setIsOpen, hydrated: cartHydrated } = useCart();
  const { count: wishlistCount, hydrated: wishlistHydrated } = useWishlist();

  const navLinks = [
    {
      href: "/shop",
      label: locale === "ku" ? "فرۆشگا" : locale === "ar" ? "المتجر" : "Shop",
    },
    {
      href: "/new-arrivals",
      label:
        locale === "ku"
          ? "نوێهاتووەکان"
          : locale === "ar"
            ? "وصل حديثاً"
            : "New Drops",
    },
    {
      href: "/shop?sale=true",
      label:
        locale === "ku" ? "داشکاندن" : locale === "ar" ? "تخفيضات" : "Sale",
      highlight: true,
    },
    {
      href: "/info",
      label:
        locale === "ku"
          ? "زانیاری فرۆشگا"
          : locale === "ar"
            ? "معلومات المتجر"
            : "Store Info",
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Logo href={href("/")} variant="wordmark" />

          {/* Desktop Navigation Links (hidden on mobile, visible on desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            {navLinks.map((link) => {
              const active = pathname.includes(link.href.split("?")[0]);
              return (
                <Link
                  key={link.href}
                  href={href(link.href)}
                  className={`transition-colors hover:text-foreground flex items-center leading-none ${
                    link.highlight
                      ? "text-[#E01B24] font-bold"
                      : active
                        ? "text-foreground font-bold"
                        : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Search, Wishlist, Cart, Theme, Language */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search Button */}
          <Link
            href={href("/shop")}
            aria-label="Search"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="w-[18px] h-[18px]" />
          </Link>

          {/* Wishlist Button */}
          <Link
            href={href("/wishlist")}
            aria-label="Wishlist"
            className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <Heart className="w-[18px] h-[18px]" />
            {wishlistHydrated && wishlistCount > 0 && (
              <span className="absolute top-1 end-1 w-4 h-4 bg-[#E01B24] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Button — hidden for now, see note near the useCart import above.
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Cart"
            className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <ShoppingBag className="w-[18px] h-[18px]" />
            {cartHydrated && cartCount > 0 && (
              <span className="absolute top-1 end-1 w-4 h-4 bg-[#E01B24] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          */}

          <div className="h-5 w-px bg-border mx-0.5 hidden sm:block" />

          {/* Theme & Language Switchers */}
          <ThemeToggle />
          <LanguageSwitcher showIcon={false} />
        </div>
      </div>
    </header>
  );
}
