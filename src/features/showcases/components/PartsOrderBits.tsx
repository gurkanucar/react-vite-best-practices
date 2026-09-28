import {
  CarOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  EnvironmentOutlined,
  HomeOutlined,
  InboxOutlined,
  RollbackOutlined,
  ShopOutlined,
  ShoppingOutlined,
} from '@ant-design/icons'
import { Tag, Timeline, Typography } from 'antd'
import type { Dayjs } from 'dayjs'
import type { ReactNode } from 'react'
import type { OrderStatus, TrackingEvent } from '@/features/showcases/data/partsCommerce'
import { usePartsCopy } from '@/features/showcases/hooks/usePartsCopy'

const statusColors: Record<OrderStatus, string> = {
  received: 'gold',
  preparing: 'gold',
  shipped: 'blue',
  inTransit: 'blue',
  outForDelivery: 'geekblue',
  delivered: 'green',
  ready: 'green',
  cancelled: 'default',
  returnRequested: 'purple',
}

const stageIcons: Record<OrderStatus, ReactNode> = {
  received: <ShoppingOutlined />,
  preparing: <InboxOutlined />,
  shipped: <CarOutlined />,
  inTransit: <EnvironmentOutlined />,
  outForDelivery: <CarOutlined />,
  delivered: <HomeOutlined />,
  ready: <ShopOutlined />,
  cancelled: <CloseCircleFilled />,
  returnRequested: <RollbackOutlined />,
}

export function OrderStatusTag({ status }: { status: OrderStatus }) {
  const { text } = usePartsCopy()
  return (
    <Tag color={statusColors[status]} icon={stageIcons[status]} variant="filled">
      {text.status[status]}
    </Tag>
  )
}

/**
 * The parcel's journey in order. Steps still ahead follow in grey with their expected time,
 * so the customer sees both where it is and what comes next.
 */
export function TrackingTimeline({ events, now }: { events: TrackingEvent[]; now: Dayjs }) {
  const { text, language } = usePartsCopy()
  const format = (at: Dayjs) =>
    at.locale(language).format(at.isSame(now, 'year') ? 'D MMM, HH:mm' : 'D MMM YYYY, HH:mm')
  const latest = [...events].reverse().find((event) => event.done)

  return (
    <Timeline
      className="parts-timeline"
      items={events.map((event) => {
        const current = event === latest
        return {
          key: `${event.stage}-${event.at.valueOf()}`,
          color: !event.done
            ? 'gray'
            : event.stage === 'cancelled'
              ? 'red'
              : current
                ? 'blue'
                : 'green',
          icon: current ? (
            <span
              className={`parts-timeline__current${event.stage === 'cancelled' ? ' is-cancelled' : ''}`}
              aria-hidden="true"
            >
              {stageIcons[event.stage]}
            </span>
          ) : event.done && event.stage !== 'cancelled' ? (
            <CheckCircleFilled />
          ) : undefined,
          content: (
            <div
              className={`parts-timeline__item${event.done ? '' : ' is-expected'}${current ? ' is-current' : ''}`}
            >
              <Typography.Text strong={current}>{text.status[event.stage]}</Typography.Text>
              <Typography.Text type="secondary" className="parts-timeline__meta">
                {event.location[language]} ·{' '}
                {event.done ? (
                  <time dateTime={event.at.toISOString()}>{format(event.at)}</time>
                ) : (
                  <>
                    {text.order.expected}{' '}
                    <time dateTime={event.at.toISOString()}>{format(event.at)}</time>
                  </>
                )}
              </Typography.Text>
            </div>
          ),
        }
      })}
    />
  )
}
