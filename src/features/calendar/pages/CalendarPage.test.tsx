import { fireEvent, render, screen, within } from '@testing-library/react'
import dayjs from 'dayjs'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { CalendarPage } from '@/features/calendar/pages/CalendarPage'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderAt(search: string) {
  return render(
    <MemoryRouter initialEntries={[`/calendar${search}`]}>
      <AppThemeProvider>
        <CalendarPage />
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

describe('CalendarPage', () => {
  it('draws six whole weeks in the month view, so the grid never changes height', () => {
    const { container } = renderAt('?view=month&date=2026-09-14')

    expect(container.querySelectorAll('.calendar-month__cell')).toHaveLength(42)
    expect(screen.getByText('September 2026')).toBeInTheDocument()
  })

  it('draws seven day columns in the week view and one in the day view', () => {
    const week = renderAt('?view=week&date=2026-09-14')
    expect(week.container.querySelectorAll('.calendar-daycolumn')).toHaveLength(7)
    week.unmount()

    const day = renderAt('?view=day&date=2026-09-14')
    expect(day.container.querySelectorAll('.calendar-daycolumn')).toHaveLength(1)
  })

  it('falls back to today when the date in the URL is not a real date', () => {
    // Without strict parsing dayjs accepts this and renders a month nobody asked for.
    renderAt('?view=month&date=2026-13-45')

    expect(screen.getByText(dayjs().format('MMMM YYYY'))).toBeInTheDocument()
  })

  it('steps through the range and back to today from the toolbar', () => {
    renderAt('?view=month&date=2026-09-14')

    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('October 2026')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
    expect(screen.getByText('August 2026')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Today' }))
    expect(screen.getByText(dayjs().format('MMMM YYYY'))).toBeInTheDocument()
  })

  it('switches view from the toolbar, stepping by the unit that view shows', () => {
    renderAt('?view=week&date=2026-09-14')

    // A week step moves seven days; a day step moves one.
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('20 – 26 September 2026')).toBeInTheDocument()

    // Switching view keeps the date, which the week step moved to the 21st.
    // antd's Segmented is a radio group, so the option is picked by its radio role.
    fireEvent.click(screen.getByRole('radio', { name: 'Day' }))
    expect(screen.getByText('21 September 2026')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('22 September 2026')).toBeInTheDocument()
  })

  it('opens an event and shows where and with whom it is', async () => {
    renderAt('?view=day&date=2026-09-09')

    fireEvent.click(screen.getAllByRole('button', { name: /Architecture sync/ })[0]!)

    const dialog = await screen.findByRole('dialog')

    expect(within(dialog).getByText('Room 2')).toBeInTheDocument()
    expect(within(dialog).getByText(/Maya Chen/)).toBeInTheDocument()
    expect(within(dialog).getByText('Review')).toBeInTheDocument()
  })

  it('opens the day that was clicked in the month grid, keeping both the view and the date', () => {
    // Two separate search-param writes in one handler lost the date; this pins the fix.
    renderAt('?view=month&date=2026-09-14')

    fireEvent.click(screen.getByRole('button', { name: '17 September 2026' }))

    expect(screen.getByText('17 September 2026')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Day' })).toBeChecked()
  })

  it('shows all-day events in their own row, out of the time grid', () => {
    const { container } = renderAt('?view=week&date=2026-09-25')

    const allDayRow = container.querySelector('.calendar-timegrid__allday')

    expect(allDayRow).not.toBeNull()
    expect(within(allDayRow as HTMLElement).getByText('Team offsite')).toBeInTheDocument()
    // An all-day event has no place on an hour axis, so it is not drawn as a timed block.
    const timedTitles = [...container.querySelectorAll('.calendar-event__title')].map(
      (element) => element.textContent,
    )

    expect(timedTitles).not.toContain('Team offsite')
  })

  it('lays overlapping events side by side rather than on top of each other', () => {
    // Wednesday the 9th holds the architecture sync and the candidate interview.
    const { container } = renderAt('?view=day&date=2026-09-09')
    const widths = [...container.querySelectorAll<HTMLElement>('.calendar-event')].map(
      (element) => element.style.width,
    )

    expect(widths.length).toBeGreaterThan(1)
    expect(widths.some((width) => width.includes('50%'))).toBe(true)
  })
})
