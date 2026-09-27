import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type ShowcaseColorMode = 'light' | 'dark'

interface ShowcaseThemeState {
  colorMode: ShowcaseColorMode
  toggleColorMode: () => void
}

/**
 * The public sites' own light/dark switch. Kept apart from the admin's preference on purpose:
 * a visitor flipping a marketing site to dark should not repaint the dashboard, and back.
 */
export const useShowcaseTheme = create<ShowcaseThemeState>()(
  persist(
    (set) => ({
      colorMode: 'light',
      toggleColorMode: () =>
        set((state) => ({ colorMode: state.colorMode === 'dark' ? 'light' : 'dark' })),
    }),
    { name: 'rvbp-showcase-theme', storage: createJSONStorage(() => localStorage) },
  ),
)
