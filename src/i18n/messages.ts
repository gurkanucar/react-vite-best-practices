import en from '@/assets/locales/en.json'
import tr from '@/assets/locales/tr.json'
import { usePreferencesStore, type Language } from '@/store/preferences-store'

/**
 * English is the reference locale. Every other locale must provide the same
 * keys, which TypeScript enforces through the `satisfies` checks below.
 */
export type Messages = typeof en

export const messages = {
  en,
  tr: tr satisfies Messages,
} as const satisfies Record<Language, Messages>

export function useMessages(): Messages {
  const language = usePreferencesStore((state) => state.language)

  return messages[language]
}
