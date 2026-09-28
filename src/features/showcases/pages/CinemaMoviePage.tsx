import { ArrowLeftOutlined, PlayCircleFilled } from '@ant-design/icons'
import { Avatar, Button, Empty, Flex, Result, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { MovieMeta, TrailerModal } from '@/features/showcases/components/CinemaMovieBits'
import { CinemaPoster } from '@/features/showcases/components/CinemaPoster'
import {
  CinemaDateStrip,
  CinemaShowtimeGroups,
} from '@/features/showcases/components/CinemaShowtimes'
import { CinemaSiteShell } from '@/features/showcases/components/CinemaSiteShell'
import {
  cinemaPaths,
  findMovie,
  isBookable,
  opensOn,
  saleDates,
  scheduleFor,
  type Movie,
} from '@/features/showcases/data/cinema'
import { useCinemaText } from '@/features/showcases/data/cinemaCopy'
import { useCinemaNow } from '@/features/showcases/hooks/useCinemaNow'

interface CinemaMoviePageProps {
  standalone?: boolean
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

export function CinemaMoviePage({ standalone = false }: CinemaMoviePageProps) {
  const { movieId } = useParams()
  const { text, language } = useCinemaText()
  const navigate = useNavigate()
  const paths = cinemaPaths(standalone)
  const now = useCinemaNow()
  const today = dayjs(now)
  const [params, setParams] = useSearchParams()
  const [trailer, setTrailer] = useState<Movie | null>(null)
  const movie = findMovie(movieId)

  const dates = saleDates(today)
  const dayDate = today.format('YYYY-MM-DD')
  // The first day on sale with a showing left, unless the address names a day.
  const firstDay = dates.find((date) =>
    scheduleFor(date, dayjs(dayDate)).some(
      (show) => show.movieId === movieId && isBookable(show, today),
    ),
  )
  const date = dates.includes(params.get('date') ?? '')
    ? params.get('date')!
    : (firstDay ?? dates[0]!)
  const shows = scheduleFor(date, dayjs(dayDate)).filter((show) => show.movieId === movieId)

  if (!movie) {
    return (
      <CinemaSiteShell standalone={standalone} page="movie">
        <Result
          status="404"
          title={text.movie.notFound}
          subTitle={text.movie.notFoundText}
          extra={
            <Button type="primary" onClick={() => navigate(paths.root)}>
              {text.movie.back}
            </Button>
          }
        />
      </CinemaSiteShell>
    )
  }

  const opening = opensOn(movie, today)
  const notOnSale = opening !== null && !dates.includes(opening.format('YYYY-MM-DD'))
  const bookable = shows.filter((show) => isBookable(show, today))

  return (
    <CinemaSiteShell standalone={standalone} page="movie">
      <section
        className="cinema-movie-hero"
        style={{
          background: `linear-gradient(115deg, #0b0b12 35%, ${movie.poster.colors[0]} 80%, ${movie.poster.colors[1]})`,
        }}
      >
        <div className="cinema-movie-hero__inner">
          <CinemaPoster movie={movie} className="cinema-movie-hero__poster" />
          <div className="cinema-movie-hero__copy">
            <Link to={paths.root} className="cinema-back">
              <ArrowLeftOutlined aria-hidden="true" /> {text.movie.back}
            </Link>
            <Typography.Title>{movie.title[language]}</Typography.Title>
            <Typography.Paragraph className="cinema-hero__tagline">
              {movie.tagline[language]}
            </Typography.Paragraph>
            <MovieMeta movie={movie} />
            <Flex
              gap={6}
              wrap
              className="cinema-movie-hero__formats"
              aria-label={text.movie.formats}
            >
              {movie.formats.map((format) => (
                <Tag key={format} variant="outlined" className="cinema-format-tag">
                  {format}
                </Tag>
              ))}
            </Flex>
            {opening && (
              <Typography.Text className="cinema-movie-hero__opens">
                {text.home.opens(opening.locale(language).format('D MMMM YYYY'))}
              </Typography.Text>
            )}
          </div>
        </div>
      </section>

      <div className="showcase-section cinema-movie">
        <div className="cinema-movie__main">
          <section aria-labelledby="cinema-showtimes-title">
            <Typography.Title level={2} id="cinema-showtimes-title">
              {text.movie.showtimes}
            </Typography.Title>
            {notOnSale ? (
              <Empty description={text.movie.notYet(opening.locale(language).format('D MMMM'))} />
            ) : (
              <>
                <CinemaDateStrip
                  dates={dates}
                  value={date}
                  onChange={(value) => {
                    const next = new URLSearchParams(params)
                    next.set('date', value)
                    setParams(next, { replace: true })
                  }}
                  label={text.home.dateLabel}
                />
                {bookable.length === 0 ? (
                  <Empty description={text.movie.noShows} className="cinema-empty" />
                ) : (
                  <CinemaShowtimeGroups shows={shows} bookPath={paths.book} now={now} />
                )}
              </>
            )}
          </section>

          <section aria-labelledby="cinema-story-title">
            <Typography.Title level={2} id="cinema-story-title">
              {text.movie.synopsis}
            </Typography.Title>
            <Typography.Paragraph className="cinema-movie__synopsis">
              {movie.synopsis[language]}
            </Typography.Paragraph>
          </section>
        </div>

        <aside className="cinema-movie__side">
          <button
            type="button"
            className="cinema-trailer-thumb"
            onClick={() => setTrailer(movie)}
            aria-label={text.movie.play(movie.title[language])}
          >
            <CinemaPoster movie={movie} showTitle={false} className="cinema-trailer-thumb__art" />
            <span className="cinema-trailer-thumb__play" aria-hidden="true">
              <PlayCircleFilled />
            </span>
            <span className="cinema-trailer-thumb__label">{text.movie.trailer}</span>
          </button>

          <div className="cinema-credits">
            <Typography.Text type="secondary">{text.movie.director}</Typography.Text>
            <Typography.Text strong>{movie.director}</Typography.Text>
          </div>

          <div>
            <Typography.Title level={4}>{text.movie.cast}</Typography.Title>
            <ul className="cinema-cast">
              {movie.cast.map((person) => (
                <li key={person.name}>
                  <Avatar
                    size={44}
                    className="cinema-cast__avatar"
                    style={{ background: movie.poster.colors[1] }}
                  >
                    {initials(person.name)}
                  </Avatar>
                  <span>
                    <Typography.Text strong>{person.name}</Typography.Text>
                    <Typography.Text type="secondary">{person.role[language]}</Typography.Text>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <TrailerModal movie={trailer} onClose={() => setTrailer(null)} />
    </CinemaSiteShell>
  )
}
