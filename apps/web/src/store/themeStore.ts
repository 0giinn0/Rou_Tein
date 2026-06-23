import { create } from "zustand";
import { persist } from "zustand/middleware";
import { themePresets } from "@/theme/themePresets";
import type { ThemePreset } from "@/theme/themePresets";

interface ThemeStore {
  activePresetId: string;
  preset: ThemePreset;
  setPreset: (id: string) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      activePresetId: "black_white",
      preset: themePresets.find((p) => p.id === "black_white")!,
      setPreset: (id: string) => {
        const preset = themePresets.find((p) => p.id === id);
        if (preset) set({ activePresetId: id, preset });
      },
    }),
    { name: "routtein-theme", partialize: (state) => ({ activePresetId: state.activePresetId }) }
  )
);
