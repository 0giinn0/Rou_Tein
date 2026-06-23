"use client";

import { ThemeProvider } from "@/theme/ThemeContext";
import { BentoShell } from "@/components/BentoShell";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <BentoShell>{children}</BentoShell>
    </ThemeProvider>
  );
}
