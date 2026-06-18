"use client";

import * as React from "react";

import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { AuthProvider } from "@/components/providers/auth-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

export function AppProviders({
  locale,
  dict,
  children,
}: React.PropsWithChildren<{ locale: Locale; dict: Dictionary }>) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <I18nProvider locale={locale} dict={dict}>
            {children}
          </I18nProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

