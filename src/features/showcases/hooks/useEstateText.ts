import { useMemo } from 'react'
import { hoodOf, type Listing } from '@/features/showcases/data/estate'
import { estateCopy } from '@/features/showcases/data/estateCopy'
import { usePreferencesStore } from '@/store/preferences-store'

export function useEstateText() {
  const language = usePreferencesStore((state) => state.language)
  return useMemo(() => {
    const text = estateCopy[language]
    return {
      text,
      language,
      titleOf: (listing: Listing) => text.title(listing, hoodOf(listing)),
    }
  }, [language])
}
