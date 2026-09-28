import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { formatPrice, hoodOf, listings } from '@/features/showcases/data/estate'
import { estateCopy } from '@/features/showcases/data/estateCopy'
import {
  mortgagePlan,
  DEFAULT_MORTGAGE,
  moveInCost,
} from '@/features/showcases/data/estateMortgage'
import { parseFilters, searchListings } from '@/features/showcases/data/estateSearch'
import { useEstateStore } from '@/features/showcases/hooks/useEstateStore'
import { EstateComparePage } from '@/features/showcases/pages/EstateComparePage'
import { EstateHomePage } from '@/features/showcases/pages/EstateHomePage'
import { EstateListingPage } from '@/features/showcases/pages/EstateListingPage'
import { EstateListingsPage } from '@/features/showcases/pages/EstateListingsPage'
import { usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Routes>
          <Route path="/preview/estate" element={<EstateHomePage standalone />} />
          <Route path="/preview/estate/listings" element={<EstateListingsPage standalone />} />
          <Route
            path="/preview/estate/listings/:listingId"
            element={<EstateListingPage standalone />}
          />
          <Route path="/preview/estate/compare" element={<EstateComparePage standalone />} />
        </Routes>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

const en = estateCopy.en
const countFor = (query: string, favourites: string[] = []) =>
  searchListings(listings, parseFilters(new URLSearchParams(query)), { favourites }).length
const heading = () => document.querySelector('.estate-search__count')!.textContent
const cards = () => [...document.querySelectorAll<HTMLElement>('.estate-card')]

/*
 * jsdom matches no media query, so these run the phone layout: the filters are in a drawer
 * and the map only opens on request, which keeps Leaflet out of the list tests. Controls are
 * found by text and label; role queries are slow over antd trees this size.
 */
describe('real estate showcase', () => {
  beforeEach(() => {
    usePreferencesStore.getState().setLanguage('en')
    useEstateStore.getState().reset()
  })

  it('shows the featured homes and searches a city from the home page', async () => {
    renderAt('/preview/estate')

    expect(screen.getByText('Find the home that fits the way you live.')).toBeInTheDocument()
    expect(cards()).toHaveLength(6)

    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'İzmir' } })
    fireEvent.click(screen.getByText('Search'))

    await waitFor(() => expect(heading()).toBe(en.results.count(countFor('city=izmir'), 'sale')))
  })

  it('reads the search from the address and removes a filter from its chip', async () => {
    renderAt('/preview/estate/listings?deal=rent&city=ankara&rooms=2%2B1')

    const count = countFor('deal=rent&city=ankara&rooms=2%2B1')
    expect(heading()).toBe(en.results.count(count, 'rent'))
    expect(cards()).toHaveLength(Math.min(count, 12))

    const chip = screen.getByText('Rooms: 2+1').closest<HTMLElement>('.ant-tag')!
    fireEvent.click(chip.querySelector('.ant-tag-close-icon')!)
    await waitFor(() =>
      expect(heading()).toBe(en.results.count(countFor('deal=rent&city=ankara'), 'rent')),
    )
  })

  it('ignores filters in the address that are not options', () => {
    renderAt('/preview/estate/listings?deal=boat&rooms=9%2B9&sort=nope')

    expect(heading()).toBe(en.results.count(countFor(''), 'sale'))
    expect(document.querySelector('.estate-chips')).toBeNull()
  })

  it('saves a home and shows it under "Saved"', async () => {
    renderAt('/preview/estate/listings')

    const first = cards()[0]!
    const id = first.dataset.listing!
    fireEvent.click(within(first).getByLabelText(/^Save /))
    expect(useEstateStore.getState().favourites).toEqual([id])

    fireEvent.click(screen.getByText('Saved (1)'))
    await waitFor(() => expect(heading()).toBe(en.results.count(1, 'sale')))
  })

  it('compares three homes at most and says so', async () => {
    renderAt('/preview/estate/listings')

    const checks = cards().map((card) => within(card).getByText('Compare'))
    for (const check of checks.slice(0, 4)) fireEvent.click(check)

    expect(useEstateStore.getState().compare).toHaveLength(3)
    expect(await screen.findByText(en.compareTray.full)).toBeInTheDocument()
    expect(screen.getByText('Comparing 3 of 3')).toBeInTheDocument()
  })

  it('shows a home with its facts, the mortgage and a contact form that checks itself', async () => {
    const listing = listings.find((entry) => entry.deal === 'sale')!
    renderAt(`/preview/estate/listings/${listing.id}`)

    expect(
      screen.getByText(en.title(listing, hoodOf(listing)), { selector: 'h1' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Key facts')).toBeInTheDocument()

    const plan = mortgagePlan({ price: listing.price, ...DEFAULT_MORTGAGE })
    expect(document.querySelector('.estate-mortgage__monthly')!.textContent).toBe(
      formatPrice(plan.monthly, 'en'),
    )

    fireEvent.click(screen.getByText('Send message'))
    expect(await screen.findByText('Tell us your name.')).toBeInTheDocument()
    expect(screen.getByText('Please agree so the agent can reply.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Ada Yılmaz' } })
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '0532 555 12 34' } })
    fireEvent.click(screen.getByText(en.contact.consent))
    fireEvent.click(screen.getByText('Send message'))
    expect(await screen.findByText('Message sent')).toBeInTheDocument()
  })

  it('shows what moving in costs on a home to rent', () => {
    const listing = listings.find((entry) => entry.deal === 'rent')!
    renderAt(`/preview/estate/listings/${listing.id}`)

    expect(screen.getByText('What moving in costs')).toBeInTheDocument()
    expect(screen.getByText(formatPrice(moveInCost(listing.price).total, 'en'))).toBeInTheDocument()
    expect(document.querySelector('.estate-mortgage')).toBeNull()
  })

  it('says when a home is no longer listed', () => {
    renderAt('/preview/estate/listings/nope')

    expect(screen.getByText('This home is no longer listed')).toBeInTheDocument()
  })

  it('lines up homes from a compare link, marks the best values and removes one', async () => {
    const [a, b, c] = listings.filter((listing) => listing.deal === 'sale')
    renderAt(`/preview/estate/compare?ids=${a!.id},${b!.id},${c!.id}`)

    const table = document.querySelector<HTMLElement>('.estate-compare__table')!
    expect(table.querySelectorAll('thead th')).toHaveLength(3)
    expect(within(table).getAllByText('Best').length).toBeGreaterThan(0)

    fireEvent.click(screen.getByLabelText(en.compareTray.remove(en.title(a!, hoodOf(a!)))))
    await waitFor(() => expect(table.querySelectorAll('thead th')).toHaveLength(2))
  })

  it('offers a way back to the homes when there is nothing to compare', () => {
    renderAt('/preview/estate/compare')

    expect(screen.getByText('Nothing to compare yet')).toBeInTheDocument()
    expect(screen.getByText('Browse homes')).toBeInTheDocument()
  })

  it('speaks Turkish, with the locative each neighbourhood takes', () => {
    usePreferencesStore.getState().setLanguage('tr')
    const listing = listings.find((entry) => entry.hoodId === 'levent')!
    renderAt(`/preview/estate/listings/${listing.id}`)

    expect(screen.getByText(/^Levent'te /, { selector: 'h1' })).toBeInTheDocument()
    expect(screen.getByText('Temel bilgiler')).toBeInTheDocument()
  })
})
