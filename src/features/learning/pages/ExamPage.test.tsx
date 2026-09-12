import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { examQuestions } from '@/features/learning/data'
import { ExamPage } from '@/features/learning/pages/ExamPage'
import { getMessages } from '@/i18n/messages'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/learning/exam']}>
      <AppThemeProvider>
        <ExamPage />
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

const messages = getMessages('en')

function start() {
  renderPage()
  fireEvent.click(screen.getByRole('button', { name: messages.learning.startExam }))
}

const goToQuestion = (index: number) =>
  fireEvent.click(
    screen.getByRole('button', {
      name: messages.learning.goToQuestion.replace('{index}', String(index)),
    }),
  )

async function handIn() {
  fireEvent.click(screen.getByRole('button', { name: messages.learning.submitExam }))

  const dialog = await screen.findByRole('dialog')

  fireEvent.click(within(dialog).getByRole('button', { name: messages.learning.submitExam }))
}

describe('ExamPage', () => {
  it('opens on an introduction rather than the first question', () => {
    renderPage()

    expect(screen.getByText(messages.learning.examIntroTitle)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: messages.learning.submitExam })).toBeNull()
  })

  it('renders the right control for each question kind', () => {
    start()

    // 1 single choice, 3 multiple, 4 true/false, 5 text, 6 matching, 7 ordering, 8 upload.
    expect(screen.getAllByRole('radio')).toHaveLength(3)

    goToQuestion(3)
    expect(screen.getAllByRole('checkbox')).toHaveLength(4)

    goToQuestion(5)
    expect(screen.getByRole('textbox', { name: messages.learning.typeAnswer })).toBeInTheDocument()

    goToQuestion(6)
    expect(screen.getAllByRole('combobox')).toHaveLength(4)

    goToQuestion(7)
    expect(
      screen.getAllByRole('button', { name: new RegExp(messages.learning.moveUp) }),
    ).toHaveLength(4)
  })

  it('counts an answer as soon as one is given', () => {
    start()

    expect(
      screen.getByText(
        messages.learning.answeredOf
          .replace('{answered}', '0')
          .replace('{total}', String(examQuestions.length)),
      ),
    ).toBeInTheDocument()

    fireEvent.click(screen.getAllByRole('radio')[1]!)

    expect(
      screen.getByText(
        messages.learning.answeredOf
          .replace('{answered}', '1')
          .replace('{total}', String(examQuestions.length)),
      ),
    ).toBeInTheDocument()
  })

  it('does not count an ordering question nobody has touched', () => {
    start()
    goToQuestion(7)

    expect(
      screen.getByText(
        messages.learning.answeredOf
          .replace('{answered}', '0')
          .replace('{total}', String(examQuestions.length)),
      ),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getAllByRole('button', { name: new RegExp(messages.learning.moveDown) })[0]!,
    )

    expect(
      screen.getByText(
        messages.learning.answeredOf
          .replace('{answered}', '1')
          .replace('{total}', String(examQuestions.length)),
      ),
    ).toBeInTheDocument()
  })

  it('asks before handing the paper in, and scores what was answered', async () => {
    start()
    fireEvent.click(screen.getAllByRole('radio')[1]!)
    await handIn()

    // The cache question is worth 4 of the 41 points on the paper.
    expect(await screen.findByText('10%')).toBeInTheDocument()
    expect(screen.getByText(messages.learning.failed)).toBeInTheDocument()
    expect(
      screen.getByText(
        messages.learning.scoreOf.replace('{earned}', '4').replace('{possible}', '41'),
      ),
    ).toBeInTheDocument()
  })

  it('keeps an uploaded answer out of the score until a person looks at it', async () => {
    start()
    goToQuestion(8)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'diagram.pdf', { type: 'application/pdf' })

    fireEvent.change(input, { target: { files: [file] } })

    await screen.findByText('diagram.pdf')
    await handIn()

    // The upload's 10 points are set aside, so only 31 are counted.
    expect(
      await screen.findByText(
        messages.learning.scoreOf.replace('{earned}', '0').replace('{possible}', '31'),
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(messages.learning.pendingReview.replace('{count}', '10')),
    ).toBeInTheDocument()
  })

  it('shows the right answer and the reason on review', async () => {
    start()
    await handIn()

    fireEvent.click(await screen.findByRole('button', { name: messages.learning.reviewAnswers }))

    await waitFor(() =>
      expect(screen.getByText(messages.learning.explanations.cache)).toBeInTheDocument(),
    )
    // The tag reads "Not answered · 0/4", so the label is matched as a substring.
    expect(
      screen.getAllByText(new RegExp(messages.learning.outcomes.unanswered)).length,
    ).toBeGreaterThan(0)
  })

  it('clears the paper on a retry', async () => {
    start()
    fireEvent.click(screen.getAllByRole('radio')[1]!)
    await handIn()

    fireEvent.click(await screen.findByRole('button', { name: messages.learning.tryAgain }))

    expect(
      screen.getByText(
        messages.learning.answeredOf
          .replace('{answered}', '0')
          .replace('{total}', String(examQuestions.length)),
      ),
    ).toBeInTheDocument()
  })
})
