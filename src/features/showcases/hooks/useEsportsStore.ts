import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { esportsCopy } from '@/features/showcases/data/esportsCopy'
import { usePreferencesStore } from '@/store/preferences-store'

export const esportsStorageKey = 'rvbp-esports'

interface EsportsData {
  /** Team ids, most recently followed first. */
  follows: string[]
  /** Match id to the id of the team picked to win. */
  predictions: Record<string, string>
  /** Match id to the side the visitor cheers for in the stands. */
  fanSides: Record<string, 'a' | 'b'>
}

interface EsportsState extends EsportsData {
  toggleFollow: (teamId: string) => void
  predict: (matchId: string, teamId: string) => void
  setFanSide: (matchId: string, side: 'a' | 'b') => void
  reset: () => void
}

const initialData = (): EsportsData => ({ follows: [], predictions: {}, fanSides: {} })

/**
 * Version 2 added the side you cheer for. Follows and picks from version 1 carry over;
 * ids that no longer exist are simply never shown. Anything unrecognised starts empty.
 */
export function migrateEsports(persisted: unknown, version: number): EsportsData {
  const data = (persisted ?? {}) as Partial<EsportsData>
  if (version === 1) {
    return { follows: data.follows ?? [], predictions: data.predictions ?? {}, fanSides: {} }
  }
  if (version === 2) return { ...initialData(), ...data }
  return initialData()
}

export const useEsportsStore = create<EsportsState>()(
  persist(
    (set) => ({
      ...initialData(),
      toggleFollow: (teamId) =>
        set((state) => ({
          follows: state.follows.includes(teamId)
            ? state.follows.filter((id) => id !== teamId)
            : [teamId, ...state.follows],
        })),
      predict: (matchId, teamId) =>
        set((state) => ({ predictions: { ...state.predictions, [matchId]: teamId } })),
      setFanSide: (matchId, side) =>
        set((state) => ({ fanSides: { ...state.fanSides, [matchId]: side } })),
      reset: () => set(initialData()),
    }),
    {
      name: esportsStorageKey,
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ follows, predictions, fanSides }) => ({ follows, predictions, fanSides }),
      migrate: (persisted, version) => migrateEsports(persisted, version),
    },
  ),
)

export function useEsportsCopy() {
  const language = usePreferencesStore((state) => state.language)
  return { text: esportsCopy[language], language }
}

/**
 * Where the site's clock comes from. Tests pin it to a fixed moment so live scores and
 * brackets render the same way on every run.
 */
export const esportsClock = { now: () => Date.now() }

/** The current time, refreshed on an interval so live scores tick while you watch. */
export function useEsportsNow(intervalMs = 15_000): number {
  const [now, setNow] = useState(() => esportsClock.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(esportsClock.now()), intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])
  return now
}
