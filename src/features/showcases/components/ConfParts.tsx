import { StarFilled, StarOutlined, WarningFilled } from '@ant-design/icons'
import { Button, Flex, Tag, Tooltip, Typography } from 'antd'
import type { CSSProperties } from 'react'
import {
  CONF_TRACK_COLORS,
  findSpeaker,
  initials,
  type ConfSession,
  type ConfSpeaker,
  type ConfTrack,
} from '@/features/showcases/data/confData'
import { sessionWhen } from '@/features/showcases/components/confFormat'
import { duration, isStarrable } from '@/features/showcases/data/confSchedule'
import { useConfAgenda } from '@/features/showcases/hooks/useConfAgenda'
import { useConfText } from '@/features/showcases/hooks/useConfText'

interface SpeakerAvatarProps {
  speaker: ConfSpeaker
  size?: number
}

/** Initials on the speaker's two colours: the people are invented, so there are no photos. */
export function SpeakerAvatar({ speaker, size = 48 }: SpeakerAvatarProps) {
  return (
    <span
      className="conf-avatar"
      aria-hidden="true"
      style={
        {
          '--conf-avatar-size': `${size}px`,
          background: `linear-gradient(135deg, ${speaker.colors[0]}, ${speaker.colors[1]})`,
        } as CSSProperties
      }
    >
      {initials(speaker.name)}
    </span>
  )
}

export function TrackTag({ track }: { track: ConfTrack }) {
  const { text } = useConfText()
  return (
    <Tag
      variant="filled"
      className="conf-track-tag"
      style={{ '--conf-track': CONF_TRACK_COLORS[track] } as CSSProperties}
    >
      <span className="conf-track-tag__dot" aria-hidden="true" />
      {text.tracks[track]}
    </Tag>
  )
}

interface StarButtonProps {
  session: ConfSession
  size?: 'small' | 'middle'
}

/** Adds a session to "My agenda", or takes it out. */
export function StarButton({ session, size = 'small' }: StarButtonProps) {
  const { text, language } = useConfText()
  const starred = useConfAgenda((state) => state.starred.includes(session.id))
  const toggle = useConfAgenda((state) => state.toggle)
  if (!isStarrable(session)) return null
  const label = `${starred ? text.schedule.unstar : text.schedule.star}: ${session.title[language]}`

  return (
    <Tooltip title={starred ? text.schedule.unstar : text.schedule.star}>
      <Button
        type="text"
        size={size}
        shape="circle"
        className={`conf-star${starred ? ' conf-star--on' : ''}`}
        aria-label={label}
        aria-pressed={starred}
        icon={starred ? <StarFilled /> : <StarOutlined />}
        onClick={(event) => {
          event.stopPropagation()
          toggle(session.id)
        }}
      />
    </Tooltip>
  )
}

interface SessionCardProps {
  session: ConfSession
  onOpen: (id: string) => void
  /** Show the day as well: the agenda spans all three. */
  withDay?: boolean
  /** Another starred session at the same time. */
  clashesWith?: ConfSession
  live?: boolean
}

/** A session in the list and agenda views. The title opens the details. */
export function SessionCard({ session, onOpen, withDay, clashesWith, live }: SessionCardProps) {
  const { text, language } = useConfText()
  const speakers = session.speakerIds
    .map((id) => findSpeaker(id))
    .filter((speaker): speaker is ConfSpeaker => speaker !== undefined)

  if (session.format === 'break') {
    return (
      <div className="conf-session-card conf-session-card--break">
        <Typography.Text type="secondary">
          {session.start}–{session.end}
        </Typography.Text>
        <Typography.Text strong>{session.title[language]}</Typography.Text>
      </div>
    )
  }

  return (
    <article
      className={`conf-session-card${clashesWith ? ' conf-session-card--clash' : ''}`}
      style={
        {
          '--conf-track': session.track ? CONF_TRACK_COLORS[session.track] : '#94a3b8',
        } as CSSProperties
      }
    >
      <Flex justify="space-between" align="flex-start" gap={8}>
        <Flex vertical gap={4} className="conf-session-card__body">
          <Typography.Text type="secondary" className="conf-session-card__when">
            {sessionWhen(session, text, language, { withDay })} · {text.minutes(duration(session))}
          </Typography.Text>
          <button
            type="button"
            className="conf-session-card__title"
            onClick={() => onOpen(session.id)}
          >
            {session.title[language]}
          </button>
          {speakers.length > 0 && (
            <Flex align="center" gap={8} wrap className="conf-session-card__speakers">
              <span className="conf-avatar-stack">
                {speakers.map((speaker) => (
                  <SpeakerAvatar key={speaker.id} speaker={speaker} size={24} />
                ))}
              </span>
              <Typography.Text type="secondary">
                {speakers.map((s) => s.name).join(', ')}
              </Typography.Text>
            </Flex>
          )}
          <Flex gap={6} wrap>
            {live && (
              <Tag color="red" variant="solid">
                {text.schedule.liveNow}
              </Tag>
            )}
            {session.track && <TrackTag track={session.track} />}
            <Tag variant="outlined">{text.formats[session.format]}</Tag>
            {session.level && <Tag variant="outlined">{text.levels[session.level]}</Tag>}
          </Flex>
          {clashesWith && (
            <Typography.Text type="warning" className="conf-session-card__clash">
              <WarningFilled aria-hidden="true" />{' '}
              {text.schedule.clashesWith(clashesWith.title[language])}
            </Typography.Text>
          )}
        </Flex>
        <StarButton session={session} />
      </Flex>
    </article>
  )
}
