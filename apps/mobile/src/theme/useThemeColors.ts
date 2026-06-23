import { useStreakStore } from "../store/streakStore";
import { THEMES, getThemeById } from "@ticktick/shared";

export const defaultColors = {
  bg: "#070707",
  surface: "#0f0f10",
  surfaceVariant: "#1a1a1c",
  card: "#131314",
  border: "#2a2a2c",
  primary: "#f5f5f5",
  cream: "#f5f5f5",
  muted: "#7a7a7c",
  subtle: "#4a4a4c",
  coral: "#ff6b6b",
  coralLight: "#ff8e53",
  amber: "#fbbf24",
  sky: "#38bdf8",
  violet: "#a78bfa",
  emerald: "#34d399",
  teal: "#2dd4bf",
  error: "#fb7185",
};

export function getColors(themeId: string) {
  const theme = getThemeById(themeId) ?? THEMES[0];
  return {
    ...defaultColors,
    bg: theme.bg,
    surface: theme.surface,
    coral: theme.primary,
    violet: theme.accent,
  };
}

export function useThemeColors() {
  const activeTheme = useStreakStore((state) => state.activeTheme);
  return getColors(activeTheme);
}
