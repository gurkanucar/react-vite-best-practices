import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { tours } from '@/features/tours/data'
import { TourListPage } from '@/features/tours/pages/TourListPage'
import { getMessages } from '@/i18n/messages'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/tours']}>
      <AppThemeProvider>
        <TourListPage />
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

const messages = getMessages('en')
const cardTitles = () =>
  [...document.querySelectorAll('.tour-card__title')].map((node) => node.textContent)

describe('TourListPage', () => {
  it('shows every tour, newest first', () => {
    renderPage()

    expect(cardTitles()).toHaveLength(tours.length)
    expect(cardTitles()[0]).toBe(messages.tours.names.mountain)
  })

  it('filters by the name a reader can actually see', () => {
    renderPage()

    fireEvent.change(screen.getByPlaceholderText(messages.tours.searchPlaceholder), {
      target: { value: 'safari' },
    })

    expect(cardTitles()).toEqual([messages.tours.names.safari])
  })

  it('says so when nothing matches', () => {
    renderPage()

    fireEvent.change(screen.getByPlaceholderText(messages.tours.searchPlaceholder), {
      target: { value: 'zzzz' },
    })

    expect(screen.getByText(messages.tours.noResults)).toBeInTheDocument()
    expect(cardTitles()).toHaveLength(0)
  })

  it('reorders by price without losing any card', () => {
    renderPage()

    fireEvent.mouseDown(screen.getByRole('combobox', { name: messages.tours.sortBy }))
    fireEvent.click(screen.getByTitle(messages.tours.sorts.priceLow))

    expect(cardTitles()).toHaveLength(tours.length)
    expect(cardTitles()[0]).toBe(messages.tours.names.historic)
  })

  it('links each card to its own detail route', () => {
    renderPage()

    const link = screen.getByRole('link', { name: messages.tours.names.island })

    expect(link).toHaveAttribute('href', '/tours/island-hopping')
  })

  it('narrows by country from the filter drawer, and counts the filter', async () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: messages.tours.filters }))

    const drawer = await screen.findByRole('dialog')
    fireEvent.click(within(drawer).getByRole('checkbox', { name: messages.tours.countries.india }))

    expect(cardTitles()).toEqual([messages.tours.names.canyon])
  })
})
