import {
  ArrowRightOutlined,
  CalendarOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { Button, Col, Collapse, Flex, Form, Input, Row, Tag, Typography } from 'antd'
import type { CSSProperties } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { SpeakerAvatar, TrackTag } from '@/features/showcases/components/ConfParts'
import { ConfSiteShell } from '@/features/showcases/components/ConfSiteShell'
import {
  CONF_DAYS,
  CONF_TRACK_COLORS,
  CONF_TRACKS,
  confRoot,
  confSessions,
  confSpeakers,
  confSponsors,
  type ConfSponsor,
} from '@/features/showcases/data/confData'
import { CONF_STARTS_AT, countdownParts } from '@/features/showcases/data/confSchedule'
import {
  EARLY_BIRD_DEADLINE,
  formatLira,
  ticketTiers,
  tierState,
} from '@/features/showcases/data/confTickets'
import { useConfNow } from '@/features/showcases/hooks/useConfNow'
import { useConfText } from '@/features/showcases/hooks/useConfText'

interface EventHomePageProps {
  standalone?: boolean
}

const featured = [
  'ayse-korkmaz',
  'elif-sancak',
  'sofia-lindqvist',
  'emre-tas',
  'deniz-aydin',
  'marco-bellini',
  'hannah-okafor',
  'kerem-yildiz',
]

const tierOrder: ConfSponsor['tier'][] = ['platinum', 'gold', 'silver', 'community']

/** The conference's front page, counting down to the doors opening. */
export function EventHomePage({ standalone = false }: EventHomePageProps) {
  const { text, language } = useConfText()
  const root = confRoot(standalone)
  const navigate = useNavigate()
  const now = useConfNow(1000)
  const countdown = countdownParts(CONF_STARTS_AT, now)
  const [subscribed, setSubscribed] = useState(false)
  const lowest = Math.min(
    ...ticketTiers.filter((tier) => tierState(tier, now) === 'onSale').map((tier) => tier.price),
  )
  const earlyDaysLeft = Math.max(0, Math.ceil((EARLY_BIRD_DEADLINE - now) / 86_400_000))
  const home = text.home

  const units = [
    ['days', countdown.days],
    ['hours', countdown.hours],
    ['minutes', countdown.minutes],
    ['seconds', countdown.seconds],
  ] as const

  return (
    <ConfSiteShell
      standalone={standalone}
      title={{ en: 'Conference website', tr: 'Konferans sitesi' }}
      description={{
        en: 'A conference site with a live countdown, program, speakers and ticket checkout.',
        tr: 'Canlı geri sayım, program, konuşmacılar ve bilet satışı olan bir konferans sitesi.',
      }}
    >
      <section className="conf-hero">
        <div className="conf-hero__inner">
          <div className="conf-hero__copy">
            <Tag variant="filled" className="conf-hero__eyebrow" icon={<CalendarOutlined />}>
              {home.eyebrow}
            </Tag>
            <Typography.Title className="conf-hero__title">{home.title}</Typography.Title>
            <Typography.Paragraph className="conf-hero__description">
              {home.description}
            </Typography.Paragraph>
            <Flex gap={12} wrap>
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined aria-hidden="true" />}
                iconPlacement="end"
                onClick={() => void navigate(`${root}/tickets`)}
              >
                {home.tickets}
              </Button>
              <Button size="large" ghost onClick={() => void navigate(`${root}/schedule`)}>
                {home.program}
              </Button>
            </Flex>
          </div>

          <div className="conf-countdown" aria-live="off">
            <Typography.Text className="conf-countdown__label">
              {countdown.done ? home.countdownDone : home.countdownLabel}
            </Typography.Text>
            {!countdown.done && (
              <div className="conf-countdown__units" role="timer" aria-label={home.countdownLabel}>
                {units.map(([unit, value]) => (
                  <div key={unit} className="conf-countdown__unit">
                    <strong>{String(value).padStart(2, '0')}</strong>
                    <span>{home.units[unit]}</span>
                  </div>
                ))}
              </div>
            )}
            <Typography.Text className="conf-countdown__venue">
              <EnvironmentOutlined aria-hidden="true" /> Kıyı Hall · Karaköy
            </Typography.Text>
          </div>
        </div>

        <dl className="conf-stats">
          {home.stats.map(([value, label]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="showcase-section">
        <Flex justify="space-between" align="flex-end" gap={16} wrap className="conf-section-head">
          <div className="showcase-section__heading">
            <Typography.Title level={2}>{home.speakersTitle}</Typography.Title>
            <Typography.Paragraph type="secondary">{home.speakersText}</Typography.Paragraph>
          </div>
          <Button
            icon={<ArrowRightOutlined aria-hidden="true" />}
            iconPlacement="end"
            onClick={() => void navigate(`${root}/speakers`)}
          >
            {home.allSpeakers}
          </Button>
        </Flex>
        <Row gutter={[20, 20]}>
          {featured.map((id) => {
            const speaker = confSpeakers.find((entry) => entry.id === id)
            if (!speaker) return null
            return (
              <Col xs={12} md={8} lg={6} key={id}>
                <Link to={`${root}/speakers/${id}`} className="conf-speaker-tile">
                  <SpeakerAvatar speaker={speaker} size={88} />
                  <strong>{speaker.name}</strong>
                  <span>
                    {speaker.role[language]}, {speaker.company}
                  </span>
                </Link>
              </Col>
            )
          })}
        </Row>
      </section>

      <section className="conf-band">
        <div className="showcase-section">
          <div className="showcase-section__heading">
            <Typography.Title level={2}>{home.tracksTitle}</Typography.Title>
            <Typography.Paragraph type="secondary">{home.tracksText}</Typography.Paragraph>
          </div>
          <Row gutter={[20, 20]}>
            {CONF_TRACKS.map((track) => {
              const count = confSessions.filter((session) => session.track === track).length
              return (
                <Col xs={24} sm={12} lg={6} key={track}>
                  <Link
                    to={`${root}/schedule?track=${track}`}
                    className="conf-track-card"
                    style={{ '--conf-track': CONF_TRACK_COLORS[track] } as CSSProperties}
                  >
                    <TrackTag track={track} />
                    <Typography.Paragraph>{home.trackText[track]}</Typography.Paragraph>
                    <Typography.Text type="secondary">{home.sessionCount(count)}</Typography.Text>
                  </Link>
                </Col>
              )
            })}
          </Row>
        </div>
      </section>

      <section className="showcase-section">
        <div className="showcase-section__heading">
          <Typography.Title level={2}>{home.scheduleTitle}</Typography.Title>
          <Typography.Paragraph type="secondary">{home.scheduleText}</Typography.Paragraph>
        </div>
        <ol className="conf-days-teaser">
          {CONF_DAYS.map((day) => (
            <li key={day.index}>
              <Link to={`${root}/schedule?day=${day.index}`}>
                <span className="conf-days-teaser__date">{text.days[day.index]?.short}</span>
                <strong>{text.days[day.index]?.name}</strong>
                <span>{home.dayHighlights[day.index]}</span>
                <span className="conf-days-teaser__count">
                  {home.sessionCount(
                    confSessions.filter((s) => s.day === day.index && s.format !== 'break').length,
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <Link to={`${root}/schedule`} className="conf-more-link">
          {home.fullProgram} <ArrowRightOutlined aria-hidden="true" />
        </Link>
      </section>

      <section className="conf-band conf-band--venue">
        <div className="showcase-section conf-venue">
          <div>
            <Typography.Title level={2}>{home.venueTitle}</Typography.Title>
            <Typography.Paragraph>{home.venueText}</Typography.Paragraph>
            <dl className="conf-venue__travel">
              {home.travel.map(([title, detail]) => (
                <div key={title}>
                  <dt>{title}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
            <Button
              icon={<CompassOutlined aria-hidden="true" />}
              href="https://www.openstreetmap.org/#map=17/41.0226/28.9775"
              target="_blank"
              rel="noreferrer"
            >
              {home.directions}
            </Button>
          </div>
          <svg className="conf-venue__map" viewBox="0 0 400 300" aria-hidden="true">
            <rect width="400" height="300" rx="24" className="conf-map__land" />
            <path
              d="M0 200 C80 170 150 230 230 200 S360 150 400 170 L400 300 L0 300 Z"
              className="conf-map__water"
            />
            <path d="M40 120 L360 90" className="conf-map__road" />
            <path d="M120 40 L160 260" className="conf-map__road" />
            <path d="M260 30 L240 210" className="conf-map__tram" />
            <circle cx="248" cy="130" r="7" className="conf-map__stop" />
            <text x="262" y="126" className="conf-map__label">
              T1
            </text>
            <rect x="286" y="206" width="36" height="12" rx="4" className="conf-map__pier" />
            <circle cx="200" cy="150" r="30" className="conf-map__pulse" />
            <circle cx="200" cy="150" r="12" className="conf-map__pin" />
            <text x="200" y="104" textAnchor="middle" className="conf-map__venue">
              Kıyı Hall
            </text>
          </svg>
        </div>
      </section>

      <section className="showcase-section">
        <Flex justify="space-between" align="flex-end" gap={16} wrap className="conf-section-head">
          <Typography.Title level={2}>{home.sponsorsTitle}</Typography.Title>
          <Button href="mailto:sponsors@relaysummit.example">{home.becomeSponsor}</Button>
        </Flex>
        {tierOrder.map((tier) => (
          <div key={tier} className={`conf-sponsors conf-sponsors--${tier}`}>
            <Typography.Text type="secondary" className="conf-sponsors__tier">
              {home.tiers[tier]}
            </Typography.Text>
            <ul>
              {confSponsors
                .filter((sponsor) => sponsor.tier === tier)
                .map((sponsor) => (
                  <li key={sponsor.name}>{sponsor.name}</li>
                ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="showcase-section">
        <div className="conf-ticket-teaser">
          <div>
            <Typography.Title level={2}>{home.ticketsTitle}</Typography.Title>
            <Typography.Paragraph>{home.ticketsText(earlyDaysLeft)}</Typography.Paragraph>
          </div>
          <Flex vertical align="flex-start" gap={12}>
            <Typography.Text className="conf-ticket-teaser__price">
              <span>{home.ticketsFrom}</span> {formatLira(lowest, text.locale)}
            </Typography.Text>
            <Button
              size="large"
              icon={<ArrowRightOutlined aria-hidden="true" />}
              iconPlacement="end"
              onClick={() => void navigate(`${root}/tickets`)}
            >
              {home.tickets}
            </Button>
          </Flex>
        </div>
      </section>

      <section className="showcase-section conf-faq">
        <Typography.Title level={2}>{home.faqTitle}</Typography.Title>
        <Collapse
          accordion
          items={home.faq.map(([question, answer]) => ({
            key: question,
            label: question,
            children: <Typography.Paragraph>{answer}</Typography.Paragraph>,
          }))}
        />
      </section>

      <section className="showcase-section">
        <div className="conf-newsletter" aria-live="polite">
          <div>
            <Typography.Title level={3}>{home.newsletterTitle}</Typography.Title>
            <Typography.Text>{home.newsletterText}</Typography.Text>
          </div>
          {subscribed ? (
            <Typography.Text strong className="conf-newsletter__done">
              {home.newsletterDone}
            </Typography.Text>
          ) : (
            <Form
              layout="inline"
              className="conf-newsletter__form"
              onFinish={() => setSubscribed(true)}
              requiredMark={false}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, type: 'email', message: home.newsletterInvalid }]}
              >
                <Input
                  type="email"
                  aria-label={home.newsletterPlaceholder}
                  placeholder={home.newsletterPlaceholder}
                />
              </Form.Item>
              <Button type="primary" htmlType="submit" icon={<SendOutlined aria-hidden="true" />}>
                {home.newsletterButton}
              </Button>
            </Form>
          )}
        </div>
      </section>
    </ConfSiteShell>
  )
}
