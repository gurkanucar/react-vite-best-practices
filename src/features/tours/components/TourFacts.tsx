import {
  CalendarOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Col, Flex, Row, Typography } from 'antd'
import type { ReactNode } from 'react'
import type { Tour } from '@/features/tours/types'
import { useMessages } from '@/i18n/messages'

interface Fact {
  id: string
  icon: ReactNode
  label: string
  value: string
}

export function TourFacts({ tour }: { tour: Tour }) {
  const messages = useMessages()

  const facts: Fact[] = [
    {
      id: 'available',
      icon: <CalendarOutlined aria-hidden="true" />,
      label: messages.tours.available,
      value: `${tour.startsOn} – ${tour.endsOn}`,
    },
    {
      id: 'contactName',
      icon: <UserOutlined aria-hidden="true" />,
      label: messages.tours.contactName,
      value: tour.guides.join(', '),
    },
    {
      id: 'duration',
      icon: <ClockCircleOutlined aria-hidden="true" />,
      label: messages.tours.duration,
      value: messages.tours.durationValue
        .replace('{days}', String(tour.durationNights + 1))
        .replace('{nights}', String(tour.durationNights)),
    },
    {
      id: 'contactPhone',
      icon: <PhoneOutlined aria-hidden="true" />,
      label: messages.tours.contactPhone,
      value: tour.contactPhones.join(', '),
    },
  ]

  return (
    <Row gutter={[16, 16]}>
      {facts.map((fact) => (
        <Col key={fact.id} xs={24} md={12}>
          <Flex gap={12} align="start">
            <Typography.Text type="secondary">{fact.icon}</Typography.Text>
            <div>
              <Typography.Text type="secondary">{fact.label}</Typography.Text>
              <br />
              <Typography.Text strong>{fact.value}</Typography.Text>
            </div>
          </Flex>
        </Col>
      ))}
    </Row>
  )
}
