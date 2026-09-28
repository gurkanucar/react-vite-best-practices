import { QRCode, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { CinemaPoster } from '@/features/showcases/components/CinemaPoster'
import { findCinema, findHall, findMovie } from '@/features/showcases/data/cinema'
import {
  concessions,
  ticketPayload,
  type CinemaBooking,
} from '@/features/showcases/data/cinemaBooking'
import { useCinemaText } from '@/features/showcases/data/cinemaCopy'

interface CinemaETicketProps {
  booking: CinemaBooking
}

/** The ticket as the door sees it: the film, where and when, the seats and a code to scan. */
export function CinemaETicket({ booking }: CinemaETicketProps) {
  const { text, language } = useCinemaText()
  const movie = findMovie(booking.movieId)
  const cinema = findCinema(booking.cinemaId)
  const hall = findHall(booking.hallId)
  const snacks = concessions.filter((item) => (booking.snacks[item.id] ?? 0) > 0)
  const t = text.ticket

  const facts = [
    [t.date, dayjs(booking.date).locale(language).format('ddd, D MMMM YYYY')],
    [t.time, booking.time],
    [t.cinema, cinema?.name ?? '—'],
    [t.hall, hall ? `${text.hall(hall.number)} · ${booking.format}` : booking.format],
    [t.seats, booking.lines.map((line) => line.seatId).join(', ')],
  ]

  return (
    <article className="cinema-eticket" aria-label={`${t.code} ${booking.code}`}>
      <div className="cinema-eticket__main">
        <div className="cinema-eticket__film">
          {movie && (
            <CinemaPoster movie={movie} showTitle={false} className="cinema-eticket__poster" />
          )}
          <div>
            <Typography.Title level={4}>{movie?.title[language]}</Typography.Title>
            <Tag variant="filled">{text.audio[booking.audio]}</Tag>
            {movie && <Tag variant="filled">{text.rating[movie.rating]}</Tag>}
          </div>
        </div>
        <dl className="cinema-eticket__facts">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
          {snacks.length > 0 && (
            <div className="cinema-eticket__wide">
              <dt>{t.snacks}</dt>
              <dd>
                {snacks
                  .map((item) => `${booking.snacks[item.id]} × ${item.name[language]}`)
                  .join(', ')}
              </dd>
            </div>
          )}
        </dl>
      </div>
      <div className="cinema-eticket__stub">
        <figure className="cinema-eticket__qr" aria-label={t.qrLabel(booking.code)}>
          <QRCode value={ticketPayload(booking)} size={132} bordered={false} type="svg" />
        </figure>
        <Typography.Text type="secondary" className="cinema-eticket__code-label">
          {t.code}
        </Typography.Text>
        <Typography.Text strong copyable className="cinema-eticket__code">
          {booking.code}
        </Typography.Text>
        <Typography.Text type="secondary" className="cinema-eticket__scan">
          {t.scan}
        </Typography.Text>
      </div>
    </article>
  )
}
