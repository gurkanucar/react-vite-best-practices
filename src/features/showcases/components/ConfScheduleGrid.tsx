import { WarningFilled } from '@ant-design/icons'
import { Tooltip, Typography } from 'antd'
import type { CSSProperties } from 'react'
import { StarButton } from '@/features/showcases/components/ConfParts'
import { speakerNames } from '@/features/showcases/components/confFormat'
import { CONF_HALLS, CONF_TRACK_COLORS } from '@/features/showcases/data/confData'
import { duration, type DayLayout } from '@/features/showcases/data/confSchedule'
import { useConfText } from '@/features/showcases/hooks/useConfText'

interface ConfScheduleGridProps {
  layout: DayLayout
  /** Sessions that pass the filters; the rest are drawn faded, so the day keeps its shape. */
  visible: Set<string>
  /** Starred sessions that clash with another starred one. */
  clashing: Set<string>
  live: Set<string>
  onOpen: (id: string) => void
}

/** One day as a timetable: halls across, time down, every session as tall as it is long. */
export function ConfScheduleGrid({
  layout,
  visible,
  clashing,
  live,
  onOpen,
}: ConfScheduleGridProps) {
  const { text, language } = useConfText()

  return (
    <div
      className="conf-grid"
      style={
        {
          gridTemplateColumns: `64px repeat(${layout.halls.length}, minmax(0, 1fr))`,
          gridTemplateRows: `48px repeat(${layout.rows}, var(--conf-slot))`,
        } as CSSProperties
      }
    >
      <div className="conf-grid__corner" style={{ gridRow: 1, gridColumn: 1 }} />
      {layout.halls.map((hall, index) => (
        <div key={hall} className="conf-grid__hall" style={{ gridRow: 1, gridColumn: index + 2 }}>
          {CONF_HALLS[hall][language]}
        </div>
      ))}
      <div
        className="conf-grid__lines"
        style={{ gridRow: '2 / -1', gridColumn: '2 / -1' }}
        aria-hidden="true"
      />
      {layout.marks.map((mark, index) => (
        <div
          key={mark.label}
          className={`conf-grid__time${index === 0 ? ' conf-grid__time--first' : ''}`}
          style={{ gridRow: `${mark.row} / span 6`, gridColumn: 1 }}
        >
          {mark.label}
        </div>
      ))}

      {layout.items.map(({ session, rowStart, rowEnd, columnStart, columnEnd }) => {
        const position = {
          gridRow: `${rowStart} / ${rowEnd}`,
          gridColumn: `${columnStart} / ${columnEnd}`,
        }
        if (session.format === 'break') {
          return (
            <div key={session.id} className="conf-grid__break" style={position}>
              <span>
                {session.start}–{session.end}
              </span>
              <strong>{session.title[language]}</strong>
            </div>
          )
        }

        const minutes = duration(session)
        const classes = [
          'conf-grid__session',
          `conf-grid__session--${session.format}`,
          minutes <= 20 ? 'conf-grid__session--short' : '',
          visible.has(session.id) ? '' : 'conf-grid__session--dimmed',
          live.has(session.id) ? 'conf-grid__session--live' : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <article
            key={session.id}
            className={classes}
            style={
              {
                ...position,
                '--conf-track': session.track ? CONF_TRACK_COLORS[session.track] : '#94a3b8',
              } as CSSProperties
            }
          >
            <div className="conf-grid__session-top">
              <Typography.Text type="secondary" className="conf-grid__session-time">
                {session.start}–{session.end}
                {live.has(session.id) && (
                  <span className="conf-grid__live">{text.schedule.liveNow}</span>
                )}
              </Typography.Text>
              <span className="conf-grid__session-actions">
                {clashing.has(session.id) && (
                  <Tooltip title={text.schedule.conflictAlert(1)}>
                    <WarningFilled
                      className="conf-grid__clash"
                      aria-label={text.schedule.conflictAlert(1)}
                    />
                  </Tooltip>
                )}
                <StarButton session={session} />
              </span>
            </div>
            <button
              type="button"
              className="conf-grid__session-title"
              title={minutes <= 20 ? session.title[language] : undefined}
              onClick={() => onOpen(session.id)}
            >
              {session.title[language]}
            </button>
            {minutes > 20 && session.speakerIds.length > 0 && (
              <Typography.Text type="secondary" className="conf-grid__session-speakers">
                {speakerNames(session)}
              </Typography.Text>
            )}
          </article>
        )
      })}
    </div>
  )
}
