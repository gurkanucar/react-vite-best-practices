import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  applyInput,
  sanitizeReminder,
  type Reminder,
  type ReminderAlert,
  type ReminderInput,
} from '@/features/showcases/data/reminders'
import { seedReminders } from '@/features/showcases/data/remindersSeed'

export const remindersStorageKey = 'rvbp-reminders'

/** An alert put off until later. Test alarms have no reminder behind them. */
export interface SnoozedAlert extends ReminderAlert {
  until: number
}

/** How many rung alert keys are remembered: enough for a year of alarms. */
const HANDLED_LIMIT = 400

interface RemindersState {
  reminders: Reminder[]
  /** Keys of alerts that have rung, so each rings once. */
  handled: string[]
  snoozes: SnoozedAlert[]
  muted: boolean
  showHolidays: boolean
  add: (input: ReminderInput, now: number) => string
  update: (id: string, input: ReminderInput, now: number) => void
  remove: (id: string) => void
  toggleGift: (id: string, giftId: string) => void
  addGift: (id: string, text: string, now: number) => void
  removeGift: (id: string, giftId: string) => void
  /** Marks alerts as rung and drops their snoozes. */
  markRung: (keys: readonly string[]) => void
  snooze: (alert: ReminderAlert, minutes: number, now: number) => void
  setMuted: (muted: boolean) => void
  setShowHolidays: (show: boolean) => void
  reset: () => void
}

const initial = () => ({
  reminders: seedReminders.map((reminder) => structuredClone(reminder)),
  handled: [] as string[],
  snoozes: [] as SnoozedAlert[],
  muted: false,
  showHolidays: true,
})

const mapReminder = (reminders: Reminder[], id: string, change: (reminder: Reminder) => Reminder) =>
  reminders.map((reminder) => (reminder.id === id ? change(reminder) : reminder))

type Persisted = Pick<
  RemindersState,
  'reminders' | 'handled' | 'snoozes' | 'muted' | 'showHolidays'
>

/** Whatever was stored, a state the pages can trust. */
export function cleanPersisted(value: unknown): Persisted {
  const raw = (value ?? {}) as Partial<Record<keyof Persisted, unknown>>
  const fresh = initial()
  return {
    reminders: Array.isArray(raw.reminders)
      ? raw.reminders
          .map(sanitizeReminder)
          .filter((reminder): reminder is Reminder => reminder !== null)
      : fresh.reminders,
    handled: Array.isArray(raw.handled)
      ? raw.handled.filter((key): key is string => typeof key === 'string').slice(-HANDLED_LIMIT)
      : [],
    snoozes: Array.isArray(raw.snoozes)
      ? raw.snoozes.filter(
          (entry): entry is SnoozedAlert =>
            Boolean(entry) &&
            typeof (entry as SnoozedAlert).key === 'string' &&
            typeof (entry as SnoozedAlert).until === 'number',
        )
      : [],
    muted: raw.muted === true,
    showHolidays: raw.showHolidays !== false,
  }
}

export const useRemindersStore = create<RemindersState>()(
  persist(
    (set, get) => ({
      ...initial(),
      add: (input, now) => {
        const reminder = applyInput(input, now)
        set(({ reminders }) => ({ reminders: [...reminders, reminder] }))
        return reminder.id
      },
      update: (id, input, now) =>
        set(({ reminders }) => ({
          reminders: mapReminder(reminders, id, (reminder) => applyInput(input, now, reminder)),
        })),
      remove: (id) =>
        set(({ reminders, snoozes }) => ({
          reminders: reminders.filter((reminder) => reminder.id !== id),
          snoozes: snoozes.filter((entry) => entry.reminderId !== id),
        })),
      toggleGift: (id, giftId) =>
        set(({ reminders }) => ({
          reminders: mapReminder(reminders, id, (reminder) => ({
            ...reminder,
            gifts: reminder.gifts.map((gift) =>
              gift.id === giftId ? { ...gift, done: !gift.done } : gift,
            ),
          })),
        })),
      addGift: (id, text, now) => {
        const trimmed = text.trim()
        if (!trimmed) return
        set(({ reminders }) => ({
          reminders: mapReminder(reminders, id, (reminder) => ({
            ...reminder,
            gifts: [...reminder.gifts, { id: `g-${now.toString(36)}`, text: trimmed, done: false }],
          })),
        }))
      },
      removeGift: (id, giftId) =>
        set(({ reminders }) => ({
          reminders: mapReminder(reminders, id, (reminder) => ({
            ...reminder,
            gifts: reminder.gifts.filter((gift) => gift.id !== giftId),
          })),
        })),
      markRung: (keys) => {
        if (keys.length === 0) return
        const { handled, snoozes } = get()
        set({
          handled: [...new Set([...handled, ...keys])].slice(-HANDLED_LIMIT),
          snoozes: snoozes.filter((entry) => !keys.includes(entry.key)),
        })
      },
      snooze: (alert, minutes, now) =>
        set(({ snoozes }) => ({
          snoozes: [
            ...snoozes.filter((entry) => entry.key !== alert.key),
            { ...alert, until: now + minutes * 60_000 },
          ],
        })),
      setMuted: (muted) => set({ muted }),
      setShowHolidays: (showHolidays) => set({ showHolidays }),
      reset: () => set(initial()),
    }),
    {
      name: remindersStorageKey,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ reminders, handled, snoozes, muted, showHolidays }) => ({
        reminders,
        handled,
        snoozes,
        muted,
        showHolidays,
      }),
      migrate: (persisted) => cleanPersisted(persisted),
      merge: (persisted, current) => ({ ...current, ...cleanPersisted(persisted) }),
    },
  ),
)

/** The reminders the lists, the calendar and the alarms work with. */
export function visibleReminders(reminders: readonly Reminder[], showHolidays: boolean) {
  return showHolidays ? [...reminders] : reminders.filter((reminder) => !reminder.builtin)
}
