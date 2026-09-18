"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useHydrated } from "@/lib/store/persisted";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  // The resolved theme is unknowable until next-themes has read the DOM, so the
  // button renders an empty placeholder through hydration.
  const mounted = useHydrated();

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className={`w-9 h-9 rounded-full flex items-center justify-center border border-border text-foreground/80 ${className}`}
      >
        <span className="w-4 h-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={`w-9 h-9 rounded-full flex items-center justify-center border border-border text-foreground hover:bg-secondary transition-colors ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-foreground transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-foreground transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
