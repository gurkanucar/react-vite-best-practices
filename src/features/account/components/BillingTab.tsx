import { CreditCardOutlined, PlusOutlined } from '@ant-design/icons'
import { App, Button, Card, Col, Flex, Row, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { invoices, paymentCards } from '@/features/account/data'
import type { Invoice } from '@/features/account/types'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

const statusColors: Record<Invoice['statusId'], string> = {
  paid: 'success',
  pending: 'processing',
  overdue: 'error',
}

export function BillingTab() {
  const messages = useMessages()
  const { message } = App.useApp()
  const language = usePreferencesStore((state) => state.language)
  const locale = language === 'tr' ? 'tr-TR' : 'en-US'
  const [primaryCard, setPrimaryCard] = useState(
    paymentCards.find((card) => card.primary)?.id ?? paymentCards[0]?.id,
  )

  const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' })

  const columns: ColumnsType<Invoice> = [
    { title: messages.account.invoiceNumber, dataIndex: 'id', key: 'id' },
    { title: messages.account.issuedAt, dataIndex: 'issuedAt', key: 'issuedAt' },
    {
      title: messages.account.amount,
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount: number) => money.format(amount),
    },
    {
      title: messages.account.status,
      dataIndex: 'statusId',
      key: 'statusId',
      render: (status: Invoice['statusId']) => (
        <Tag color={statusColors[status]}>{messages.account.invoiceStatuses[status]}</Tag>
      ),
    },
    {
      title: messages.account.actions,
      key: 'actions',
      align: 'right',
      render: (_, invoice) => (
        <Button
          type="link"
          onClick={() => message.info(`${messages.account.downloadStarted}: ${invoice.id}`)}
        >
          {messages.account.download}
        </Button>
      ),
    },
  ]

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={10}>
        <Card
          title={messages.account.paymentMethods}
          extra={
            <Button
              type="link"
              icon={<PlusOutlined aria-hidden="true" />}
              onClick={() => message.info(messages.account.addCardHint)}
            >
              {messages.account.addCard}
            </Button>
          }
        >
          <Flex vertical gap={12}>
            {paymentCards.map((card) => (
              <Card key={card.id} size="small">
                <Flex align="center" justify="space-between" gap={12} wrap>
                  <Flex align="center" gap={12}>
                    <CreditCardOutlined aria-hidden="true" />
                    <div>
                      <Typography.Text strong>
                        {messages.account.cardBrands[card.brandId as 'visa' | 'mastercard']} ••••{' '}
                        {card.last4}
                      </Typography.Text>
                      <br />
                      <Typography.Text type="secondary">
                        {messages.account.expires} {card.expiry}
                      </Typography.Text>
                    </div>
                  </Flex>

                  {primaryCard === card.id ? (
                    <Tag color="blue">{messages.account.primaryCard}</Tag>
                  ) : (
                    <Button size="small" onClick={() => setPrimaryCard(card.id)}>
                      {messages.account.makePrimary}
                    </Button>
                  )}
                </Flex>
              </Card>
            ))}
          </Flex>
        </Card>
      </Col>

      <Col xs={24} lg={14}>
        <Card title={messages.account.invoiceHistory}>
          <Table<Invoice>
            rowKey="id"
            columns={columns}
            dataSource={invoices}
            pagination={false}
            size="middle"
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </Col>
    </Row>
  )
}
