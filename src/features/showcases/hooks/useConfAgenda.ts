import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { cleanAgenda } from '@/features/showcases/data/confSchedule'

export const confStorageKey = 'rvbp-event'

interface ConfAgendaState {
  /** Starred session ids, in schedule order. */
  starred: string[]
  toggle: (id: string) => void
  add: (ids: readonly string[]) => number
  clear: () => void
}

export const useConfAgenda = create<ConfAgendaState>()(
  persist(
    (set, get) => ({
      starred: [],
      toggle: (id) =>
        set(({ starred }) => ({
          starred: starred.includes(id)
            ? starred.filter((entry) => entry !== id)
            : cleanAgenda([...starred, id]),
        })),
      add: (ids) => {
        const before = get().starred
        const starred = cleanAgenda([...before, ...ids])
        set({ starred })
        return starred.length - before.length
      },
      clear: () => set({ starred: [] }),
    }),
    {
      name: confStorageKey,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ starred }) => ({ starred }),
      // Whatever was saved, keep only ids that still name a session.
      migrate: (persisted) => {
        const starred = (persisted as { starred?: unknown } | null)?.starred
        return {
          starred: Array.isArray(starred)
            ? cleanAgenda(starred.filter((id): id is string => typeof id === 'string'))
            : [],
        }
      },
      merge: (persisted, current) => {
        const starred = (persisted as { starred?: unknown } | null)?.starred
        return {
          ...current,
          starred: Array.isArray(starred)
            ? cleanAgenda(starred.filter((id): id is string => typeof id === 'string'))
            : [],
        }
      },
    },
  ),
)
