import { headers } from "next/headers";
import { translations } from "@/app/data/translations";

const SUPPORTED_LOCALES = ["en", "pt", "fr"];
export const DEFAULT_LOCALE = "en";

/**
 * Detect preferred language from Accept-Language header.
 * Falls back to English (site default).
 */
export function detectLocale(acceptLanguage) {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  // Parse quality values: "en-US,en;q=0.9,pt;q=0.8" -> ["en", "pt"]
  const preferred = acceptLanguage
    .split(",")
    .map((entry) => {
      const [locale, q = "q=1"] = entry.trim().split(";");
      const lang = locale.split("-")[0].toLowerCase();
      const quality = parseFloat(q.replace("q=", ""));
      return { lang, quality };
    })
    .filter(({ lang }) => SUPPORTED_LOCALES.includes(lang))
    .sort((a, b) => b.quality - a.quality);

  return preferred.length > 0 ? preferred[0].lang : DEFAULT_LOCALE;
}

/**
 * Server-side translation lookup.
 * Usage: t(someKey) in server components or generateMetadata.
 */
export function getTranslation(locale, key, variables = {}) {
  let value = translations[locale]?.[key] ?? translations[DEFAULT_LOCALE]?.[key] ?? key;

  if (typeof value === "string" && Object.keys(variables).length > 0) {
    Object.keys(variables).forEach((v) => {
      value = value.replace(`{${v}}`, variables[v]);
    });
  }

  return value;
}

/**
 * Get locale-to-OG mapping.
 */
export function localeToOG(locale) {
  const map = { pt: "pt_BR", en: "en_US", fr: "fr_FR" };
  return map[locale] ?? "en_US";
}
