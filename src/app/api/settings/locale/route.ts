import { NextResponse } from "next/server";

import { isLocale } from "@/i18n/locales";
import { LOCALE_COOKIE } from "@/lib/i18n/locale";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as null | { locale?: string };
  const locale = body?.locale;

  if (!isLocale(locale)) {
    return NextResponse.json({ ok: false, error: "Invalid locale" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true, locale });
  res.cookies.set(LOCALE_COOKIE, locale, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}

/** DELETE — clear locale cookie so browser Accept-Language header takes effect */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(LOCALE_COOKIE, "", {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}

