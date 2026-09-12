import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { TourDetailPage } from '@/features/tours/pages/TourDetailPage'
import { getMessages } from '@/i18n/messages'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderAt(tourId: string) {
  return render(
    <MemoryRouter initialEntries={[`/tours/${tourId}`]}>
      <AppThemeProvider>
        <Routes>
          <Route path="/tours/:tourId" element={<TourDetailPage />} />
        </Routes>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

const messages = getMessages('en')

describe('TourDetailPage', () => {
  it('renders the tour named in the route', () => {
    renderAt('island-hopping')

    expect(
      screen.getByRole('heading', { level: 1, name: messages.tours.names.island }),
    ).toBeInTheDocument()
    expect(screen.getByText(messages.tours.countries.canada)).toBeInTheDocument()
  })

  it('lists the program a day at a time', () => {
    renderAt('island-hopping')

    expect(screen.getByText('Day 1')).toBeInTheDocument()
    expect(screen.getByText('Day 3')).toBeInTheDocument()
    expect(screen.getByText(messages.tours.programDays.day2)).toBeInTheDocument()
  })

  it('marks the services the tour does not include rather than hiding them', () => {
    const { container } = renderAt('island-hopping')

    // Audio guide is not included on this tour, so it is shown struck through.
    expect(screen.getByText(messages.tours.services.audioGuide).tagName).toBe('DEL')
    expect(container.querySelectorAll('.tour-service--on').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('.tour-service--off').length).toBeGreaterThan(0)
  })

  it('moves to the bookers on the second tab', () => {
    renderAt('island-hopping')

    fireEvent.click(screen.getByRole('tab', { name: new RegExp(messages.tours.booker) }))

    expect(screen.getByRole('columnheader', { name: messages.tours.guests })).toBeInTheDocument()
    expect(screen.getAllByText('Lainey Davidson').length).toBeGreaterThan(0)
  })

  it('toggles the favourite without leaving the page', () => {
    renderAt('island-hopping')

    const favourite = screen.getByRole('button', { name: messages.tours.favourite })

    expect(favourite).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(favourite)
    expect(favourite).toHaveAttribute('aria-pressed', 'true')
  })

  it('shows a not-found result for a tour that does not exist', () => {
    renderAt('nope')

    expect(screen.getByText(messages.tours.notFound)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: messages.tours.backToList })).toHaveAttribute(
      'href',
      '/tours',
    )
  })
})
