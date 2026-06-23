import { useColorScheme } from "react-native";
import { useStreakStore } from "../store/streakStore";
import { THEMES, getThemeById } from "@ticktick/shared";

type ColorScheme = "system" | "light" | "dark";

export const defaultDark = {
  bg: "#070707",
  surface: "#0f0f10",
  surfaceVariant: "#1a1a1c",
  card: "#131314",
  border: "#2a2a2c",
  primary: "#f5f5f5",
  cream: "#f5f5f5",
  text: "#f5f5f5",
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

export const defaultLight = {
  bg: "#f5f5f7",
  surface: "#ffffff",
  surfaceVariant: "#e8e8ec",
  card: "#fafafa",
  border: "#d1d1d6",
  primary: "#1a1a1c",
  cream: "#1a1a1c",
  text: "#1a1a1c",
  muted: "#8e8e93",
  subtle: "#aeaeb2",
  coral: "#e04b4b",
  coralLight: "#e07040",
  amber: "#d4a017",
  sky: "#0ea5e9",
  violet: "#7c3aed",
  emerald: "#10b981",
  teal: "#14b8a6",
  error: "#e04b4b",
};

export function getColors(themeId: string, scheme: ColorScheme, systemScheme: "light" | "dark" | null | undefined) {
  const theme = getThemeById(themeId) ?? THEMES[0];
  const resolved = scheme === "system" ? (systemScheme ?? "dark") : scheme;
  const base = resolved === "light" ? defaultLight : defaultDark;

  return {
    ...base,
    coral: theme.primary,
    violet: theme.accent,
  };
}

export function useThemeColors() {
  const activeTheme = useStreakStore((s) => s.activeTheme);
  const colorScheme = useStreakStore((s) => s.colorScheme ?? "system");
  const systemScheme = useColorScheme();
  return getColors(activeTheme, colorScheme, systemScheme);
}
