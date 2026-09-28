import { remindersCopy } from '@/features/showcases/data/remindersCopy'
import { usePreferencesStore } from '@/store/preferences-store'

export function useRemindersCopy() {
  const language = usePreferencesStore((state) => state.language)
  return { text: remindersCopy[language], language }
}
