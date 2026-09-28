import { partsCopy } from '@/features/showcases/data/partsCopy'
import { usePreferencesStore } from '@/store/preferences-store'

export function usePartsCopy() {
  const language = usePreferencesStore((state) => state.language)
  return { text: partsCopy[language], language }
}
