import { useMemo } from 'react'
import { usePreferencesStore } from '@/store/preferences-store'

/** One currency formatter for every price on these screens, following the language. */
export function useMoney() {
  const language = usePreferencesStore((state) => state.language)

  return useMemo(() => {
    const format = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
    })

    return (value: number) => format.format(value)
  }, [language])
}
