"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  Check, ChevronDown, ChevronRight,
  Compass, Mail, Plus, Route,
  Sparkles, Zap, X,
} from "lucide-react";

import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

/* Facebook icon — removed from lucide-react v1, use inline SVG to match style */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

/* ─── Data ────────────────────────────────────────────────────────────── */

const PRODUCTS = [
  {
    key: "typoo",
    name: "XviTypoo",
    logo: "/xviTypooCm.svg",
    href: "#xvitypoo",
    status: "Live",
    description:
      "XviTypoo is a browser-native typing platform engineered for Bangla, English, code, symbols, and digits. No installation required — it runs entirely in your browser with real-time analytics, Unijoy and Avro layout support, and competitive performance tracking. Designed for students, professionals, and enthusiasts who want to master typing in their native language and beyond.",
  },
  {
    key: "xviGet",
    name: "XviGet",
    logo: "/xviGetCm.svg",
    href: "#ecosystem",
    status: "Building",
    description:
      "XviGet is the embeddable widget engine of the XviFloo ecosystem. It lets developers publish interactive, dynamic widgets to any website with a single embed snippet. Designed for flexibility, performance, and deep integration with the XviFloo platform core.",
  },
  {
    key: "kleava",
    name: "Kleava",
    logo: "/kleavaCm.svg",
    href: "#vision",
    status: "Research",
    description:
      "Kleava is the AI intelligence layer of XviFloo — a contextual assistant with long-term memory, desktop integration, and cross-product awareness. Currently in deep research, Kleava will eventually serve as the unified AI brain across every XviFloo product.",
  },
] as const;

const LOCALE_OPTIONS = [
  { value: "en",     label: "English",  sub: "English (US)" },
  { value: "bn",     label: "বাংলা",    sub: "Bangla"       },
  { value: "system", label: "Browser",  sub: "Browser default" },
] as const;

/* ─── Hamburger icon ─────────────────────────────────────────────────── */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-[18px] w-5 flex-col items-stretch justify-between">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "block h-[1.5px] w-full rounded-full bg-current origin-center transition-all duration-300",
            open && i === 0 && "translate-y-[7.5px] rotate-45",
            open && i === 1 && "opacity-0 scale-x-0",
            open && i === 2 && "-translate-y-[7.5px] -rotate-45",
          )}
        />
      ))}
    </span>
  );
}

/* ─── Main SiteHeader ────────────────────────────────────────────────── */
export function SiteHeader() {
  const { dict, locale } = useI18n();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [scrolled,       setScrolled]       = React.useState(false);
  const [activeHash,     setActiveHash]     = React.useState("");

  /* desktop hover panels */
  const [desktopPanel,   setDesktopPanel]   = React.useState<string | null>(null);
  const [activeProduct,  setActiveProduct]  = React.useState<string>(PRODUCTS[0].key);
  const [langHover,      setLangHover]      = React.useState(false);
  const panelTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  /* mobile */
  const [mobileOpen,    setMobileOpen]    = React.useState(false);
  const [mobileSubOpen, setMobileSubOpen] = React.useState<string | null>(null);

  /* scroll */
  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* active hash */
  React.useEffect(() => {
    const sections = ["hero", "ecosystem", "xvitypoo", "roadmap", "vision", "features", "contact"];
    const els = sections.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActiveHash(`#${vis.target.id}`);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* close mobile on resize */
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const fn = (e: MediaQueryListEvent) => { if (e.matches) setMobileOpen(false); };
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  /* body scroll lock */
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* locale setter */
  const setLocale = async (nextLocale: string) => {
    try {
      if (nextLocale === "system") {
        await fetch("/api/settings/locale", { method: "DELETE", headers: { "content-type": "application/json" } });
      } else {
        const res = await fetch("/api/settings/locale", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ locale: nextLocale }),
        });
        if (!res.ok) return;
      }
      window.location.reload();
    } catch { /* noop */ }
  };

  /* panel hover helpers */
  const openPanel = (panel: string) => {
    if (panelTimeoutRef.current) clearTimeout(panelTimeoutRef.current);
    setDesktopPanel(panel);
  };
  const closePanel = () => {
    panelTimeoutRef.current = setTimeout(() => setDesktopPanel(null), 140);
  };
  const keepPanel = () => {
    if (panelTimeoutRef.current) clearTimeout(panelTimeoutRef.current);
  };

  const activeProductData = PRODUCTS.find((p) => p.key === activeProduct) ?? PRODUCTS[0];

  const currentLocaleLabel =
    LOCALE_OPTIONS.find(
      (o) => o.value === locale || (o.value === "system" && !["en", "bn"].includes(locale)),
    )?.label ?? "EN";

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ── Navbar bar ──────────────────────────────────────────────── */}
      <div className={cn(
        "w-full transition-all duration-300",
        scrolled || mobileOpen || desktopPanel
          ? "navbar-glass"
          : "bg-transparent",
      )}>
        <div className="mx-auto flex h-14 w-full max-w-[88rem] items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo — desktop: xviFlooCm.svg, mobile: xviFlooPm.svg */}
          <Link href="/" onClick={() => setMobileOpen(false)}
            className="relative flex-shrink-0 transition-opacity hover:opacity-80">
            <Image
              src="/xviFlooCm.svg"
              alt="XviFloo"
              width={110}
              height={32}
              priority
              className="hidden h-8 w-auto lg:block"
            />
            <Image
              src="/xviFlooPm.svg"
              alt="XviFloo"
              width={36}
              height={36}
              priority
              className="block h-9 w-auto lg:hidden"
            />
          </Link>

          {/* Desktop center nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">

            {/* Products hover */}
            <div
              className="relative"
              onMouseEnter={() => openPanel("products")}
              onMouseLeave={closePanel}
            >
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200",
                  desktopPanel === "products"
                    ? "text-[var(--brand)]"
                    : "text-[#778B88] hover:text-[#444444]",
                )}
              >
                {dict.nav.products}
                <ChevronDown className={cn("size-3 transition-transform duration-200", desktopPanel === "products" && "rotate-180")} />
              </button>
            </div>

            {/* Roadmap hover */}
            <div
              className="relative"
              onMouseEnter={() => openPanel("roadmap")}
              onMouseLeave={closePanel}
            >
              <Link
                href="#roadmap"
                className={cn(
                  "flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200",
                  activeHash === "#roadmap" || desktopPanel === "roadmap"
                    ? "text-[var(--brand)]"
                    : "text-[#778B88] hover:text-[#444444]",
                )}
                onMouseEnter={() => openPanel("roadmap")}
              >
                {dict.nav.roadmap}
              </Link>
            </div>

            {/* Vision */}
            <Link
              href="#vision"
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200",
                activeHash === "#vision" ? "text-[var(--brand)]" : "text-[#778B88] hover:text-[#444444]",
              )}
            >
              {dict.nav.vision}
            </Link>

            {/* Features */}
            <Link
              href="#features"
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200",
                activeHash === "#features" ? "text-[var(--brand)]" : "text-[#778B88] hover:text-[#444444]",
              )}
            >
              {dict.nav.features}
            </Link>

            {/* Contact hover */}
            <div
              className="relative"
              onMouseEnter={() => openPanel("contact")}
              onMouseLeave={closePanel}
            >
              <Link
                href="#contact"
                className={cn(
                  "flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200",
                  activeHash === "#contact" || desktopPanel === "contact"
                    ? "text-[var(--brand)]"
                    : "text-[#778B88] hover:text-[#444444]",
                )}
              >
                {dict.nav.contact}
              </Link>
            </div>
          </nav>

          {/* Desktop right */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Language hover */}
            <div
              className="relative"
              onMouseEnter={() => setLangHover(true)}
              onMouseLeave={() => setLangHover(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full border border-[rgba(23,183,155,0.20)] bg-[rgba(242,255,250,0.60)] px-3 py-1.5 font-heading text-[0.65rem] uppercase tracking-[0.14em] text-[#778B88] backdrop-blur-sm transition-all hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                <svg className="size-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="8" cy="8" r="6.5"/>
                  <path d="M8 1.5C8 1.5 5.5 4 5.5 8s2.5 6.5 2.5 6.5M8 1.5C8 1.5 10.5 4 10.5 8s-2.5 6.5-2.5 6.5M1.5 8h13"/>
                </svg>
                {currentLocaleLabel}
              </button>
              {langHover && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-[rgba(23,183,155,0.15)] bg-white py-1.5 shadow-[var(--shadow-panel)]">
                  {LOCALE_OPTIONS.map((opt) => {
                    const active = locale === opt.value || (opt.value === "system" && !["en","bn"].includes(locale));
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setLocale(opt.value)}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-[rgba(23,183,155,0.06)]",
                          active && "bg-[rgba(23,183,155,0.08)] text-[var(--brand)]",
                        )}
                      >
                        <span className="flex size-4 items-center justify-center">
                          {active && <Check className="size-3 text-[var(--brand)]" />}
                        </span>
                        <span>
                          <p className="font-heading text-xs font-semibold">{opt.label}</p>
                          <p className="font-heading text-[0.58rem] text-[#778B88]">{opt.sub}</p>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/auth/sign-in"
              className="btn-primary text-xs"
            >
              {dict.nav.signIn}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full border border-[rgba(23,183,155,0.20)] text-[#444444] lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>

        {/* ── Desktop expanding panels ─────────────────────────────── */}
        {desktopPanel && (
          <div
            className="hidden lg:block border-t border-[rgba(23,183,155,0.08)]"
            onMouseEnter={keepPanel}
            onMouseLeave={closePanel}
          >
            <div className="mx-auto max-w-[88rem] px-8">

              {/* Products panel */}
              {desktopPanel === "products" && (
                <div className="flex gap-0 py-5" style={{ animation: "menu-panel-in 0.25s ease both" }}>
                  {/* Product list */}
                  <div className="flex w-52 flex-col gap-1 border-r border-[rgba(23,183,155,0.10)] pr-5">
                    {PRODUCTS.map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onMouseEnter={() => setActiveProduct(p.key)}
                        onClick={() => { setDesktopPanel(null); }}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all",
                          activeProduct === p.key
                            ? "bg-[rgba(23,183,155,0.08)] text-[var(--brand)]"
                            : "text-[#778B88] hover:bg-[rgba(23,183,155,0.05)] hover:text-[#444444]",
                        )}
                      >
                        <Image src={p.logo} alt={p.name} width={20} height={20} className="size-5 rounded" />
                        <span>
                          <p className="font-heading text-sm font-semibold">{p.name}</p>
                          <span className={cn("badge-status text-[0.52rem]",
                            p.status === "Live" ? "badge-live" : p.status === "Building" ? "badge-active" : "badge-upcoming"
                          )}>{p.status}</span>
                        </span>
                        <ChevronRight className="ml-auto size-3 opacity-40" />
                      </button>
                    ))}
                  </div>

                  {/* Active product detail */}
                  <div className="flex flex-1 items-start gap-6 pl-6">
                    <Link
                      href={activeProductData.href}
                      onClick={() => setDesktopPanel(null)}
                      className="group flex-shrink-0 transition-opacity hover:opacity-80"
                    >
                      <Image
                        src={activeProductData.logo}
                        alt={activeProductData.name}
                        width={52}
                        height={52}
                        className="size-14 rounded-xl"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        href={activeProductData.href}
                        onClick={() => setDesktopPanel(null)}
                        className="group inline-flex items-center gap-1.5 transition-colors hover:text-[var(--brand)]"
                      >
                        <h3 className="font-heading text-base font-bold text-[#444444]">
                          {activeProductData.name}
                        </h3>
                        <ChevronRight className="size-4 opacity-0 transition-all group-hover:opacity-70 group-hover:translate-x-0.5" />
                      </Link>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-[#778B88]">
                        {activeProductData.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Roadmap panel */}
              {desktopPanel === "roadmap" && (
                <div className="py-5" style={{ animation: "menu-panel-in 0.25s ease both" }}>
                  <div className="flex items-start gap-8">
                    {/* Mini topology */}
                    <div className="flex-shrink-0">
                      <svg width="200" height="90" viewBox="0 0 200 90" className="opacity-70">
                        <defs>
                          <radialGradient id="rp-glow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#17b79b" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#17b79b" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                        <ellipse cx="100" cy="65" rx="80" ry="20" fill="url(#rp-glow)" />
                        <rect x="30" y="55" width="140" height="24" rx="12" fill="none" stroke="#17b79b" strokeWidth="0.8" strokeOpacity="0.4" />
                        {[[50,30],[100,22],[150,30]].map(([x,y],i) => (
                          <g key={i}>
                            <line x1={x} y1={y} x2={[50,100,150][i]} y2={55} stroke="#17b79b" strokeWidth="0.6" strokeOpacity="0.3" />
                            <circle cx={x} cy={y} r="5" fill="#17b79b" fillOpacity="0.15" stroke="#17b79b" strokeWidth="0.8" />
                            <circle cx={x} cy={y} r="2" fill="#17b79b" />
                          </g>
                        ))}
                        <text x="100" y="72" textAnchor="middle" fill="#17b79b" fontSize="6" fontFamily="Oxanium" opacity="0.6">XviFloo Platform</text>
                      </svg>
                    </div>
                    <div>
                      <p className="eyebrow mb-2">Ecosystem Evolution</p>
                      <p className="max-w-sm text-sm text-[#778B88]">
                        Follow the journey from XviTypoo&apos;s live platform through XviGet&apos;s engine era to Kleava&apos;s AI intelligence layer.
                      </p>
                      <Link
                        href="#roadmap"
                        onClick={() => setDesktopPanel(null)}
                        className="mt-3 inline-flex items-center gap-1 font-heading text-xs font-semibold text-[var(--brand)] hover:underline"
                      >
                        View full roadmap <ChevronRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact panel */}
              {desktopPanel === "contact" && (
                <div className="py-5" style={{ animation: "menu-panel-in 0.25s ease both" }}>
                  <div className="flex items-center gap-6">
                    <a href="mailto:hello@xvifloo.com"
                      className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 transition-colors hover:bg-[rgba(23,183,155,0.08)]">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-[rgba(23,183,155,0.10)]">
                        <Mail className="size-4 text-[var(--brand)]" />
                      </span>
                      <span>
                        <p className="font-heading text-sm font-semibold text-[#444444]">Email</p>
                        <p className="font-heading text-xs text-[#778B88]">hello@xvifloo.com</p>
                      </span>
                    </a>
                    <a href="https://x.com/xvifloo" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 transition-colors hover:bg-[rgba(23,183,155,0.08)]">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-[rgba(23,183,155,0.10)]">
                        <X className="size-4 text-[var(--brand)]" />
                      </span>
                      <span>
                        <p className="font-heading text-sm font-semibold text-[#444444]">X (Twitter)</p>
                        <p className="font-heading text-xs text-[#778B88]">@xvifloo</p>
                      </span>
                    </a>
                    <a href="https://facebook.com/xvifloo" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 transition-colors hover:bg-[rgba(23,183,155,0.08)]">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-[rgba(23,183,155,0.10)]">
                        <FacebookIcon className="size-4 text-[var(--brand)]" />
                      </span>
                      <span>
                        <p className="font-heading text-sm font-semibold text-[#444444]">Facebook</p>
                        <p className="font-heading text-xs text-[#778B88]">@xvifloo</p>
                      </span>
                    </a>
                    <Link
                      href="#contact"
                      onClick={() => setDesktopPanel(null)}
                      className="ml-4 btn-outline text-xs"
                    >
                      {dict.nav.contact}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Mobile expandable menu ────────────────────────────────── */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
            mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0",
          )}
          aria-hidden={!mobileOpen}
        >
          <div className="border-t border-[rgba(23,183,155,0.10)] px-4 pb-5 pt-3">
            <nav className="space-y-0.5">
              {/* Products mobile */}
              <MobileMenuItem
                icon={<Sparkles className="size-4" />}
                label={dict.nav.products}
                isOpen={mobileSubOpen === "products"}
                onToggle={() => setMobileSubOpen((v) => v === "products" ? null : "products")}
              >
                {PRODUCTS.map((p) => (
                  <Link
                    key={p.key}
                    href={p.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#778B88] hover:bg-[rgba(23,183,155,0.06)] hover:text-[#444444]"
                  >
                    <Image src={p.logo} alt={p.name} width={16} height={16} className="size-4" />
                    <span className="font-heading font-semibold">{p.name}</span>
                    <span className={cn("badge-status ml-auto text-[0.5rem]",
                      p.status === "Live" ? "badge-live" : p.status === "Building" ? "badge-active" : "badge-upcoming"
                    )}>{p.status}</span>
                  </Link>
                ))}
              </MobileMenuItem>

              {/* Roadmap mobile */}
              <MobileMenuItem
                icon={<Route className="size-4" />}
                label={dict.nav.roadmap}
                isOpen={mobileSubOpen === "roadmap"}
                onToggle={() => setMobileSubOpen((v) => v === "roadmap" ? null : "roadmap")}
              >
                <Link
                  href="#roadmap"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-[#778B88] hover:bg-[rgba(23,183,155,0.06)]"
                >
                  View Product Roadmap →
                </Link>
              </MobileMenuItem>

              {/* Vision */}
              <Link
                href="#vision"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-heading font-semibold text-[#444444] hover:bg-[rgba(23,183,155,0.06)]"
              >
                <span className="flex size-7 items-center justify-center rounded-lg bg-[rgba(23,183,155,0.08)] text-[var(--brand)]">
                  <Compass className="size-4" />
                </span>
                {dict.nav.vision}
              </Link>

              {/* Features */}
              <Link
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-heading font-semibold text-[#444444] hover:bg-[rgba(23,183,155,0.06)]"
              >
                <span className="flex size-7 items-center justify-center rounded-lg bg-[rgba(23,183,155,0.08)] text-[var(--brand)]">
                  <Zap className="size-4" />
                </span>
                {dict.nav.features}
              </Link>

              {/* Contact mobile */}
              <MobileMenuItem
                icon={<Mail className="size-4" />}
                label={dict.nav.contact}
                isOpen={mobileSubOpen === "contact"}
                onToggle={() => setMobileSubOpen((v) => v === "contact" ? null : "contact")}
              >
                <div className="space-y-1 px-1">
                  <a href="mailto:hello@xvifloo.com"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#778B88] hover:bg-[rgba(23,183,155,0.06)]">
                    <Mail className="size-3.5 text-[var(--brand)]" />hello@xvifloo.com
                  </a>
                  <a href="https://x.com/xvifloo" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#778B88] hover:bg-[rgba(23,183,155,0.06)]">
                    <X className="size-3.5 text-[var(--brand)]" />@xvifloo
                  </a>
                  <a href="https://facebook.com/xvifloo" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#778B88] hover:bg-[rgba(23,183,155,0.06)]">
                    <FacebookIcon className="size-3.5 text-[var(--brand)]" />@xvifloo
                  </a>
                </div>
              </MobileMenuItem>

              {/* Language mobile */}
              <MobileMenuItem
                icon={
                  <svg className="size-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="8" cy="8" r="6.5"/>
                    <path d="M8 1.5C8 1.5 5.5 4 5.5 8s2.5 6.5 2.5 6.5M8 1.5C8 1.5 10.5 4 10.5 8s-2.5 6.5-2.5 6.5M1.5 8h13"/>
                  </svg>
                }
                label={`Language — ${currentLocaleLabel}`}
                isOpen={mobileSubOpen === "lang"}
                onToggle={() => setMobileSubOpen((v) => v === "lang" ? null : "lang")}
              >
                {LOCALE_OPTIONS.map((opt) => {
                  const active = locale === opt.value || (opt.value === "system" && !["en","bn"].includes(locale));
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setLocale(opt.value); setMobileOpen(false); }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        active ? "bg-[rgba(23,183,155,0.08)] text-[var(--brand)]" : "text-[#778B88] hover:bg-[rgba(23,183,155,0.05)]",
                      )}
                    >
                      <span className="flex size-4 items-center justify-center">
                        {active && <Check className="size-3 text-[var(--brand)]" />}
                      </span>
                      <span className="font-heading font-semibold">{opt.label}</span>
                      <span className="text-xs text-[#778B88]">{opt.sub}</span>
                    </button>
                  );
                })}
              </MobileMenuItem>
            </nav>

            <div className="mt-4 border-t border-[rgba(23,183,155,0.10)] pt-4">
              <Link
                href="/auth/sign-in"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full justify-center text-sm"
              >
                {dict.nav.signIn}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─── Mobile accordion item ──────────────────────────────────────────── */
function MobileMenuItem({
  icon, label, isOpen, onToggle, children,
}: {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[rgba(23,183,155,0.06)]"
      >
        <span className={cn(
          "flex size-7 items-center justify-center rounded-lg transition-colors",
          isOpen ? "bg-[var(--brand)] text-white" : "bg-[rgba(23,183,155,0.08)] text-[var(--brand)]",
        )}>
          {icon}
        </span>
        <span className="flex-1 font-heading text-sm font-semibold text-[#444444]">{label}</span>
        <span className={cn(
          "flex size-5 items-center justify-center rounded-full border border-[rgba(23,183,155,0.20)] text-[var(--brand)] transition-transform duration-200",
          isOpen && "rotate-45",
        )}>
          <Plus className="size-3" />
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ maxHeight: isOpen ? "400px" : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <div className="ml-10 py-1 pl-0.5">
          {children}
        </div>
      </div>
    </div>
  );
}
