import {
  BellOutlined,
  CheckOutlined,
  CoffeeOutlined,
  CrownOutlined,
  PlayCircleFilled,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { App, Button, Empty, Flex, Segmented, Select, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { MovieMeta, TrailerModal } from '@/features/showcases/components/CinemaMovieBits'
import { CinemaPoster } from '@/features/showcases/components/CinemaPoster'
import {
  CinemaDateStrip,
  CinemaShowtimeGroups,
} from '@/features/showcases/components/CinemaShowtimes'
import { CinemaSiteShell } from '@/features/showcases/components/CinemaSiteShell'
import {
  cinemaPaths,
  cinemas,
  comingSoon,
  formats,
  isBookable,
  matchesFilters,
  movies,
  opensOn,
  saleDates,
  scheduleFor,
  type AudioFilter,
  type Format,
  type Movie,
} from '@/features/showcases/data/cinema'
import { useCinemaText } from '@/features/showcases/data/cinemaCopy'
import { useCinemaNow } from '@/features/showcases/hooks/useCinemaNow'

interface CinemaHomePageProps {
  standalone?: boolean
}

const audioFilters: AudioFilter[] = ['all', 'turkish', 'subtitled']

export function CinemaHomePage({ standalone = false }: CinemaHomePageProps) {
  const { text, language } = useCinemaText()
  const { message } = App.useApp()
  const paths = cinemaPaths(standalone)
  const now = useCinemaNow()
  const today = dayjs(now)
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [trailer, setTrailer] = useState<Movie | null>(null)
  const [reminders, setReminders] = useState<string[]>([])

  const dates = saleDates(today)
  const date = dates.includes(params.get('date') ?? '') ? params.get('date')! : dates[0]!
  const cinema = cinemas.some((item) => item.id === params.get('cinema'))
    ? params.get('cinema')!
    : 'all'
  const chosenFormats = (params.get('format') ?? '')
    .split(',')
    .filter((value): value is Format => formats.includes(value as Format))
  const audio = audioFilters.includes(params.get('audio') as AudioFilter)
    ? (params.get('audio') as AudioFilter)
    : 'all'

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === '' || value === 'all') next.delete(key)
      else next.set(key, value)
    }
    setParams(next, { replace: true })
  }

  const dayDate = today.format('YYYY-MM-DD')
  const schedule = scheduleFor(date, dayjs(dayDate))
  const filtered = schedule.filter(
    (show) =>
      matchesFilters(show, { cinema, formats: chosenFormats, audio }) && isBookable(show, today),
  )
  const films = movies
    .map((movie) => ({ movie, shows: filtered.filter((show) => show.movieId === movie.id) }))
    .filter(({ shows }) => shows.length > 0)
  const filtersOn = cinema !== 'all' || chosenFormats.length > 0 || audio !== 'all'
  const dayOver = date === dates[0] && !schedule.some((show) => isBookable(show, today))

  const featured = movies.find((movie) => movie.featured) ?? movies[0]!
  const soon = comingSoon(today)

  const toggleFormat = (format: Format, checked: boolean) => {
    const next = checked
      ? [...chosenFormats, format]
      : chosenFormats.filter((item) => item !== format)
    update({ format: next.join(',') })
  }

  return (
    <CinemaSiteShell standalone={standalone} page="home">
      <section
        className="cinema-hero"
        style={{
          background: `radial-gradient(circle at 78% 30%, ${featured.poster.colors[1]}cc, transparent 55%), linear-gradient(120deg, #0b0b12 30%, ${featured.poster.colors[0]})`,
        }}
      >
        <div className="cinema-hero__inner">
          <div className="cinema-hero__copy">
            <Tag variant="solid" color="#d1204f">
              {text.home.featured}
            </Tag>
            <Typography.Title>{featured.title[language]}</Typography.Title>
            <Typography.Paragraph className="cinema-hero__tagline">
              {featured.tagline[language]}
            </Typography.Paragraph>
            <MovieMeta movie={featured} />
            <Flex gap={12} wrap className="cinema-hero__actions">
              <Button
                type="primary"
                size="large"
                onClick={() => navigate(paths.movie(featured.id))}
              >
                {text.home.getTickets}
              </Button>
              <Button
                size="large"
                ghost
                icon={<PlayCircleFilled aria-hidden="true" />}
                onClick={() => setTrailer(featured)}
              >
                {text.home.trailer}
              </Button>
            </Flex>
          </div>
          <CinemaPoster movie={featured} className="cinema-hero__poster" />
        </div>
      </section>

      <section className="showcase-section cinema-program" id="cinema-showtimes">
        <Typography.Title level={2}>{text.home.showtimes}</Typography.Title>
        <CinemaDateStrip
          dates={dates}
          value={date}
          onChange={(value) => update({ date: value === dates[0] ? null : value })}
          label={text.home.dateLabel}
        />

        <Flex gap={12} wrap align="center" className="cinema-filters">
          <Select
            value={cinema}
            onChange={(value) => update({ cinema: value })}
            aria-label={text.home.cinema}
            className="cinema-filters__cinema"
            options={[
              { value: 'all', label: text.home.allCinemas },
              ...cinemas.map((item) => ({ value: item.id, label: item.name })),
            ]}
          />
          <fieldset className="cinema-filters__formats">
            <legend className="cinema-sr-only">{text.home.format}</legend>
            {formats.map((format) => (
              <Tag.CheckableTag
                key={format}
                checked={chosenFormats.includes(format)}
                onChange={(checked) => toggleFormat(format, checked)}
                className="cinema-filters__format"
              >
                {format}
              </Tag.CheckableTag>
            ))}
          </fieldset>
          <Segmented<AudioFilter>
            value={audio}
            onChange={(value) => update({ audio: value })}
            aria-label={text.home.language}
            options={audioFilters.map((value) => ({ value, label: text.audioFilter[value] }))}
          />
        </Flex>

        {films.length === 0 ? (
          <Empty
            className="cinema-empty"
            description={dayOver ? text.home.noShowsToday : text.home.noShows}
          >
            {dayOver ? (
              <Button type="primary" onClick={() => update({ date: dates[1]! })}>
                {text.home.seeTomorrow}
              </Button>
            ) : (
              filtersOn && (
                <Button onClick={() => update({ cinema: null, format: null, audio: null })}>
                  {text.home.clearFilters}
                </Button>
              )
            )}
          </Empty>
        ) : (
          <ul className="cinema-films">
            {films.map(({ movie, shows }) => (
              <li key={movie.id} className="cinema-film">
                <Link to={paths.movie(movie.id)} className="cinema-film__poster" tabIndex={-1}>
                  <CinemaPoster movie={movie} />
                </Link>
                <div className="cinema-film__body">
                  <Link to={paths.movie(movie.id)} className="cinema-film__title">
                    <Typography.Title level={3}>{movie.title[language]}</Typography.Title>
                  </Link>
                  <MovieMeta movie={movie} />
                  <CinemaShowtimeGroups shows={shows} bookPath={paths.book} now={now} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="showcase-section cinema-soon" id="cinema-soon">
        <div className="showcase-section__heading">
          <Typography.Title level={2}>{text.home.soonTitle}</Typography.Title>
          <Typography.Paragraph type="secondary">{text.home.soonLead}</Typography.Paragraph>
        </div>
        <ul className="cinema-soon__grid">
          {soon.map((movie) => {
            const reminded = reminders.includes(movie.id)
            return (
              <li key={movie.id} className="cinema-soon__card">
                <Link to={paths.movie(movie.id)} tabIndex={-1}>
                  <CinemaPoster movie={movie} />
                </Link>
                <Link to={paths.movie(movie.id)}>
                  <Typography.Title level={4}>{movie.title[language]}</Typography.Title>
                </Link>
                <Typography.Text type="secondary">
                  {text.home.opens(opensOn(movie, today)!.locale(language).format('D MMMM'))}
                </Typography.Text>
                <Button
                  icon={
                    reminded ? (
                      <CheckOutlined aria-hidden="true" />
                    ) : (
                      <BellOutlined aria-hidden="true" />
                    )
                  }
                  aria-pressed={reminded}
                  onClick={() => {
                    if (reminded) return
                    setReminders((current) => [...current, movie.id])
                    void message.success(text.home.reminderSaved(movie.title[language]))
                  }}
                >
                  {reminded ? text.home.reminded : text.home.remind}
                </Button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="showcase-section cinema-perks">
        <Typography.Title level={2}>{text.home.perksTitle}</Typography.Title>
        <ul className="cinema-perks__grid">
          {text.home.perks.map(([title, body], index) => (
            <li key={title}>
              <span className="cinema-perks__icon" aria-hidden="true">
                {
                  [
                    <ThunderboltOutlined key="imax" />,
                    <CrownOutlined key="lounge" />,
                    <CoffeeOutlined key="snacks" />,
                  ][index]
                }
              </span>
              <Typography.Title level={4}>{title}</Typography.Title>
              <Typography.Paragraph type="secondary">{body}</Typography.Paragraph>
            </li>
          ))}
        </ul>
      </section>

      <TrailerModal movie={trailer} onClose={() => setTrailer(null)} />
    </CinemaSiteShell>
  )
}
