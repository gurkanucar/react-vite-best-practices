import {
  CloseCircleOutlined,
  HistoryOutlined,
  PaperClipOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  App,
  Badge,
  Button,
  Card,
  Empty,
  Flex,
  Grid,
  Input,
  Select,
  Statistic,
  Table,
  Tabs,
  Typography,
  type TableColumnsType,
} from 'antd'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
// import { PageHeader } from '@/components/PageHeader/PageHeader'
import {
  AgentAvatar,
  PriorityTag,
  RecentActivityDrawer,
  RequesterCell,
  SlaBadge,
  StatusTag,
} from '@/features/helpdesk/components'
import { agents } from '@/features/helpdesk/data'
import {
  useHelpdeskStore,
  useHelpdeskText,
  useNow,
  useTicketFilters,
} from '@/features/helpdesk/hooks'
import {
  activeSla,
  comparePriority,
  formatDuration,
  matchesFilters,
  minutesSince,
  queueStats,
  sortQueue,
  statusCounts,
  TICKET_CHANNELS,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type Contact,
  type StatusFilter,
  type Ticket,
  type TicketStatus,
} from '@/features/helpdesk/types'
import './helpdesk.css'

export function HelpdeskListPage() {
  const { text, language } = useHelpdeskText()
  const { message } = App.useApp()
  const { tickets, contacts, bulkUpdate } = useHelpdeskStore()
  const { filters, setFilters, clearFilters } = useTicketFilters()
  const now = useNow()
  const wide = Grid.useBreakpoint().lg ?? false
  const [selected, setSelected] = useState<number[]>([])
  const [activityOpen, setActivityOpen] = useState(false)

  const contactById = useMemo(
    () =>
      Object.fromEntries(contacts.map((contact) => [contact.id, contact])) as Record<
        string,
        Contact
      >,
    [contacts],
  )
  const stats = queueStats(tickets, now)
  // Counted before the status filter, so each tab says what switching to it would show.
  const counts = statusCounts(
    tickets.filter((ticket) => matchesFilters(ticket, { ...filters, status: 'all' }, contactById)),
  )
  const visible = sortQueue(
    tickets.filter((ticket) => matchesFilters(ticket, filters, contactById)),
    now,
  )
  const filtered =
    filters.search !== '' || Boolean(filters.priority || filters.assignee || filters.channel)

  const updatedLabel = (iso: string) => {
    const minutes = minutesSince(iso, now)
    return minutes < 1 ? text.justNow : text.ago(formatDuration(minutes, language))
  }

  const applyBulk = (changes: Parameters<typeof bulkUpdate>[1]) => {
    bulkUpdate(selected, changes)
    void message.success(text.bulkUpdated(selected.length))
    setSelected([])
  }

  const agentOptions = [
    { value: 'unassigned', label: text.unassigned },
    ...agents.map((agent) => ({ value: agent.id, label: agent.name })),
  ]

  const subjectCell = (ticket: Ticket) => (
    <div className="helpdesk-subject">
      <Typography.Text type="secondary" className="helpdesk-subject__id">
        #{ticket.id}
      </Typography.Text>
      <Link to={`/helpdesk/${ticket.id}`} className="helpdesk-subject__link">
        {ticket.subject}
      </Link>
      <Typography.Text type="secondary" className="helpdesk-subject__meta">
        {text.channels[ticket.channel]} · {text.categories[ticket.category]}
        {ticket.messages.some((entry) => entry.attachments?.length) && (
          <>
            {' '}
            · <PaperClipOutlined aria-label={text.form.attachments} />
          </>
        )}
      </Typography.Text>
    </div>
  )

  const columns: TableColumnsType<Ticket> = [
    { key: 'ticket', title: text.columns.ticket, render: (_, ticket) => subjectCell(ticket) },
    {
      key: 'requester',
      title: text.columns.requester,
      width: 210,
      render: (_, ticket) => <RequesterCell contact={contactById[ticket.requesterId]} />,
    },
    {
      key: 'status',
      title: text.columns.status,
      width: 120,
      render: (_, ticket) => <StatusTag status={ticket.status} />,
    },
    {
      key: 'priority',
      title: text.columns.priority,
      width: 120,
      sorter: (left, right) => comparePriority(left.priority, right.priority),
      render: (_, ticket) => <PriorityTag priority={ticket.priority} />,
    },
    {
      key: 'assignee',
      title: text.columns.assignee,
      width: 110,
      align: 'center',
      render: (_, ticket) => <AgentAvatar agentId={ticket.assigneeId} />,
    },
    {
      key: 'sla',
      title: text.columns.sla,
      width: 150,
      sorter: (left, right) =>
        (activeSla(left, now)?.remaining ?? Infinity) -
        (activeSla(right, now)?.remaining ?? Infinity),
      render: (_, ticket) => <SlaBadge clock={activeSla(ticket, now)} />,
    },
    {
      key: 'updated',
      title: text.columns.updated,
      width: 120,
      sorter: (left, right) => left.updatedAt.localeCompare(right.updatedAt),
      render: (_, ticket) => (
        <Typography.Text type="secondary">{updatedLabel(ticket.updatedAt)}</Typography.Text>
      ),
    },
  ]

  const statCards = [
    { key: 'open', title: text.stats.open, value: stats.open },
    { key: 'pending', title: text.stats.pending, value: stats.pending },
    {
      key: 'breached',
      title: text.stats.breached,
      value: stats.breached,
      danger: stats.breached > 0,
    },
    { key: 'resolved', title: text.stats.resolvedThisWeek, value: stats.resolvedThisWeek },
    {
      key: 'first',
      title: text.stats.averageFirstResponse,
      value:
        stats.averageFirstResponse === null
          ? '—'
          : formatDuration(stats.averageFirstResponse, language),
    },
  ]

  return (
    <div className="admin-page helpdesk">
      {/* Description commented out rather than deleted, as on the other workspace screens. */}
      {/* <PageHeader title={text.title} description={text.description} /> */}

      <div className="helpdesk-stats">
        {statCards.map((stat) => (
          <Card key={stat.key} className="dashboard-panel helpdesk-stat" size="small">
            <Statistic
              title={stat.title}
              value={stat.value}
              styles={stat.danger ? { content: { color: 'var(--ant-color-error)' } } : undefined}
            />
          </Card>
        ))}
      </div>

      <Card className="dashboard-panel helpdesk-queue">
        <Flex justify="space-between" align="center" gap={12} wrap>
          <Tabs
            className="helpdesk-queue__tabs"
            activeKey={filters.status}
            onChange={(key) => {
              setSelected([])
              setFilters({ status: key as StatusFilter })
            }}
            items={(['all', ...TICKET_STATUSES] as StatusFilter[]).map((status) => ({
              key: status,
              label: (
                <span>
                  {status === 'all' ? text.all : text.statuses[status]}{' '}
                  <Badge
                    count={counts[status]}
                    showZero
                    color="var(--ant-color-fill-secondary)"
                    className="helpdesk-count"
                  />
                </span>
              ),
            }))}
          />
          <Flex gap={8}>
            <Button
              icon={<HistoryOutlined aria-hidden="true" />}
              onClick={() => setActivityOpen(true)}
            >
              {text.recentActivity}
            </Button>
            <Link to="/helpdesk/new">
              <Button type="primary" icon={<PlusOutlined aria-hidden="true" />}>
                {text.newTicket}
              </Button>
            </Link>
          </Flex>
        </Flex>

        <Flex gap={8} wrap className="helpdesk-filters">
          <Input
            allowClear
            prefix={<SearchOutlined aria-hidden="true" />}
            placeholder={text.search}
            aria-label={text.search}
            value={filters.search}
            onChange={(event) => setFilters({ search: event.target.value })}
            className="helpdesk-filters__search"
          />
          <Select
            allowClear
            placeholder={text.priority}
            aria-label={text.priority}
            value={filters.priority}
            onChange={(priority) => setFilters({ priority })}
            options={TICKET_PRIORITIES.map((priority) => ({
              value: priority,
              label: text.priorities[priority],
            }))}
            className="helpdesk-filters__select"
          />
          <Select
            allowClear
            placeholder={text.assignee}
            aria-label={text.assignee}
            value={filters.assignee}
            onChange={(assignee) => setFilters({ assignee })}
            options={agentOptions}
            className="helpdesk-filters__select"
          />
          <Select
            allowClear
            placeholder={text.channel}
            aria-label={text.channel}
            value={filters.channel}
            onChange={(channel) => setFilters({ channel })}
            options={TICKET_CHANNELS.map((channel) => ({
              value: channel,
              label: text.channels[channel],
            }))}
            className="helpdesk-filters__select"
          />
          {filtered && (
            <Button
              type="link"
              icon={<CloseCircleOutlined aria-hidden="true" />}
              onClick={clearFilters}
            >
              {text.clearFilters}
            </Button>
          )}
        </Flex>

        {selected.length > 0 && (
          <Flex
            align="center"
            gap={8}
            wrap
            className="helpdesk-bulk"
            role="toolbar"
            aria-label={text.selected(selected.length)}
          >
            <Typography.Text strong>{text.selected(selected.length)}</Typography.Text>
            <Select
              placeholder={text.assignTo}
              aria-label={text.assignTo}
              value={null}
              options={agentOptions}
              onChange={(value: string) =>
                applyBulk({ assigneeId: value === 'unassigned' ? undefined : value })
              }
              className="helpdesk-filters__select"
            />
            <Select
              placeholder={text.setStatus}
              aria-label={text.setStatus}
              value={null}
              options={TICKET_STATUSES.map((status) => ({
                value: status,
                label: text.statuses[status],
              }))}
              onChange={(status: TicketStatus) => applyBulk({ status })}
              className="helpdesk-filters__select"
            />
            <Button onClick={() => applyBulk({ status: 'closed' })}>{text.closeSelected}</Button>
          </Flex>
        )}

        {visible.length === 0 ? (
          <Empty description={text.empty} className="helpdesk-empty" />
        ) : wide ? (
          <Table<Ticket>
            rowKey="id"
            size="middle"
            columns={columns}
            dataSource={visible}
            pagination={{ pageSize: 10, hideOnSinglePage: true }}
            rowSelection={{
              selectedRowKeys: selected,
              onChange: (keys) => setSelected(keys as number[]),
            }}
            rowClassName={(ticket) =>
              activeSla(ticket, now)?.state === 'breached' ? 'helpdesk-row--breached' : ''
            }
          />
        ) : (
          // A seven-column table does not fit a phone; each ticket becomes a card instead.
          <ul className="helpdesk-cards">
            {visible.map((ticket) => (
              <li key={ticket.id} className="helpdesk-card">
                {subjectCell(ticket)}
                <Flex gap={6} wrap>
                  <StatusTag status={ticket.status} />
                  <PriorityTag priority={ticket.priority} />
                </Flex>
                <Flex justify="space-between" align="center" gap={8} wrap>
                  <RequesterCell contact={contactById[ticket.requesterId]} />
                  <AgentAvatar agentId={ticket.assigneeId} />
                </Flex>
                <Flex justify="space-between" gap={8} wrap>
                  <SlaBadge clock={activeSla(ticket, now)} />
                  <Typography.Text type="secondary">
                    {updatedLabel(ticket.updatedAt)}
                  </Typography.Text>
                </Flex>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <RecentActivityDrawer
        open={activityOpen}
        onClose={() => setActivityOpen(false)}
        tickets={tickets}
        now={now}
      />
    </div>
  )
}
