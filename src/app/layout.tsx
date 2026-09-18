import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAVEN — Authentic Sneakers Erbil",
  description: "Authentic sneakers in Erbil, Kurdistan Region, Iraq.",
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
    <html lang="ckb" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* The stylesheet itself is @import-ed at the top of globals.css;
            these only warm up the connection. */}
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col selection:bg-[#E01B24] selection:text-white transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
