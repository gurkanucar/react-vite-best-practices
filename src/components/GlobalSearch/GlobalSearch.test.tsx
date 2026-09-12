import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react'
import { MemoryRouter, useLocation } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { GlobalSearch } from '@/components/GlobalSearch/GlobalSearch'
import { matchesQuery, type SearchEntry } from '@/components/GlobalSearch/useSearchEntries'
import { initialPreferences, usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

beforeEach(() => {
  act(() => {
    usePreferencesStore.setState(initialPreferences)
  })
})

function renderSearch() {
  return render(
    <AppThemeProvider>
      <MemoryRouter initialEntries={['/dashboard']}>
        <GlobalSearch />
        <LocationProbe />
      </MemoryRouter>
    </AppThemeProvider>,
  )
}

describe('GlobalSearch', () => {
  it('finds a page and navigates to it', async () => {
    const user = userEvent.setup()
    renderSearch()

    await user.type(screen.getByLabelText('Search the workspace'), 'pdf')

    // Results are grouped by the section the page belongs to.
    expect(await screen.findByText('Workspace')).toBeInTheDocument()
    await user.click(await screen.findByText('PDF documents'))

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/documents')
    })
  })

  it('focuses on the keyboard shortcut', async () => {
    const user = userEvent.setup()
    renderSearch()

    const input = screen.getByLabelText('Search the workspace')
    expect(input).not.toHaveFocus()

    await user.keyboard('{Meta>}k{/Meta}')

    expect(input).toHaveFocus()
  })
})

describe('matchesQuery', () => {
  const entry: SearchEntry = {
    group: 'Workspace',
    key: '/documents',
    label: 'PDF belgeleri',
    perform: () => {},
  }

  it('matches case-insensitively in the active locale', () => {
    // A plain toLowerCase turns "I" into "i", which never matches Turkish "ı".
    expect(matchesQuery({ ...entry, label: 'Iletişim' }, 'ıletişim', 'tr')).toBe(true)
    expect(matchesQuery(entry, 'BELGE', 'tr')).toBe(true)
    expect(matchesQuery(entry, 'invoice', 'tr')).toBe(false)
  })

  it('treats an empty query as matching everything', () => {
    expect(matchesQuery(entry, '   ', 'en')).toBe(true)
  })
})

function LocationProbe() {
  return <output data-testid="location">{useLocation().pathname}</output>
}
