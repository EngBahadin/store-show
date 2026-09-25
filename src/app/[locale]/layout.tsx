import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";

import { BottomNav } from "@/components/layout/bottom-nav";
import { CartSheet } from "@/components/commerce/cart-sheet";
import { DirLangUpdater } from "@/components/layout/dir-lang-updater";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { isLocale, locales } from "@/lib/i18n/config";
import { I18nProvider } from "@/lib/i18n/provider";
import { site } from "@/lib/site";
import { CartProvider } from "@/lib/store/cart";
import { RecentlyViewedProvider } from "@/lib/store/recently-viewed";
import { SellerProvider } from "@/lib/store/seller-store";
import { WishlistProvider } from "@/lib/store/wishlist";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const title = `RAVEN — ${site.tagline[locale]}`;
  const description =
    locale === "ku"
      ? "پێڵاوی ڕەسەن، هۆکا، جۆردان، نایکی، ئەدیداس و سکێچەرز لە سلێمانی."
      : locale === "ar"
        ? "أحذية أصلية، هوكا، جوردان، نايكي، أديداس وسكيتشرز في السليمانية."
        : "Authentic sneakers — Hoka, Jordan, Nike, Adidas & Skechers in Sulaymaniyah.";

  return {
    metadataBase: new URL(site.url),
    title,
    description,
    alternates: {
      canonical: `${site.url}/${locale}/`,
      languages: {
        ku: `${site.url}/ku/`,
        ar: `${site.url}/ar/`,
        en: `${site.url}/en/`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${site.url}/${locale}/`,
      siteName: "RAVEN",
      images: [
        {
          url: "/brand/raven-wordmark-white.png",
          width: 947,
          height: 678,
          alt: "RAVEN Sneakers",
        },
      ],
      locale: locale === "ku" ? "ckb" : locale,
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <I18nProvider locale={locale}>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <SellerProvider>
                <DirLangUpdater locale={locale} />
                <div className="flex flex-col min-h-screen bg-background text-foreground">
                  <SiteHeader />
                  <main className="flex-1 w-full">{children}</main>
                  <BottomNav />
                  <CartSheet />
                  <SiteFooter />
                  <Toaster position="top-center" richColors />
                </div>
              </SellerProvider>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
