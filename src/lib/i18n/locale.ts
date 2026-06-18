import { cookies, headers } from "next/headers";

import { defaultLocale, isLocale, type Locale } from "@/i18n/locales";

const LOCALE_COOKIE = "xv_locale";

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language") ?? "";
  const preferred = acceptLanguage.split(",")[0]?.trim().slice(0, 2);
  if (isLocale(preferred)) return preferred;

  return defaultLocale;
}

export { LOCALE_COOKIE };

