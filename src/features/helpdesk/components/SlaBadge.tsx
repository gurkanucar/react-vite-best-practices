import { ClockCircleOutlined, PauseCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import { useHelpdeskText } from '@/features/helpdesk/hooks'
import { formatDuration, type SlaClock } from '@/features/helpdesk/types'

/** One line for a clock: time left, time over, paused or met. */
export function SlaBadge({ clock }: { clock: SlaClock | null }) {
  const { text, language } = useHelpdeskText()

  if (!clock) return <Typography.Text type="secondary">—</Typography.Text>

  const duration = formatDuration(clock.remaining, language)

  if (clock.state === 'breached') {
    return (
      <Typography.Text type="danger" strong className="helpdesk-sla">
        <WarningOutlined aria-hidden="true" /> {text.slaBreached(duration)}
      </Typography.Text>
    )
  }
  if (clock.state === 'paused') {
    return (
      <Typography.Text type="secondary" className="helpdesk-sla">
        <PauseCircleOutlined aria-hidden="true" /> {text.slaPaused}
      </Typography.Text>
    )
  }
  if (clock.state === 'met') {
    return (
      <Typography.Text type="success" className="helpdesk-sla">
        {text.slaMet}
      </Typography.Text>
    )
  }

  // Under an hour left is the moment to act, so it is flagged before it turns red.
  return (
    <Typography.Text type={clock.remaining < 60 ? 'warning' : undefined} className="helpdesk-sla">
      <ClockCircleOutlined aria-hidden="true" /> {text.slaLeft(duration)}
    </Typography.Text>
  )
}
