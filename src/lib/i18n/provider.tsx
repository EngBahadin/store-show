"use client";

import { createContext, useContext, useMemo } from "react";

import { formatPrice, formatSize } from "@/lib/format";

import { dirOf, localePath, type Locale } from "./config";
import {
  createTranslator,
  getDictionary,
  type Translator,
} from "./dictionaries";

type I18nValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Translator;
  /** Prefixes a path with the active locale: href("/shop") -> "/ku/shop". */
  href: (path: string) => string;
  /** 150000 -> "150,000 IQD" / "150,000 د.ع" */
  price: (value: number) => string;
  size: (value: number) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value = useMemo<I18nValue>(() => {
    const t = createTranslator(getDictionary(locale));
    return {
      locale,
      dir: dirOf(locale),
      t,
      href: (path) => localePath(path, locale),
      price: (amount) => formatPrice(amount, t("common.currency")),
      size: (value) => formatSize(value),
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}
