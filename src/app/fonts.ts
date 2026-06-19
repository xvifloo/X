import localFont from "next/font/local";

/**
 * Display face — used for headings and the hero. Geometric, technical,
 * and confident at large sizes without tipping into novelty.
 */
export const fontDisplay = localFont({
  src: [
    { path: "./fonts/space-grotesk-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/space-grotesk-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/space-grotesk-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
});

/**
 * Body face — workhorse copy face. Warmer and more refined than a default
 * system grotesk so long-form copy reads as considered, not boilerplate.
 */
export const fontBody = localFont({
  src: [
    { path: "./fonts/jakarta-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jakarta-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/jakarta-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/jakarta-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "Segoe UI",
    "Noto Sans Bengali",
    "sans-serif",
  ],
});

/**
 * Technical / data face — eyebrows, labels, stats, status chips, and the
 * roadmap. Reinforces the "engineering dashboard" register the brief asks for.
 */
export const fontMono = localFont({
  src: [
    { path: "./fonts/jbmono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jbmono-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/jbmono-600.woff2", weight: "600", style: "normal" },
  ],
  // NOTE: intentionally NOT named "--font-mono" — that name is owned by the
  // Tailwind theme token in globals.css (`@theme inline { --font-mono: ... }`).
  // Reusing it here would make that declaration self-referential and silently
  // fall back to the browser default, which is exactly the bug this file fixes.
  variable: "--font-jbmono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});
