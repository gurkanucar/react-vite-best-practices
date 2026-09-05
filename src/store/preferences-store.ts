import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  defaultThemePreferences,
  visualThemeOptions,
  type ColorMode,
  type VisualTheme,
} from '@/theme/theme'

export type Language = 'en' | 'tr'

export interface PreferencesState {
  language: Language
  colorMode: ColorMode
  compact: boolean
  visualTheme: VisualTheme
}

interface PreferencesActions {
  setLanguage: (language: Language) => void
  setColorMode: (colorMode: ColorMode) => void
  setCompact: (compact: boolean) => void
  setVisualTheme: (visualTheme: VisualTheme) => void
  resetPreferences: () => void
}

export type PreferencesStore = PreferencesState & PreferencesActions

export const initialPreferences: PreferencesState = {
  language: 'en',
  ...defaultThemePreferences,
}

export const preferencesStorageKey = 'rvbp-preferences'

function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'tr'
}

function isColorMode(value: unknown): value is ColorMode {
  return value === 'system' || value === 'light' || value === 'dark'
}

function isVisualTheme(value: unknown): value is VisualTheme {
  return visualThemeOptions.some((option) => option.value === value)
}

function mergePersistedPreferences(
  persistedState: unknown,
  currentState: PreferencesStore,
): PreferencesStore {
  const persisted = (persistedState ?? {}) as Partial<PreferencesState>

  return {
    ...currentState,
    language: isLanguage(persisted.language) ? persisted.language : currentState.language,
    colorMode: isColorMode(persisted.colorMode) ? persisted.colorMode : currentState.colorMode,
    compact: typeof persisted.compact === 'boolean' ? persisted.compact : currentState.compact,
    visualTheme: isVisualTheme(persisted.visualTheme)
      ? persisted.visualTheme
      : currentState.visualTheme,
  }
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      ...initialPreferences,
      setLanguage: (language) => set({ language }),
      setColorMode: (colorMode) => set({ colorMode }),
      setCompact: (compact) => set({ compact }),
      setVisualTheme: (visualTheme) => set({ visualTheme }),
      resetPreferences: () => set(initialPreferences),
    }),
    {
      name: preferencesStorageKey,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      merge: mergePersistedPreferences,
      partialize: ({ language, colorMode, compact, visualTheme }) => ({
        language,
        colorMode,
        compact,
        visualTheme,
      }),
    },
  ),
)
