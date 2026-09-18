"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { defaultLocale, isLocale, matchLocale } from "@/lib/i18n/config";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem("raven.locale");
      if (savedLocale && isLocale(savedLocale)) {
        router.replace(`/${savedLocale}/`);
        return;
      }
      const matched = matchLocale(navigator.languages || [navigator.language]);
      router.replace(`/${matched}/`);
    } catch {
      router.replace(`/${defaultLocale}/`);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="relative w-28 h-28 mb-4 animate-rvpulse">
        <Image
          src="/brand/raven-mark-white.png"
          alt="RAVEN"
          fill
          priority
          className="object-contain"
        />
      </div>

      <h1 className="text-xl font-extrabold tracking-widest uppercase font-mono">
        RAVEN
      </h1>
      <p className="text-xs text-[#8A8A8A] mt-1">Sulaymaniyah · Kurdistan Region</p>

      {/* No-JS fallback */}
      <noscript className="mt-8 block">
        <div className="flex gap-4 text-sm font-bold underline">
          <Link href="/ku/">کوردی</Link>
          <Link href="/ar/">العربية</Link>
          <Link href="/en/">English</Link>
        </div>
      </noscript>
    </div>
  );
}
