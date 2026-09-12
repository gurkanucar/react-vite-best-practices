import { LeftOutlined, PrinterOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Row,
  Steps,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { MoneySummary, useMoney } from '@/features/shop/components'
import { order } from '@/features/shop/data'
import { lineTotal, totalsFor, type OrderLine, type OrderStatus } from '@/features/shop/types'
import { useMessages } from '@/i18n/messages'

const statusColors: Record<OrderStatus, string> = {
  pending: 'default',
  packing: 'processing',
  shipped: 'blue',
  delivered: 'success',
}

export function ShopOrderPage() {
  const messages = useMessages()
  const { message } = App.useApp()
  const money = useMoney()
  const navigate = useNavigate()
  const [status, setStatus] = useState(order.status)

  const totals = totalsFor(order.lines, order)
  const columns: ColumnsType<OrderLine> = [
    {
      title: messages.shop.product,
      dataIndex: 'nameId',
      key: 'product',
      render: (nameId: string, line) => (
        <Flex align="center" gap={12}>
          <img src={line.image} alt="" className="shop-line-image" />
          <div>
            <Typography.Text strong>
              {messages.shop.products[nameId as keyof typeof messages.shop.products]}
            </Typography.Text>
            <br />
            <Typography.Text type="secondary">{line.sku}</Typography.Text>
          </div>
        </Flex>
      ),
    },
    {
      title: messages.shop.unitPrice,
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      align: 'right',
      render: (price: number) => money(price),
    },
    {
      title: messages.shop.quantityShort,
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right',
    },
    {
      title: messages.shop.lineTotal,
      key: 'total',
      align: 'right',
      render: (_, line) => money(lineTotal(line.quantity, line.unitPrice)),
    },
  ]

  return (
    <div className="admin-page">
      <PageHeader
        title={`${messages.shop.orderTitle} ${order.id}`}
        extra={
          <Flex gap={8} wrap>
            <Button
              icon={<PrinterOutlined aria-hidden="true" />}
              onClick={() => message.info(messages.shop.printHint)}
            >
              {messages.shop.printOrder}
            </Button>
            <Button
              type="primary"
              disabled={status === 'delivered'}
              onClick={() => {
                setStatus('delivered')
                message.success(messages.shop.markedDelivered)
              }}
            >
              {messages.shop.markDelivered}
            </Button>
          </Flex>
        }
      />

      <Button
        type="link"
        className="shop-back"
        icon={<LeftOutlined aria-hidden="true" />}
        onClick={() => navigate(-1)}
      >
        {messages.shop.back}
      </Button>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Flex vertical gap={16}>
            <Card title={messages.shop.items}>
              <Table<OrderLine>
                rowKey="id"
                columns={columns}
                dataSource={order.lines}
                pagination={false}
                size="middle"
                scroll={{ x: 'max-content' }}
              />
              <MoneySummary totals={totals} />
            </Card>

            <Card title={messages.shop.timeline}>
              {/*
               * `Steps` already knows how to draw a progression; the only work is saying
               * which step the order has reached.
               */}
              <Steps
                orientation="vertical"
                size="small"
                current={order.timeline.filter((event) => event.done).length - 1}
                items={order.timeline.map((event) => ({
                  title:
                    messages.shop.orderEvents[event.id as keyof typeof messages.shop.orderEvents],
                  content: event.done ? event.at : `${messages.shop.expected} ${event.at}`,
                }))}
              />
            </Card>
          </Flex>
        </Col>

        <Col xs={24} xl={8}>
          <Card>
            <Descriptions column={1} size="small" styles={{ label: { width: 140 } }}>
              <Descriptions.Item label={messages.shop.orderStatus}>
                <Tag color={statusColors[status]}>{messages.shop.orderStatuses[status]}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={messages.shop.orderPlaced}>
                {order.placedAt}
              </Descriptions.Item>
              <Descriptions.Item label={messages.shop.customer}>
                <div>
                  {order.customer.name}
                  <br />
                  <Typography.Text type="secondary">{order.customer.email}</Typography.Text>
                  <br />
                  <Typography.Text type="secondary">{order.customer.phone}</Typography.Text>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label={messages.shop.shipTo}>
                <div>
                  {order.shipTo.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label={messages.shop.shippingMethod}>
                {
                  messages.shop.shippingMethods[
                    order.shippingMethodId as keyof typeof messages.shop.shippingMethods
                  ]
                }
              </Descriptions.Item>
              <Descriptions.Item label={messages.shop.tracking}>
                <Typography.Text copyable>{order.trackingNumber}</Typography.Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
