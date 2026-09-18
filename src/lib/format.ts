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
  return input.replace(/[\u0660-\u0669\u06f0-\u06f9]/g, (d) => {
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
