"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Check, ChevronDown, Compass, Globe,
  Layers, Moon, Monitor, Route, Sparkles, Sun, Zap,
} from "lucide-react";

import { XviFlooLogo } from "@/components/brand/xvifloo-logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { key: "ecosystem", href: "#ecosystem",  Icon: Layers   },
  { key: "products",  href: "#xvitypoo",   Icon: Sparkles },
  { key: "roadmap",   href: "#roadmap",    Icon: Route    },
  { key: "vision",    href: "#vision",     Icon: Compass  },
  { key: "features",  href: "#features",   Icon: Zap      },
] as const;

const LOCALE_OPTIONS = [
  { value: "en",     label: "English",  sub: "English (US)" },
  { value: "bn",     label: "বাংলা",    sub: "Bangla"       },
  { value: "system", label: "Browser",  sub: "Browser default" },
] as const;

const THEME_OPTIONS = [
  { key: "dark",   icon: Moon,    label: "Dark"   },
  { key: "light",  icon: Sun,     label: "Light"  },
  { key: "system", icon: Monitor, label: "System" },
] as const;

function ThemePill() {
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
              "flex size-7 items-center justify-center rounded-full transition-all duration-300",
              isActive
                ? "bg-[var(--brand)] text-white shadow-[0_0_14px_var(--brand-glow)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

/* Hamburger — animates 3 lines → X */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-5 w-5 flex-col items-center justify-center gap-[5px]">
      <span
        className={cn(
          "block h-[1.5px] w-full rounded-full bg-current transition-all duration-300 origin-center",
          open ? "translate-y-[6.5px] rotate-45" : "",
        )}
      />
      <span
        className={cn(
          "block h-[1.5px] w-full rounded-full bg-current transition-all duration-300",
          open ? "opacity-0 scale-x-0" : "",
        )}
      />
      <span
        className={cn(
          "block h-[1.5px] w-full rounded-full bg-current transition-all duration-300 origin-center",
          open ? "-translate-y-[6.5px] -rotate-45" : "",
        )}
      />
    </span>
  );
}

export function SiteHeader() {
  const { dict, locale } = useI18n();
  const [scrolled,       setScrolled]       = React.useState(false);
  const [mobileOpen,     setMobileOpen]     = React.useState(false);
  const [activeHash,     setActiveHash]     = React.useState("");
  const [langAccordion,  setLangAccordion]  = React.useState(false);
  const [desktopLangOpen, setDesktopLangOpen] = React.useState(false);
  const langDesktopRef = React.useRef<HTMLDivElement>(null);

  /* scroll sentinel */
  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* active section tracker */
  React.useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""))
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActiveHash(`#${vis.target.id}`);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    ids.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* close mobile menu on lg+ */
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const fn = (e: MediaQueryListEvent) => { if (e.matches) setMobileOpen(false); };
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  /* close desktop lang popup on outside click */
  React.useEffect(() => {
    if (!desktopLangOpen) return;
    const fn = (e: MouseEvent) => {
      if (langDesktopRef.current && !langDesktopRef.current.contains(e.target as Node))
        setDesktopLangOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [desktopLangOpen]);

  /* prevent body scroll when mobile menu open */
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const setLocale = async (nextLocale: string) => {
    try {
      if (nextLocale === "system") {
        // Clear locale cookie so server falls back to browser Accept-Language
        await fetch("/api/settings/locale", {
          method: "DELETE",
          headers: { "content-type": "application/json" },
        });
      } else {
        const res = await fetch("/api/settings/locale", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ locale: nextLocale }),
        });
        if (!res.ok) return;
      }
      window.location.reload();
    } catch { /* noop */ }
  };

  const navLabel = (key: (typeof NAV_LINKS)[number]["key"]) => dict.nav[key];

  const currentLocaleLabel =
    LOCALE_OPTIONS.find(
      (o) => o.value === locale || (o.value === "system" && !["en", "bn"].includes(locale)),
    )?.label ?? "EN";

  return (
    <>
      {/* ── Fixed header bar ──────────────────────────────────────────── */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500",
          scrolled || mobileOpen ? "glass-header" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex w-full max-w-[90rem] items-center justify-between px-[0.4rem] py-3 sm:px-4 md:px-6">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg outline-none transition-opacity hover:opacity-80"
          >
            <XviFlooLogo size="md" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const isActive = activeHash === link.href;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-sm transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {navLabel(link.key)}
                  <span
                    className="absolute inset-x-3 -bottom-0.5 h-px rounded-full bg-[var(--brand)] transition-transform duration-300"
                    style={{ transform: isActive ? "scaleX(1)" : "scaleX(0)" }}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop right controls */}
          <div className="hidden items-center gap-2.5 lg:flex">
            {/* Language popup */}
            <div ref={langDesktopRef} className="relative">
              <button
                type="button"
                onClick={() => setDesktopLangOpen((v) => !v)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border border-border/60 bg-[var(--surface-2)] px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground transition-all hover:text-foreground",
                  desktopLangOpen && "border-[var(--brand)]/40 text-foreground",
                )}
                aria-haspopup="listbox"
                aria-expanded={desktopLangOpen}
              >
                <Globe className="size-3" aria-hidden="true" />
                {dict.settings.language}
              </button>
              {desktopLangOpen && (
                <div
                  className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-border/60 bg-background/95 py-1.5 shadow-[var(--shadow-panel)] backdrop-blur-2xl"
                  role="listbox"
                >
                  {LOCALE_OPTIONS.map((opt) => {
                    const active =
                      locale === opt.value ||
                      (opt.value === "system" && !["en", "bn"].includes(locale));
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => { setLocale(opt.value); setDesktopLangOpen(false); }}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-foreground/5",
                          active && "bg-[var(--brand-muted)]",
                        )}
                      >
                        <span className="flex size-4 shrink-0 items-center justify-center">
                          {active && <Check className="size-3 text-[var(--brand)]" />}
                        </span>
                        <span>
                          <p className="text-sm font-medium">{opt.label}</p>
                          <p className="mt-0.5 font-mono text-[0.58rem] text-muted-foreground">
                            {opt.sub}
                          </p>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <ThemePill />
            <Button asChild size="sm" className="h-8 rounded-full px-4 text-xs">
              <Link href="/auth/sign-in">{dict.nav.signIn}</Link>
            </Button>
          </div>

          {/* Mobile hamburger — right side */}
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full border border-border/60 bg-[var(--surface-2)] text-foreground lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>

        {/* ── Mobile expandable panel — grows downward from header ─────── */}
        <div
          id="mobile-nav-panel"
          className="overflow-hidden transition-all duration-400 ease-in-out lg:hidden"
          style={{
            maxHeight: mobileOpen ? "600px" : "0px",
            opacity: mobileOpen ? 1 : 0,
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          aria-hidden={!mobileOpen}
        >
          <div className="border-t border-border/30 px-[0.4rem] pb-4 pt-2 sm:px-4">
            {/* Nav links */}
            <nav className="space-y-0.5" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) => {
                const isActive = activeHash === link.href;
                const Icon = link.Icon;
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "bg-[var(--brand-muted)] text-[var(--brand)]"
                        : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-7 items-center justify-center rounded-lg transition-colors",
                        isActive
                          ? "bg-[var(--brand)] text-white"
                          : "bg-foreground/6 text-muted-foreground",
                      )}
                    >
                      <Icon className="size-3.5" aria-hidden="true" />
                    </span>
                    {navLabel(link.key)}
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="my-3 border-t border-border/30" />

            {/* Theme row */}
            <div className="flex items-center justify-between px-1 py-1">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
                {dict.settings.theme}
              </p>
              <ThemePill />
            </div>

            {/* Language accordion */}
            <div className="mt-1">
              <button
                type="button"
                onClick={() => setLangAccordion((v) => !v)}
                className="flex w-full items-center justify-between px-1 py-2"
              >
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {dict.settings.language}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[0.65rem] text-[var(--brand)]">
                    {currentLocaleLabel}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-3 text-muted-foreground transition-transform duration-300",
                      langAccordion && "rotate-180",
                    )}
                  />
                </div>
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: langAccordion ? "180px" : "0px" }}
              >
                <div className="space-y-0.5 pt-1">
                  {LOCALE_OPTIONS.map((opt) => {
                    const active =
                      locale === opt.value ||
                      (opt.value === "system" && !["en", "bn"].includes(locale));
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setLocale(opt.value); setMobileOpen(false); }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                          active
                            ? "bg-[var(--brand-muted)] text-[var(--brand)]"
                            : "hover:bg-foreground/5 text-foreground/80",
                        )}
                      >
                        <span className="flex size-4 items-center justify-center">
                          {active && <Check className="size-3 text-[var(--brand)]" />}
                        </span>
                        <span>
                          <p className="font-medium">{opt.label}</p>
                          <p className="font-mono text-[0.58rem] text-muted-foreground">
                            {opt.sub}
                          </p>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sign in */}
            <div className="mt-3">
              <Button asChild className="w-full rounded-xl" size="sm">
                <Link href="/auth/sign-in" onClick={() => setMobileOpen(false)}>
                  {dict.nav.signIn}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
