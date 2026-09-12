import {
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  FlagOutlined,
  HeartFilled,
  HeartOutlined,
  LeftOutlined,
  ShareAltOutlined,
  StarFilled,
} from '@ant-design/icons'
import { App, Badge, Button, Card, Divider, Dropdown, Flex, Result, Tabs, Typography } from 'antd'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { TourBookers, TourFacts, TourGallery, TourServices } from '@/features/tours/components'
import { findTour } from '@/features/tours/data'
import type { TourStatus } from '@/features/tours/types'
import { useMessages } from '@/i18n/messages'

export function TourDetailPage() {
  const messages = useMessages()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const { tourId } = useParams()
  const tour = findTour(tourId)

  const [favourite, setFavourite] = useState(false)
  const [status, setStatus] = useState<TourStatus>(tour?.status ?? 'draft')

  if (!tour) {
    return (
      <div className="admin-page">
        <Result
          status="404"
          title={messages.tours.notFound}
          subTitle={messages.tours.notFoundHint}
          extra={
            <Link to="/tours">
              <Button type="primary">{messages.tours.backToList}</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const name = messages.tours.names[tour.nameId as keyof typeof messages.tours.names]

  return (
    <div className="admin-page">
      <PageHeader
        title={name}
        extra={
          <Flex align="center" gap={8} wrap>
            <Button
              type="text"
              aria-label={messages.tours.preview}
              icon={<EyeOutlined aria-hidden="true" />}
              onClick={() => message.info(messages.tours.previewHint)}
            />
            <Button
              type="text"
              aria-label={messages.tours.edit}
              icon={<EditOutlined aria-hidden="true" />}
              onClick={() => message.info(messages.tours.editHint)}
            />
            <Dropdown
              trigger={['click']}
              menu={{
                selectable: true,
                selectedKeys: [status],
                items: [
                  { key: 'published', label: messages.tours.statuses.published },
                  { key: 'draft', label: messages.tours.statuses.draft },
                ],
                onClick: ({ key }) => setStatus(key as TourStatus),
              }}
            >
              <Button type="primary">{messages.tours.statuses[status]}</Button>
            </Dropdown>
          </Flex>
        }
      />

      <Button
        type="link"
        className="shop-back"
        icon={<LeftOutlined aria-hidden="true" />}
        onClick={() => navigate(-1)}
      >
        {messages.tours.back}
      </Button>

      <Tabs
        items={[
          {
            key: 'content',
            label: messages.tours.tourContent,
            children: (
              <Card>
                <TourGallery images={tour.images} alt={name} />

                <Flex
                  align="center"
                  justify="space-between"
                  gap={16}
                  wrap
                  className="tour-detail__heading"
                >
                  <Typography.Title level={3} className="tour-card__title">
                    {name}
                  </Typography.Title>

                  <Flex gap={4}>
                    <Button
                      type="text"
                      aria-label={messages.tours.share}
                      icon={<ShareAltOutlined aria-hidden="true" />}
                    />
                    <Button
                      type="text"
                      aria-label={messages.tours.favourite}
                      aria-pressed={favourite}
                      onClick={() => setFavourite((current) => !current)}
                      icon={
                        favourite ? (
                          <HeartFilled
                            aria-hidden="true"
                            style={{ color: 'var(--ant-color-error)' }}
                          />
                        ) : (
                          <HeartOutlined aria-hidden="true" />
                        )
                      }
                    />
                  </Flex>
                </Flex>

                <Flex align="center" gap={16} wrap className="tour-detail__meta">
                  <Flex align="center" gap={6}>
                    <StarFilled aria-hidden="true" className="tour-star" />
                    <Typography.Text strong>{tour.rating}</Typography.Text>
                    <Typography.Text type="secondary">
                      {messages.tours.reviewCount.replace('{count}', String(tour.reviewCount))}
                    </Typography.Text>
                  </Flex>

                  <Flex align="center" gap={6}>
                    <EnvironmentOutlined aria-hidden="true" className="tour-fact__icon--place" />
                    <Typography.Text>
                      {
                        messages.tours.countries[
                          tour.countryId as keyof typeof messages.tours.countries
                        ]
                      }
                    </Typography.Text>
                  </Flex>

                  <Flex align="center" gap={6}>
                    <FlagOutlined aria-hidden="true" />
                    <Typography.Text type="secondary">{messages.tours.guideBy}</Typography.Text>
                    <Typography.Text strong>{tour.guides.join(', ')}</Typography.Text>
                  </Flex>
                </Flex>

                <Divider />
                <TourFacts tour={tour} />
                <Divider />

                <Typography.Title level={5}>{messages.tours.description}</Typography.Title>
                <Typography.Paragraph type="secondary">
                  {messages.tours.descriptionBody}
                </Typography.Paragraph>

                <Typography.Title level={5}>{messages.tours.highlightsTitle}</Typography.Title>
                <Typography>
                  <ul>
                    {tour.highlightIds.map((id) => (
                      <li key={id}>
                        {messages.tours.highlights[id as keyof typeof messages.tours.highlights]}
                      </li>
                    ))}
                  </ul>
                </Typography>

                <Typography.Title level={5}>{messages.tours.program}</Typography.Title>
                {tour.program.map((day, index) => (
                  <div key={day.bodyId}>
                    <Typography.Text strong>
                      {messages.tours.day.replace('{number}', String(index + 1))}
                    </Typography.Text>
                    <Typography.Paragraph type="secondary">
                      {
                        messages.tours.programDays[
                          day.bodyId as keyof typeof messages.tours.programDays
                        ]
                      }
                    </Typography.Paragraph>
                  </div>
                ))}

                <Typography.Title level={5}>{messages.tours.servicesTitle}</Typography.Title>
                <TourServices tour={tour} />
              </Card>
            ),
          },
          {
            key: 'bookers',
            label: (
              <Flex align="center" gap={8}>
                <span>{messages.tours.booker}</span>
                <Badge count={tour.bookers.length} color="blue" />
              </Flex>
            ),
            children: (
              <Card>
                <TourBookers tour={tour} />
              </Card>
            ),
          },
        ]}
      />
    </div>
  )
}
