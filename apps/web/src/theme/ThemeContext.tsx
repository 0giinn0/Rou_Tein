"use client";

import { useEffect, createContext, useContext } from "react";
import { useThemeStore } from "@/store/themeStore";
import type { ThemePreset } from "./themePresets";

const ThemeContext = createContext<ThemePreset | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preset = useThemeStore((s) => s.preset);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bg", preset.bg);
    root.style.setProperty("--surface", preset.surface);
    root.style.setProperty("--surface-variant", preset.surfaceVariant);
    root.style.setProperty("--card", preset.card);
    root.style.setProperty("--border", preset.border);
    root.style.setProperty("--primary", preset.primary);
    root.style.setProperty("--on-bg", preset.onBg);
    root.style.setProperty("--on-surface", preset.onSurface);
    root.style.setProperty("--muted", preset.muted);
    root.style.setProperty("--subtle", preset.subtle);
    root.style.setProperty("--green", preset.green);
    root.style.setProperty("--error", preset.error);
    root.style.setProperty("--emerald", "#34d399");
    root.style.setProperty("--coral", "#ff6b6b");
    root.style.setProperty("--amber", "#fbbf24");
    root.style.setProperty("--sky", "#38bdf8");
    root.style.setProperty("--violet", "#a78bfa");
    root.style.setProperty("--teal", "#2dd4bf");
    root.style.setProperty("--gradient-start", preset.gradientStart);
    root.style.setProperty("--gradient-end", preset.gradientEnd);
  }, [preset]);

  return <ThemeContext.Provider value={preset}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
