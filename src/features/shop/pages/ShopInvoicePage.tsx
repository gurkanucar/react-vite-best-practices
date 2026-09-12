import { DownloadOutlined, LeftOutlined, SendOutlined } from '@ant-design/icons'
import { App, Button, Card, Col, Flex, Row, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { MoneySummary, useMoney } from '@/features/shop/components'
import { invoice } from '@/features/shop/data'
import { lineTotal, totalsFor, type InvoiceLine, type InvoiceStatus } from '@/features/shop/types'
import { useMessages } from '@/i18n/messages'

const statusColors: Record<InvoiceStatus, string> = {
  paid: 'success',
  pending: 'processing',
  overdue: 'error',
}

export function ShopInvoicePage() {
  const messages = useMessages()
  const { message } = App.useApp()
  const money = useMoney()
  const navigate = useNavigate()
  const totals = totalsFor(invoice.lines, invoice)

  const columns: ColumnsType<InvoiceLine> = [
    {
      title: messages.shop.serviceItem,
      dataIndex: 'titleId',
      key: 'item',
      render: (titleId: string, line) => (
        <div>
          <Typography.Text strong>
            {messages.shop.services[titleId as keyof typeof messages.shop.services]}
          </Typography.Text>
          <br />
          <Typography.Text type="secondary">
            {
              messages.shop.serviceDescriptions[
                line.descriptionId as keyof typeof messages.shop.serviceDescriptions
              ]
            }
          </Typography.Text>
        </div>
      ),
    },
    {
      title: messages.shop.quantityShort,
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right',
    },
    {
      title: messages.shop.unitPrice,
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      align: 'right',
      render: (price: number) => money(price),
    },
    {
      title: messages.shop.lineTotal,
      key: 'total',
      align: 'right',
      render: (_, line) => money(lineTotal(line.quantity, line.unitPrice)),
    },
  ]

  const party = (title: string, party: { name: string; address: string[]; phone: string }) => (
    <Col xs={24} md={12}>
      <Typography.Text type="secondary">{title}</Typography.Text>
      <Typography.Title level={5} className="shop-party-name">
        {party.name}
      </Typography.Title>
      {party.address.map((line) => (
        <Typography.Paragraph key={line} className="shop-party-line">
          {line}
        </Typography.Paragraph>
      ))}
      <Typography.Paragraph className="shop-party-line">{party.phone}</Typography.Paragraph>
    </Col>
  )

  return (
    <div className="admin-page">
      <PageHeader
        title={`${messages.shop.invoiceTitle} ${invoice.id}`}
        extra={
          <Flex gap={8} wrap>
            <Button
              icon={<DownloadOutlined aria-hidden="true" />}
              onClick={() => message.info(messages.shop.printHint)}
            >
              {messages.shop.downloadInvoice}
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined aria-hidden="true" />}
              onClick={() => message.success(messages.shop.sentInvoice)}
            >
              {messages.shop.sendInvoice}
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

      <Card>
        <Flex align="center" justify="space-between" gap={16} wrap>
          <Typography.Title level={4} className="shop-party-name">
            {invoice.id}
          </Typography.Title>
          <Tag color={statusColors[invoice.status]}>
            {messages.shop.invoiceStatuses[invoice.status]}
          </Tag>
        </Flex>

        <Row gutter={[16, 16]} className="shop-parties">
          {party(messages.shop.invoiceFrom, invoice.from)}
          {party(messages.shop.invoiceTo, invoice.to)}

          <Col xs={24} md={12}>
            <Typography.Text type="secondary">{messages.shop.issuedAt}</Typography.Text>
            <Typography.Paragraph className="shop-party-line">
              {invoice.issuedAt}
            </Typography.Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <Typography.Text type="secondary">{messages.shop.dueAt}</Typography.Text>
            <Typography.Paragraph className="shop-party-line">{invoice.dueAt}</Typography.Paragraph>
          </Col>
        </Row>

        <Table<InvoiceLine>
          rowKey="id"
          columns={columns}
          dataSource={invoice.lines}
          pagination={false}
          size="middle"
          scroll={{ x: 'max-content' }}
        />

        <MoneySummary totals={totals} />
      </Card>
    </div>
  )
}
