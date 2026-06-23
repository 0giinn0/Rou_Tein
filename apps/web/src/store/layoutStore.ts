import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Layout, LayoutItem } from "react-grid-layout";

const defaultLayout: LayoutItem[] = [
  { i: "01", x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 2 },
  { i: "02", x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 1 },
  { i: "03", x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 1 },
  { i: "04", x: 6, y: 2, w: 3, h: 2, minW: 2, minH: 1 },
  { i: "05", x: 9, y: 2, w: 3, h: 2, minW: 2, minH: 1 },
  { i: "06", x: 0, y: 4, w: 6, h: 2, minW: 3, minH: 1 },
  { i: "07", x: 6, y: 4, w: 6, h: 2, minW: 3, minH: 1 },
];

interface LayoutStore {
  layouts: Record<string, LayoutItem[]>;
  setLayouts: (layouts: Record<string, LayoutItem[]>) => void;
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      layouts: { lg: defaultLayout },
      setLayouts: (layouts) => set({ layouts }),
    }),
    { name: "routtein-layout" }
  )
);
