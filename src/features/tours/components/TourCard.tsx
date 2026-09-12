import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  MoreOutlined,
  StarFilled,
  TeamOutlined,
} from '@ant-design/icons'
import { App, Button, Card, Dropdown, Flex, Typography } from 'antd'
import { Link } from 'react-router'
import type { Tour } from '@/features/tours/types'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

interface TourCardProps {
  tour: Tour
}

export function TourCard({ tour }: TourCardProps) {
  const messages = useMessages()
  const { message } = App.useApp()
  const language = usePreferencesStore((state) => state.language)
  const locale = language === 'tr' ? 'tr-TR' : 'en-US'
  const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' })
  const name = messages.tours.names[tour.nameId as keyof typeof messages.tours.names]

  const facts = [
    {
      id: 'country',
      icon: (
        <EnvironmentOutlined
          aria-hidden="true"
          className="tour-fact__icon tour-fact__icon--place"
        />
      ),
      text: messages.tours.countries[tour.countryId as keyof typeof messages.tours.countries],
    },
    {
      id: 'dates',
      icon: (
        <ClockCircleOutlined aria-hidden="true" className="tour-fact__icon tour-fact__icon--time" />
      ),
      text: `${tour.startsOn} – ${tour.endsOn}`,
    },
    {
      id: 'booked',
      icon: <TeamOutlined aria-hidden="true" className="tour-fact__icon tour-fact__icon--people" />,
      text: messages.tours.bookedCount.replace('{count}', String(tour.bookedCount)),
    },
  ]

  return (
    <Card
      cover={
        /*
         * One large frame beside two stacked ones. A grid rather than three components,
         * because the shape is the design — there is no antd component for a mosaic.
         */
        <div className="tour-mosaic tour-mosaic--card">
          <img src={tour.images[0]} alt="" className="tour-mosaic__lead" />
          <img src={tour.images[1]} alt="" />
          <img src={tour.images[2]} alt="" />

          <div className="tour-price">
            <Typography.Text delete className="tour-price__was">
              {money.format(tour.compareAtPrice)}
            </Typography.Text>
            <Typography.Text strong className="tour-price__now">
              {money.format(tour.price)}
            </Typography.Text>
          </div>

          <div className="tour-rating">
            <StarFilled aria-hidden="true" /> {tour.rating}
          </div>
        </div>
      }
    >
      <Typography.Text type="secondary" className="tour-posted">
        {messages.tours.postedAt} {tour.postedAt}
      </Typography.Text>

      <Typography.Title level={5} className="tour-card__title">
        <Link to={`/tours/${tour.id}`}>{name}</Link>
      </Typography.Title>

      <Flex align="end" justify="space-between" gap={8}>
        <Flex vertical gap={6}>
          {facts.map((fact) => (
            <Flex key={fact.id} align="center" gap={8}>
              {fact.icon}
              <Typography.Text type="secondary">{fact.text}</Typography.Text>
            </Flex>
          ))}
        </Flex>

        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              { key: 'view', label: <Link to={`/tours/${tour.id}`}>{messages.tours.view}</Link> },
              {
                key: 'edit',
                label: messages.tours.edit,
                onClick: () => message.info(messages.tours.editHint),
              },
              { type: 'divider' },
              {
                key: 'delete',
                label: messages.tours.delete,
                danger: true,
                onClick: () => message.info(messages.tours.deleteHint),
              },
            ],
          }}
        >
          <Button
            type="text"
            aria-label={`${messages.tours.actions}: ${name}`}
            icon={<MoreOutlined aria-hidden="true" />}
          />
        </Dropdown>
      </Flex>
    </Card>
  )
}
