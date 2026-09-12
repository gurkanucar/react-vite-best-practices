import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { flashcards } from '@/features/learning/data'
import { FlashcardsPage } from '@/features/learning/pages/FlashcardsPage'
import { getMessages } from '@/i18n/messages'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderPage() {
  return render(
    <AppThemeProvider>
      <FlashcardsPage />
    </AppThemeProvider>,
  )
}

const messages = getMessages('en')
const cards = messages.learning.flashcards

describe('FlashcardsPage', () => {
  it('opens on the front of the first card', () => {
    renderPage()

    expect(screen.getByText(cards.urlFront)).toBeInTheDocument()
    expect(screen.queryByText(cards.urlBack)).toBeNull()
  })

  it('turns the card over and back', () => {
    renderPage()

    const card = screen.getByRole('button', { name: messages.learning.flip, pressed: false })

    fireEvent.click(card)
    expect(screen.getByText(cards.urlBack)).toBeInTheDocument()

    fireEvent.click(card)
    expect(screen.getByText(cards.urlFront)).toBeInTheDocument()
  })

  it('shows the next card front first, so the answer is not given away', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: messages.learning.flip, pressed: false }))
    fireEvent.click(screen.getByRole('button', { name: messages.learning.next }))

    expect(screen.getByText(cards.optimisticFront)).toBeInTheDocument()
    expect(screen.queryByText(cards.optimisticBack)).toBeNull()
  })

  it('counts the cards marked known and moves on', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: messages.learning.markKnown }))

    expect(
      screen.getByText(messages.learning.knownCount.replace('{count}', '1')),
    ).toBeInTheDocument()
    expect(screen.getByText(cards.optimisticFront)).toBeInTheDocument()
  })

  it('wraps round the end of the deck', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: messages.learning.previous }))

    expect(
      screen.getByText(
        messages.learning.cardOf
          .replace('{index}', String(flashcards.length))
          .replace('{total}', String(flashcards.length)),
      ),
    ).toBeInTheDocument()
  })

  it('clears the count on a reset', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: messages.learning.markKnown }))
    fireEvent.click(screen.getByRole('button', { name: messages.learning.resetDeck }))

    expect(
      screen.getByText(messages.learning.knownCount.replace('{count}', '0')),
    ).toBeInTheDocument()
    expect(screen.getByText(cards.urlFront)).toBeInTheDocument()
  })
})
