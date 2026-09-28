import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { useMagazineStore } from '@/features/showcases/hooks/useMagazineStore'
import { MagazineArticlePage } from '@/features/showcases/pages/MagazineArticlePage'
import { MagazineAuthorPage } from '@/features/showcases/pages/MagazineAuthorPage'
import { MagazineBookmarksPage } from '@/features/showcases/pages/MagazineBookmarksPage'
import { MagazineHomePage } from '@/features/showcases/pages/MagazineHomePage'
import { MagazineTopicPage } from '@/features/showcases/pages/MagazineTopicPage'
import { usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

const root = '/preview/magazine'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Routes>
          <Route path={root} element={<MagazineHomePage standalone />} />
          <Route
            path={`${root}/articles/:articleSlug`}
            element={<MagazineArticlePage standalone />}
          />
          <Route path={`${root}/topics/:topicId`} element={<MagazineTopicPage standalone />} />
          <Route path={`${root}/authors/:authorId`} element={<MagazineAuthorPage standalone />} />
          <Route path={`${root}/bookmarks`} element={<MagazineBookmarksPage standalone />} />
        </Routes>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

/*
 * jsdom matches no media query, so these run the phone layout (contents in a collapse).
 * Controls are found by label and text; role queries over antd trees are slow here.
 */
describe('magazine site', () => {
  beforeEach(() => {
    usePreferencesStore.getState().setLanguage('en')
    useMagazineStore.getState().reset()
  })

  it('shows the cover story, latest, most read, topics and writers', () => {
    renderAt(root)
    expect(
      screen.getByRole('heading', { level: 1, name: 'The slow train to Kars' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Most read')).toBeInTheDocument()
    expect(screen.getByText('Browse by topic')).toBeInTheDocument()
    expect(screen.getByText('Our writers')).toBeInTheDocument()
    expect(screen.queryByText('Continue reading')).not.toBeInTheDocument()
  })

  it('speaks Turkish', () => {
    usePreferencesStore.getState().setLanguage('tr')
    renderAt(root)
    expect(screen.getByText('Kars’a giden yavaş tren', { selector: 'h1 a' })).toBeInTheDocument()
    expect(screen.getByText('En çok okunanlar')).toBeInTheDocument()
  })

  it('offers to continue an article that was started', () => {
    useMagazineStore.getState().recordProgress('a-grid-is-a-promise', 0.42)
    renderAt(root)
    expect(screen.getByText('Continue reading')).toBeInTheDocument()
    expect(screen.getAllByText('42% read').length).toBeGreaterThan(0)
  })

  it('renders an article with its contents, reading time and author', () => {
    renderAt(`${root}/articles/a-grid-is-a-promise`)
    expect(
      screen.getByRole('heading', { level: 1, name: 'A grid is a promise' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Contents')).toBeInTheDocument()
    expect(document.getElementById('twelve')).toHaveTextContent('Why twelve columns')
    expect(screen.getAllByText(/min read/).length).toBeGreaterThan(0)
    expect(screen.getByText('About the author')).toBeInTheDocument()
    expect(screen.getByText('Read next')).toBeInTheDocument()
  })

  it('saves an article and lists it under saved', () => {
    renderAt(`${root}/articles/a-grid-is-a-promise`)
    fireEvent.click(screen.getByLabelText('Save “A grid is a promise”'))
    expect(useMagazineStore.getState().bookmarks.map((item) => item.slug)).toEqual([
      'a-grid-is-a-promise',
    ])
  })

  it('offers to resume where the reader stopped', () => {
    useMagazineStore.getState().recordProgress('a-grid-is-a-promise', 0.5)
    renderAt(`${root}/articles/a-grid-is-a-promise`)
    expect(screen.getByText('You stopped at 50% of this article.')).toBeInTheDocument()
  })

  it('opens and closes the reading mode, keeping its settings', async () => {
    renderAt(`${root}/articles/a-grid-is-a-promise`)
    fireEvent.click(screen.getByText('Reading mode'))
    const dialog = await screen.findByLabelText('Reading mode: A grid is a promise')
    expect(dialog).toHaveClass('mag-reader--light')
    fireEvent.click(screen.getByLabelText('Text settings'))
    fireEvent.click(await screen.findByText('Sepia'))
    expect(useMagazineStore.getState().reader.theme).toBe('sepia')
    expect(dialog).toHaveClass('mag-reader--sepia')
    fireEvent.click(screen.getByLabelText('Larger text'))
    expect(useMagazineStore.getState().reader.size).toBe(20)
    fireEvent.keyDown(window, { key: 'Escape' })
    await waitFor(() =>
      expect(screen.queryByLabelText('Reading mode: A grid is a promise')).not.toBeInTheDocument(),
    )
  })

  it('shows a not-found page for an unknown article', () => {
    renderAt(`${root}/articles/nope`)
    expect(screen.getByText('This article could not be found.')).toBeInTheDocument()
  })

  it('filters a topic from the address', () => {
    renderAt(`${root}/topics/technology?author=deniz-aksoy&q=offline`)
    expect(screen.getByRole('heading', { level: 1, name: 'Technology' })).toBeInTheDocument()
    expect(screen.getByText('1 article')).toBeInTheDocument()
    expect(screen.getByText('Writing apps that expect to be offline')).toBeInTheDocument()
  })

  it('shows an author with stats and articles', () => {
    renderAt(`${root}/authors/ayla-demirci`)
    expect(screen.getByRole('heading', { level: 1, name: 'Ayla Demirci' })).toBeInTheDocument()
    expect(screen.getByText('Minutes of reading')).toBeInTheDocument()
    expect(screen.getByText('The patience of sourdough')).toBeInTheDocument()
  })

  it('lists saved articles and reading history', () => {
    useMagazineStore.getState().toggleBookmark('libraries-after-dark')
    useMagazineStore.getState().recordProgress('the-colours-of-twilight', 0.3)
    renderAt(`${root}/bookmarks`)
    expect(screen.getByText('Libraries after dark')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Remove: Libraries after dark'))
    expect(useMagazineStore.getState().bookmarks).toEqual([])
    expect(screen.getByText(/Nothing saved yet/)).toBeInTheDocument()
  })

  it('opens the history tab from the address', () => {
    useMagazineStore.getState().recordProgress('the-colours-of-twilight', 0.3)
    renderAt(`${root}/bookmarks?tab=history`)
    expect(screen.getByText('The colours of twilight')).toBeInTheDocument()
    expect(screen.getAllByText('30% read').length).toBeGreaterThan(0)
  })
})
