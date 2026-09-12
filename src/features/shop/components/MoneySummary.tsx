import { Divider, Flex, Typography } from 'antd'
import { useMoney } from '@/features/shop/components/useMoney'
import type { MoneyTotals } from '@/features/shop/types'
import { useMessages } from '@/i18n/messages'

/** The subtotal-to-total block, shared by the order and the invoice. */
export function MoneySummary({ totals }: { totals: MoneyTotals }) {
  const messages = useMessages()
  const money = useMoney()

  const rows = [
    { id: 'subtotal', label: messages.shop.subtotal, value: money(totals.subtotal) },
    { id: 'discount', label: messages.shop.discount, value: `−${money(totals.discount)}` },
    { id: 'shipping', label: messages.shop.shipping, value: money(totals.shipping) },
    { id: 'tax', label: messages.shop.tax, value: money(totals.tax) },
  ]

  return (
    <Flex vertical gap={8} className="shop-summary">
      {rows.map((row) => (
        <Flex key={row.id} justify="space-between" gap={16}>
          <Typography.Text type="secondary">{row.label}</Typography.Text>
          <Typography.Text>{row.value}</Typography.Text>
        </Flex>
      ))}

      <Divider className="product-divider" />

      <Flex justify="space-between" gap={16}>
        <Typography.Text strong>{messages.shop.total}</Typography.Text>
        <Typography.Title level={5} className="shop-summary__total">
          {money(totals.total)}
        </Typography.Title>
      </Flex>
    </Flex>
  )
}
