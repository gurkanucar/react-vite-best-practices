import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import en from '@/assets/locales/en.json'
import tr from '@/assets/locales/tr.json'
import { initialPreferences, usePreferencesStore } from '@/store/preferences-store'
import { messages, useMessages } from './messages'

function collectKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) {
    return [prefix]
  }

  return Object.entries(value).flatMap(([key, child]) =>
    collectKeys(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe('locale files', () => {
  it('keep the same key structure across languages', () => {
    expect(collectKeys(tr).sort()).toEqual(collectKeys(en).sort())
  })

  it('do not contain empty translations', () => {
    for (const locale of Object.values(messages)) {
      const leaves = collectKeys(locale).map((path) =>
        path
          .split('.')
          .reduce<unknown>((node, key) => (node as Record<string, unknown>)[key], locale),
      )

      expect(leaves.every((leaf) => typeof leaf === 'string' && leaf.trim() !== '')).toBe(true)
    }
  })
})

describe('useMessages', () => {
  beforeEach(() => {
    act(() => {
      usePreferencesStore.setState(initialPreferences)
    })
  })

  it('returns the messages for the active language', () => {
    const { result } = renderHook(() => useMessages())

    expect(result.current.navigation.dashboard).toBe(en.navigation.dashboard)

    act(() => {
      usePreferencesStore.getState().setLanguage('tr')
    })

    expect(result.current.navigation.dashboard).toBe(tr.navigation.dashboard)
  })
})
