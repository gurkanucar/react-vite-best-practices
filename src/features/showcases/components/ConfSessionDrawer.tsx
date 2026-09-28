import { CalendarOutlined, WarningFilled } from '@ant-design/icons'
import { App, Button, Descriptions, Drawer, Flex, Grid, Tag, Typography } from 'antd'
import { Link } from 'react-router'
import { SpeakerAvatar, StarButton, TrackTag } from '@/features/showcases/components/ConfParts'
import { downloadFile, sessionWhen } from '@/features/showcases/components/confFormat'
import {
  CONF_HALLS,
  findSpeaker,
  type ConfSession,
  type ConfSpeaker,
} from '@/features/showcases/data/confData'
import { buildIcs, icsFileName } from '@/features/showcases/data/confIcs'
import { duration } from '@/features/showcases/data/confSchedule'
import { useConfText } from '@/features/showcases/hooks/useConfText'

interface ConfSessionDrawerProps {
  session: ConfSession | undefined
  root: string
  /** Starred sessions at the same time as this one. */
  clashes: ConfSession[]
  onClose: () => void
}

/** Everything about one session, with a way into the agenda and into a calendar. */
export function ConfSessionDrawer({ session, root, clashes, onClose }: ConfSessionDrawerProps) {
  const { text, language } = useConfText()
  const { message } = App.useApp()
  const wide = Grid.useBreakpoint().md ?? false
  const speakers = (session?.speakerIds ?? [])
    .map((id) => findSpeaker(id))
    .filter((speaker): speaker is ConfSpeaker => speaker !== undefined)

  const exportOne = () => {
    if (!session) return
    downloadFile(
      icsFileName([session]),
      buildIcs([session], {
        language,
        now: Date.now(),
        url: `${window.location.origin}${root}/schedule?session=${session.id}`,
      }),
    )
    void message.success(text.schedule.exported)
  }

  return (
    <Drawer
      open={session !== undefined}
      onClose={onClose}
      size={wide ? 520 : '85%'}
      placement={wide ? 'right' : 'bottom'}
      title={session ? text.formats[session.format] : undefined}
      extra={session && <StarButton session={session} size="middle" />}
      className="conf-drawer"
    >
      {session && (
        <Flex vertical gap={20}>
          <div>
            <Typography.Title level={3} className="conf-drawer__title">
              {session.title[language]}
            </Typography.Title>
            <Flex gap={6} wrap>
              {session.track && <TrackTag track={session.track} />}
              {session.level && <Tag variant="outlined">{text.levels[session.level]}</Tag>}
            </Flex>
          </div>

          {session.abstract && (
            <Typography.Paragraph className="conf-drawer__abstract">
              {session.abstract[language]}
            </Typography.Paragraph>
          )}

          {clashes.map((clash) => (
            <Typography.Text key={clash.id} type="warning">
              <WarningFilled aria-hidden="true" />{' '}
              {text.schedule.clashesWith(clash.title[language])}
            </Typography.Text>
          ))}

          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label={text.schedule.when}>
              {sessionWhen(session, text, language, { withDay: true, withHall: false })} ·{' '}
              {text.minutes(duration(session))}
            </Descriptions.Item>
            <Descriptions.Item label={text.schedule.hall}>
              {session.hall === 'all' ? text.allHalls : CONF_HALLS[session.hall][language]}
            </Descriptions.Item>
            <Descriptions.Item label={text.schedule.format}>
              {text.formats[session.format]}
            </Descriptions.Item>
          </Descriptions>

          <div>
            <Typography.Title level={5}>{text.schedule.speakers}</Typography.Title>
            {speakers.length === 0 ? (
              <Typography.Text type="secondary">{text.schedule.communitySpeakers}</Typography.Text>
            ) : (
              <ul className="conf-drawer__speakers">
                {speakers.map((speaker) => (
                  <li key={speaker.id}>
                    <SpeakerAvatar speaker={speaker} size={44} />
                    <div>
                      <Link to={`${root}/speakers/${speaker.id}`} className="conf-drawer__speaker">
                        {speaker.name}
                      </Link>
                      <Typography.Text type="secondary">
                        {speaker.role[language]}, {speaker.company}
                      </Typography.Text>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button icon={<CalendarOutlined aria-hidden="true" />} onClick={exportOne} block>
            {text.schedule.addToCalendar}
          </Button>
        </Flex>
      )}
    </Drawer>
  )
}
