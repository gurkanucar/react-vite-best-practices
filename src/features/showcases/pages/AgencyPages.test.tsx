import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { AgencyCaseStudyPage } from '@/features/showcases/pages/AgencyCaseStudyPage'
import { AgencyContactPage } from '@/features/showcases/pages/AgencyContactPage'
import { AgencyHomePage } from '@/features/showcases/pages/AgencyHomePage'
import { AgencyWorkPage } from '@/features/showcases/pages/AgencyWorkPage'
import { usePreferencesStore } from '@/store/preferences-store'

function Search() {
  return <output data-testid="search">{useLocation().search}</output>
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/preview/agency" element={<AgencyHomePage standalone />} />
        <Route path="/showcases/agency" element={<AgencyHomePage />} />
        <Route
          path="/preview/agency/work"
          element={
            <>
              <AgencyWorkPage standalone />
              <Search />
            </>
          }
        />
        <Route path="/preview/agency/work/:caseId" element={<AgencyCaseStudyPage standalone />} />
        <Route path="/preview/agency/contact" element={<AgencyContactPage standalone />} />
      </Routes>
    </MemoryRouter>,
  )
}

/*
 * Role queries are slow over antd trees in jsdom, so controls are found by text and label.
 * jsdom's IntersectionObserver never fires; the reveal only fades content, so it is all there.
 */
describe('agency showcase', () => {
  beforeEach(() => {
    usePreferencesStore.getState().setLanguage('en')
  })

  it('renders the studio home page with its work, services and team', () => {
    renderAt('/preview/agency')

    expect(screen.getByText('remember.')).toBeInTheDocument()
    expect(screen.getByText('A bank that talks like a neighbour')).toBeInTheDocument()
    expect(screen.getByText('Brand strategy & identity')).toBeInTheDocument()
    expect(screen.getByText('Lina Vogel')).toBeInTheDocument()
    // The marquee repeats its names for a seamless loop; the copy is hidden from readers.
    const copies = screen.getAllByText('Lindqvist Furniture')
    expect(copies).toHaveLength(2)
    expect(copies[1]!.closest('ul')).toHaveAttribute('aria-hidden', 'true')
  })

  it('steps through the testimonials and opens the reel', async () => {
    renderAt('/preview/agency')

    expect(screen.getByText(/The archive used to be our storeroom/)).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Next quote'))
    expect(screen.getByText(/They listened to our tellers/)).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Previous quote'))
    fireEvent.click(screen.getByLabelText('Previous quote'))
    expect(screen.getByText(/The app never makes a patient feel behind/)).toBeInTheDocument()

    fireEvent.click(screen.getByText('Watch the reel'))
    expect(
      await screen.findByText('Eight projects, seventy-two seconds, no stock footage.'),
    ).toBeInTheDocument()
  })

  it('keeps the admin preview frame outside the standalone site', () => {
    renderAt('/showcases/agency')

    expect(screen.getByText('Open in a new tab').closest('a')).toHaveAttribute(
      'href',
      '/preview/agency',
    )
  })

  it('filters the work by discipline and keeps the filter in the address', () => {
    renderAt('/preview/agency/work')

    expect(screen.getByText('8 projects')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Motion'))

    expect(screen.getByText('3 projects')).toBeInTheDocument()
    expect(screen.getByTestId('search')).toHaveTextContent('?discipline=motion')
    expect(screen.getByText('A festival you can hear in the poster')).toBeInTheDocument()
    expect(screen.queryByText('A bank that talks like a neighbour')).toBeNull()
    expect(screen.getByText('Motion').closest('button')).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByText('All'))
    expect(screen.getByText('8 projects')).toBeInTheDocument()
  })

  it('opens a filtered view straight from a link and ignores unknown filters', () => {
    renderAt('/preview/agency/work?discipline=web')
    expect(screen.getByText('3 projects')).toBeInTheDocument()
  })

  it('shows a case study with a comparison slider and the next project', () => {
    renderAt('/preview/agency/work/kora-bank')

    expect(screen.getByText('A bank that talks like a neighbour')).toBeInTheDocument()
    expect(screen.getByText('+62%')).toBeInTheDocument()
    expect(screen.getByText('Deniz Aksoy')).toBeInTheDocument()

    const slider = screen.getByLabelText('Comparison position')
    expect(slider).toHaveAttribute('aria-valuetext', 'Before 50%, After 50%')
    fireEvent.change(slider, { target: { value: '20' } })
    expect(slider).toHaveAttribute('aria-valuetext', 'Before 20%, After 80%')

    const next = screen.getByText('Next project').closest('a')!
    expect(next).toHaveAttribute('href', '/preview/agency/work/orbit-festival')
    expect(within(next).getByText('Orbit Festival')).toBeInTheDocument()
  })

  it('shows a not-found page for an unknown project', () => {
    renderAt('/preview/agency/work/nope')

    expect(screen.getByText('Project not found')).toBeInTheDocument()
    expect(screen.getByText('All work').closest('a')).toHaveAttribute(
      'href',
      '/preview/agency/work',
    )
  })

  it('validates the brief and confirms it with a summary', async () => {
    const { container } = renderAt('/preview/agency/contact')

    fireEvent.click(screen.getByText('Send brief'))
    expect(await screen.findByText('Tell us your name.')).toBeInTheDocument()
    expect(screen.getByText('Pick at least one thing you need.')).toBeInTheDocument()
    expect(screen.getByText('We need your consent to reply.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Your name'), { target: { value: 'Ada Byron' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@engines.example' } })
    fireEvent.click(screen.getByText('Website'))
    fireEvent.click(screen.getByText('Motion'))
    fireEvent.click(screen.getByText('€25–50k'))
    fireEvent.mouseDown(container.querySelector('.ant-select')!.querySelector('input')!)
    fireEvent.click(await screen.findByText('In 1–3 months'))
    fireEvent.change(screen.getByLabelText('Project details'), {
      target: { value: 'A new site for our engine company.' },
    })
    fireEvent.click(screen.getByText(/I agree that Oda Studio/))
    fireEvent.click(screen.getByText('Send brief'))

    expect(await screen.findByText('Brief received. Thank you.')).toBeInTheDocument()
    expect(screen.getByText(/^Ada, we will read it this week/)).toBeInTheDocument()
    expect(screen.getByText('Website, Motion')).toBeInTheDocument()
    expect(screen.getByText('€25–50k')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Send another brief'))
    await waitFor(() => expect(screen.getByLabelText('Your name')).toHaveValue(''))
  })

  it('books an intro call on a free slot', () => {
    const { container } = renderAt('/preview/agency/contact')

    const free = container.querySelector<HTMLButtonElement>('.agency-slot:not(:disabled)')!
    const time = free.textContent
    fireEvent.click(free)
    expect(free).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByText('Book this slot'))

    expect(screen.getByText(/^Booked for .*A calendar invite is on its way\.$/)).toBeInTheDocument()
    expect(screen.getByText(/^Booked for/).textContent).toContain(time)
  })
})
