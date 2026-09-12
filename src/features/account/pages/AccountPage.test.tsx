import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AccountPage } from '@/features/account/pages/AccountPage'
import { getMessages } from '@/i18n/messages'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderAt(search = '') {
  return render(
    <MemoryRouter initialEntries={[`/account${search}`]}>
      <AppThemeProvider>
        <AccountPage />
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

const messages = getMessages('en')

describe('AccountPage', () => {
  it('opens the general tab by default', () => {
    renderAt()

    expect(screen.getByLabelText(messages.account.name)).toHaveValue('Jaydon Frankie')
    expect(screen.getByText(messages.account.publicProfile)).toBeInTheDocument()
  })

  it('opens the tab named in the URL, and only that one', () => {
    renderAt('?tab=billing')

    expect(screen.getByText(messages.account.invoiceHistory)).toBeInTheDocument()
    // Each pane mounts on its own, so the general form is not also in the tree.
    expect(screen.queryByLabelText(messages.account.name)).toBeNull()
  })

  it('falls back to general when the URL names a tab that does not exist', () => {
    renderAt('?tab=nope')

    expect(screen.getByLabelText(messages.account.name)).toBeInTheDocument()
  })

  it('rejects an email address that is not one', async () => {
    renderAt()

    fireEvent.change(screen.getByLabelText(messages.account.email), {
      target: { value: 'not-an-email' },
    })
    fireEvent.click(screen.getByRole('button', { name: messages.account.saveChanges }))

    expect(await screen.findByText(messages.account.emailInvalid)).toBeInTheDocument()
  })

  it('requires the two new passwords to match', async () => {
    renderAt('?tab=security')

    fireEvent.change(screen.getByLabelText(messages.account.newPassword), {
      target: { value: 'longenough1' },
    })
    fireEvent.change(screen.getByLabelText(messages.account.confirmPassword), {
      target: { value: 'different1' },
    })
    fireEvent.click(screen.getByRole('button', { name: messages.account.savePassword }))

    expect(await screen.findByText(messages.account.passwordMismatch)).toBeInTheDocument()
  })

  it('rejects a new password that is too short', async () => {
    renderAt('?tab=security')

    fireEvent.change(screen.getByLabelText(messages.account.newPassword), {
      target: { value: 'short' },
    })
    fireEvent.click(screen.getByRole('button', { name: messages.account.savePassword }))

    expect(await screen.findByText(messages.account.passwordTooShort)).toBeInTheDocument()
  })

  it('moves the primary badge to whichever card is promoted', () => {
    renderAt('?tab=billing')

    const mastercard = screen.getByText(/Mastercard/).closest('.ant-card') as HTMLElement

    fireEvent.click(within(mastercard).getByRole('button', { name: messages.account.makePrimary }))

    expect(within(mastercard).getByText(messages.account.primaryCard)).toBeInTheDocument()
    expect(screen.getAllByText(messages.account.primaryCard)).toHaveLength(1)
  })

  it('toggles a notification without touching the others', () => {
    renderAt('?tab=notifications')

    const mentions = screen.getByLabelText(messages.account.notificationOptions.mentions.title)
    const answers = screen.getByLabelText(messages.account.notificationOptions.answers.title)

    expect(mentions).toBeChecked()
    expect(answers).not.toBeChecked()

    fireEvent.click(mentions)

    expect(mentions).not.toBeChecked()
    expect(answers).not.toBeChecked()
  })

  it('validates the social links as addresses', async () => {
    renderAt('?tab=social')

    fireEvent.change(screen.getByLabelText(messages.account.socialNetworks.facebook), {
      target: { value: 'not a url' },
    })
    fireEvent.click(screen.getByRole('button', { name: messages.account.saveChanges }))

    expect(await screen.findByText(messages.account.urlInvalid)).toBeInTheDocument()
  })

  it('switches tab from the tab bar', async () => {
    renderAt()

    fireEvent.click(screen.getByRole('tab', { name: messages.account.tabs.security }))

    await waitFor(() =>
      expect(screen.getByText(messages.account.changePassword)).toBeInTheDocument(),
    )
  })
})
