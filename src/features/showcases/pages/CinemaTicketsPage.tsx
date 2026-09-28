import { QrcodeOutlined } from '@ant-design/icons'
import { App, Button, Empty, Flex, Modal, Popconfirm, Tabs, Tag, Tooltip, Typography } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { CinemaETicket } from '@/features/showcases/components/CinemaETicket'
import { CinemaPoster } from '@/features/showcases/components/CinemaPoster'
import { CinemaSiteShell } from '@/features/showcases/components/CinemaSiteShell'
import {
  cinemaPaths,
  findCinema,
  findHall,
  findMovie,
  showtimeStart,
} from '@/features/showcases/data/cinema'
import { canCancel, formatMoney, type CinemaBooking } from '@/features/showcases/data/cinemaBooking'
import { useCinemaText } from '@/features/showcases/data/cinemaCopy'
import { useCinemaNow } from '@/features/showcases/hooks/useCinemaNow'
import { useCinemaTickets } from '@/features/showcases/hooks/useCinemaTickets'

interface CinemaTicketsPageProps {
  standalone?: boolean
}

export function CinemaTicketsPage({ standalone = false }: CinemaTicketsPageProps) {
  const { text, language } = useCinemaText()
  const t = text.tickets
  const { message } = App.useApp()
  const navigate = useNavigate()
  const paths = cinemaPaths(standalone)
  const now = dayjs(useCinemaNow())
  const bookings = useCinemaTickets((state) => state.bookings)
  const cancelBooking = useCinemaTickets((state) => state.cancelBooking)
  const [shown, setShown] = useState<CinemaBooking | null>(null)
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  const byStart = (a: CinemaBooking, b: CinemaBooking) =>
    showtimeStart(a).valueOf() - showtimeStart(b).valueOf()
  const upcoming = bookings
    .filter((booking) => !booking.cancelledAt && showtimeStart(booking).isAfter(now))
    .sort(byStart)
  const past = bookings
    .filter((booking) => booking.cancelledAt || !showtimeStart(booking).isAfter(now))
    .sort((a, b) => byStart(b, a))

  const card = (booking: CinemaBooking) => {
    const movie = findMovie(booking.movieId)
    const cinema = findCinema(booking.cinemaId)
    const hall = findHall(booking.hallId)
    const start = showtimeStart(booking).locale(language)
    const isUpcoming = !booking.cancelledAt && start.isAfter(now)
    const cancellable = isUpcoming && canCancel(start, now)

    return (
      <li
        key={booking.code}
        className={`cinema-booking-card${booking.cancelledAt ? ' is-cancelled' : ''}`}
      >
        {movie && (
          <Link to={paths.movie(movie.id)} tabIndex={-1} className="cinema-booking-card__poster">
            <CinemaPoster movie={movie} showTitle={false} />
          </Link>
        )}
        <div className="cinema-booking-card__body">
          <Flex gap={8} align="center" wrap>
            <Typography.Title level={4}>{movie?.title[language]}</Typography.Title>
            {booking.cancelledAt ? (
              <Tag variant="filled" color="red">
                {t.cancelled}
              </Tag>
            ) : (
              !isUpcoming && (
                <Tag variant="filled" color="green">
                  {t.watched}
                </Tag>
              )
            )}
          </Flex>
          <Typography.Text>
            <strong>{start.format('ddd, D MMMM')}</strong> · {booking.time}
          </Typography.Text>
          <Typography.Text type="secondary">
            {cinema?.name} · {hall ? text.hall(hall.number) : ''} · {booking.format} ·{' '}
            {text.audio[booking.audio]}
          </Typography.Text>
          <Typography.Text type="secondary">
            {text.ticket.seats}: {booking.lines.map((line) => line.seatId).join(', ')} · {t.total}:{' '}
            {formatMoney(booking.total, language)}
          </Typography.Text>
          <Typography.Text type="secondary" className="cinema-booking-card__code">
            {text.ticket.code}: <strong>{booking.code}</strong>
          </Typography.Text>
        </div>
        <Flex vertical gap={8} className="cinema-booking-card__actions">
          {!booking.cancelledAt && (
            <Button icon={<QrcodeOutlined aria-hidden="true" />} onClick={() => setShown(booking)}>
              {t.show}
            </Button>
          )}
          {isUpcoming &&
            (cancellable ? (
              <Popconfirm
                title={t.cancelConfirm}
                description={t.cancelText(formatMoney(booking.total, language))}
                okText={t.cancel}
                cancelText={t.keep}
                okButtonProps={{ danger: true }}
                onConfirm={() => {
                  cancelBooking(booking.code)
                  void message.success(t.cancelDone)
                }}
              >
                <Button danger>{t.cancel}</Button>
              </Popconfirm>
            ) : (
              <Tooltip title={t.cancelClosed}>
                <Button danger disabled>
                  {t.cancel}
                </Button>
              </Tooltip>
            ))}
        </Flex>
      </li>
    )
  }

  const list = (items: CinemaBooking[]) =>
    items.length === 0 ? (
      <Empty description={t.empty} className="cinema-empty">
        <Button type="primary" onClick={() => navigate(paths.root)}>
          {t.browse}
        </Button>
      </Empty>
    ) : (
      <ul className="cinema-booking-list">{items.map(card)}</ul>
    )

  return (
    <CinemaSiteShell standalone={standalone} page="tickets">
      <div className="showcase-section cinema-tickets">
        <Typography.Title>{t.title}</Typography.Title>
        <Typography.Paragraph type="secondary">{t.lead}</Typography.Paragraph>
        <Tabs
          activeKey={tab}
          onChange={(key) => setTab(key as 'upcoming' | 'past')}
          items={[
            {
              key: 'upcoming',
              label: `${t.upcoming} (${upcoming.length})`,
              children: list(upcoming),
            },
            { key: 'past', label: `${t.past} (${past.length})`, children: list(past) },
          ]}
        />
      </div>

      <Modal
        open={shown !== null}
        onCancel={() => setShown(null)}
        footer={null}
        width={720}
        title={t.show}
        destroyOnHidden
      >
        {shown && <CinemaETicket booking={shown} />}
      </Modal>
    </CinemaSiteShell>
  )
}
