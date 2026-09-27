import { formBuilderCopy } from '@/features/forms/data'
import { usePreferencesStore } from '@/store/preferences-store'

export function useFormCopy() {
  return formBuilderCopy[usePreferencesStore((state) => state.language)]
}
