"use client";

import Link from "next/link";

import { XviFlooLogo } from "@/components/brand/xvifloo-logo";
import { useI18n } from "@/components/providers/i18n-provider";

const TYPOO_URL = "https://typoo.xvifloo.com";

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
    <footer className="relative border-t border-border/50">
      <div className="section-divider" aria-hidden="true" />
      <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-8 md:py-24">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
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

          <nav aria-label="Legal">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
              {dict.footer.columns.legal}
            </p>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
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

        <div className="mt-16 flex flex-col gap-2 border-t border-border/40 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {dict.brand.name}. {dict.footer.copyright}
          </p>
          <p>{dict.brand.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
