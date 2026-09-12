import { ClockCircleOutlined, SafetyCertificateOutlined, VerifiedOutlined } from '@ant-design/icons'
import { Col, Flex, Row, Typography } from 'antd'
import { useMessages } from '@/i18n/messages'

const icons = [VerifiedOutlined, ClockCircleOutlined, SafetyCertificateOutlined]
const ids = ['original', 'replacement', 'warranty'] as const

export function ProductHighlights() {
  const messages = useMessages()

  return (
    <Row gutter={[16, 24]} className="product-highlights">
      {ids.map((id, index) => {
        const Icon = icons[index]!
        const copy = messages.shop.highlights[id]

        return (
          <Col key={id} xs={24} md={8}>
            <Flex vertical align="center" gap={8} className="product-highlight">
              <Icon aria-hidden="true" className="product-highlight__icon" />
              <Typography.Text strong>{copy.title}</Typography.Text>
              <Typography.Text type="secondary">{copy.description}</Typography.Text>
            </Flex>
          </Col>
        )
      })}
    </Row>
  )
}
