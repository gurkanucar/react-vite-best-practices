import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { initialPreferences, usePreferencesStore } from '@/store/preferences-store'
import { RouteLoading } from './RouteLoading'

describe('RouteLoading', () => {
  beforeEach(() => {
    act(() => {
      usePreferencesStore.setState(initialPreferences)
    })
  })

  it('uses the active language for its loading message', () => {
    const { rerender } = render(<RouteLoading />)

    expect(screen.getByText('Loading page…')).toBeInTheDocument()

    act(() => {
      usePreferencesStore.getState().setLanguage('tr')
    })
    rerender(<RouteLoading />)

    expect(screen.getByText('Sayfa yükleniyor…')).toBeInTheDocument()
  })
})
