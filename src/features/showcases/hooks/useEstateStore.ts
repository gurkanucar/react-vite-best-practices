import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { MAX_COMPARE } from '@/features/showcases/data/estateSearch'

export const estateStorageKey = 'rvbp-estate'

interface EstateData {
  favourites: string[]
  compare: string[]
}

interface EstateStore extends EstateData {
  toggleFavourite: (id: string) => boolean
  /** `'full'` when three listings are already picked; nothing changes then. */
  toggleCompare: (id: string) => 'added' | 'removed' | 'full'
  removeCompare: (id: string) => void
  setCompare: (ids: string[]) => void
  clearCompare: () => void
  reset: () => void
}

const initialEstateData = (): EstateData => ({ favourites: [], compare: [] })

export const useEstateStore = create<EstateStore>()(
  persist(
    (set, get) => ({
      ...initialEstateData(),
      toggleFavourite: (id) => {
        const saved = get().favourites.includes(id)
        set((state) => ({
          favourites: saved
            ? state.favourites.filter((entry) => entry !== id)
            : [id, ...state.favourites],
        }))
        return !saved
      },
      toggleCompare: (id) => {
        const { compare } = get()
        if (compare.includes(id)) {
          set({ compare: compare.filter((entry) => entry !== id) })
          return 'removed'
        }
        if (compare.length >= MAX_COMPARE) return 'full'
        set({ compare: [...compare, id] })
        return 'added'
      },
      removeCompare: (id) =>
        set((state) => ({ compare: state.compare.filter((entry) => entry !== id) })),
      setCompare: (ids) => set({ compare: ids.slice(0, MAX_COMPARE) }),
      clearCompare: () => set({ compare: [] }),
      reset: () => set(initialEstateData()),
    }),
    {
      name: estateStorageKey,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ favourites, compare }) => ({ favourites, compare }),
      // Nothing older than version 1 exists; anything unrecognised starts empty.
      migrate: (persisted, version) =>
        (version === 1 ? persisted : initialEstateData()) as EstateData,
    },
  ),
)
