import { useMemo } from 'react'
import type { Loc } from '@/features/showcases/data/cityGuide'
import { cityCopy } from '@/features/showcases/data/cityCopy'
import { usePreferencesStore } from '@/store/preferences-store'

/** The site's words in the visitor's language, and `t` to pick a language from the guide's data. */
export function useCityCopy() {
  const language = usePreferencesStore((state) => state.language)
  return useMemo(
    () => ({ text: cityCopy[language], language, t: (value: Loc) => value[language] }),
    [language],
  )
}
