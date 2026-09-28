import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { leagueFate, leagues, leagueSlots, statusAt } from '@/features/showcases/data/esportsSim'
import { esportsClock, useEsportsStore } from '@/features/showcases/hooks/useEsportsStore'
import { EsportsHomePage } from '@/features/showcases/pages/EsportsHomePage'
import { EsportsLeaderboardPage } from '@/features/showcases/pages/EsportsLeaderboardPage'
import { EsportsMatchPage } from '@/features/showcases/pages/EsportsMatchPage'
import { EsportsTeamPage } from '@/features/showcases/pages/EsportsTeamPage'
import { EsportsTournamentPage } from '@/features/showcases/pages/EsportsTournamentPage'
import { EsportsTournamentsPage } from '@/features/showcases/pages/EsportsTournamentsPage'
import { usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

const root = '/preview/esports'
// The tennis semi-finals are on; the volleyball cup is days away.
const fixedNow = new Date(2026, 8, 28, 16, 20).getTime()
const realNow = esportsClock.now

/** A league match that is live at the fixed time. */
function liveLeagueMatch(sport: string) {
  const league = leagues.find((item) => item.sport === sport)!
  const slot = leagueSlots(league, fixedNow - 60 * 60_000, fixedNow)
    .map((item) => leagueFate(league, item))
    .find(
      (fate) => statusAt(fate, fixedNow) === 'live' && fixedNow - fate.def.startAt > 5 * 60_000,
    )!
  return slot.def.id
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Routes>
          <Route path={root} element={<EsportsHomePage standalone />} />
          <Route path={`${root}/tournaments`} element={<EsportsTournamentsPage standalone />} />
          <Route
            path={`${root}/tournaments/:tournamentId`}
            element={<EsportsTournamentPage standalone />}
          />
          <Route path={`${root}/matches/:matchId`} element={<EsportsMatchPage standalone />} />
          <Route path={`${root}/teams/:teamId`} element={<EsportsTeamPage standalone />} />
          <Route path={`${root}/leaderboard`} element={<EsportsLeaderboardPage standalone />} />
        </Routes>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

/* Controls are found by label and text; role queries over antd trees are slow here. */
describe('sports tournament site', () => {
  beforeAll(() => {
    esportsClock.now = () => fixedNow
  })
  afterAll(() => {
    esportsClock.now = realNow
  })
  beforeEach(() => {
    usePreferencesStore.getState().setLanguage('en')
    useEsportsStore.getState().reset()
  })

  it('shows every sport, live matches and the featured cup', () => {
    renderAt(root)
    expect(screen.getByText('Every goal, point and move, as it happens.')).toBeInTheDocument()
    expect(screen.getByText('Live now')).toBeInTheDocument()
    for (const sport of ['Football', 'Basketball', 'Volleyball', 'Tennis', 'Chess']) {
      expect(screen.getAllByText(sport).length).toBeGreaterThan(0)
    }
    expect(screen.getAllByText('Anadolu Kupası').length).toBeGreaterThan(0)
  })

  it('speaks Turkish', () => {
    usePreferencesStore.getState().setLanguage('tr')
    renderAt(root)
    expect(screen.getByText('Her gol, her sayı, her hamle anında.')).toBeInTheDocument()
  })

  it('filters tournaments from the address', () => {
    renderAt(`${root}/tournaments?status=finished`)
    expect(screen.getByText('3 tournaments')).toBeInTheDocument()
    expect(screen.getByText('Pota Kupası')).toBeInTheDocument()
    expect(screen.queryByText('File Kupası')).not.toBeInTheDocument()
  })

  it('draws a tennis bracket with undecided slots', () => {
    renderAt(`${root}/tournaments/zirve-open?tab=bracket`)
    expect(screen.getByText('Quarter-finals')).toBeInTheDocument()
    expect(screen.getByText('Winner of Semi-final 1')).toBeInTheDocument()
  })

  it('shows each sport’s league table', () => {
    renderAt(`${root}/tournaments/pota-ligi?tab=table`)
    expect(screen.getAllByText('Win %').length).toBeGreaterThan(0)
  })

  it('shows Swiss standings with Buchholz', () => {
    renderAt(`${root}/tournaments/bogazici-acik?tab=table`)
    expect(screen.getAllByText('Buchholz').length).toBeGreaterThan(0)
  })

  it('runs a live football match with play by play and the stands', () => {
    const id = liveLeagueMatch('football')
    useEsportsStore.getState().setFanSide(id, 'a')
    renderAt(`${root}/matches/${id}`)
    expect(screen.getByText('Play by play')).toBeInTheDocument()
    expect(screen.getByText('The stands')).toBeInTheDocument()
    expect(screen.getByText('Possession %')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Send a heart'))
    expect(screen.getByText('You sent ❤️')).toBeInTheDocument()
  })

  it('keeps the reaction buttons off until you pick a side', () => {
    renderAt(`${root}/matches/${liveLeagueMatch('basketball')}`)
    expect(screen.getByLabelText('Send fire')).toBeDisabled()
  })

  it('shows the chess board and both clocks', () => {
    renderAt(`${root}/matches/${liveLeagueMatch('chess')}`)
    expect(screen.getByLabelText(/Chess board after/)).toBeInTheDocument()
    expect(screen.getByText('Moves')).toBeInTheDocument()
  })

  it('shows the tennis score with the server', () => {
    renderAt(`${root}/matches/${liveLeagueMatch('tennis')}`)
    expect(screen.getByText('Serving')).toBeInTheDocument()
  })

  it('saves a prediction for an upcoming match', () => {
    renderAt(`${root}/matches/file-kupasi-r0-0`)
    expect(screen.getByText('Line-ups')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Pick Kuzey Rüzgarı VK'))
    expect(useEsportsStore.getState().predictions['file-kupasi-r0-0']).toBe('kuzey-ruzgari')
  })

  it('shows a club squad and a player profile, and follows', () => {
    renderAt(`${root}/teams/bogaz-fk`)
    expect(screen.getByText('Squad')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Follow Boğaz FK'))
    expect(useEsportsStore.getState().follows).toEqual(['bogaz-fk'])
  })

  it('shows a tennis player’s profile', () => {
    renderAt(`${root}/teams/yusuf-amrani`)
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Left-handed')).toBeInTheDocument()
  })

  it('filters the rankings by sport', () => {
    renderAt(`${root}/leaderboard?sport=chess`)
    expect(screen.getByText('Deniz Aksoy')).toBeInTheDocument()
    expect(screen.queryByText('Boğaz FK')).not.toBeInTheDocument()
  })

  it('shows a friendly page for unknown ids', () => {
    renderAt(`${root}/teams/nobody`)
    expect(screen.getByText('We could not find that team or player.')).toBeInTheDocument()
  })
})
