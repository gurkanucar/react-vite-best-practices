import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { REPLY_TIMING } from '@/features/chat/hooks'
import { ChatPage } from '@/features/chat/pages/ChatPage'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderPage() {
  return render(
    <MemoryRouter>
      <AppThemeProvider>
        <ChatPage />
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

function openChat(name: string) {
  fireEvent.click(screen.getByText(name, { selector: '.chat-list-item strong, .chat-list-item *' }))
}

describe('ChatPage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // jsdom matches no media query, so the page lays out as it does on a phone.
  it('shows the list first on a phone, then the chat, with a way back', () => {
    const { container } = renderPage()

    expect(screen.getByText('Frontend team')).toBeInTheDocument()
    expect(container.querySelector('.chat-thread')).toBeNull()

    openChat('Frontend team')
    expect(container.querySelector('.chat-sidebar')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Back to chats' }))
    expect(container.querySelector('.chat-sidebar')).not.toBeNull()
  })

  it('opens a group’s members and a member’s profile from the header', async () => {
    renderPage()
    openChat('Frontend team')

    fireEvent.click(screen.getByRole('button', { name: 'Details: Frontend team' }))
    const drawer = await screen.findByRole('dialog')
    expect(within(drawer).getByText('Group · 5 members')).toBeInTheDocument()
    expect(within(drawer).getAllByText('Admin')).toHaveLength(2)

    fireEvent.click(within(drawer).getByText('Elif Şahin'))
    expect(
      await within(drawer).findByText('If it can break, I will find out how.'),
    ).toBeInTheDocument()
    expect(within(drawer).getByText('elif.sahin@example.com')).toBeInTheDocument()
  })

  it('names the author above group messages but not in a private chat', () => {
    const { container } = renderPage()

    openChat('Frontend team')
    expect(container.querySelectorAll('.chat-messages .chat-author').length).toBeGreaterThan(0)
    expect(screen.getByText('Can Yılmaz created the group “Frontend team”')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Back to chats' }))
    openChat('Mehmet Kaya')
    // Only the quoted message carries a name in a private chat.
    expect(container.querySelectorAll('.chat-messages .ant-bubble-header')).toHaveLength(0)
    // A file and a voice note sit in the thread like any other message.
    expect(screen.getByRole('link', { name: 'Download load-test-results.csv' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument()
  })

  it('filters the list to groups and by search', () => {
    renderPage()

    fireEvent.click(screen.getByText('Groups'))
    expect(screen.queryByText('Burak Öztürk')).not.toBeInTheDocument()
    expect(screen.getByText('Release 2.4')).toBeInTheDocument()

    fireEvent.click(screen.getByText('All'))
    fireEvent.change(screen.getByPlaceholderText('Search or start a new chat'), {
      target: { value: 'selin' },
    })
    expect(screen.getByText('Selin Koç')).toBeInTheDocument()
    expect(screen.queryByText('Ayşe Demir')).not.toBeInTheDocument()
  })

  it('sends a message, shows the other side typing, and brings in the answer', async () => {
    const { container } = renderPage()
    openChat('Emre Aydın')

    expect(screen.getAllByText('No messages yet. Say hello 👋').length).toBeGreaterThan(0)

    const input = container.querySelector('.chat-composer textarea')!
    fireEvent.change(input, { target: { value: 'Hello Emre' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    const thread = container.querySelector('.chat-messages') as HTMLElement
    expect(await within(thread).findByText('Hello Emre')).toBeInTheDocument()

    await act(() => vi.advanceTimersByTimeAsync(REPLY_TIMING.read + 50))
    expect(screen.getAllByText('typing…').length).toBeGreaterThan(0)
    expect(within(thread).getByLabelText('Read')).toBeInTheDocument()

    await act(() => vi.advanceTimersByTimeAsync(REPLY_TIMING.reply))
    expect(screen.queryByText('typing…')).not.toBeInTheDocument()
    expect(container.querySelectorAll('.chat-bubble--theirs')).toHaveLength(1)
  })

  it('quotes the message being replied to', async () => {
    const { container } = renderPage()
    openChat('Mehmet Kaya')

    const bubble = screen
      .getByText(/Yes, as a “removed” event/)
      .closest('.chat-bubble') as HTMLElement
    fireEvent.click(within(bubble).getByRole('button', { name: 'Reply' }))
    expect(screen.getByText('Replying to Mehmet Kaya')).toBeInTheDocument()

    const input = container.querySelector('.chat-composer textarea')!
    fireEvent.change(input, { target: { value: 'Perfect' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    const sent = (await screen.findByText('Perfect')).closest('.chat-bubble') as HTMLElement
    expect(within(sent).getByText(/Yes, as a “removed” event/)).toBeInTheDocument()
    expect(screen.queryByText('Replying to Mehmet Kaya')).not.toBeInTheDocument()
  })

  it('moves a single-choice vote and shows who voted for what', async () => {
    renderPage()
    openChat('Frontend team')

    const poll = screen.getByText('Where shall we eat?').closest('.chat-poll') as HTMLElement
    fireEvent.click(within(poll).getByRole('radio', { name: 'Burgers' }))
    expect(within(poll).getByRole('radio', { name: 'Burgers' })).toBeChecked()

    fireEvent.click(within(poll).getByRole('radio', { name: 'The new place' }))
    expect(within(poll).getByRole('radio', { name: 'Burgers' })).not.toBeChecked()

    fireEvent.click(within(poll).getByRole('button', { name: /View votes/ }))
    const results = await screen.findByRole('dialog')
    // Mehmet and Ayşe from the seed, then the user.
    expect(within(results).getByText('3 votes')).toBeInTheDocument()
    expect(within(results).getByText('You')).toBeInTheDocument()
  })
})
