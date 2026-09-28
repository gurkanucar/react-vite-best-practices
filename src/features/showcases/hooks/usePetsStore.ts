import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { petsCopy } from '@/features/showcases/data/petsCopy'
import {
  defaultHousehold,
  householdFrom,
  type ApplicationValues,
  type Household,
} from '@/features/showcases/data/petsMatch'
import { usePreferencesStore } from '@/store/preferences-store'

export const petsStorageKey = 'rvbp-pets'

export interface PetApplication {
  id: string
  petId: string
  submittedAt: number
  score: number
  values: ApplicationValues
  withdrawnAt?: number
}

interface PetsData {
  favorites: string[]
  applications: PetApplication[]
  /** The last household the visitor described, reused by every match check. */
  household: Household
}

interface PetsState extends PetsData {
  toggleFavorite: (petId: string) => void
  setHousehold: (household: Household) => void
  apply: (petId: string, values: ApplicationValues, score: number) => PetApplication
  withdraw: (applicationId: string) => void
  reset: () => void
}

const initialData = (): PetsData => ({
  favorites: [],
  applications: [],
  household: defaultHousehold,
})

export const usePetsStore = create<PetsState>()(
  persist(
    (set) => ({
      ...initialData(),
      toggleFavorite: (petId) =>
        set((state) => ({
          favorites: state.favorites.includes(petId)
            ? state.favorites.filter((id) => id !== petId)
            : [petId, ...state.favorites],
        })),
      setHousehold: (household) => set({ household }),
      apply: (petId, values, score) => {
        const submittedAt = Date.now()
        const application: PetApplication = {
          id: `app-${petId}-${submittedAt.toString(36)}`,
          petId,
          submittedAt,
          score,
          values,
        }
        set((state) => ({
          applications: [
            application,
            // A new application replaces a withdrawn one for the same animal.
            ...state.applications.filter((item) => item.petId !== petId),
          ],
          household: householdFrom(values),
        }))
        return application
      },
      withdraw: (applicationId) =>
        set((state) => ({
          applications: state.applications.map((application) =>
            application.id === applicationId && application.withdrawnAt === undefined
              ? { ...application, withdrawnAt: Date.now() }
              : application,
          ),
        })),
      reset: () => set(initialData()),
    }),
    {
      name: petsStorageKey,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ favorites, applications, household }) => ({
        favorites,
        applications,
        household,
      }),
      // Nothing older than version 1 exists; anything unrecognised starts empty.
      migrate: (persisted, version) => (version === 1 ? persisted : initialData()) as PetsData,
    },
  ),
)

/** The open application for an animal, if the visitor has one they have not withdrawn. */
export function useOpenApplication(petId: string | undefined) {
  return usePetsStore((state) =>
    state.applications.find(
      (application) => application.petId === petId && application.withdrawnAt === undefined,
    ),
  )
}

export function usePetsCopy() {
  const language = usePreferencesStore((state) => state.language)
  return { text: petsCopy[language], language }
}

/** The current time, refreshed on an interval, so application steps move while you watch. */
export function usePetsNow(intervalMs = 10_000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])
  return now
}
