import type { Language } from '@/store/preferences-store'

export interface LocalizedText {
  en: string
  tr: string
}

export interface Publication {
  slug: string
  title: LocalizedText
  summary: LocalizedText
  body: LocalizedText[]
  category: LocalizedText
  date: string
  readingTime?: LocalizedText
}

export function localize(value: LocalizedText, language: Language): string {
  return value[language]
}
