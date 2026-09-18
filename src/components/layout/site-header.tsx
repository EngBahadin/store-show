"use client";

import { Heart, Search, Share2, Shield, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useI18n } from "@/lib/i18n/provider";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";

export function SiteHeader() {
  const { href, locale } = useI18n();
  const pathname = usePathname();
  const { count: cartCount, setIsOpen, hydrated: cartHydrated } = useCart();
  const { count: wishlistCount, hydrated: wishlistHydrated } = useWishlist();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "RAVEN — Authentic Sneakers Erbil",
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(
          locale === "ku"
            ? "لینکی فرۆشگا لەبەرگیرایەوە"
            : locale === "ar"
              ? "تم نسخ رابط المتجر"
              : "Store link copied to clipboard",
        );
      } catch {
        toast.error("Could not copy link");
      }
    }
  };

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
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border text-foreground transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Logo href={href("/")} variant="wordmark" className="h-8 sm:h-9" />

          {/* Desktop Navigation Links (hidden on mobile, visible on desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold">
            {navLinks.map((link) => {
              const active = pathname.includes(link.href.split("?")[0]);
              return (
                <Link
                  key={link.href}
                  href={href(link.href)}
                  className={`transition-colors hover:text-foreground ${
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

        {/* Right Side: Search, Share, Wishlist, Cart, Seller Portal, Theme, Language */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            aria-label="Share store"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share2 className="w-[18px] h-[18px]" />
          </button>

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

          {/* Cart Button */}
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

          {/* Seller Mode Shield Link */}
          <Link
            href={href("/admin")}
            aria-label="Seller Portal"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title={locale === "ku" ? "داشبۆردی فرۆشیار" : "Seller Portal"}
          >
            <Shield className="w-4 h-4" />
          </Link>

          <div className="h-5 w-px bg-border mx-0.5 hidden sm:block" />

          {/* Theme & Language Switchers */}
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
