"use client";

import * as React from "react";
import Link from "next/link";
import { X } from "lucide-react";

import { XviFlooLogo } from "@/components/brand/xvifloo-logo";
import { useI18n } from "@/components/providers/i18n-provider";

const TYPOO_URL = "https://typoo.xvifloo.com";
const NAFIS_FB  = "https://facebook.com/nafisxvi";

const ECOSYSTEM_BADGES = [
  { label: "XviTypoo", accent: "var(--brand)",         status: "Live"     },
  { label: "XviGet",   accent: "var(--accent-blue)",   status: "Building" },
  { label: "Kleava AI",accent: "var(--accent-violet)", status: "Research" },
] as const;

// ── Legal Modal ───────────────────────────────────────────────────────────────
type LegalModalProps = {
  title: string;
  href: string;
  onClose: () => void;
};

function LegalModal({ title, href, onClose }: LegalModalProps) {
  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-xl"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="glass-panel relative flex w-full max-w-2xl max-h-[80vh] flex-col overflow-hidden rounded-[1.5rem] border border-border/60">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--brand)]" aria-hidden="true" />
            <h2 id="legal-modal-title" className="font-heading text-sm font-semibold tracking-tight">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {/* Iframe content */}
        <div className="flex-1 overflow-auto">
          <iframe
            src={href}
            title={title}
            className="h-[60vh] w-full border-0 bg-background"
            loading="lazy"
          />
        </div>

        {/* Footer of modal */}
        <div className="flex items-center justify-between border-t border-border/40 px-6 py-3">
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-[var(--brand)]"
          >
            Open full page ↗
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[var(--brand)] px-4 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-80"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
export function SiteFooter() {
  const { dict } = useI18n();
  const year = new Date().getFullYear();

  const [modal, setModal] = React.useState<{ title: string; href: string } | null>(null);

  const productLinks = [
    { label: dict.products.typing.name,   href: TYPOO_URL,    external: true  },
    { label: dict.products.widgets.name,  href: "/#roadmap",  external: false },
    { label: dict.products.ai.name,       href: "/#roadmap",  external: false },
    { label: dict.nav.ecosystem,          href: "/#ecosystem",external: false },
  ];

  const companyLinks = [
    { label: dict.footer.about,   href: "/about"   },
    { label: dict.footer.contact, href: "/contact" },
    { label: dict.footer.admin,   href: "/admin"   },
  ];

  const legalLinks = [
    { label: dict.footer.privacy, href: "/legal/privacy" },
    { label: dict.footer.terms,   href: "/legal/terms"   },
    { label: dict.footer.cookies, href: "/legal/cookies" },
    { label: dict.footer.legal,   href: "/legal/notice"  },
  ];

  const openLegal = (label: string, href: string) => {
    setModal({ title: label, href });
  };

  return (
    <>
      {modal && (
        <LegalModal
          title={modal.title}
          href={modal.href}
          onClose={() => setModal(null)}
        />
      )}

      <footer className="relative px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-6 lg:px-8">
        <div
          className="relative mx-auto w-full max-w-[90rem] overflow-hidden rounded-[2rem] border border-border/50"
          style={{
            background: "var(--surface-glass)",
            backdropFilter: "blur(28px) saturate(160%)",
            WebkitBackdropFilter: "blur(28px) saturate(160%)",
            boxShadow: "var(--shadow-panel)",
          }}
        >
          {/* Gradient line at top */}
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(90deg, transparent, #17b79b 30%, var(--accent-blue) 55%, var(--accent-violet) 80%, transparent)",
              opacity: 0.6,
            }}
            aria-hidden="true"
          />

          {/* Ecosystem status strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/30 px-7 py-4 sm:px-10">
            <div className="flex items-center gap-2">
              <span className="status-dot" aria-hidden="true" />
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                Ecosystem status
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {ECOSYSTEM_BADGES.map((badge) => (
                <span
                  key={badge.label}
                  className="flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.08em]"
                  style={{
                    borderColor: `${badge.accent}25`,
                    color: badge.accent,
                    backgroundColor: `${badge.accent}10`,
                  }}
                >
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: badge.accent }} aria-hidden="true" />
                  {badge.label}
                  <span className="text-muted-foreground">· {badge.status}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Main grid */}
          <div className="px-7 py-10 sm:px-10 md:py-14">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
              {/* Brand column */}
              <div className="space-y-5 sm:col-span-2 lg:col-span-1">
                <XviFlooLogo size="lg" />
                <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {dict.footer.tagline}
                </p>
                {/* Decorative mini network */}
                <div className="flex items-center gap-3 pt-1">
                  {["#17b79b", "var(--accent-blue)", "var(--accent-violet)"].map((c, i) => (
                    <React.Fragment key={i}>
                      <span className="size-2 rounded-full" style={{ backgroundColor: c, boxShadow: `0 0 6px ${c}` }} aria-hidden="true" />
                      {i < 2 && <span className="h-px flex-1 opacity-40" style={{ background: `linear-gradient(90deg, ${c}, var(--accent-blue))` }} aria-hidden="true" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Products */}
              <nav aria-label="Products">
                <p className="mb-4 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {dict.footer.columns.products}
                </p>
                <ul className="space-y-2.5">
                  {productLinks.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer"
                          className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-[var(--brand)]">
                          <span className="size-1 rounded-full bg-border transition-colors group-hover:bg-[var(--brand)]" aria-hidden="true" />
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href}
                          className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground">
                          <span className="size-1 rounded-full bg-border transition-colors group-hover:bg-foreground" aria-hidden="true" />
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Company */}
              <nav aria-label="Company">
                <p className="mb-4 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {dict.footer.columns.company}
                </p>
                <ul className="space-y-2.5">
                  {companyLinks.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}
                        className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground">
                        <span className="size-1 rounded-full bg-border transition-colors group-hover:bg-foreground" aria-hidden="true" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col gap-4 border-t border-border/30 px-7 py-5 sm:px-10 md:flex-row md:items-center md:justify-between">
            {/* Left — copyright */}
            <p className="font-mono text-[0.65rem] text-muted-foreground">
              © {year} {dict.brand.name}. {dict.footer.copyright}
            </p>

            {/* Center — legal links (open modal on click) */}
            <nav aria-label="Legal" className="flex flex-wrap items-center gap-1">
              {legalLinks.map((link, i) => (
                <span key={link.label} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => openLegal(link.label, link.href)}
                    className="rounded-full px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground transition-all duration-300 hover:bg-[var(--brand-muted)] hover:text-[var(--brand)]"
                  >
                    {link.label}
                  </button>
                  {i < legalLinks.length - 1 && (
                    <span className="text-border text-xs" aria-hidden="true">·</span>
                  )}
                </span>
              ))}
            </nav>

            {/* Right — Made by */}
            <a
              href={NAFIS_FB}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[0.65rem] text-muted-foreground transition-colors hover:text-[var(--brand)]"
            >
              Made by{" "}
              <span className="text-[var(--brand)]">@nafisxvi</span>
            </a>
          </div>

          {/* Bottom gradient line */}
          <div
            className="h-px w-full"
            style={{
              background: "linear-gradient(90deg, transparent, var(--accent-violet) 30%, #17b79b 70%, transparent)",
              opacity: 0.4,
            }}
            aria-hidden="true"
          />
        </div>
      </footer>
    </>
  );
}
