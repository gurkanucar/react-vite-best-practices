import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ProfilePage } from '@/features/profile/pages/ProfilePage'
import { getMessages } from '@/i18n/messages'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderAt(search = '') {
  return render(
    <MemoryRouter initialEntries={[`/profile${search}`]}>
      <AppThemeProvider>
        <ProfilePage />
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

const messages = getMessages('en')

describe('ProfilePage', () => {
  it('opens the profile tab and shows the columns around it', () => {
    renderAt()

    expect(screen.getByRole('heading', { name: 'Jaydon Frankie' })).toBeInTheDocument()
    expect(screen.getByText(messages.profile.about)).toBeInTheDocument()
    expect(screen.getByText(messages.profile.social)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(messages.profile.composerPlaceholder)).toBeInTheDocument()
    expect(screen.getAllByText(messages.profile.posts.sunset)).toHaveLength(1)
  })

  it('opens the tab named in the URL', () => {
    renderAt('?tab=friends')

    expect(screen.getByPlaceholderText(messages.profile.searchFriends)).toBeInTheDocument()
    // The profile tab's own content is not rendered at the same time.
    expect(screen.queryByPlaceholderText(messages.profile.composerPlaceholder)).toBeNull()
  })

  it('falls back to the profile tab when the URL names one that does not exist', () => {
    renderAt('?tab=nope')

    expect(screen.getByPlaceholderText(messages.profile.composerPlaceholder)).toBeInTheDocument()
  })

  it('switches tab from the tab bar and keeps it in the URL', () => {
    renderAt()

    fireEvent.click(screen.getByRole('tab', { name: messages.profile.tabs.gallery }))

    // The tab and the card carry the same word, and two gallery entries share a subject,
    // so the count of rendered images is what identifies the tab.
    expect(screen.getAllByRole('img')).toHaveLength(6)
    expect(screen.queryByPlaceholderText(messages.profile.composerPlaceholder)).toBeNull()
  })

  it('only enables the post button once something has been written', () => {
    renderAt()

    const composer = screen.getByPlaceholderText(messages.profile.composerPlaceholder)
    const post = screen.getByRole('button', { name: messages.profile.post })

    expect(post).toBeDisabled()

    fireEvent.change(composer, { target: { value: 'Hello' } })
    expect(post).toBeEnabled()

    // Whitespace is not a post.
    fireEvent.change(composer, { target: { value: '   ' } })
    expect(post).toBeDisabled()
  })

  it('counts a like once, and takes it back', () => {
    renderAt()

    const [like] = screen.getAllByRole('button', { pressed: false })

    expect(like).toHaveTextContent('20')
    fireEvent.click(like!)
    expect(like).toHaveTextContent('21')
    fireEvent.click(like!)
    expect(like).toHaveTextContent('20')
  })

  it('filters friends by name', () => {
    renderAt('?tab=friends')

    const search = screen.getByPlaceholderText(messages.profile.searchFriends)

    fireEvent.change(search, { target: { value: 'maya' } })

    expect(screen.getByText('Maya Chen')).toBeInTheDocument()
    expect(screen.queryByText('Noah Williams')).toBeNull()
  })

  it('toggles following a person', () => {
    renderAt('?tab=followers')

    const card = screen.getByText('Cristopher Cardenas').closest('.ant-card') as HTMLElement
    const button = within(card).getByRole('button')

    expect(button).toHaveTextContent(messages.profile.follow)
    fireEvent.click(button)
    expect(button).toHaveTextContent(messages.profile.followed)
  })
})
