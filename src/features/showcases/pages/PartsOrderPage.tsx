import { ArrowLeftOutlined, CloseOutlined, RollbackOutlined, SyncOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  Card,
  Descriptions,
  Divider,
  Flex,
  Popconfirm,
  Result,
  Steps,
  Typography,
} from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { Link, useParams } from 'react-router'
import { PartVisual } from '@/features/showcases/components/PartsBits'
import { OrderStatusTag, TrackingTimeline } from '@/features/showcases/components/PartsOrderBits'
import { PartsSiteShell } from '@/features/showcases/components/PartsSiteShell'
import { findPart, warehouseNames } from '@/features/showcases/data/partsCatalog'
import {
  canCancel,
  canReturn,
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

interface PartsOrderPageProps {
  standalone?: boolean
}

function OrderDetail({ order, root }: { order: Order; root: string }) {
  const { text, language } = usePartsCopy()
  const { message } = App.useApp()
  // Fast enough to watch a fresh demo order move from one step to the next.
  const now = usePartsNow(5_000)
  const cancelOrder = usePartsStore((state) => state.cancelOrder)
  const requestReturn = usePartsStore((state) => state.requestReturn)
  const events = trackingEvents(order, now)
  const status = orderStatus(order, now)
  const eta = estimatedArrival(order, now)
  const plan = events.filter(
    (event) => event.stage !== 'cancelled' && event.stage !== 'returnRequested',
  )
  const reached = plan.filter((event) => event.done).length - 1
  const finished = status === 'delivered' || status === 'ready' || status === 'returnRequested'
  const method = shippingMethods[order.shipping]
  const money = (value: number) => formatTry(value, language)
  const format = (value: string | Dayjs) =>
    dayjs(value).locale(language).format('D MMMM YYYY, HH:mm')

  return (
    <>
      <Link to={`${root}/orders`} className="parts-link parts-order__back">
        <ArrowLeftOutlined /> {text.order.back}
      </Link>
      <Flex justify="space-between" align="center" gap={12} wrap className="parts-order__head">
        <div>
          <Typography.Title level={2} className="parts-order__title">
            {text.order.title(order.id)}
          </Typography.Title>
          <Typography.Text type="secondary">
            {text.order.placed(format(order.placedAt))}
          </Typography.Text>
        </div>
        <OrderStatusTag status={status} />
      </Flex>

      <div className="parts-order__layout">
        <Card className="parts-order__tracking" title={text.order.tracking}>
          {!order.cancelledAt && (
            <Steps
              className="parts-order__steps"
              size="small"
              type="dot"
              titlePlacement="vertical"
              current={Math.max(reached, 0)}
              status={finished ? 'finish' : 'process'}
              items={plan.map((event) => ({ title: text.status[event.stage] }))}
            />
          )}
          <Descriptions
            size="small"
            column={{ xs: 1, sm: 2 }}
            className="parts-order__facts"
            items={[
              {
                key: 'tracking',
                label: text.order.trackingNumber,
                children: (
                  <Typography.Text
                    copyable={{ onCopy: () => void message.success(text.order.copied) }}
                    className="parts-mono"
                  >
                    {order.trackingNumber}
                  </Typography.Text>
                ),
              },
              { key: 'carrier', label: text.order.carrier, children: method.carrier },
              {
                key: 'from',
                label: text.order.from,
                children: warehouseNames[order.warehouse][language],
              },
              ...(eta && !order.cancelledAt
                ? [
                    {
                      key: 'eta',
                      label: finished
                        ? order.shipping === 'pickup'
                          ? text.order.readyAt
                          : text.order.deliveredAt
                        : text.order.eta,
                      children: format(eta),
                    },
                  ]
                : []),
            ]}
          />
          <Divider />
          <TrackingTimeline events={events} now={now} />
          {!finished && !order.cancelledAt && (
            <Typography.Text type="secondary" className="parts-order__live">
              <SyncOutlined spin aria-hidden="true" /> {text.order.live}
            </Typography.Text>
          )}
          {(canCancel(order, now) || canReturn(order, now)) && (
            <Flex gap={8} wrap className="parts-order__actions">
              {canCancel(order, now) && (
                <Popconfirm
                  title={text.order.cancelConfirm}
                  description={text.order.cancelText}
                  okText={text.order.yes}
                  cancelText={text.order.no}
                  okButtonProps={{ danger: true }}
                  onConfirm={() => {
                    cancelOrder(order.id)
                    void message.success(text.order.cancelled)
                  }}
                >
                  <Button danger icon={<CloseOutlined />}>
                    {text.order.cancel}
                  </Button>
                </Popconfirm>
              )}
              {canReturn(order, now) && (
                <Popconfirm
                  title={text.order.returnConfirm}
                  description={text.order.returnText}
                  okText={text.order.yes}
                  cancelText={text.order.no}
                  onConfirm={() => {
                    requestReturn(order.id)
                    void message.success(text.order.returnBooked)
                  }}
                >
                  <Button icon={<RollbackOutlined />}>{text.order.return}</Button>
                </Popconfirm>
              )}
            </Flex>
          )}
        </Card>

        <div className="parts-order__side">
          <Card title={text.order.items}>
            <ul className="parts-summary__lines">
              {order.lines.map((line) => {
                const part = findPart(line.partId)
                return (
                  <li key={line.partId}>
                    {part && <PartVisual category={part.category} size="small" />}
                    <span className="parts-summary__name">
                      {part ? (
                        <Link to={`${root}/products/${line.partId}`}>{line.name[language]}</Link>
                      ) : (
                        line.name[language]
                      )}
                      <Typography.Text type="secondary">
                        {' '}
                        {line.brand} · <span className="parts-mono">{line.sku}</span>{' '}
                        {text.order.quantity(line.quantity)}
                      </Typography.Text>
                    </span>
                    <span>{money(line.unitPrice * line.quantity)}</span>
                  </li>
                )
              })}
            </ul>
            <Divider />
            <dl className="parts-summary__totals">
              <div>
                <dt>{text.checkout.subtotal}</dt>
                <dd>{money(order.totals.subtotal)}</dd>
              </div>
              {order.totals.discount > 0 && (
                <div className="is-discount">
                  <dt>{text.checkout.discount}</dt>
                  <dd>−{money(order.totals.discount)}</dd>
                </div>
              )}
              <div>
                <dt>{text.checkout.shipping}</dt>
                <dd>
                  {order.totals.shipping === 0 ? text.checkout.free : money(order.totals.shipping)}
                </dd>
              </div>
              {order.totals.codFee > 0 && (
                <div>
                  <dt>{text.checkout.codFee}</dt>
                  <dd>{money(order.totals.codFee)}</dd>
                </div>
              )}
              <div className="is-total">
                <dt>{text.checkout.total}</dt>
                <dd>{money(order.totals.total)}</dd>
              </div>
            </dl>
            <Typography.Text type="secondary">
              {text.checkout.vat(money(order.totals.vat))}
            </Typography.Text>
          </Card>

          <Card>
            <Descriptions
              size="small"
              column={1}
              items={[
                {
                  key: 'address',
                  label: text.order.address,
                  children: (
                    <address className="parts-order__address">
                      {order.address.fullName}
                      <br />
                      {order.address.line}
                      <br />
                      {order.address.postcode} {order.address.district} / {order.address.city}
                      <br />
                      {order.address.phone}
                    </address>
                  ),
                },
                {
                  key: 'delivery',
                  label: text.checkout.reviewDelivery,
                  children: text.shippingNames[order.shipping],
                },
                {
                  key: 'payment',
                  label: text.order.payment,
                  children: text.checkout.payments[order.payment],
                },
                ...(order.vehicle
                  ? [{ key: 'vehicle', label: text.order.vehicle, children: order.vehicle }]
                  : []),
              ]}
            />
          </Card>
        </div>
      </div>
    </>
  )
}

export function PartsOrderPage({ standalone = false }: PartsOrderPageProps) {
  const { text } = usePartsCopy()
  const root = partsRoot(standalone)
  const { orderId = '' } = useParams()
  const order = usePartsStore((state) => state.orders.find((entry) => entry.id === orderId))

  return (
    <PartsSiteShell standalone={standalone}>
      <div className="parts-section">
        {order ? (
          <OrderDetail order={order} root={root} />
        ) : (
          <Result
            status="404"
            title={text.order.notFound}
            subTitle={text.order.notFoundText}
            extra={
              <Link to={`${root}/orders`}>
                <Button type="primary">{text.order.back}</Button>
              </Link>
            }
          />
        )}
      </div>
    </PartsSiteShell>
  )
}
