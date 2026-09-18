import type { Locale } from "@/lib/i18n/config";

/**
 * Numbers are always rendered in Latin ("English") digits, in every locale.
 * Arabic-Indic digits were tried and dropped: the shop's own pricing, the
 * WhatsApp orders it generates and the sellers' phone keypads all speak Latin,
 * so one script for digits keeps them comparable.
 *
 * Grouping is done by hand rather than through Intl on purpose: the same string
 * has to come out of the static build (Node's ICU) and out of the browser (the
 * platform's ICU) or React reports a hydration mismatch.
 */
function groupThousands(value: number, separator: string) {
  const whole = Math.round(Math.abs(value)).toString();
  let out = "";
  for (let i = 0; i < whole.length; i++) {
    if (i > 0 && (whole.length - i) % 3 === 0) out += separator;
    out += whole[i];
  }
  return (value < 0 ? "-" : "") + out;
}

/**
 * Arabic-Indic (٠-٩) and Extended Arabic-Indic (۰-۹) digits to Latin. Kurdish
 * and Arabic keyboards emit one or the other, so typed input is normalised
 * before it is parsed or echoed back.
 */
export function toLatinDigits(input: string) {
  return input.replace(/[٠-٩۰-۹]/g, (d) => {
    const code = d.charCodeAt(0);
    return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
  });
}

/** A bare number: 1500 -> "1,500". */
export function formatNumber(value: number) {
  return groupThousands(value, ",");
}

/**
 * A price with its currency. `currencyLabel` comes from the dictionary
 * ("IQD" / "د.ع"); pass "" and trim to get the bare amount.
 */
export function formatPrice(value: number, currencyLabel: string) {
  return `${formatNumber(value)} ${currencyLabel}`;
}

/** EU shoe sizes, keeping the half step: 42.5 -> "42.5". */
export function formatSize(size: number) {
  return Number.isInteger(size) ? String(size) : size.toFixed(1);
}

export function discountPercent(price: number, compareAt: number) {
  return Math.round((1 - price / compareAt) * 100);
}

/**
 * Honest "last updated" copy — minutes/hours/days since a real ISO timestamp
 * (a product's `addedAt`, or the catalogue's most recent one), never a made-up
 * number. Pass `nowMs` from `useMountTime()` so the server-rendered string and
 * the hydrated one agree.
 *
 * This is deliberately the only "activity" signal on the storefront: it is
 * always true, because it is read straight from the data file the seller (or
 * whoever maintains the catalogue) edits.
 */
export function formatRelativeTime(
  fromIso: string,
  nowMs: number,
  locale: Locale,
): string {
  const diffMs = Math.max(0, nowMs - new Date(fromIso).getTime());
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const unit: "day" | "hour" | "minute" =
    days >= 1 ? "day" : hours >= 1 ? "hour" : "minute";
  const n = unit === "day" ? days : unit === "hour" ? hours : Math.max(1, minutes);

  const words: Record<Locale, Record<typeof unit, [string, string]>> = {
    ku: {
      day: ["ڕۆژ", "ڕۆژ"],
      hour: ["کاتژمێر", "کاتژمێر"],
      minute: ["خولەک", "خولەک"],
    },
    ar: {
      day: ["يوم", "أيام"],
      hour: ["ساعة", "ساعات"],
      minute: ["دقيقة", "دقائق"],
    },
    en: {
      day: ["day", "days"],
      hour: ["hour", "hours"],
      minute: ["minute", "minutes"],
    },
  };

  const [singular, plural] = words[locale][unit];
  const word = n === 1 ? singular : plural;

  if (locale === "ku") return `${formatNumber(n)} ${word} لەمەوپێش`;
  if (locale === "ar") return `منذ ${formatNumber(n)} ${word}`;
  return `${formatNumber(n)} ${word} ago`;
}
