import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Reveal } from "@/components/home/section-shell";

type LegalSection = { heading: string; body: string };

export function LegalPageShell({
  eyebrow,
  heading,
  updated,
  intro,
  sections,
  backLabel,
}: {
  eyebrow: string;
  heading: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  backLabel: string;
}) {
  return (
    <article className="section-pad">
      <div className="mx-auto w-full max-w-3xl">
        <Reveal>
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            {backLabel}
          </Link>

          <header className="mb-14 space-y-4 border-b border-border/50 pb-10">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="text-display-sm">{heading}</h1>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {updated}
            </p>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{intro}</p>
          </header>
        </Reveal>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <Reveal key={section.heading} delay={Math.min(index * 40, 320)}>
              <section className="space-y-3 border-b border-border/30 pb-8 last:border-b-0 last:pb-0">
                <h2 className="font-heading text-xl font-semibold tracking-tight">
                  {section.heading}
                </h2>
                <p className="max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </article>
  );
}
