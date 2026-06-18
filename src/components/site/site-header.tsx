"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { XviFlooLogo } from "@/components/brand/xvifloo-logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/components/providers/i18n-provider";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { key: "ecosystem", href: "#ecosystem" },
  { key: "products", href: "#xvitypoo" },
  { key: "roadmap", href: "#roadmap" },
  { key: "vision", href: "#vision" },
  { key: "features", href: "#features" },
] as const;

export function SiteHeader() {
  const { dict, locale } = useI18n();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const setLocale = async (nextLocale: string) => {
    try {
      const res = await fetch("/api/settings/locale", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale: nextLocale }),
      });
      if (!res.ok) return;
      window.location.reload();
    } catch {
      // Avoid unhandled promise rejections in embedded browsers.
    }
  };

  const navLabel = (key: (typeof NAV_LINKS)[number]["key"]) => dict.nav[key];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled ? "glass-header" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-5 md:px-8">
        <Link
          href="/"
          className="rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <XviFlooLogo size="md" />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {navLabel(link.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">
                {locale.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{dict.settings.language}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLocale("en")}>
                {dict.settings.english}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale("bn")}>
                {dict.settings.bangla}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle
            label={dict.settings.theme}
            light={dict.settings.light}
            dark={dict.settings.dark}
            system={dict.settings.system}
          />

          <Button asChild size="sm" className="rounded-full px-4">
            <Link href="/auth/sign-in">{dict.nav.signIn}</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="sr-only">{mobileOpen ? dict.nav.close : dict.nav.menu}</span>
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileOpen && (
        <div id="mobile-nav" className="glass-header border-t lg:hidden">
          <nav
            className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-6 py-5 md:px-8"
            aria-label="Mobile"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-base text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {navLabel(link.key)}
              </Link>
            ))}
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/50 pt-4">
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => setLocale("en")}>
                EN
              </Button>
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => setLocale("bn")}>
                BN
              </Button>
              <ThemeToggle
                label={dict.settings.theme}
                light={dict.settings.light}
                dark={dict.settings.dark}
                system={dict.settings.system}
              />
              <Button asChild size="sm" className="rounded-full">
                <Link href="/auth/sign-in" onClick={() => setMobileOpen(false)}>
                  {dict.nav.signIn}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
