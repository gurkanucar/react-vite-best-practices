import { storeCopy } from '@/features/showcases/data/storeCopy'
import { usePreferencesStore } from '@/store/preferences-store'

export function useStoreCopy() {
  const language = usePreferencesStore((state) => state.language)
  return { text: storeCopy[language], language }
}
