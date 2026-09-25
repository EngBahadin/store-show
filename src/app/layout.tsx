import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAVEN — Authentic Sneakers Sulaymaniyah",
  description: "Authentic sneakers in Sulaymaniyah, Kurdistan Region, Iraq.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ckb"
      dir="rtl"
      className="light"
      suppressHydrationWarning
      style={{ colorScheme: "light" }}
    >
      <head>
        {/* Instant direction and language synchronizer before first paint to prevent layout flip */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;var isEn=p.indexOf('/en')===0||p.indexOf('/en/')!==-1;var isAr=p.indexOf('/ar')===0||p.indexOf('/ar/')!==-1;var d=isEn?'ltr':'rtl';var l=isEn?'en':(isAr?'ar':'ckb');document.documentElement.dir=d;document.documentElement.lang=l;}catch(e){}})();`,
          }}
        />

        {/* DNS prefetch & preconnect for fastest network handshake */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Preload critical local brand font to eliminate Kurdish FOUT */}
        <link
          rel="preload"
          href="/fonts/NRT-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />

        {/* Preload header brand wordmarks so they render on Frame 0 */}
        <link
          rel="preload"
          href="/brand/raven-wordmark-white.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preload"
          href="/brand/raven-wordmark-black.png"
          as="image"
          type="image/png"
        />

        {/* Streamlined, high-performance Google Fonts stylesheet (focused weights for 0 lag) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=Cairo:wght@700;800&family=IBM+Plex+Sans+Arabic:wght@400;600;700&family=Inter:wght@400;500;600;700&family=Vazirmatn:wght@500;700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col selection:bg-[#E01B24] selection:text-white">
        {children}
      </body>
    </html>
  );
}
