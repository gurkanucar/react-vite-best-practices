import { agencyCopy } from '@/features/showcases/data/agencyCopy'
import { usePreferencesStore } from '@/store/preferences-store'

export function useAgencyCopy() {
  const language = usePreferencesStore((state) => state.language)
  return { text: agencyCopy[language], language }
}
