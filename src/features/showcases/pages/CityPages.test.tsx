import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cityStorageKey, useCityStore } from '@/features/showcases/hooks/useCityStore'
import { CityEventsPage } from '@/features/showcases/pages/CityEventsPage'
import { CityExplorePage } from '@/features/showcases/pages/CityExplorePage'
import { CityHomePage } from '@/features/showcases/pages/CityHomePage'
import { CityOverviewPage } from '@/features/showcases/pages/CityOverviewPage'
import { CityPlacePage } from '@/features/showcases/pages/CityPlacePage'
import { usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

const root = '/preview/city'

function Where() {
  const { pathname, search } = useLocation()
  return <output data-testid="where">{pathname + search}</output>
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Routes>
          <Route path={root} element={<CityHomePage standalone />} />
          <Route path={`${root}/:cityId`} element={<CityOverviewPage standalone />} />
          <Route path={`${root}/:cityId/explore`} element={<CityExplorePage standalone />} />
          <Route path={`${root}/:cityId/places/:placeId`} element={<CityPlacePage standalone />} />
          <Route path={`${root}/:cityId/events`} element={<CityEventsPage standalone />} />
        </Routes>
        <Where />
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

const where = () => screen.getByTestId('where').textContent
const cardTitles = () =>
  [...document.querySelectorAll('.city-card h3')].map((heading) => heading.textContent)

/*
 * jsdom matches no media query, so the phone layout runs: the explore map stays closed and
 * Leaflet only loads on the place page. Only Date is faked, so "today" is fixed while
 * antd's timers still run.
 */
describe('city guide showcase', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-09-28T10:00:00'))
    usePreferencesStore.getState().setLanguage('en')
    useCityStore.getState().reset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('offers both cities and the next events on the home page', () => {
    renderAt(root)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Two capitals, three hours apart.',
    )
    const picker = screen.getByRole('heading', { name: 'Choose a city' }).parentElement!
    expect(within(picker).getByRole('link', { name: /İstanbul/ })).toHaveAttribute(
      'href',
      `${root}/istanbul`,
    )
    expect(within(picker).getByRole('link', { name: /Edirne/ })).toHaveAttribute(
      'href',
      `${root}/edirne`,
    )
    const firstEvent = document.querySelector('.city-events .city-event h3')
    expect(firstEvent).toHaveTextContent('Autumn Concert by the Bosphorus')
  })

  it('tells the story of a city and says when it does not cover one', () => {
    const { unmount } = renderAt(`${root}/edirne`)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Edirne')
    expect(screen.getByText('Selimiye Mosque, since 2011')).toBeInTheDocument()
    expect(screen.getByText('Hadrianopolis')).toBeInTheDocument()
    expect(cardTitles()).toContain('Selimiye Mosque')
    const tabs = screen.getByRole('navigation', { name: 'City sections' })
    expect(within(tabs).getByRole('link', { name: 'Overview' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    unmount()

    renderAt(`${root}/ankara`)
    expect(screen.getByText('We do not cover that city yet')).toBeInTheDocument()
  })

  it('filters places from the address and keeps the filters in it', () => {
    renderAt(`${root}/edirne/explore?cat=food`)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Explore Edirne')
    expect(cardTitles()).toEqual(
      expect.arrayContaining(['Edirne tava ciğeri', 'Badem ezmesi', 'Peynir helvası']),
    )
    expect(cardTitles()).not.toContain('Selimiye Mosque')

    fireEvent.change(screen.getByLabelText('Search this city'), { target: { value: 'helva' } })
    expect(cardTitles()).toEqual(['Peynir helvası'])
    expect(where()).toBe(`${root}/edirne/explore?cat=food&q=helva`)

    fireEvent.change(screen.getByLabelText('Search this city'), { target: { value: 'nothing' } })
    expect(screen.getByText(/No place matches/)).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: 'Clear filters' })[0]!)
    expect(where()).toBe(`${root}/edirne/explore?cat=food`)
  })

  it('shows a landmark with facts, a real-place badge and what is nearby', () => {
    renderAt(`${root}/edirne/places/selimiye`)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Selimiye Mosque')
    expect(screen.getByText('Real place')).toBeInTheDocument()
    expect(screen.getByText('Check the official site before you go.')).toBeInTheDocument()
    expect(screen.getByText('1568–1575')).toBeInTheDocument()
    const nearby = screen.getByRole('heading', { name: 'Nearby' }).parentElement!
    expect(within(nearby).getAllByRole('link').length).toBe(5)
    expect(within(nearby).getByText('Old Mosque')).toBeInTheDocument()
  })

  it('lists where to try a dish and saves it', () => {
    renderAt(`${root}/edirne/places/tava-ciger`)

    const tryIt = screen.getByRole('heading', { name: 'Where to try it' }).parentElement!
    expect(within(tryIt).getByText('Tunca Ciğer Salonu')).toBeInTheDocument()
    expect(
      screen.getByText('Found across the city rather than at one address.'),
    ).toBeInTheDocument()

    // The first Save is the dish's own; the cards below have theirs.
    fireEvent.click(screen.getAllByRole('button', { name: /Save/ })[0]!)
    expect(useCityStore.getState().saved).toEqual(['tava-ciger'])
    expect(JSON.parse(localStorage.getItem(cityStorageKey)!)).toMatchObject({
      state: { saved: ['tava-ciger'] },
      version: 1,
    })
  })

  it('marks an invented business as demo data', () => {
    renderAt(`${root}/istanbul/places/lodos-meyhane`)

    expect(screen.getByText('Demo business')).toBeInTheDocument()
    expect(screen.getByText(/invented for the demo/)).toBeInTheDocument()
    const known = screen.getByRole('heading', { name: 'Known for' }).parentElement!
    expect(within(known).getByRole('link', { name: /Meyhane mezes/ })).toHaveAttribute(
      'href',
      `${root}/istanbul/places/meze`,
    )
  })

  it('filters events and builds a plan', () => {
    renderAt(`${root}/istanbul/events`)

    expect(screen.getByText('10 events')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Music' }))
    expect(screen.getByText('2 events')).toBeInTheDocument()
    expect(where()).toBe(`${root}/istanbul/events?cat=music`)

    fireEvent.click(screen.getByRole('button', { name: 'Add to plan: Winter Jazz Nights' }))
    expect(useCityStore.getState().plan).toEqual(['kis-caz'])
    const plan = screen.getByRole('heading', { name: /My plan/ }).parentElement!
    expect(within(plan).getByText('Winter Jazz Nights')).toBeInTheDocument()
    expect(within(plan).getByRole('button', { name: /Add to calendar/ })).toBeInTheDocument()

    fireEvent.click(within(plan).getByRole('button', { name: /Clear plan/ }))
    expect(useCityStore.getState().plan).toEqual([])
  })

  it('speaks Turkish', () => {
    usePreferencesStore.getState().setLanguage('tr')
    renderAt(`${root}/istanbul/explore`)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("İstanbul'u keşfedin")
    expect(screen.getByRole('tab', { name: /Yöresel lezzetler/ })).toBeInTheDocument()
  })
})
