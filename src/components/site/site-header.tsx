"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowRight, Check, Menu, Monitor, Moon, Sun, X } from "lucide-react";

import { XviFlooLogo } from "@/components/brand/xvifloo-logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { key: "ecosystem", href: "#ecosystem" },
  { key: "products",  href: "#xvitypoo"  },
  { key: "roadmap",   href: "#roadmap"   },
  { key: "vision",    href: "#vision"    },
  { key: "features",  href: "#features"  },
] as const;

// ── Language popup ─────────────────────────────────────────────────────────────
const LOCALE_OPTIONS = [
  { value: "system", label: "System", sublabel: "Follow device language" },
  { value: "en",     label: "English", sublabel: "English (US)" },
  { value: "bn",     label: "বাংলা",   sublabel: "Bangla" },
] as const;

function LanguagePopup({
  locale,
  onSelect,
  onClose,
}: {
  locale: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-border/60 bg-background/90 py-1 shadow-[var(--shadow-panel)] backdrop-blur-xl"
      role="listbox"
      aria-label="Select language"
    >
      {LOCALE_OPTIONS.map((opt) => {
        const active = locale === opt.value || (opt.value === "system" && !["en", "bn"].includes(locale));
        return (
          <button
            key={opt.value}
            type="button"
            role="option"
            aria-selected={active}
            onClick={() => { onSelect(opt.value); onClose(); }}
            className={cn(
              "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-foreground/5",
              active && "bg-[var(--brand-muted)]",
            )}
          >
            <span className="flex size-4 items-center justify-center">
              {active && <Check className="size-3 text-[var(--brand)]" aria-hidden="true" />}
            </span>
            <span>
              <p className="text-sm font-medium leading-none">{opt.label}</p>
              <p className="mt-0.5 font-mono text-[0.58rem] text-muted-foreground">{opt.sublabel}</p>
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Theme pill ─────────────────────────────────────────────────────────────────
const THEME_OPTIONS = [
  { key: "light",  icon: Sun,     label: "Light"  },
  { key: "dark",   icon: Moon,    label: "Dark"   },
  { key: "system", icon: Monitor, label: "System" },
] as const;

function ThemePill({ compact = true }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const active = mounted ? (theme ?? "system") : "system";

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex items-center gap-0.5 rounded-full border border-border/70 bg-[var(--surface-2)] p-0.5"
    >
      {THEME_OPTIONS.map(({ key, icon: Icon, label }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={label}
            title={label}
            onClick={() => setTheme(key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2 py-1 transition-all duration-300",
              isActive
                ? "bg-[var(--brand)] text-white shadow-[0_0_14px_var(--brand-glow)]"
                : "text-muted-foreground hover:text-foreground",
              compact && "px-1.5",
            )}
          >
            <Icon className="size-3.5 shrink-0" aria-hidden="true" />
            {!compact && (
              <span className="font-mono text-[0.62rem] leading-none">{label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Main header ─────────────────────────────────────────────────────────────────
export function SiteHeader() {
  const { dict, locale } = useI18n();
  const [scrolled,    setScrolled]    = React.useState(false);
  const [mobileOpen,  setMobileOpen]  = React.useState(false);
  const [activeHash,  setActiveHash]  = React.useState("");
  const [langOpen,    setLangOpen]    = React.useState(false);
  const langRef = React.useRef<HTMLDivElement>(null);

  // Scroll listener
  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn(); window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Active section via IntersectionObserver
  React.useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", "")).map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActiveHash(`#${vis.target.id}`);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    ids.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Mobile menu — lock body scroll, close on ESC
  React.useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", fn);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", fn); };
  }, [mobileOpen]);

  // Close on viewport wider than lg
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const fn = (e: MediaQueryListEvent) => { if (e.matches) setMobileOpen(false); };
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  // Close language popup on outside click
  React.useEffect(() => {
    if (!langOpen) return;
    const fn = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [langOpen]);

  const setLocale = async (nextLocale: string) => {
    if (nextLocale === "system") {
      const sys = navigator.language.startsWith("bn") ? "bn" : "en";
      nextLocale = sys;
    }
    try {
      const res = await fetch("/api/settings/locale", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale: nextLocale }),
      });
      if (!res.ok) return;
      window.location.reload();
    } catch { /* noop */ }
  };

  const navLabel = (key: (typeof NAV_LINKS)[number]["key"]) => dict.nav[key];

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-500",
      scrolled || mobileOpen ? "glass-header" : "bg-transparent",
    )}>
      <div className="mx-auto flex w-full max-w-[90rem] items-center justify-between gap-4 px-6 py-4 md:px-8">
        <Link href="/" className="rounded-lg outline-none transition-opacity hover:opacity-80"
          onClick={() => setMobileOpen(false)}>
          <XviFlooLogo size="md" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const isActive = activeHash === link.href;
            return (
              <Link key={link.key} href={link.href}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}>
                {navLabel(link.key)}
                <span
                  className="absolute inset-x-3 -bottom-0.5 h-px scale-x-0 rounded-full bg-[var(--brand)] transition-transform duration-300"
                  style={isActive ? { transform: "scaleX(1)" } : undefined}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop right controls */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Language picker */}
          <div ref={langRef} className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border border-border/60 bg-[var(--surface-2)] px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground transition-all hover:text-foreground",
                langOpen && "border-[var(--brand)]/40 text-foreground",
              )}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
            >
              <span className="size-1.5 rounded-full bg-[var(--brand)]" aria-hidden="true" />
              {dict.settings.language}
            </button>
            {langOpen && (
              <LanguagePopup locale={locale} onSelect={setLocale} onClose={() => setLangOpen(false)} />
            )}
          </div>

          <ThemePill />

          <Button asChild size="sm" className="rounded-full px-4">
            <Link href="/auth/sign-in">{dict.nav.signIn}</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Button variant="ghost" size="icon-sm" className="relative z-10 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((o) => !o)}>
          <span className="sr-only">{mobileOpen ? dict.nav.close : dict.nav.menu}</span>
          <span className="relative size-4">
            <Menu className={cn("absolute inset-0 transition-all duration-300",
              mobileOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100")} />
            <X className={cn("absolute inset-0 transition-all duration-300",
              mobileOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0")} />
          </span>
        </Button>
      </div>

      {/* ── Mobile panel ────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="mobile-menu-backdrop fixed inset-x-0 bottom-0 top-[calc(var(--header-h,68px)+0px)] z-40 lg:hidden"
          style={{ background: "color-mix(in srgb, var(--background) 55%, transparent)", backdropFilter: "blur(6px)" }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="mobile-menu-panel mx-3 mt-2 overflow-hidden rounded-2xl border border-border/60"
            style={{
              background: "color-mix(in srgb, var(--background) 85%, transparent)",
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              boxShadow: "var(--shadow-panel)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nav links */}
            <nav className="flex flex-col px-3 py-4" aria-label="Mobile">
              {NAV_LINKS.map((link, i) => {
                const isActive = activeHash === link.href;
                return (
                  <Link key={link.key} href={link.href}
                    className={cn(
                      "mobile-menu-item flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                      isActive ? "bg-[var(--brand-muted)] text-[var(--brand)]" : "text-foreground/90 hover:bg-foreground/5",
                    )}
                    style={{ animationDelay: `${i * 45}ms` }}
                    onClick={() => setMobileOpen(false)}>
                    <span className="flex items-center gap-3">
                      <span className={cn("size-1.5 rounded-full", isActive ? "bg-[var(--brand)]" : "bg-border")} aria-hidden="true" />
                      {navLabel(link.key)}
                    </span>
                    <ArrowRight className={cn("size-3.5 shrink-0 transition-all", isActive ? "opacity-70" : "opacity-0 -translate-x-1")} aria-hidden="true" />
                  </Link>
                );
              })}
            </nav>

            {/* Bottom controls */}
            <div
              className="mobile-menu-item space-y-4 border-t border-border/40 px-5 py-5"
              style={{ animationDelay: `${NAV_LINKS.length * 45 + 60}ms` }}
            >
              {/* Theme */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {dict.settings.theme}
                </span>
                <ThemePill compact={false} />
              </div>

              {/* Language */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {dict.settings.language}
                </span>
                <div className="flex gap-1">
                  {LOCALE_OPTIONS.map((opt) => {
                    const active = locale === opt.value || (opt.value === "system" && !["en", "bn"].includes(locale));
                    return (
                      <button key={opt.value} type="button"
                        onClick={() => setLocale(opt.value)}
                        className={cn(
                          "rounded-full px-2.5 py-1 font-mono text-[0.62rem] transition-all",
                          active ? "bg-[var(--brand)] text-white" : "bg-[var(--surface-2)] text-muted-foreground",
                        )}>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button asChild size="sm" className="w-full rounded-full">
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
