import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { attempts } from '@/features/learning/data'
import { ExamResultsPage } from '@/features/learning/pages/ExamResultsPage'
import { getMessages } from '@/i18n/messages'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

const messages = getMessages('en')

describe('ExamResultsPage', () => {
  it('summarises the attempts and lists every one', () => {
    render(
      <AppThemeProvider>
        <ExamResultsPage />
      </AppThemeProvider>,
    )

    const best = Math.max(...attempts.map((attempt) => attempt.percentage))
    const average = Math.round(
      attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length,
    )

    expect(screen.getByText(String(best))).toBeInTheDocument()
    expect(screen.getByText(String(average))).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(attempts.length + 1)
    expect(screen.getAllByText(messages.learning.passed)).toHaveLength(
      attempts.filter((attempt) => attempt.passed).length,
    )
  })
})
