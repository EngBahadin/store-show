import ar from "@/messages/ar.json";
import en from "@/messages/en.json";
import ku from "@/messages/ku.json";

import type { Locale } from "./config";

/**
 * All three dictionaries are bundled. The site is static and the payload is a
 * few KB per language, so this buys instant language switching with no fetch.
 */
const dictionaries = { en, ku, ar } as const;

/** English is the shape of record — every other locale must match it. */
export type Dictionary = typeof en;

/** Dot-separated leaf paths, e.g. "cart.checkout". */
export type MessageKey = LeafKeys<Dictionary>;

type LeafKeys<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : LeafKeys<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] as Dictionary;
}

export type Translator = (
  key: MessageKey,
  vars?: Record<string, string | number>,
) => string;

/**
 * Builds the `t()` used across the app.
 *
 *   t("shop.results", { count: 12 })  ->  "12 results"
 *
 * A missing key returns the key itself rather than throwing, so a typo shows up
 * on screen during development instead of blanking a page in production.
 */
export function createTranslator(dict: Dictionary): Translator {
  return (key, vars) => {
    const value = key
      .split(".")
      .reduce<unknown>(
        (node, part) =>
          node && typeof node === "object"
            ? (node as Record<string, unknown>)[part]
            : undefined,
        dict,
      );

    if (typeof value !== "string") return key;
    if (!vars) return value;

    return value.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in vars ? String(vars[name]) : match,
    );
  };
}
