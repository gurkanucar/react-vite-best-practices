import { Col, Empty, Flex, Input, Row, Segmented, Typography } from 'antd'
import { Link, useSearchParams } from 'react-router'
import { SpeakerAvatar, TrackTag } from '@/features/showcases/components/ConfParts'
import { ConfSiteShell } from '@/features/showcases/components/ConfSiteShell'
import {
  CONF_TRACKS,
  confRoot,
  confSpeakers,
  sessionsBySpeaker,
  type ConfTrack,
} from '@/features/showcases/data/confData'
import { useConfText } from '@/features/showcases/hooks/useConfText'

interface EventSpeakersPageProps {
  standalone?: boolean
}

const fold = (value: string) =>
  value
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i')

/** Every speaker, searchable by name or company and narrowed by track, both in the address. */
export function EventSpeakersPage({ standalone = false }: EventSpeakersPageProps) {
  const { text, language } = useConfText()
  const root = confRoot(standalone)
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const trackParam = params.get('track')
  const track = CONF_TRACKS.includes(trackParam as ConfTrack) ? (trackParam as ConfTrack) : 'all'

  const set = (key: string, value: string) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        if (value === '' || value === 'all') next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true },
    )

  const words = fold(query).split(/\s+/).filter(Boolean)
  const speakers = confSpeakers.filter((speaker) => {
    if (track !== 'all' && speaker.track !== track) return false
    const haystack = fold(
      `${speaker.name} ${speaker.company} ${speaker.role.en} ${speaker.role.tr}`,
    )
    return words.every((word) => haystack.includes(word))
  })

  return (
    <ConfSiteShell
      standalone={standalone}
      title={{ en: 'Conference speakers', tr: 'Konferans konuşmacıları' }}
      description={{
        en: 'Speaker grid with search and a track filter, each linking to a profile with their sessions.',
        tr: 'Arama ve kulvar filtreli konuşmacı listesi; her biri oturumlarını gösteren profile gider.',
      }}
    >
      <section className="showcase-section conf-page-head">
        <Typography.Title>{text.speakers.title}</Typography.Title>
        <Typography.Paragraph type="secondary">{text.speakers.description}</Typography.Paragraph>
      </section>

      <section className="showcase-section conf-speakers">
        <Flex gap={12} wrap align="center" className="conf-filters">
          <Input.Search
            allowClear
            aria-label={text.speakers.search}
            placeholder={text.speakers.search}
            defaultValue={query}
            onChange={(event) => set('q', event.target.value)}
            className="conf-filters__search"
          />
          <div className="conf-segmented-scroll">
            <Segmented<ConfTrack | 'all'>
              value={track}
              onChange={(value) => set('track', value)}
              options={[
                { value: 'all', label: text.speakers.allTracks },
                ...CONF_TRACKS.map((value) => ({ value, label: text.tracks[value] })),
              ]}
            />
          </div>
          <Typography.Text type="secondary">{text.speakers.count(speakers.length)}</Typography.Text>
        </Flex>

        {speakers.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={text.speakers.empty} />
        ) : (
          <Row gutter={[20, 20]}>
            {speakers.map((speaker) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={speaker.id}>
                <Link to={`${root}/speakers/${speaker.id}`} className="conf-speaker-card">
                  <SpeakerAvatar speaker={speaker} size={72} />
                  <div className="conf-speaker-card__text">
                    <strong>{speaker.name}</strong>
                    <span>
                      {speaker.role[language]}, {speaker.company}
                    </span>
                  </div>
                  <Flex gap={6} wrap align="center">
                    <TrackTag track={speaker.track} />
                    <Typography.Text type="secondary">
                      {text.home.sessionCount(sessionsBySpeaker(speaker.id).length)}
                    </Typography.Text>
                  </Flex>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </section>
    </ConfSiteShell>
  )
}
