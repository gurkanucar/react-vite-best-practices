import { ArrowRightOutlined, InboxOutlined } from '@ant-design/icons'
import { Button, Empty, Flex, Progress, Typography } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { Link } from 'react-router'
import { OrderStatusTag } from '@/features/showcases/components/PartsOrderBits'
import { PartsSiteShell } from '@/features/showcases/components/PartsSiteShell'
import {
  estimatedArrival,
  formatTry,
  orderStatus,
  shippingMethods,
  trackingEvents,
  type Order,
} from '@/features/showcases/data/partsCommerce'
import { partsRoot } from '@/features/showcases/data/partsCopy'
import { usePartsCopy } from '@/features/showcases/hooks/usePartsCopy'
import { usePartsNow } from '@/features/showcases/hooks/usePartsNow'
import { usePartsStore } from '@/features/showcases/hooks/usePartsStore'

interface PartsOrdersPageProps {
  standalone?: boolean
}

function OrderRow({ order, root, now }: { order: Order; root: string; now: Dayjs }) {
  const { text, language } = usePartsCopy()
  const status = orderStatus(order, now)
  const events = trackingEvents(order, now).filter(
    (event) => event.stage !== 'cancelled' && event.stage !== 'returnRequested',
  )
  const done = events.filter((event) => event.done).length
  const eta = estimatedArrival(order, now)
  const finished = status === 'delivered' || status === 'ready' || status === 'returnRequested'
  const names = order.lines.map((line) => line.name[language])
  const count = order.lines.reduce((sum, line) => sum + line.quantity, 0)

  return (
    <li className="parts-order">
      <Flex justify="space-between" align="center" gap={8} wrap>
        <Link to={`${root}/orders/${order.id}`} className="parts-order__id parts-mono">
          {order.id}
        </Link>
        <OrderStatusTag status={status} />
      </Flex>
      <Typography.Text type="secondary">
        {text.orders.placed(dayjs(order.placedAt).locale(language).format('D MMMM YYYY, HH:mm'))} ·{' '}
        {text.orders.items(count)} · <strong>{formatTry(order.totals.total, language)}</strong>
      </Typography.Text>
      <Typography.Paragraph ellipsis={{ rows: 1 }} className="parts-order__items">
        {names.join(', ')}
      </Typography.Paragraph>
      {!order.cancelledAt && (
        <Progress
          percent={Math.round((done / events.length) * 100)}
          showInfo={false}
          size="small"
          status={finished ? 'success' : 'active'}
          aria-label={text.status[status]}
        />
      )}
      <Flex justify="space-between" align="center" gap={8} wrap>
        <Typography.Text type="secondary">
          {shippingMethods[order.shipping].carrier} · {text.orders.tracking}{' '}
          <span className="parts-mono">{order.trackingNumber}</span>
          {eta && !order.cancelledAt && (
            <>
              {' · '}
              {finished ? text.orders.delivered : text.orders.eta}{' '}
              {eta.locale(language).format('D MMM, HH:mm')}
            </>
          )}
        </Typography.Text>
        <Link to={`${root}/orders/${order.id}`}>
          <Button type="link" icon={<ArrowRightOutlined />} iconPlacement="end">
            {text.orders.view}
          </Button>
        </Link>
      </Flex>
    </li>
  )
}

export function PartsOrdersPage({ standalone = false }: PartsOrdersPageProps) {
  const { text } = usePartsCopy()
  const root = partsRoot(standalone)
  const orders = usePartsStore((state) => state.orders)
  // Demo orders move along in minutes, so the list keeps up while it is open.
  const now = usePartsNow(15_000)

  return (
    <PartsSiteShell standalone={standalone}>
      <div className="parts-section parts-orders">
        <Typography.Title level={2}>{text.orders.title}</Typography.Title>
        <Typography.Paragraph type="secondary">{text.orders.description}</Typography.Paragraph>
        {orders.length === 0 ? (
          <Empty
            image={<InboxOutlined className="parts-empty__icon" />}
            description={text.orders.empty}
          >
            <Link to={`${root}/catalog`}>
              <Button type="primary">{text.cart.browse}</Button>
            </Link>
          </Empty>
        ) : (
          <ul className="parts-orders__list">
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} root={root} now={now} />
            ))}
          </ul>
        )}
      </div>
    </PartsSiteShell>
  )
}
