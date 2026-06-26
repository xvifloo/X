"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown, Languages, LogIn, Moon, Sun, SunMoon,
} from "lucide-react";

import { useI18n } from "@/components/providers/i18n-provider";
import { useTheme } from "next-themes";
import { XviFlooLogo } from "@/components/brand/xvifloo-logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#features", labelKey: "nav.features" },
  { href: "/#ecosystem", labelKey: "nav.ecosystem" },
  { href: "/pricing", labelKey: "nav.pricing" },
  { href: "/blog", labelKey: "nav.blog" },
  { href: "/docs", labelKey: "nav.docs" },
];

const themeOptions = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: SunMoon },
];

const langOptions = [
  { value: "en", label: "English" },
  { value: "bn", label: "বাংলা" },
];

function HamburgerButton({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="hamburger-button"
      aria-label="Toggle menu"
      aria-expanded={isOpen}
      onClick={onClick}
    >
      <span className={cn("line top", { open: isOpen })} />
      <span className={cn("line middle", { open: isOpen })} />
      <span className={cn("line bottom", { open: isOpen })} />
    </button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { dict, lang, setLang } = useI18n();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const NavLink = ({
    href,
    labelKey,
  }: {
    href: string;
    labelKey: string;
  }) => {
    const isActive = pathname === href;
    const label = labelKey.split(".").reduce((o, k) => o[k], dict as any);
    return (
      <Link
        href={href}
        className={cn("nav-link", { active: isActive })}
        onClick={() => setIsMenuOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav
      className={cn("navbar-capsule", { "menu-open": isMenuOpen })}
      style={{
        // FUTURE-CONFIG: Navbar-এর width, blur, radius এবং glow এখান থেকে পরিবর্তন করা যাবে।
        "--navbar-max-width": "var(--size-container-3)",
        "--navbar-blur": "20px",
        "--navbar-radius": "9999px",
        "--navbar-glow-color": "var(--brand-glow)",
      }}
    >
      <div className="navbar-content">
        <div className="navbar-left">
          <Link href="/" className="shrink-0" onClick={() => setIsMenuOpen(false)}>
            <XviFlooLogo size="sm" />
            <span className="sr-only">XviFloo Home</span>
          </Link>
        </div>

        <div className="navbar-center">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </div>

        <div className="navbar-right">
          <div className="hidden items-center gap-2 lg:flex">
            {/* Theme Selector */}
            <div className="theme-selector">
              <Sun className="size-3.5" />
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                aria-label="Select theme"
              >
                {themeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="size-3.5 opacity-50" />
            </div>

            {/* Language Selector */}
            <div className="lang-selector">
              <Languages className="size-3.5" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as "en" | "bn")}
                aria-label="Select language"
              >
                {langOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="size-3.5 opacity-50" />
            </div>
          </div>

          <div className="h-6 w-px bg-white/10" />

          <Link href="/login" className="sign-in-button">
            <LogIn className="size-3.5" />
            <span>{dict.nav.signIn}</span>
          </Link>
        </div>

        <div className="navbar-mobile-toggle">
          <HamburgerButton isOpen={isMenuOpen} onClick={toggleMenu} />
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className="mobile-menu-panel">
        <div className="mobile-menu-content">
          <div className="mobile-nav-links">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>

          <div className="mobile-menu-separator" />

          <div className="mobile-menu-section">
            <p className="mobile-menu-heading">{dict.nav.theme}</p>
            <div className="mobile-menu-options">
              {themeOptions.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  className={cn("mobile-menu-option", { active: theme === value })}
                  onClick={() => {
                    setTheme(value);
                    setIsMenuOpen(false);
                  }}
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mobile-menu-section">
            <p className="mobile-menu-heading">{dict.nav.language}</p>
            <div className="mobile-menu-options">
              {langOptions.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={cn("mobile-menu-option", { active: lang === value })}
                  onClick={() => {
                    setLang(value as "en" | "bn");
                    setIsMenuOpen(false);
                  }}
                >
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

```

#### ২. Header কম্পোনেন্ট-এর পরিবর্তন

`header.tsx` ফাইল থেকে পুরনো নেভিগেশন কোড সরিয়ে নতুন `Navbar` কম্পোনেন্টটি যোগ করা হয়েছে।

```diff
--- a/c:\Xvifloo-Ecoseystem\src\components\layout\header.tsx
+++ b/c:\Xvifloo-Ecoseystem\src\components\layout\header.tsx
@@ -1,11 +1,7 @@
-import { MainNav } from "@/components/layout/main-nav";
-import { MobileNav } from "@/components/layout/mobile-nav";
+import { Navbar } from "@/components/layout/navbar";
 
 export function Header() {
   return (
-    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
-      <div className="container flex h-14 max-w-screen-2xl items-center">
-        <MainNav />
-        <MobileNav />
-      </div>
-    </header>
+    <header className="header-container">
+      <Navbar />
+    </header>
   );
 }

```

#### ৩. গ্লোবাল CSS-এর পরিবর্তন

`globals.css` ফাইলে নতুন Navbar-এর জন্য প্রয়োজনীয় স্টাইল, ভেরিয়েবল, গ্লাস ইফেক্ট এবং অ্যানিমেশন যোগ করা হয়েছে।

```diff
--- a/c:\Xvifloo-Ecoseystem\src\app\globals.css
+++ b/c:\Xvifloo-Ecoseystem\src\app\globals.css
@@ -52,3 +52,190 @@
     --radius: 0.5rem;
   }
 }
+
+/* ─── Header & Navbar ──────────────────────────────────────────────────────────────── */
+
+.header-container {
+  @apply pointer-events-none fixed inset-x-0 top-0 z-50 flex h-28 justify-center;
+}
+
 /* FUTURE-CONFIG: Navbar-এর size, padding, এবং gap এখান থেকে পরিবর্তন করা যাবে। */
+.navbar-capsule {
+  @apply pointer-events-auto relative m-auto mt-6 flex h-14 w-full max-w-[calc(100%-2rem)] flex-col rounded-[var(--navbar-radius)] border border-white/10 bg-white/5 shadow-2xl shadow-black/20 transition-all duration-500 ease-in-out;
+  -webkit-backdrop-filter: blur(var(--navbar-blur));
+  backdrop-filter: blur(var(--navbar-blur));
+  box-shadow:
+    0 0 0 1px rgba(255, 255, 255, 0.08) inset,
+    0 0 40px -15px var(--navbar-glow-color);
+
+  &.menu-open {
+    @apply h-[calc(100dvh-3rem)] md:h-14;
+  }
+}
+
+.navbar-content {
+  @apply flex h-14 shrink-0 items-center justify-between px-4;
+}
+
+.navbar-left {
+  @apply flex items-center gap-4;
+}
+
+.navbar-center {
+  @apply absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 md:flex;
+}
+
+.navbar-right {
+  @apply flex items-center gap-4;
+}
+
+.nav-link {
+  @apply rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground;
+  &.active {
+    @apply bg-white/5 text-foreground;
+  }
+}
+
+.theme-selector,
+.lang-selector {
+  @apply relative flex h-8 items-center gap-1.5 rounded-full bg-white/5 pl-2.5 pr-2 text-sm text-muted-foreground transition-colors hover:text-foreground;
+
+  select {
+    @apply absolute inset-0 cursor-pointer opacity-0;
+  }
+}
+
+.sign-in-button {
+  @apply hidden h-8 items-center gap-2 rounded-full bg-brand px-3 text-sm font-semibold text-background transition-opacity hover:opacity-80 lg:flex;
+}
+
+.navbar-mobile-toggle {
+  @apply z-10 lg:hidden;
+}
+
+.hamburger-button {
+  @apply relative h-8 w-8;
+
+  .line {
+    @apply absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground transition-all duration-300 ease-in-out;
+
+    &.top {
+      @apply -translate-y-2;
+      &.open {
+        @apply translate-y-0 rotate-45;
+      }
+    }
+
+    &.middle {
+      @apply opacity-100;
+      &.open {
+        @apply opacity-0;
+      }
+    }
+
+    &.bottom {
+      @apply translate-y-2;
+      &.open {
+        @apply translate-y-0 -rotate-45;
+      }
+    }
+  }
+}
+
+/* ─── Mobile Menu ────────────────────────────────────────────────────────────────── */
+
+.mobile-menu-panel {
+  @apply flex-1 overflow-y-auto lg:hidden;
+}
+
+.mobile-menu-content {
+  @apply flex flex-col gap-6 p-4 pt-2;
+}
+
+.mobile-nav-links {
+  @apply flex flex-col items-start gap-1;
+  .nav-link {
+    @apply w-full py-2 text-base text-left;
+  }
+}
+
+.mobile-menu-separator {
+  @apply h-px bg-white/10;
+}
+
+.mobile-menu-section {
+  @apply space-y-3;
+}
+
+.mobile-menu-heading {
+  @apply px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground;
+}
+
+.mobile-menu-options {
+  @apply grid grid-cols-2 gap-2 sm:grid-cols-3;
+}
+
+.mobile-menu-option {
+  @apply flex items-center justify-center gap-2 rounded-lg border border-transparent bg-white/5 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground;
+
+  &.active {
+    @apply border-white/10 bg-white/10 text-foreground;
+  }
+}