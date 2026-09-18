"use client";

import { useEffect } from "react";

import { localeMeta, type Locale } from "@/lib/i18n/config";

export function DirLangUpdater({ locale }: { locale: Locale }) {
  useEffect(() => {
    const meta = localeMeta[locale];
    if (meta) {
      document.documentElement.setAttribute("dir", meta.dir);
      document.documentElement.setAttribute("lang", meta.htmlLang);
    }
  }, [locale]);

  return null;
}
