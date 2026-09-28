import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  GithubOutlined,
  LinkedinOutlined,
  XOutlined,
} from '@ant-design/icons'
import { Button, Flex, Result, Typography } from 'antd'
import { Link, useNavigate, useParams } from 'react-router'
import { SessionCard, SpeakerAvatar, TrackTag } from '@/features/showcases/components/ConfParts'
import { ConfSiteShell } from '@/features/showcases/components/ConfSiteShell'
import { confRoot, findSpeaker, sessionsBySpeaker } from '@/features/showcases/data/confData'
import { useConfText } from '@/features/showcases/hooks/useConfText'

interface EventSpeakerPageProps {
  standalone?: boolean
}

/** One speaker: who they are and every session they are in, each a way into the program. */
export function EventSpeakerPage({ standalone = false }: EventSpeakerPageProps) {
  const { text, language } = useConfText()
  const root = confRoot(standalone)
  const navigate = useNavigate()
  const { speakerId = '' } = useParams()
  const speaker = findSpeaker(speakerId)
  const shell = {
    standalone,
    title: { en: 'Speaker profile', tr: 'Konuşmacı profili' },
    description: {
      en: 'A speaker’s bio and sessions, each opening in the program.',
      tr: 'Konuşmacının özgeçmişi ve oturumları; her biri programda açılır.',
    },
  }

  if (!speaker) {
    return (
      <ConfSiteShell {...shell}>
        <Result
          status="404"
          title={text.speakers.notFound}
          subTitle={text.speakers.notFoundText}
          extra={
            <Button type="primary" onClick={() => void navigate(`${root}/speakers`)}>
              {text.speakers.back}
            </Button>
          }
        />
      </ConfSiteShell>
    )
  }

  const sessions = sessionsBySpeaker(speaker.id)
  // Placeholder profiles: the people are invented, so the links go nowhere.
  const socials = [
    { icon: <XOutlined />, label: `@${speaker.handle}` },
    { icon: <LinkedinOutlined />, label: `in/${speaker.handle}` },
    { icon: <GithubOutlined />, label: speaker.handle },
  ]

  return (
    <ConfSiteShell {...shell}>
      <section className="showcase-section conf-speaker">
        <Link to={`${root}/speakers`} className="conf-back">
          <ArrowLeftOutlined aria-hidden="true" /> {text.speakers.back}
        </Link>

        <div className="conf-speaker__head">
          <SpeakerAvatar speaker={speaker} size={128} />
          <div>
            <Typography.Title className="conf-speaker__name">{speaker.name}</Typography.Title>
            <Typography.Text className="conf-speaker__role">
              {speaker.role[language]}, {speaker.company}
            </Typography.Text>
            <Flex gap={12} wrap align="center" className="conf-speaker__meta">
              <TrackTag track={speaker.track} />
              <Typography.Text type="secondary">
                <EnvironmentOutlined aria-hidden="true" /> {text.speakers.basedIn}: {speaker.city}
              </Typography.Text>
            </Flex>
          </div>
        </div>

        <div className="conf-speaker__body">
          <div>
            <Typography.Title level={4}>{text.speakers.about}</Typography.Title>
            <Typography.Paragraph className="conf-speaker__bio">
              {speaker.bio[language]}
            </Typography.Paragraph>
            <Typography.Title level={5}>{text.speakers.follow}</Typography.Title>
            <ul className="conf-speaker__socials">
              {socials.map((social) => (
                <li key={social.label}>
                  <span aria-hidden="true">{social.icon}</span> {social.label}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Typography.Title level={4}>{text.speakers.talks}</Typography.Title>
            <Flex vertical gap={12}>
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  withDay
                  onOpen={(id) =>
                    void navigate(`${root}/schedule?day=${session.day}&session=${id}`)
                  }
                />
              ))}
            </Flex>
          </div>
        </div>
      </section>
    </ConfSiteShell>
  )
}
