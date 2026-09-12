import { CheckCircleOutlined } from '@ant-design/icons'
import { Col, Flex, Row, Typography } from 'antd'
import type { Tour } from '@/features/tours/types'
import { useMessages } from '@/i18n/messages'

/**
 * Everything a tour could include is listed, with the ones it does not dimmed rather than
 * removed — the absence is the information.
 */
export function TourServices({ tour }: { tour: Tour }) {
  const messages = useMessages()

  return (
    <Row gutter={[8, 8]}>
      {tour.services.map((service) => (
        <Col key={service.id} xs={24} md={12}>
          <Flex align="center" gap={8}>
            <CheckCircleOutlined
              aria-hidden="true"
              className={service.included ? 'tour-service--on' : 'tour-service--off'}
            />
            <Typography.Text
              type={service.included ? undefined : 'secondary'}
              delete={!service.included}
            >
              {messages.tours.services[service.id as keyof typeof messages.tours.services]}
            </Typography.Text>
          </Flex>
        </Col>
      ))}
    </Row>
  )
}
