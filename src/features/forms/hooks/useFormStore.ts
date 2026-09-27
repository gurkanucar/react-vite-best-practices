import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createSeedForms, createSeedResponses } from '@/features/forms/data'
import { newId, type AnswerValue, type FormResponse, type FormSchema } from '@/features/forms/types'
import { usePreferencesStore } from '@/store/preferences-store'

interface FormStore {
  forms: FormSchema[]
  responses: FormResponse[]
  /** Adds the form, or replaces the stored one with the same id, and stamps the change. */
  saveForm: (form: FormSchema) => FormSchema
  duplicateForm: (formId: string, title: string) => FormSchema | undefined
  /** Deletes the form and its responses: answers to questions nobody can see are noise. */
  deleteForm: (formId: string) => void
  submitResponse: (formId: string, answers: Record<string, AnswerValue>) => FormResponse
  reset: () => void
}

export const formStorageKey = 'rvbp-forms'

const language = () => usePreferencesStore.getState().language

/**
 * Forms and their answers have no API behind them, so both live in the browser, persisted
 * to local storage like the task list: a form built here is still there after a reload.
 */
export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      forms: createSeedForms(language()),
      responses: createSeedResponses(language()),
      saveForm: (form) => {
        const saved = { ...form, updatedAt: new Date().toISOString() }
        const exists = get().forms.some((entry) => entry.id === form.id)
        set({
          forms: exists
            ? get().forms.map((entry) => (entry.id === form.id ? saved : entry))
            : [saved, ...get().forms],
        })
        return saved
      },
      duplicateForm: (formId, title) => {
        const source = get().forms.find((form) => form.id === formId)
        if (!source) return undefined

        const now = new Date().toISOString()
        // Field ids stay: they only have to be unique inside one form.
        const copy: FormSchema = {
          ...source,
          id: newId('form'),
          title,
          status: 'draft',
          createdAt: now,
          updatedAt: now,
        }
        set({ forms: [copy, ...get().forms] })
        return copy
      },
      deleteForm: (formId) =>
        set({
          forms: get().forms.filter((form) => form.id !== formId),
          responses: get().responses.filter((response) => response.formId !== formId),
        }),
      submitResponse: (formId, answers) => {
        const response: FormResponse = {
          id: newId('response'),
          formId,
          submittedAt: new Date().toISOString(),
          answers,
        }
        set({ responses: [response, ...get().responses] })
        return response
      },
      reset: () =>
        set({ forms: createSeedForms(language()), responses: createSeedResponses(language()) }),
    }),
    {
      name: formStorageKey,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ forms, responses }) => ({ forms, responses }),
    },
  ),
)

/** Responses of one form, newest first. */
export function selectResponses(responses: FormResponse[], formId: string): FormResponse[] {
  return responses
    .filter((response) => response.formId === formId)
    .sort((left, right) => right.submittedAt.localeCompare(left.submittedAt))
}
