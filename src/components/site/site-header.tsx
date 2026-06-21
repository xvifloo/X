"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Globe2, Menu, Moon, Sun, X } from "lucide-react";

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
  const [activeHash, setActiveHash] = React.useState("");

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  // Track which section is currently in view so the active nav indicator
  // reflects scroll position, not just the last clicked link.
  React.useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.slice(1));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveHash(`#${visible.target.id}`);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  // Close the mobile menu automatically if the viewport grows past the
  // mobile breakpoint (e.g. device rotation, window resize).
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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
        scrolled || mobileOpen ? "glass-header" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-5 md:px-8">
        <Link
          href="/"
          className="rounded-lg outline-none transition-opacity hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50"
          onClick={() => setMobileOpen(false)}
        >
          <XviFlooLogo size="md" />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const isActive = activeHash === link.href;
            return (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {navLabel(link.key)}
                <span
                  className="absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-[var(--brand)] transition-transform duration-300"
                  style={isActive ? { transform: "scaleX(1)" } : undefined}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
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
          className="relative z-10 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="sr-only">{mobileOpen ? dict.nav.close : dict.nav.menu}</span>
          <span className="relative size-4">
            <Menu
              className={cn(
                "absolute inset-0 transition-all duration-300",
                mobileOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
              )}
            />
            <X
              className={cn(
                "absolute inset-0 transition-all duration-300",
                mobileOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
              )}
            />
          </span>
        </Button>
      </div>

      {/* Mobile slide-down panel — full backdrop blur, staggered link reveal */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="mobile-menu-backdrop fixed inset-x-0 top-[var(--header-h,72px)] bottom-0 z-40 lg:hidden"
          style={{
            background:
              "color-mix(in srgb, var(--background) 70%, transparent)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="mobile-menu-panel glass-header mx-3 mt-2 overflow-hidden rounded-2xl border border-border/60"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col px-3 py-4" aria-label="Mobile">
              {NAV_LINKS.map((link, i) => {
                const isActive = activeHash === link.href;
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    className={cn(
                      "mobile-menu-item flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                      isActive
                        ? "bg-[var(--brand-muted)] text-[var(--brand)]"
                        : "text-foreground/90 hover:bg-foreground/5",
                    )}
                    style={{ animationDelay: `${i * 45}ms` }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "size-1.5 rounded-full transition-colors",
                          isActive ? "bg-[var(--brand)]" : "bg-border",
                        )}
                        aria-hidden="true"
                      />
                      {navLabel(link.key)}
                    </span>
                    <ArrowRight
                      className={cn(
                        "size-3.5 shrink-0 transition-all duration-300",
                        isActive ? "translate-x-0 opacity-70" : "-translate-x-1 opacity-0",
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </nav>

            <div
              className="mobile-menu-item flex items-center justify-between gap-3 border-t border-border/50 px-5 py-4"
              style={{ animationDelay: `${NAV_LINKS.length * 45 + 60}ms` }}
            >
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full"
                  aria-label="Toggle light theme"
                  onClick={() => document.documentElement.classList.remove("dark")}
                >
                  <Sun className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full"
                  aria-label="Toggle dark theme"
                  onClick={() => document.documentElement.classList.add("dark")}
                >
                  <Moon className="size-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="rounded-full" aria-label="Change language">
                      <Globe2 className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
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
              </div>

              <Button asChild size="sm" className="rounded-full px-5">
                <Link href="/auth/sign-in" onClick={() => setMobileOpen(false)}>
                  {dict.nav.signIn}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
