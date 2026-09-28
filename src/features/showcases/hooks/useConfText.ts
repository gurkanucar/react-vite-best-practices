import { confCopy } from '@/features/showcases/data/confCopy'
import { usePreferencesStore } from '@/store/preferences-store'

export function useConfText() {
  const language = usePreferencesStore((state) => state.language)
  return { text: confCopy[language], language }
}
