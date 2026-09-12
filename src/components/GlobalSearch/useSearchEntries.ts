import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useNavigationSections } from '@/router/navigation'

export interface SearchEntry {
  /** Unique within the whole result set, not just within its group. */
  key: string
  label: string
  group: string
  icon?: ReactNode
  /** Extra words that should match this entry but are not shown. */
  keywords?: string[]
  perform: () => void
}

/**
 * The search is a list of entries and a way to run one, not a page index. Pages are the
 * only source today; another source — a recent record, a setting, a command — is one more
 * array concatenated here, and the rest of the component does not change.
 */
export function useSearchEntries(): SearchEntry[] {
  const navigate = useNavigate()
  const sections = useNavigationSections()

  return sections.flatMap((section) =>
    section.children.map((entry) => ({
      group: section.label,
      icon: entry.icon,
      key: entry.key,
      keywords: [entry.key.replace(/[/#]/g, ' ').trim()],
      label: entry.label,
      perform: () => void navigate(entry.key),
    })),
  )
}

/**
 * Matching is locale-aware because casing is: in Turkish "I" lowercases to "ı", so a
 * plain `toLowerCase()` would fail to match what the reader actually typed.
 */
export function matchesQuery(entry: SearchEntry, query: string, locale: string): boolean {
  const normalize = (value: string) => value.toLocaleLowerCase(locale)
  const needle = normalize(query.trim())

  if (!needle) return true

  return [entry.label, entry.group, ...(entry.keywords ?? [])].some((value) =>
    normalize(value).includes(needle),
  )
}
