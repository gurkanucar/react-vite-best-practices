import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import dayjs from 'dayjs'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { ISO } from '@/features/showcases/data/reminders'
import { useRemindersStore } from '@/features/showcases/hooks/useRemindersStore'
import { ReminderDetailPage } from '@/features/showcases/pages/ReminderDetailPage'
import { RemindersCalendarPage } from '@/features/showcases/pages/RemindersCalendarPage'
import { RemindersHomePage } from '@/features/showcases/pages/RemindersHomePage'
import { usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Routes>
          <Route path="/preview/reminders" element={<RemindersHomePage standalone />} />
          <Route
            path="/preview/reminders/calendar"
            element={<RemindersCalendarPage standalone />}
          />
          <Route
            path="/preview/reminders/:reminderId"
            element={<ReminderDetailPage standalone />}
          />
        </Routes>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

/* The seeded days repeat every year, so the tests add their own days relative to today. */
const today = dayjs().format(ISO)

function addToday(title: string) {
  return useRemindersStore.getState().add(
    {
      title,
      category: 'birthday',
      date: dayjs().subtract(30, 'year').format(ISO),
      repeat: 'yearly',
      countYears: true,
      offsets: [],
      alarmTime: '09:00',
      gifts: ['Scarf'],
    },
    Date.now(),
  )
}

describe('special days showcase', () => {
  beforeEach(() => {
    usePreferencesStore.getState().setLanguage('en')
    useRemindersStore.getState().reset()
  })

  it('lists upcoming days with countdowns and filters them by category', () => {
    addToday('Selin’s birthday')
    renderAt('/preview/reminders')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Never miss the days that matter.' }),
    ).toBeInTheDocument()
    const todayGroup = screen.getByRole('heading', { level: 2, name: /^Today/ }).closest('section')!
    expect(within(todayGroup).getByText('Selin’s birthday')).toBeInTheDocument()
    expect(within(todayGroup).getByText('Turns 30')).toBeInTheDocument()

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search reminders' }), {
      target: { value: 'rent' },
    })
    expect(screen.getByText('Rent')).toBeInTheDocument()
    expect(document.querySelector('.reminders-list [data-reminder]')?.textContent).toContain('Rent')
    expect(document.querySelectorAll('.reminders-list [data-reminder]')).toHaveLength(1)
    expect(screen.getByText('1 reminder')).toBeInTheDocument()
  })

  it('hides the public holidays when asked', () => {
    renderAt('/preview/reminders')
    expect(screen.getAllByText('Republic Day').length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('switch', { name: 'Show public holidays' }))
    expect(screen.queryByText('Republic Day')).not.toBeInTheDocument()
  })

  it('adds a reminder on a calendar day', async () => {
    renderAt('/preview/reminders/calendar?date=2026-12-24')

    expect(
      screen.getByRole('heading', { level: 2, name: 'Thu, 24 December 2026' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Nothing on this day.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Add on this day/ }))
    const drawer = await screen.findByRole('dialog')
    fireEvent.change(within(drawer).getByLabelText('Title'), {
      target: { value: 'Office party' },
    })
    fireEvent.click(within(drawer).getByRole('button', { name: 'Save' }))

    await waitFor(() =>
      expect(useRemindersStore.getState().reminders.some((r) => r.title === 'Office party')).toBe(
        true,
      ),
    )
    const added = useRemindersStore.getState().reminders.find((r) => r.title === 'Office party')!
    expect(added.date).toBe('2026-12-24')
    const day = document.querySelector<HTMLElement>('.reminders-cal__day')!
    expect(await within(day).findByText('Office party')).toBeInTheDocument()
  })

  it('shows a day’s countdown, gift ideas and a missing reminder', () => {
    const id = addToday('Selin’s birthday')
    renderAt(`/preview/reminders/${id}`)

    expect(screen.getByRole('heading', { level: 1, name: 'Selin’s birthday' })).toBeInTheDocument()
    expect(screen.getByText('It is today!')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('checkbox', { name: 'Scarf' }))
    expect(screen.getByText('1 of 1 ticked off')).toBeInTheDocument()

    fireEvent.change(screen.getByRole('textbox', { name: 'A gift idea' }), {
      target: { value: 'Tea set' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Add an idea/ }))
    expect(screen.getByRole('checkbox', { name: 'Tea set' })).toBeInTheDocument()
    expect(useRemindersStore.getState().reminders.find((r) => r.id === id)?.gifts).toHaveLength(2)
  })

  it('says so when a reminder does not exist', () => {
    renderAt('/preview/reminders/nope')
    expect(screen.getByText('This reminder does not exist')).toBeInTheDocument()
  })

  it('rings a due alarm and snoozes it', async () => {
    useRemindersStore.setState({ muted: true })
    useRemindersStore.getState().snooze(
      {
        key: 'mum-birthday:x:0',
        reminderId: 'mum-birthday',
        occurrence: today,
        offset: 0,
        at: 0,
      },
      -1,
      Date.now(),
    )
    renderAt('/preview/reminders')

    expect(await screen.findByText('Alarm: Mum’s birthday')).toBeInTheDocument()
    expect(useRemindersStore.getState().handled).toContain('mum-birthday:x:0')
    expect(useRemindersStore.getState().snoozes).toEqual([])

    fireEvent.click(screen.getByRole('button', { name: 'Snooze 5 min' }))
    expect(useRemindersStore.getState().snoozes).toHaveLength(1)
    expect(useRemindersStore.getState().snoozes[0]!.until).toBeGreaterThan(Date.now())
  })
})
