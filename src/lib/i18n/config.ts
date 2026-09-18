export const locales = ["ku", "en", "ar"] as const;
export type Locale = (typeof locales)[number];

/** Locale used for `/` and for any unknown path segment. */
export const defaultLocale: Locale = "ku";

export const localeMeta: Record<
  Locale,
  { label: string; english: string; dir: "ltr" | "rtl"; htmlLang: string; flag: string }
> = {
  ku: { label: "کوردی", english: "Kurdish", dir: "rtl", htmlLang: "ckb", flag: "🇮🇶" },
  en: { label: "English", english: "English", dir: "ltr", htmlLang: "en", flag: "🇬🇧" },
  ar: { label: "العربية", english: "Arabic", dir: "rtl", htmlLang: "ar", flag: "🇮🇶" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale) {
  return localeMeta[locale].dir;
}

/** Prefix an app-relative path with the active locale: ("/shop", "ar") -> "/ar/shop". */
export function localePath(path: string, locale: Locale) {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/**
 * Best locale for a visitor, given what the browser advertises.
 * Kurdish is reported as `ckb`, `ku`, or `ku-IQ` depending on the platform.
 */
export function matchLocale(candidates: readonly string[]): Locale {
  for (const raw of candidates) {
    const tag = raw.toLowerCase();
    if (tag.startsWith("ckb") || tag.startsWith("ku")) return "ku";
    if (tag.startsWith("ar")) return "ar";
    if (tag.startsWith("en")) return "en";
  }
  return defaultLocale;
}
