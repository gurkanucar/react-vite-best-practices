import { helpdeskCopy } from '@/features/helpdesk/data'
import { usePreferencesStore } from '@/store/preferences-store'

export function useHelpdeskText() {
  const language = usePreferencesStore((state) => state.language)
  return { language, text: helpdeskCopy[language] }
}
