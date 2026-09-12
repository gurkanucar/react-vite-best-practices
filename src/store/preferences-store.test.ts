import { beforeEach, describe, expect, it } from 'vitest'
import { initialPreferences, preferencesStorageKey, usePreferencesStore } from './preferences-store'

describe('preferences store', () => {
  beforeEach(() => {
    localStorage.clear()
    usePreferencesStore.setState(initialPreferences)
  })
  it('updates and persists global preferences', () => {
    const state = usePreferencesStore.getState()
    state.setLanguage('tr')
    state.setColorMode('dark')
    state.setCompact(true)
    state.setVisualTheme('illustration')
    expect(usePreferencesStore.getState()).toMatchObject({
      language: 'tr',
      colorMode: 'dark',
      compact: true,
      visualTheme: 'illustration',
    })
    expect(JSON.parse(localStorage.getItem(preferencesStorageKey) ?? '{}').state.language).toBe(
      'tr',
    )
  })
  it('resets preferences', () => {
    usePreferencesStore.getState().setLanguage('tr')
    usePreferencesStore.getState().resetPreferences()
    expect(usePreferencesStore.getState()).toMatchObject(initialPreferences)
  })

  it('validates persisted values during hydration', async () => {
    localStorage.setItem(
      preferencesStorageKey,
      JSON.stringify({
        state: { language: 'de', colorMode: 'sepia', compact: 'yes', visualTheme: 'blossom' },
        version: 1,
      }),
    )
    await usePreferencesStore.persist.rehydrate()
    expect(usePreferencesStore.getState()).toMatchObject(initialPreferences)

    localStorage.setItem(
      preferencesStorageKey,
      JSON.stringify({
        state: { language: 'tr', colorMode: 'dark', compact: true, visualTheme: 'glass' },
        version: 1,
      }),
    )
    await usePreferencesStore.persist.rehydrate()
    expect(usePreferencesStore.getState()).toMatchObject({
      language: 'tr',
      colorMode: 'dark',
      compact: true,
      visualTheme: 'ant-design',
    })
  })
})
