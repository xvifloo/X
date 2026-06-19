"use client";

import * as React from "react";
import { Handshake, Mail, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { Reveal } from "@/components/home/section-shell";
import { SiteShell } from "@/components/site/site-shell";
import { trackEvent } from "@/lib/analytics/track-event";

const CHANNEL_ICONS = {
  general: Mail,
  support: MessageCircle,
  partnerships: Handshake,
} as const;

export default function ContactPage() {
  const { dict } = useI18n();
  const section = dict.contact;
  const channelKeys = Object.keys(section.channels) as Array<keyof typeof section.channels>;

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    trackEvent({
      eventName: "contact_form_submit",
      props: { hasName: Boolean(name), hasEmail: Boolean(email) },
    });

    const subject = encodeURIComponent(`Message from ${name || "the XviFloo site"}`);
    const bodyLines = [message, "", `— ${name || "Anonymous"}`, email].filter(Boolean);
    const body = encodeURIComponent(bodyLines.join("\n"));
    const to = section.channels.general.value;

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  return (
    <SiteShell>
      <section className="section-pad">
        <div className="mx-auto w-full max-w-7xl">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow">{section.eyebrow}</p>
              <h1 className="text-display-sm mt-4">{section.heading}</h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {section.subheading}
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal delay={100}>
              <div className="space-y-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {section.channelsHeading}
                </p>
                <ul className="space-y-3">
                  {channelKeys.map((key) => {
                    const channel = section.channels[key];
                    const Icon = CHANNEL_ICONS[key];
                    return (
                      <li key={key}>
                        <a
                          href={`mailto:${channel.value}`}
                          className="card-elevated group flex items-center gap-4 p-5"
                        >
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-muted)] text-[var(--brand)] transition-colors duration-500 group-hover:bg-[var(--brand)] group-hover:text-white">
                            <Icon className="size-4" aria-hidden="true" />
                          </span>
                          <span>
                            <span className="block text-sm font-medium">{channel.label}</span>
                            <span className="block text-sm text-muted-foreground">
                              {channel.value}
                            </span>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <form
                onSubmit={handleSubmit}
                className="glass-panel space-y-5 rounded-[1.75rem] p-7 md:p-9"
              >
                <div>
                  <h2 className="font-heading text-xl font-semibold tracking-tight">
                    {section.formHeading}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {section.formNote}
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {section.nameLabel}
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={section.namePlaceholder}
                      className="w-full rounded-xl border border-border/70 bg-[var(--surface-2)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--brand)]/50"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {section.emailLabel}
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={section.emailPlaceholder}
                      className="w-full rounded-xl border border-border/70 bg-[var(--surface-2)] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--brand)]/50"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {section.messageLabel}
                  </span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={section.messagePlaceholder}
                    rows={5}
                    className="w-full resize-none rounded-xl border border-border/70 bg-[var(--surface-2)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--brand)]/50"
                  />
                </label>

                <Button type="submit" size="lg" className="h-11 w-full rounded-full sm:w-auto">
                  {section.submit}
                </Button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
