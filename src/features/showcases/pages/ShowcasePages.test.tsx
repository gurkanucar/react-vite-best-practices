import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import {
  campusUpdates,
  corporateAnnouncements,
  corporateNews,
  residentCompanies,
} from '@/features/showcases/data'
import {
  CorporateAnnouncementDetailPage,
  CorporateAnnouncementsPage,
  CorporateNewsPage,
} from '@/features/showcases/pages/CorporatePublicationPages'
import { TechParkCompaniesPage } from '@/features/showcases/pages/TechParkCompaniesPage'
import { TechParkCompanyPage } from '@/features/showcases/pages/TechParkCompanyPage'
import { TechParkLandingPage } from '@/features/showcases/pages/TechParkLandingPage'

describe('showcase pages', () => {
  it('offers a clean standalone preview from the admin version', () => {
    render(
      <MemoryRouter>
        <TechParkLandingPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /Open in a new tab$/ })).toHaveAttribute(
      'href',
      '/preview/technopark',
    )
    expect(screen.getByRole('link', { name: /Open in a new tab$/ })).toHaveAttribute(
      'target',
      '_blank',
    )
  })

  it('removes the admin preview toolbar in standalone mode', () => {
    render(
      <MemoryRouter>
        <TechParkLandingPage standalone />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('link', { name: /Open in a new tab$/ })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /category leaders/i })).toBeInTheDocument()
    expect(
      screen.getByText(
        'From a first technical hypothesis to an international commercial contract, every stage has a place here.',
      ),
    ).toHaveClass('techpark-program__description')
    expect(
      screen.getByText('Applications for the winter residency cohort close on October 18.'),
    ).toHaveClass('techpark-cta__description')
  })

  it('puts news and announcements above the fold, with a stand-in for the ones with no picture', () => {
    const { container } = render(
      <MemoryRouter>
        <TechParkLandingPage standalone />
      </MemoryRouter>,
    )

    const sections = [...container.querySelectorAll('main > section, main > div')]
    const updates = container.querySelector('.techpark-updates')
    const metrics = container.querySelector('.techpark-metrics')

    // Second only to the hero: a visitor should not have to scroll to find what is new.
    expect(sections.indexOf(updates as Element)).toBe(1)
    expect(sections.indexOf(updates as Element)).toBeLessThan(sections.indexOf(metrics as Element))

    const withPicture = campusUpdates.filter((update) => update.image)
    expect(withPicture.length).toBeGreaterThan(0)
    expect(withPicture.length).toBeLessThan(campusUpdates.length)
    expect(container.querySelectorAll('.techpark-update__cover--empty')).toHaveLength(
      campusUpdates.length - withPicture.length,
    )
  })

  it('keeps the marquee halves identical so the loop has no seam', () => {
    const { container } = render(
      <MemoryRouter>
        <TechParkLandingPage standalone />
      </MemoryRouter>,
    )

    const groups = container.querySelectorAll('.techpark-strip__group')
    expect(groups).toHaveLength(2)
    expect(groups[0]?.childElementCount).toBe(groups[1]?.childElementCount)
    // The repeat is decoration; a screen reader should hear the names once.
    expect(groups[1]).toHaveAttribute('aria-hidden', 'true')
  })

  it('reveals the company directory one page at a time', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <TechParkCompaniesPage standalone />
      </MemoryRouter>,
    )

    expect(screen.getByText('Showing 9 of 42 companies')).toBeVisible()

    // jsdom has no IntersectionObserver, which is exactly why the sentinel is a real button.
    await user.click(screen.getByRole('button', { name: 'Load more companies' }))

    expect(screen.getByText('Showing 18 of 42 companies')).toBeVisible()
  })

  it('gives every company a detail route reachable from the directory', () => {
    render(
      <MemoryRouter>
        <TechParkCompaniesPage standalone />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Lumen Analytics' })).toHaveAttribute(
      'href',
      '/preview/technopark/companies/lumen-analytics',
    )
    expect(new Set(residentCompanies.map((company) => company.slug)).size).toBe(
      residentCompanies.length,
    )
  })

  it('shows a company profile with its own facts and its sector neighbours', () => {
    render(
      <MemoryRouter initialEntries={['/preview/technopark/companies/aurora-orbital']}>
        <Routes>
          <Route
            path="/preview/technopark/companies/:companySlug"
            element={<TechParkCompanyPage standalone />}
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Aurora Orbital' })).toBeVisible()
    expect(screen.getByText('268 people')).toBeVisible()
    // Same sector, never itself.
    expect(screen.getByRole('link', { name: /Sidereal Optics/ })).toBeVisible()
    expect(screen.queryByRole('link', { name: /^Aurora Orbital/ })).not.toBeInTheDocument()
  })

  it('says so plainly when the slug matches no resident', () => {
    render(
      <MemoryRouter initialEntries={['/preview/technopark/companies/not-a-company']}>
        <Routes>
          <Route
            path="/preview/technopark/companies/:companySlug"
            element={<TechParkCompanyPage standalone />}
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'No company with that name is in residence.' }),
    ).toBeVisible()
  })

  it('keeps newsroom links inside the standalone route family', () => {
    render(
      <MemoryRouter>
        <CorporateNewsPage standalone />
      </MemoryRouter>,
    )

    expect(screen.getAllByRole('link', { name: /Read article$/ })[0]).toHaveAttribute(
      'href',
      '/preview/corporate/news/green-data-center-investment',
    )
  })

  it('supports optional publication media and downloadable attachments', () => {
    expect(corporateNews).toHaveLength(10)
    expect(corporateAnnouncements).toHaveLength(10)
    expect(corporateNews.some((publication) => !publication.coverImage)).toBe(true)
    expect(corporateAnnouncements.some((publication) => publication.gallery?.length)).toBe(true)
    expect(corporateAnnouncements.some((publication) => publication.attachments?.length)).toBe(true)
  })

  it('paginates publication data through the URL search parameter', () => {
    render(
      <MemoryRouter initialEntries={['/preview/corporate/news']}>
        <CorporateNewsPage standalone />
      </MemoryRouter>,
    )

    expect(screen.getAllByRole('link', { name: /Read article$/ })).toHaveLength(6)
    fireEvent.click(screen.getByTitle('2'))

    expect(screen.getAllByRole('link', { name: /Read article$/ })).toHaveLength(4)
    expect(
      screen.getByText('Circular packaging trial cuts single-use material by 38%'),
    ).toBeVisible()
  })

  it('uses the Aurora design for announcements and renders detail assets', () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={['/preview/corporate/announcements/planned-service-maintenance']}
      >
        <Routes>
          <Route
            path="/preview/corporate/announcements/:slug"
            element={<CorporateAnnouncementDetailPage standalone />}
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(container.querySelector('.announcement-site')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Planned service maintenance' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Download: Maintenance schedule' })).toHaveAttribute(
      'href',
      '/showcase-attachments/maintenance-window.csv',
    )
    expect(screen.getByAltText('Network operations center')).toBeVisible()
  })

  it('shows announcements as a separate modern paginated example', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/preview/corporate/announcements']}>
        <CorporateAnnouncementsPage standalone />
      </MemoryRouter>,
    )

    expect(container.querySelector('.publication-hero--modern')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Deadlines, campus operations, programs, and service updates for the Aurora community.',
      ),
    ).toHaveClass('publication-hero__description')
    expect(screen.getAllByRole('link', { name: /View announcement$/ })).toHaveLength(6)
  })
})
