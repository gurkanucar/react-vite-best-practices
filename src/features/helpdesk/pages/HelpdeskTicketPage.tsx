import { ArrowLeftOutlined } from '@ant-design/icons'
import { App, Button, Card, Col, Flex, Result, Row, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  PriorityTag,
  ReplyComposer,
  StatusTag,
  TicketHistory,
  TicketSidebar,
  TicketThread,
} from '@/features/helpdesk/components'
import { useHelpdeskStore, useHelpdeskText, useNow } from '@/features/helpdesk/hooks'
import { ticketHistory } from '@/features/helpdesk/types'
import './helpdesk.css'

export function HelpdeskTicketPage() {
  const { text } = useHelpdeskText()
  const { message } = App.useApp()
  const { ticketId } = useParams<{ ticketId: string }>()
  const { tickets, contacts, addMessage, updateTicket } = useHelpdeskStore()
  const now = useNow()
  const ticket = tickets.find((candidate) => String(candidate.id) === ticketId)
  const [tab, setTab] = useState<'conversation' | 'history'>('conversation')
  /** A message the history pointed at; the thread scrolls to it once it is on screen. */
  const [focusedMessage, setFocusedMessage] = useState<string | null>(null)

  useEffect(() => {
    if (tab !== 'conversation' || !focusedMessage) return
    const element = document.getElementById(`helpdesk-message-${focusedMessage}`)
    element?.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
    element?.classList.add('helpdesk-message--focused')
    const timer = window.setTimeout(() => {
      element?.classList.remove('helpdesk-message--focused')
      setFocusedMessage(null)
    }, 1600)
    return () => window.clearTimeout(timer)
  }, [tab, focusedMessage])

  const back = (
    <Link to="/helpdesk">
      <Button icon={<ArrowLeftOutlined aria-hidden="true" />}>{text.back}</Button>
    </Link>
  )

  if (!ticket) {
    return (
      <div className="admin-page">
        <Result
          status="404"
          title={text.notFoundTitle}
          subTitle={text.notFoundDescription}
          extra={back}
        />
      </div>
    )
  }

  const requester = contacts.find((contact) => contact.id === ticket.requesterId)
  const otherTickets = tickets.filter(
    (other) => other.requesterId === ticket.requesterId && other.id !== ticket.id,
  )

  return (
    <div className="admin-page helpdesk">
      <Flex vertical gap={12} className="helpdesk-ticket__header">
        <div>{back}</div>
        <Flex align="center" gap={8} wrap>
          <Tag variant="filled" className="helpdesk-ticket__id">
            #{ticket.id}
          </Tag>
          <StatusTag status={ticket.status} />
          <PriorityTag priority={ticket.priority} />
          <Typography.Text type="secondary">
            {text.channels[ticket.channel]} · {dayjs(ticket.createdAt).format('D MMM YYYY, HH:mm')}
          </Typography.Text>
        </Flex>
        <Typography.Title level={3} className="helpdesk-ticket__subject">
          {ticket.subject}
        </Typography.Title>
      </Flex>

      <Row gutter={[16, 16]} align="top">
        <Col xs={24} xl={16}>
          <Card
            className="dashboard-panel helpdesk-ticket__main"
            activeTabKey={tab}
            onTabChange={(key) => setTab(key as typeof tab)}
            tabList={[
              { key: 'conversation', label: `${text.conversation} (${ticket.messages.length})` },
              { key: 'history', label: `${text.history} (${ticketHistory(ticket, now).length})` },
            ]}
          >
            {tab === 'conversation' ? (
              <>
                <TicketThread messages={ticket.messages} />
                <ReplyComposer
                  onSubmit={(kind, body, status) => {
                    addMessage(ticket.id, kind, body, status)
                    void message.success(kind === 'reply' ? text.sent : text.noteAdded)
                  }}
                />
              </>
            ) : (
              <TicketHistory
                ticket={ticket}
                now={now}
                onShowMessage={(messageId) => {
                  setFocusedMessage(messageId)
                  setTab('conversation')
                }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <TicketSidebar
            ticket={ticket}
            requester={requester}
            otherTickets={otherTickets}
            now={now}
            onShowHistory={() => setTab('history')}
            onChange={(changes) => {
              updateTicket(ticket.id, changes)
              void message.success(text.updated)
            }}
          />
        </Col>
      </Row>
    </div>
  )
}
