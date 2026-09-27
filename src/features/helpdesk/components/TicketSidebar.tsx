import { MailOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Flex, Progress, Select, Timeline, Typography } from 'antd'
import dayjs from 'dayjs'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { StatusTag } from '@/features/helpdesk/components/TicketTags'
import { SlaBadge } from '@/features/helpdesk/components/SlaBadge'
import { describeChange } from '@/features/helpdesk/components/activityText'
import { agents } from '@/features/helpdesk/data'
import { useHelpdeskText, type TicketChanges } from '@/features/helpdesk/hooks'
import {
  initials,
  slaClocks,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type Contact,
  type SlaClock,
  type Ticket,
} from '@/features/helpdesk/types'

interface TicketSidebarProps {
  ticket: Ticket
  requester?: Contact
  otherTickets: Ticket[]
  now: number
  onChange: (changes: TicketChanges) => void
  onShowHistory: () => void
}

/** The sidebar keeps the latest few changes; the history tab has the rest. */
const RECENT_ACTIVITY = 5

function Property({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="helpdesk-property">
      <Typography.Text type="secondary">{label}</Typography.Text>
      {children}
    </label>
  )
}

function SlaRow({ label, clock }: { label: string; clock: SlaClock }) {
  const { text } = useHelpdeskText()
  const status =
    clock.state === 'breached' ? 'exception' : clock.state === 'met' ? 'success' : 'active'

  return (
    <div className="helpdesk-sla-row">
      <Flex justify="space-between" gap={8} wrap>
        <Typography.Text strong>{label}</Typography.Text>
        <SlaBadge clock={clock} />
      </Flex>
      <Progress
        percent={Math.round(clock.used)}
        status={status}
        showInfo={false}
        size="small"
        aria-label={label}
      />
      <Typography.Text type="secondary" className="helpdesk-sla-row__due">
        {text.dueAt(dayjs(clock.due).format('D MMM, HH:mm'))}
      </Typography.Text>
    </div>
  )
}

export function TicketSidebar({
  ticket,
  requester,
  otherTickets,
  now,
  onChange,
  onShowHistory,
}: TicketSidebarProps) {
  const { text } = useHelpdeskText()
  const clocks = slaClocks(ticket, now)

  return (
    <Flex vertical gap={16}>
      <Card className="dashboard-panel" title={text.properties} size="small">
        <Flex vertical gap={12}>
          <Property label={text.status}>
            <Select
              value={ticket.status}
              aria-label={text.status}
              onChange={(status) => onChange({ status })}
              options={TICKET_STATUSES.map((status) => ({
                value: status,
                label: text.statuses[status],
              }))}
            />
          </Property>
          <Property label={text.priority}>
            <Select
              value={ticket.priority}
              aria-label={text.priority}
              onChange={(priority) => onChange({ priority })}
              options={TICKET_PRIORITIES.map((priority) => ({
                value: priority,
                label: text.priorities[priority],
              }))}
            />
          </Property>
          <Property label={text.assignee}>
            <Select
              value={ticket.assigneeId ?? 'unassigned'}
              aria-label={text.assignee}
              onChange={(value: string) =>
                onChange({ assigneeId: value === 'unassigned' ? undefined : value })
              }
              options={[
                { value: 'unassigned', label: text.unassigned },
                ...agents.map((agent) => ({ value: agent.id, label: agent.name })),
              ]}
            />
          </Property>
          <Property label={text.category}>
            <Select
              value={ticket.category}
              aria-label={text.category}
              onChange={(category) => onChange({ category })}
              options={TICKET_CATEGORIES.map((category) => ({
                value: category,
                label: text.categories[category],
              }))}
            />
          </Property>
          <Property label={text.tags}>
            <Select
              mode="tags"
              value={ticket.tags}
              aria-label={text.tags}
              onChange={(tags: string[]) => onChange({ tags })}
              tokenSeparators={[',']}
            />
          </Property>
        </Flex>
      </Card>

      {requester && (
        <Card className="dashboard-panel" title={text.requester} size="small">
          <Flex align="center" gap={12}>
            <Avatar size={44}>{initials(requester.name)}</Avatar>
            <div className="helpdesk-requester__text">
              <Typography.Text strong>{requester.name}</Typography.Text>
              <Typography.Text type="secondary">{requester.company}</Typography.Text>
            </div>
          </Flex>
          <Typography.Link href={`mailto:${requester.email}`} className="helpdesk-requester__email">
            <MailOutlined aria-hidden="true" /> {requester.email}
          </Typography.Link>
          <Typography.Text type="secondary" className="helpdesk-requester__history">
            {text.previousTickets(otherTickets.length)}
          </Typography.Text>
          {otherTickets.length > 0 && (
            <ul className="helpdesk-history">
              {otherTickets.slice(0, 4).map((other) => (
                <li key={other.id}>
                  <Link to={`/helpdesk/${other.id}`}>
                    #{other.id} {other.subject}
                  </Link>
                  <StatusTag status={other.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      <Card className="dashboard-panel" title={text.sla} size="small">
        <Flex vertical gap={16}>
          <SlaRow label={text.firstResponse} clock={clocks.firstResponse} />
          <SlaRow label={text.resolution} clock={clocks.resolution} />
        </Flex>
      </Card>

      <Card
        className="dashboard-panel"
        title={text.activity}
        size="small"
        extra={
          <Button type="link" size="small" onClick={onShowHistory}>
            {text.viewHistory}
          </Button>
        }
      >
        <Timeline
          className="helpdesk-activity"
          items={[...ticket.activity]
            .reverse()
            .slice(0, RECENT_ACTIVITY)
            .map((activity) => ({
              key: activity.id,
              color: activity.kind === 'created' ? 'green' : 'blue',
              content: (
                <>
                  <Typography.Text>{describeChange(text, activity)}</Typography.Text>
                  <br />
                  <Typography.Text type="secondary" className="helpdesk-activity__time">
                    {dayjs(activity.at).format('D MMM, HH:mm')}
                  </Typography.Text>
                </>
              ),
            }))}
        />
      </Card>
    </Flex>
  )
}
