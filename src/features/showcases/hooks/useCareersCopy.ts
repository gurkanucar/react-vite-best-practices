import { careersCopy } from '@/features/showcases/data/careersCopy'
import { usePreferencesStore } from '@/store/preferences-store'

export function useCareersCopy() {
  const language = usePreferencesStore((state) => state.language)
  return { text: careersCopy[language], language }
}
