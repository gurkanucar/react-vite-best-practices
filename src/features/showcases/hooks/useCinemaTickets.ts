import dayjs, { type Dayjs } from 'dayjs'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { findHall, scheduleFor, showtimeId, type Showtime } from '@/features/showcases/data/cinema'
import {
  createBooking,
  quoteBooking,
  seatMapFor,
  type CinemaBooking,
} from '@/features/showcases/data/cinemaBooking'

export const cinemaStorageKey = 'rvbp-cinema'

interface CinemaState {
  bookings: CinemaBooking[]
  addBooking: (booking: CinemaBooking) => void
  cancelBooking: (code: string) => void
  reset: () => void
}

function exampleBooking(
  show: Showtime,
  seats: string[],
  snacks: Record<string, number>,
  bookedAt: Dayjs,
): CinemaBooking {
  const quote = quoteBooking(show, seatMapFor(show), seats, {}, snacks)
  return createBooking(show, quote, snacks, 'you@example.com', bookedAt)
}

/**
 * Two bookings so the page is never empty: one for tomorrow evening, one already watched.
 * They are dated from the moment the store is created, like the other showcases' seeds.
 */
export function createInitialCinemaBookings(now: Dayjs = dayjs()): CinemaBooking[] {
  const tomorrow = now.add(1, 'day').format('YYYY-MM-DD')
  // A lounge has five rows; the example seats are in row F.
  const evening = scheduleFor(tomorrow, now).filter(
    (show) => show.time >= '18:00' && findHall(show.hallId)?.layout !== 'lounge',
  )
  const upcomingShow =
    evening.find((show) => show.movieId === 'northern-drift') ?? evening[0] ?? null

  const pastDate = now.subtract(9, 'day').format('YYYY-MM-DD')
  const pastHall = findHall('kizilay-2')!
  const pastShow: Showtime = {
    id: showtimeId(pastHall.id, pastDate, '20:15'),
    movieId: 'last-ferry',
    cinemaId: pastHall.cinemaId,
    hallId: pastHall.id,
    date: pastDate,
    time: '20:15',
    format: pastHall.format,
    audio: 'turkish',
  }

  return [
    ...(upcomingShow
      ? [
          exampleBooking(
            upcomingShow,
            ['F9', 'F10'],
            { 'popcorn-menu': 1 },
            now.subtract(2, 'hour'),
          ),
        ]
      : []),
    exampleBooking(pastShow, ['E5', 'E6'], { 'couple-menu': 1 }, now.subtract(10, 'day')),
  ]
}

export const useCinemaTickets = create<CinemaState>()(
  persist(
    (set) => ({
      bookings: createInitialCinemaBookings(),
      addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),
      cancelBooking: (code) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.code === code ? { ...booking, cancelledAt: dayjs().toISOString() } : booking,
          ),
        })),
      reset: () => set({ bookings: createInitialCinemaBookings() }),
    }),
    {
      name: cinemaStorageKey,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ bookings }) => ({ bookings }),
      // Anything saved before this shape existed is replaced by a fresh seed.
      migrate: (persisted, version) =>
        version < 1 || !Array.isArray((persisted as { bookings?: unknown }).bookings)
          ? { bookings: createInitialCinemaBookings() }
          : (persisted as { bookings: CinemaBooking[] }),
    },
  ),
)
