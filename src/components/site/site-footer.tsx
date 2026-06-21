"use client";

import Link from "next/link";

import { XviFlooLogo } from "@/components/brand/xvifloo-logo";
import { useI18n } from "@/components/providers/i18n-provider";

const TYPOO_URL = "https://typoo.xvifloo.com";

const ECOSYSTEM_BADGES = [
  { label: "XviTypoo", accent: "var(--brand)", status: "Live" },
  { label: "XviGet", accent: "var(--accent-blue)", status: "Building" },
  { label: "Kleava AI", accent: "var(--accent-violet)", status: "Research" },
] as const;

export function SiteFooter() {
  const { dict } = useI18n();
  const year = new Date().getFullYear();

  const productLinks = [
    { label: dict.products.typing.name, href: TYPOO_URL, external: true },
    { label: dict.products.widgets.name, href: "/#roadmap", external: false },
    { label: dict.products.ai.name, href: "/#roadmap", external: false },
    { label: dict.nav.ecosystem, href: "/#ecosystem", external: false },
  ];

  const companyLinks = [
    { label: dict.footer.about, href: "/about" },
    { label: dict.footer.contact, href: "/contact" },
    { label: dict.footer.admin, href: "/admin" },
  ];

  const legalLinks = [
    { label: dict.footer.privacy, href: "/legal/privacy" },
    { label: dict.footer.terms, href: "/legal/terms" },
    { label: dict.footer.cookies, href: "/legal/cookies" },
    { label: dict.footer.legal, href: "/legal/notice" },
  ];

  return (
    <footer className="relative px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-8 lg:px-8">
      <div className="glass-panel mx-auto w-full max-w-7xl overflow-hidden rounded-[2rem] border border-border/50">
        {/* Ecosystem branding strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 px-7 py-5 sm:px-10">
          <div className="flex items-center gap-2.5">
            <span className="status-dot" aria-hidden="true" />
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
              Ecosystem status
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {ECOSYSTEM_BADGES.map((badge) => (
              <span
                key={badge.label}
                className="flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.08em]"
                style={{
                  borderColor: `${badge.accent}25`,
                  color: badge.accent,
                  backgroundColor: `${badge.accent}10`,
                }}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: badge.accent }}
                  aria-hidden="true"
                />
                {badge.label}
                <span className="text-muted-foreground">· {badge.status}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="px-7 py-12 sm:px-10 md:py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
            <div className="space-y-5 sm:col-span-2 lg:col-span-1">
              <XviFlooLogo size="lg" />
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                {dict.footer.tagline}
              </p>
            </div>

            <nav aria-label="Products">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                {dict.footer.columns.products}
              </p>
              <ul className="mt-4 space-y-3">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Company">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                {dict.footer.columns.company}
              </p>
              <ul className="mt-4 space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom bar — copyright + legal links as inline pills */}
        <div className="flex flex-col gap-4 border-t border-border/40 px-7 py-6 sm:px-10 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} {dict.brand.name}. {dict.footer.copyright}
          </p>

          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-1 gap-y-2">
            {legalLinks.map((link, i) => (
              <span key={link.label} className="flex items-center">
                <Link
                  href={link.href}
                  className="rounded-full px-2.5 py-1 text-xs text-muted-foreground transition-colors duration-300 hover:bg-foreground/5 hover:text-foreground"
                >
                  {link.label}
                </Link>
                {i < legalLinks.length - 1 && (
                  <span className="text-border" aria-hidden="true">
                    ·
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
