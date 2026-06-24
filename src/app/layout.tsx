import type { Metadata } from "next";
import "./globals.css";

import { fontBody, fontDisplay, fontMono } from "@/app/fonts";
import { AppProviders } from "@/components/providers/app-providers";
import { getDictionary } from "@/i18n/get-dictionary";
import { getRequestLocale } from "@/lib/i18n/locale";

export const metadata: Metadata = {
  title: "XviFloo — Technology Ecosystem Platform",
  description:
    "XviFloo unifies XviTypoo, XviGet, and Kleava AI into one premium ecosystem for productivity, AI, and future-ready innovation.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "XviFloo — Technology Ecosystem Platform",
    description:
      "One ecosystem. Multiple products. Built for innovation, AI, and productivity.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const dict = await getDictionary(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders locale={locale} dict={dict}>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
