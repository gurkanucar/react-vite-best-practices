import { Flex, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { Link } from 'react-router'
import { groupShowings, isBookable, type Showtime } from '@/features/showcases/data/cinema'
import { isMatinee, occupancyRate } from '@/features/showcases/data/cinemaBooking'
import { useCinemaText } from '@/features/showcases/data/cinemaCopy'

interface DateStripProps {
  dates: string[]
  value: string
  onChange: (date: string) => void
  label: string
}

/** The seven days on sale, as a row of day buttons that scrolls sideways on a phone. */
export function CinemaDateStrip({ dates, value, onChange, label }: DateStripProps) {
  const { text, language } = useCinemaText()
  const today = dayjs().format('YYYY-MM-DD')
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')

  return (
    <fieldset className="cinema-dates">
      <legend className="cinema-sr-only">{label}</legend>
      {dates.map((date) => {
        const day = dayjs(date).locale(language)
        const name =
          date === today ? text.today : date === tomorrow ? text.tomorrow : day.format('ddd')
        return (
          <button
            key={date}
            type="button"
            className={`cinema-date${date === value ? ' is-active' : ''}`}
            aria-pressed={date === value}
            onClick={() => onChange(date)}
          >
            <span className="cinema-date__name">{name}</span>
            <span className="cinema-date__day">{day.format('D')}</span>
            <span className="cinema-date__month">{day.format('MMM')}</span>
          </button>
        )
      })}
    </fieldset>
  )
}

interface ShowtimeGroupsProps {
  shows: Showtime[]
  bookPath: (showtimeId: string) => string
  now: number
}

/** A film's showings on one day: one line per hall, with its format and each start time. */
export function CinemaShowtimeGroups({ shows, bookPath, now }: ShowtimeGroupsProps) {
  const { text } = useCinemaText()
  const current = dayjs(now)
  const open = shows.filter((show) => isBookable(show, current))

  return (
    <div className="cinema-showings">
      {groupShowings(open).map(({ cinema, hall, shows: inHall }) => (
        <div key={hall.id} className="cinema-showings__hall">
          <Flex align="center" gap={8} wrap className="cinema-showings__head">
            <Typography.Text strong>{cinema.name}</Typography.Text>
            <Typography.Text type="secondary">{text.hall(hall.number)}</Typography.Text>
            <Tag
              variant="filled"
              color={
                hall.format === 'IMAX' ? 'magenta' : hall.format === '3D' ? 'purple' : 'default'
              }
            >
              {hall.format}
            </Tag>
            {hall.layout === 'lounge' && (
              <Tag variant="filled" color="gold">
                Lounge
              </Tag>
            )}
          </Flex>
          <div className="cinema-times">
            {inHall.map((show) => {
              const full = occupancyRate(show, current) > 0.8
              return (
                <Link key={show.id} to={bookPath(show.id)} className="cinema-time">
                  <strong>{show.time}</strong>
                  <span>{text.audio[show.audio]}</span>
                  {isMatinee(show) && (
                    <span className="cinema-time__flag">{text.home.matinee}</span>
                  )}
                  {full && (
                    <span className="cinema-time__flag cinema-time__flag--full">
                      {text.home.almostFull}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
