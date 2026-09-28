import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { ROUND_MS, VOTING_MS } from '@/features/showcases/data/songContest'
import { songContestClock } from '@/features/showcases/hooks/useSongContest'
import { SongContestantPage } from '@/features/showcases/pages/SongContestantPage'
import { SongContestHomePage } from '@/features/showcases/pages/SongContestHomePage'
import { SongContestLivePage } from '@/features/showcases/pages/SongContestLivePage'
import { SongContestResultsPage } from '@/features/showcases/pages/SongContestResultsPage'
import { usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

const root = '/preview/song-contest'
// Ten minutes into a round: lines are open.
const roundStart = 1_790_000_000_000 - (1_790_000_000_000 % ROUND_MS)
const openAt = roundStart + 10 * 60_000
const realNow = songContestClock.now

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Routes>
          <Route path={root} element={<SongContestHomePage standalone />} />
          <Route path={`${root}/live`} element={<SongContestLivePage standalone />} />
          <Route path={`${root}/results`} element={<SongContestResultsPage standalone />} />
          <Route
            path={`${root}/contestants/:contestantId`}
            element={<SongContestantPage standalone />}
          />
        </Routes>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

describe('song contest site', () => {
  beforeAll(() => {
    songContestClock.now = () => openAt
  })

  afterAll(() => {
    songContestClock.now = realNow
  })

  beforeEach(() => {
    songContestClock.now = () => openAt
    usePreferencesStore.getState().setLanguage('en')
  })

  it('introduces the four finalists and the live round', () => {
    renderAt(root)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Four voices. One night. One winner.' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Voting is open right now')).toBeInTheDocument()
    for (const name of ['Elif Şahin', 'Deniz Aksoy', 'Mert Kaya', 'Can Yıldız'])
      expect(screen.getByRole('heading', { name })).toBeInTheDocument()
    expect(screen.queryByText('Zeynep Arslan')).not.toBeInTheDocument()
  })

  it('speaks Turkish', () => {
    usePreferencesStore.getState().setLanguage('tr')
    renderAt(root)
    expect(screen.getByText('Dört ses. Tek gece. Tek kazanan.')).toBeInTheDocument()
    expect(screen.getByText('Gece nasıl işliyor?')).toBeInTheDocument()
  })

  it('is a display: turnout, an unnamed split and masked voters, no voting', () => {
    const { container } = renderAt(`${root}/live`)
    expect(screen.getByRole('heading', { level: 1, name: 'Live voting' })).toBeInTheDocument()
    expect(screen.getByText('The lines are open')).toBeInTheDocument()
    expect(screen.getByText('TOTAL VOTES', { selector: 'dt' })).toBeInTheDocument()
    expect(screen.getByText('The split so far')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Vote/ })).not.toBeInTheDocument()
    for (const name of ['Elif Şahin', 'Deniz Aksoy', 'Mert Kaya', 'Can Yıldız'])
      expect(screen.getByRole('heading', { name })).toBeInTheDocument()

    const voters = [...container.querySelectorAll('.sc-chip__name')].map((node) => node.textContent)
    expect(voters.length).toBeGreaterThanOrEqual(10)
    for (const voter of voters) expect(voter).toMatch(/\*\* \S\.$/u)
    // No city or device appears in the feed.
    const feed = container.querySelector('.sc-feed__list')?.textContent ?? ''
    for (const word of ['İstanbul', 'Ankara', 'SMS', 'App', 'Web']) expect(feed).not.toContain(word)

    // The only percentage on the page is turnout, in the strip; no singer has a share.
    const page = container.cloneNode(true) as HTMLElement
    page.querySelector('.sc-strip')?.remove()
    expect(container.querySelector('.sc-strip')?.textContent).toMatch(/%\d+/)
    expect(page.textContent).not.toContain('%')
    expect(container.querySelector('.sc-rate')).toBeNull()
  })

  it('says when the lines close and offers the results', () => {
    songContestClock.now = () => roundStart + VOTING_MS + 30_000
    renderAt(`${root}/live`)
    expect(screen.getByText('The lines are closed')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Open the results/ })).toBeInTheDocument()
  })

  it('reveals the final from fourth place to the winner', () => {
    const { container } = renderAt(`${root}/results`)
    expect(container.querySelectorAll('.sc-reveal-card')).toHaveLength(0)
    expect(screen.queryByText('Can Yıldız')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Reveal next/ }))
    expect(screen.getByRole('heading', { name: 'Can Yıldız' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Elif Şahin' })).not.toBeInTheDocument()

    // The glowing card is the next place and opens on its own.
    fireEvent.click(screen.getByRole('button', { name: /Tap to reveal/ }))
    expect(screen.getByRole('heading', { name: 'Mert Kaya' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Reveal all/ }))
    expect(screen.getByRole('heading', { name: 'Elif Şahin' })).toBeInTheDocument()
    expect(screen.getAllByText('Congratulations, Elif Şahin!').length).toBeGreaterThan(0)
    expect(screen.getByText('30.4%')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Start again/ }))
    expect(container.querySelectorAll('.sc-reveal-card')).toHaveLength(0)
  })

  it('lets a presenter’s clicker or the keyboard open the next place', () => {
    const { container } = renderAt(`${root}/results`)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    fireEvent.keyDown(window, { key: 'PageDown' })
    expect(container.querySelectorAll('.sc-reveal-card')).toHaveLength(2)
    expect(screen.getByText('CHAMPION', { exact: false, selector: 'dt' })).toBeInTheDocument()
    expect(container.querySelector('.sc-strip__item.is-gold dd')?.textContent).toBe('?')
  })

  it('reveals a shared place in one step', () => {
    const { container } = renderAt(`${root}/results?scenario=tie`)
    fireEvent.click(screen.getByRole('button', { name: /Reveal next/ }))
    fireEvent.click(screen.getByRole('button', { name: /Reveal next/ }))
    expect(container.querySelectorAll('.sc-reveal-card')).toHaveLength(3)
    expect(container.querySelectorAll('.sc-pill--tie')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'Deniz Aksoy' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Mert Kaya' })).toBeInTheDocument()
    // Both hold second, so both wear the silver medal.
    expect(container.querySelectorAll('.sc-reveal-card .sc-medal--silver')).toHaveLength(2)
  })

  it('crowns joint winners and a single finalist', () => {
    renderAt(`${root}/results?scenario=joint`)
    fireEvent.click(screen.getByRole('button', { name: /Reveal all/ }))
    expect(document.querySelectorAll('.sc-pill--champion')).toHaveLength(2)
    expect(document.querySelectorAll('.sc-stage-card.is-champion')).toHaveLength(2)
    expect(document.querySelector('.sc-strip__item.is-gold dd')?.textContent).toBe(
      'ELİF ŞAHİN AND ZEYNEP ARSLAN',
    )
    expect(
      screen.getAllByText('Congratulations, Elif Şahin and Zeynep Arslan!').length,
    ).toBeGreaterThan(0)
  })

  it('has just the winner to reveal with one finalist', () => {
    const { container } = renderAt(`${root}/results?scenario=solo`)
    expect(container.querySelectorAll('.sc-podium__slot')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: /Tap to reveal/ }))
    expect(screen.getByText('100.0%')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Reveal next/ })).toBeDisabled()
  })

  it('shows a singer’s performance', () => {
    renderAt(`${root}/contestants/deniz`)
    expect(screen.getByRole('heading', { level: 1, name: 'Deniz Aksoy' })).toBeInTheDocument()
    expect(screen.getByText('Anonymous Anatolian folk song')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Play preview' }))
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Vote/ })).not.toBeInTheDocument()
  })

  it('says so for an unknown singer', () => {
    renderAt(`${root}/contestants/nobody`)
    expect(screen.getByText('We couldn’t find that singer.')).toBeInTheDocument()
  })
})
