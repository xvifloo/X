"use client";

import * as React from "react";
import { Mail, Send, X } from "lucide-react";
import { Reveal } from "@/components/home/section-shell";

/* Facebook icon — removed from lucide-react v1, use inline SVG to match style */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function ContactSection() {
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    /* TODO: wire to backend */
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("sent");
  };

  return (
    <section id="contact" className="scroll-mt-20 section-pad">
      <div className="section-inner">
        <Reveal>
          <div className="mb-12 max-w-xl">
            <p className="eyebrow mb-4">Get In Touch</p>
            <h2 className="text-display-sm mb-4">
              <span className="text-[#444444]">Let&apos;s build </span>
              <span className="section-gradient-text">something great</span>
            </h2>
            <p className="text-[#778B88] leading-relaxed">
              Have a question, partnership idea, or just want to say hello?
              We&apos;d love to hear from you.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Form */}
          <Reveal delay={80}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.14em] text-[#444444]">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-[rgba(23,183,155,0.18)] bg-white px-4 py-3 font-mono text-sm text-[#444444] placeholder-[#778B88]/60 outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(23,183,155,0.12)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.14em] text-[#444444]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-[rgba(23,183,155,0.18)] bg-white px-4 py-3 font-mono text-sm text-[#444444] placeholder-[#778B88]/60 outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(23,183,155,0.12)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-[0.14em] text-[#444444]">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us what's on your mind..."
                  className="w-full resize-none rounded-xl border border-[rgba(23,183,155,0.18)] bg-white px-4 py-3 font-mono text-sm text-[#444444] placeholder-[#778B88]/60 outline-none transition-all focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(23,183,155,0.12)]"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className="btn-primary disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>Sending…</>
                ) : status === "sent" ? (
                  <>Message sent ✓</>
                ) : (
                  <>Send message <Send className="size-3.5" /></>
                )}
              </button>
              {status === "error" && (
                <p className="font-mono text-xs text-red-500">Something went wrong. Please try again.</p>
              )}
            </form>
          </Reveal>

          {/* Social links */}
          <Reveal delay={150}>
            <div className="space-y-6">
              <div>
                <p className="mb-4 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-[#778B88]">
                  Find us online
                </p>
                <div className="space-y-3">
                  {[
                    {
                      icon: <Mail className="size-4" />,
                      label: "Email",
                      value: "hello@xvifloo.com",
                      href: "mailto:hello@xvifloo.com",
                    },
                    {
                      icon: <X className="size-4" />,
                      label: "X (Twitter)",
                      value: "@xvifloo",
                      href: "https://x.com/xvifloo",
                    },
                    {
                      icon: <FacebookIcon className="size-4" />,
                      label: "Facebook",
                      value: "@xvifloo",
                      href: "https://facebook.com/xvifloo",
                    },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-4 rounded-xl border border-[rgba(23,183,155,0.12)] bg-white px-4 py-3.5 shadow-[var(--shadow-xs)] transition-all hover:border-[var(--brand)] hover:shadow-[var(--shadow-card-hover)]"
                    >
                      <span className="flex size-9 items-center justify-center rounded-lg bg-[rgba(23,183,155,0.08)] text-[var(--brand)]">
                        {item.icon}
                      </span>
                      <div>
                        <p className="font-heading text-xs font-semibold uppercase tracking-[0.10em] text-[#778B88]">
                          {item.label}
                        </p>
                        <p className="font-mono text-sm font-medium text-[#444444]">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[rgba(23,183,155,0.12)] bg-[rgba(23,183,155,0.04)] p-5">
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)] mb-2">
                  Response time
                </p>
                <p className="text-sm text-[#778B88] leading-relaxed">
                  We typically respond within 24–48 hours. For urgent matters,
                  reach out via X or Facebook for a faster reply.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
