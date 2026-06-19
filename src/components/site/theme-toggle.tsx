"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  label: string;
  light: string;
  dark: string;
  system: string;
};

const OPTIONS = [
  { key: "light", icon: Sun },
  { key: "dark", icon: Moon },
  { key: "system", icon: Monitor },
] as const;

export function ThemeToggle({ label, light, dark, system }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const active = mounted ? theme ?? "system" : "system";
  const text = { light, dark, system };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      suppressHydrationWarning
      className="inline-flex items-center gap-0.5 rounded-full border border-border/70 bg-[var(--surface-2)] p-0.5"
    >
      {OPTIONS.map(({ key, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={text[key]}
            title={text[key]}
            onClick={() => setTheme(key)}
            className={cn(
              "relative flex size-7 items-center justify-center rounded-full transition-all duration-300",
              isActive
                ? "bg-[var(--brand)] text-white shadow-[0_0_16px_var(--brand-glow)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
