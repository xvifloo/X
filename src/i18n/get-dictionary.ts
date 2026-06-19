import type { Locale } from "@/i18n/locales";

export type Dictionary = typeof import("./dictionaries/en").default;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  switch (locale) {
    case "bn":
      return (await import("./dictionaries/bn")).default;
    case "en":
    default:
      return (await import("./dictionaries/en")).default;
  }
}

