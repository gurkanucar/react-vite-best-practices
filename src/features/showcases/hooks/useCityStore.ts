import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const cityStorageKey = 'rvbp-city'

interface CityData {
  /** Saved place ids, newest first. */
  saved: string[]
  /** Event ids in the visitor's plan. */
  plan: string[]
}

interface CityStore extends CityData {
  /** Returns whether the place is saved afterwards. */
  toggleSaved: (id: string) => boolean
  /** Returns whether the event is in the plan afterwards. */
  togglePlan: (id: string) => boolean
  clearPlan: (ids: string[]) => void
  reset: () => void
}

const initialCityData = (): CityData => ({ saved: [], plan: [] })

const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((entry) => entry !== id) : [id, ...list]

export const useCityStore = create<CityStore>()(
  persist(
    (set, get) => ({
      ...initialCityData(),
      toggleSaved: (id) => {
        set((state) => ({ saved: toggle(state.saved, id) }))
        return get().saved.includes(id)
      },
      togglePlan: (id) => {
        set((state) => ({ plan: toggle(state.plan, id) }))
        return get().plan.includes(id)
      },
      clearPlan: (ids) => set((state) => ({ plan: state.plan.filter((id) => !ids.includes(id)) })),
      reset: () => set(initialCityData()),
    }),
    {
      name: cityStorageKey,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ saved, plan }) => ({ saved, plan }),
      // Zustand only migrates a stored version other than 1, and none was ever written:
      // whatever it is starts empty rather than breaking the page.
      migrate: () => initialCityData(),
    },
  ),
)
