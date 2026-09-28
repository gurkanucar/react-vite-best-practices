import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { FINISHED_AT, findArticle } from '@/features/showcases/data/magazine'
import { magazineCopy } from '@/features/showcases/data/magazineCopy'
import { usePreferencesStore } from '@/store/preferences-store'

export const magazineStorageKey = 'rvbp-magazine'

export type ReaderTheme = 'light' | 'sepia' | 'dark'
export type ReaderWidth = 'narrow' | 'medium' | 'wide'
export type ReaderFont = 'serif' | 'sans'

export const READER_SIZES = { min: 15, max: 24, initial: 19 }

export interface ReaderSettings {
  /** Body text size in pixels. */
  size: number
  width: ReaderWidth
  theme: ReaderTheme
  font: ReaderFont
}

export interface Bookmark {
  slug: string
  savedAt: number
}

export interface ReadingRecord {
  /** Where the reader is now, 0 to 1. */
  progress: number
  /** Whether they ever reached the end, even if they scrolled back up afterwards. */
  finished: boolean
  readAt: number
}

interface MagazineData {
  bookmarks: Bookmark[]
  history: Record<string, ReadingRecord>
  reader: ReaderSettings
}

interface MagazineState extends MagazineData {
  toggleBookmark: (slug: string) => void
  clearBookmarks: () => void
  recordProgress: (slug: string, progress: number) => void
  forget: (slug: string) => void
  clearHistory: () => void
  setReader: (settings: Partial<ReaderSettings>) => void
  reset: () => void
}

export const defaultReader: ReaderSettings = {
  size: READER_SIZES.initial,
  width: 'medium',
  theme: 'light',
  font: 'serif',
}

const initialData = (): MagazineData => ({ bookmarks: [], history: {}, reader: defaultReader })

const clampSize = (size: number) =>
  Math.min(READER_SIZES.max, Math.max(READER_SIZES.min, Math.round(size)))

export const useMagazineStore = create<MagazineState>()(
  persist(
    (set) => ({
      ...initialData(),
      toggleBookmark: (slug) =>
        set((state) => ({
          bookmarks: state.bookmarks.some((item) => item.slug === slug)
            ? state.bookmarks.filter((item) => item.slug !== slug)
            : [{ slug, savedAt: Date.now() }, ...state.bookmarks],
        })),
      clearBookmarks: () => set({ bookmarks: [] }),
      recordProgress: (slug, value) =>
        set((state) => {
          const progress = Math.min(1, Math.max(0, value))
          const previous = state.history[slug]
          // Small moves are not worth a write to storage.
          if (previous && Math.abs(previous.progress - progress) < 0.01) return state
          return {
            history: {
              ...state.history,
              [slug]: {
                progress,
                finished: (previous?.finished ?? false) || progress >= FINISHED_AT,
                readAt: Date.now(),
              },
            },
          }
        }),
      forget: (slug) =>
        set((state) => {
          const history = { ...state.history }
          delete history[slug]
          return { history }
        }),
      clearHistory: () => set({ history: {} }),
      setReader: (settings) =>
        set((state) => {
          const reader = { ...state.reader, ...settings }
          return { reader: { ...reader, size: clampSize(reader.size) } }
        }),
      reset: () => set(initialData()),
    }),
    {
      name: magazineStorageKey,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ bookmarks, history, reader }) => ({ bookmarks, history, reader }),
      // Nothing older than version 1 exists; anything unrecognised starts empty.
      migrate: (persisted, version) => (version === 1 ? persisted : initialData()) as MagazineData,
      // Articles can be retired; drop what points at them and fill settings added later.
      merge: (persisted, current) => {
        const data = (persisted ?? {}) as Partial<MagazineData>
        const history = Object.fromEntries(
          Object.entries(data.history ?? {}).filter(([slug]) => findArticle(slug)),
        )
        return {
          ...current,
          bookmarks: (data.bookmarks ?? []).filter((item) => findArticle(item.slug)),
          history,
          reader: { ...defaultReader, ...data.reader },
        }
      },
    },
  ),
)

export function useIsBookmarked(slug: string) {
  return useMagazineStore((state) => state.bookmarks.some((item) => item.slug === slug))
}

export function useMagazineCopy() {
  const language = usePreferencesStore((state) => state.language)
  return { text: magazineCopy[language], language }
}
