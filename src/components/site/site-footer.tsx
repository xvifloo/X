"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, X } from "lucide-react";

import { XviFlooLogo } from "@/components/brand/xvifloo-logo";
import { useI18n } from "@/components/providers/i18n-provider";

const TYPOO_URL   = "https://typoo.xvifloo.com";
const NAFIS_FB    = "https://facebook.com/nafisxvi";

const ECOSYSTEM_BADGES = [
  { label: "XviTypoo", accent: "var(--brand)",         status: "Live"     },
  { label: "XviGet",   accent: "#17B79B",              status: "Building" },
  { label: "Kleava AI",accent: "var(--accent-violet)", status: "Research" },
] as const;

// ── Universal modal ────────────────────────────────────────────────────────────
function FooterModal({
  title,
  onClose,
  children,
  href,
}: {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
  href?: string;
}) {
  React.useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4 md:p-8"
      role="dialog" aria-modal="true" aria-labelledby="footer-modal-title">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/65 backdrop-blur-2xl"
        onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div
        className="relative flex w-full flex-col overflow-hidden rounded-t-3xl sm:max-w-2xl sm:rounded-3xl"
        style={{
          background: "color-mix(in srgb, var(--background) 88%, transparent)",
          backdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid color-mix(in srgb, var(--brand) 18%, var(--border))",
          boxShadow: "0 -24px 80px rgba(0,0,0,0.5), 0 0 0 1px color-mix(in srgb, var(--brand) 10%, transparent)",
          maxHeight: "85vh",
        }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="size-1.5 rounded-full bg-[var(--brand)]" aria-hidden="true" />
            <h2 id="footer-modal-title" className="font-heading text-base font-semibold">{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="flex size-8 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        {/* Content — iframe for legal pages, custom JSX for about/admin */}
        <div className="flex-1 overflow-auto">
          {href ? (
            <iframe src={href} title={title} className="h-[55vh] w-full border-0 bg-background" loading="lazy" />
          ) : (
            <div className="px-6 py-5">{children}</div>
          )}
        </div>

        {/* Footer of modal */}
        <div className="flex shrink-0 items-center justify-between border-t border-border/30 px-6 py-3">
          {href && (
            <Link href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-[var(--brand)]">
              <ExternalLink className="size-3" aria-hidden="true" />
              Open full page
            </Link>
          )}
          <button type="button" onClick={onClose}
            className="ml-auto rounded-full bg-[var(--brand)] px-5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-80">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
type ModalState =
  | null
  | { kind: "legal";  title: string; href: string }
  | { kind: "about" }
  | { kind: "admin" };

export function SiteFooter() {
  const { dict } = useI18n();
  const year = new Date().getFullYear();
  const [modal, setModal] = React.useState<ModalState>(null);

  const productLinks = [
    { label: dict.products.typing.name,  href: TYPOO_URL,                 external: true },
    { label: dict.products.widgets.name, href: "/#roadmap?product=xviGet", external: false },
    { label: dict.products.ai.name,      href: "/#roadmap?product=kleava", external: false },
    { label: dict.nav.ecosystem,         href: "/#ecosystem",              external: false },
  ];

  const companyLinks = [
    { label: dict.footer.about,   action: () => setModal({ kind: "about" }) },
    { label: dict.footer.contact, href: "/contact" },
    { label: dict.footer.admin,   action: () => setModal({ kind: "admin" }) },
  ];

  const legalLinks = [
    { label: dict.footer.privacy, href: "/legal/privacy"  },
    { label: dict.footer.terms,   href: "/legal/terms"    },
    { label: dict.footer.cookies, href: "/legal/cookies"  },
    { label: dict.footer.legal,   href: "/legal/notice"   },
  ];

  return (
    <>
      {/* ── Modals ─────────────────────────────────────────────────────── */}
      {modal?.kind === "legal" && (
        <FooterModal title={modal.title} href={modal.href} onClose={() => setModal(null)} />
      )}

      {modal?.kind === "about" && (
        <FooterModal title="About XviFloo" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              XviFloo is a technology ecosystem platform unifying productivity, AI, and developer tools
              under one identity, one design language, and one shared infrastructure.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Products in the ecosystem — XviTypoo, XviGet, and Kleava AI — share authentication,
              analytics, content management, and a single design system. This means every new product
              starts with everything already built, not from zero.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We build in public, with a live roadmap and real engineering status — not polished
              marketing promises.
            </p>
            <Link href="/about"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/40 bg-[var(--brand-muted)] px-4 py-2 text-sm font-medium text-[var(--brand)] transition-colors hover:bg-[var(--brand)] hover:text-white">
              View full About page
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </FooterModal>
      )}

      {modal?.kind === "admin" && (
        <FooterModal title="Admin Information" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              The XviFloo Admin panel provides full control over CMS content, product management,
              user roles, analytics, and site settings. Access is restricted to SUPERADMIN, ADMIN,
              and EDITOR roles.
            </p>
            <div className="rounded-xl border border-border/50 bg-[var(--surface-1)] p-4 space-y-2">
              {[
                { role: "SUPERADMIN", desc: "Full access to all screens and user role management" },
                { role: "ADMIN",      desc: "Full access except cannot promote other SUPERADMINs" },
                { role: "EDITOR",     desc: "CMS, products, and analytics only" },
              ].map(({ role, desc }) => (
                <div key={role} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 rounded-md bg-[var(--brand-muted)] px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-[var(--brand)]">
                    {role}
                  </span>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
            <Link href="/admin"
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/40 bg-[var(--brand-muted)] px-4 py-2 text-sm font-medium text-[var(--brand)] transition-colors hover:bg-[var(--brand)] hover:text-white">
              Go to Admin Dashboard
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </FooterModal>
      )}

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="relative px-3 pb-6 pt-3 sm:px-5 md:px-7 lg:px-8">
        <div
          className="relative mx-auto w-full max-w-[90rem] overflow-hidden rounded-[2rem] border border-border/40"
          style={{
            background: "color-mix(in srgb, var(--surface-glass) 90%, transparent)",
            backdropFilter: "blur(28px) saturate(160%)",
            WebkitBackdropFilter: "blur(28px) saturate(160%)",
            boxShadow: "var(--shadow-panel)",
          }}
        >
          {/* Top gradient line */}
          <div className="h-px w-full"
            style={{ background: "linear-gradient(90deg, transparent, #3B82F6 25%, #17B79B 55%, #8B5CF6 80%, transparent)", opacity: 0.55 }}
            aria-hidden="true" />

          {/* Ecosystem status strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/25 px-6 py-3.5 sm:px-9">
            <div className="flex items-center gap-2">
              <span className="status-dot" aria-hidden="true" />
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-muted-foreground">Ecosystem status</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {ECOSYSTEM_BADGES.map((b) => (
                <span key={b.label}
                  className="flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.56rem] uppercase tracking-[0.08em]"
                  style={{ borderColor: `${b.accent}25`, color: b.accent, backgroundColor: `${b.accent}10` }}>
                  <span className="size-1 rounded-full" style={{ backgroundColor: b.accent }} aria-hidden="true" />
                  {b.label} <span className="text-muted-foreground">· {b.status}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Main 3-col grid */}
          <div className="grid gap-8 px-6 py-10 sm:grid-cols-2 sm:px-9 md:py-12 lg:grid-cols-3">
            {/* Brand */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <XviFlooLogo size="lg" />
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {dict.footer.tagline}
              </p>
              <div className="flex items-center gap-2 pt-1">
                {["#17B79B","#3B82F6","#8B5CF6"].map((c,i) => (
                  <React.Fragment key={i}>
                    <span className="size-2 rounded-full" style={{ backgroundColor: c, boxShadow: `0 0 5px ${c}` }} aria-hidden="true" />
                    {i < 2 && <span className="h-px flex-1 opacity-35" style={{ background: `linear-gradient(90deg, ${c}, #3B82F6)` }} aria-hidden="true" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Products */}
            <nav aria-label="Products">
              <p className="mb-4 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                {dict.footer.columns.products}
              </p>
              <ul className="space-y-2.5">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer"
                        className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[var(--brand)]">
                        <span className="size-1 rounded-full bg-border transition-colors group-hover:bg-[var(--brand)]" aria-hidden="true" />
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href}
                        className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                        <span className="size-1 rounded-full bg-border transition-colors group-hover:bg-foreground" aria-hidden="true" />
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Company + Legal stacked in same column */}
            <div className="space-y-7">
              {/* COMPANY */}
              <nav aria-label="Company">
                <p className="mb-4 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {dict.footer.columns.company}
                </p>
                <ul className="space-y-2.5">
                  {companyLinks.map((link) => (
                    <li key={link.label}>
                      {"action" in link ? (
                        <button type="button" onClick={link.action}
                          className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                          <span className="size-1 rounded-full bg-border transition-colors group-hover:bg-foreground" aria-hidden="true" />
                          {link.label}
                        </button>
                      ) : (
                        <Link href={link.href}
                          className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                          <span className="size-1 rounded-full bg-border transition-colors group-hover:bg-foreground" aria-hidden="true" />
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              {/* LEGAL */}
              <nav aria-label="Legal">
                <p className="mb-4 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {dict.footer.columns.legal}
                </p>
                <ul className="space-y-2.5">
                  {legalLinks.map((link) => (
                    <li key={link.label}>
                      <button type="button"
                        onClick={() => setModal({ kind: "legal", title: link.label, href: link.href })}
                        className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[var(--brand)]">
                        <span className="size-1 rounded-full bg-border transition-colors group-hover:bg-[var(--brand)]" aria-hidden="true" />
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Bottom bar — only copyright + made by */}
          <div className="flex flex-col gap-2 border-t border-border/25 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-9">
            <p className="font-mono text-[0.62rem] text-muted-foreground">
              © {year} {dict.brand.name}. {dict.footer.copyright}
            </p>
            <a href={NAFIS_FB} target="_blank" rel="noopener noreferrer"
              className="font-mono text-[0.62rem] text-muted-foreground transition-colors hover:text-[var(--brand)]">
              Made by <span className="text-[var(--brand)]">@nafisxvi</span>
            </a>
          </div>

          {/* Bottom gradient line */}
          <div className="h-px w-full"
            style={{ background: "linear-gradient(90deg, transparent, #8B5CF6 30%, #17B79B 70%, transparent)", opacity: 0.35 }}
            aria-hidden="true" />
        </div>
      </footer>
    </>
  );
}
