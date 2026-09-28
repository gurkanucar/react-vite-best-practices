import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { SaasLandingPage } from '@/features/showcases/pages/SaasLandingPage'
import { SaasPricingPage } from '@/features/showcases/pages/SaasPricingPage'
import { usePreferencesStore } from '@/store/preferences-store'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/preview/saas" element={<SaasLandingPage standalone />} />
        <Route path="/preview/saas/pricing" element={<SaasPricingPage standalone />} />
        <Route path="/showcases/saas" element={<SaasLandingPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

/** A plan card, found by its accessible name. Role queries are slow in jsdom. */
const planCard = (name: string) =>
  within(document.querySelector<HTMLElement>(`.saas-plan[aria-label="${name}"]`)!)

/*
 * jsdom matches no media query, so the pricing page shows the phone's comparison list rather
 * than the table.
 */
describe('SaaS showcase', () => {
  beforeEach(() => {
    usePreferencesStore.getState().setLanguage('en')
  })

  it('renders the product landing page and leads to pricing', () => {
    renderAt('/preview/saas')

    expect(screen.getByText('See every service. Fix what matters first.')).toBeInTheDocument()
    expect(screen.getByText('One place for the whole on-call shift')).toBeInTheDocument()
    expect(screen.getByText('Do I need to install anything?')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Compare all plans'))
    expect(
      screen.getByText('Pay for the people on call, not the data you send.'),
    ).toBeInTheDocument()
  })

  it('keeps the admin preview frame outside the standalone page', () => {
    renderAt('/showcases/saas')

    expect(screen.getByText('Open in a new tab').closest('a')).toHaveAttribute(
      'href',
      '/preview/saas',
    )
  })

  it('prices plans yearly by default and switches to monthly billing', () => {
    renderAt('/preview/saas/pricing')

    expect(planCard('Business').getByText('$20')).toBeInTheDocument()
    expect(planCard('Business').getByText('$2,400 billed yearly')).toBeInTheDocument()
    expect(planCard('Business').getByText('You save $480 a year')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Monthly'))
    expect(planCard('Business').getByText('$24')).toBeInTheDocument()
    expect(planCard('Business').getByText('$240 billed monthly')).toBeInTheDocument()
  })

  it('recalculates totals for the team size and warns when a plan is too small', () => {
    renderAt('/preview/saas/pricing?billing=monthly&seats=2')

    expect(planCard('Free').queryByText(/Up to 3 people\. Choose/)).toBeNull()
    expect(planCard('Free').getByText('Fits your team')).toBeInTheDocument()
    expect(planCard('Business').getByText('Billed for at least 5 seats')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Number of people'), { target: { value: '60' } })
    fireEvent.blur(screen.getByLabelText('Number of people'))

    expect(
      planCard('Team').getByText('Up to 50 people. Choose a larger plan for your team.'),
    ).toBeInTheDocument()
    expect(planCard('Business').getByText('$1,440 billed monthly')).toBeInTheDocument()
    expect(planCard('Free').queryByText('Fits your team')).toBeNull()
  })

  it('shows prices in the currency chosen in the address', () => {
    renderAt('/preview/saas/pricing?billing=monthly&seats=1&currency=EUR')

    expect(planCard('Team').getByText('€11.04')).toBeInTheDocument()
  })

  it('compares one plan at a time on a phone', () => {
    const { container } = renderAt('/preview/saas/pricing')
    const list = within(container.querySelector<HTMLElement>('.saas-compare-list')!)

    expect(list.getByText('Chat and email')).toBeInTheDocument()
    fireEvent.click(list.getByText('Enterprise'))
    expect(list.getByText('Dedicated manager')).toBeInTheDocument()
    expect(list.queryByText('Chat and email')).toBeNull()
  })

  it('translates the pricing page', () => {
    usePreferencesStore.getState().setLanguage('tr')
    renderAt('/preview/saas/pricing')

    expect(
      screen.getByText('Gönderdiğiniz veriye değil, nöbetteki kişilere ödeyin.'),
    ).toBeInTheDocument()
    expect(planCard('Business').getByText('En popüler')).toBeInTheDocument()
  })
})
