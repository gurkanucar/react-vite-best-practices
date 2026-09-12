import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { CorporateNewsPage } from '@/features/showcases/pages/CorporatePublicationPages'
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
})
