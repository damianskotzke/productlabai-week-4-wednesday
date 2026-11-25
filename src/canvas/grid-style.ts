import { create } from "zustand"
import { persist } from "zustand/middleware"

/** How the canvas draws the grid behind the nodes. */
export type GridStyle = "dots" | "lines" | "none"

export const GRID_STYLES: { value: GridStyle; label: string }[] = [
  { value: "dots", label: "Dots" },
  { value: "lines", label: "Lines" },
  { value: "none", label: "None" },
]

type GridStyleState = {
  gridStyle: GridStyle
  setGridStyle: (gridStyle: GridStyle) => void
}

/**
 * The grid style of this person. It is a personal setting, so it stays in
 * this browser (localStorage) and is not sent to the shared board.
 */
export const useGridStyle = create<GridStyleState>()(
  persist(
    (set) => ({
      gridStyle: "dots",
      setGridStyle: (gridStyle) => set({ gridStyle }),
    }),
    {
      name: "whiteboard:grid-style",
      // Ignore an unknown value, for example from a newer version of the app.
      merge: (saved, current) => {
        const gridStyle = (saved as Partial<GridStyleState> | undefined)?.gridStyle
        return GRID_STYLES.some((style) => style.value === gridStyle)
          ? { ...current, gridStyle: gridStyle as GridStyle }
          : current
      },
    },
  ),
)
