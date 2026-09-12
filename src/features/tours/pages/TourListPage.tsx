import { PlusOutlined } from '@ant-design/icons'
import { App, Breadcrumb, Button, Col, Empty, Row } from 'antd'
import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { TourCard, TourToolbar } from '@/features/tours/components'
import { tours } from '@/features/tours/data'
import { applyTourFilters, DEFAULT_TOUR_FILTERS, type TourFilters } from '@/features/tours/types'
import { useMessages } from '@/i18n/messages'

export function TourListPage() {
  const messages = useMessages()
  const { message } = App.useApp()
  const [filters, setFilters] = useState<TourFilters>(DEFAULT_TOUR_FILTERS)

  const visible = applyTourFilters(
    tours,
    filters,
    (tour) => messages.tours.names[tour.nameId as keyof typeof messages.tours.names],
  )

  return (
    <div className="admin-page">
      <PageHeader
        title={messages.tours.listTitle}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined aria-hidden="true" />}
            onClick={() => message.info(messages.tours.addHint)}
          >
            {messages.tours.addTour}
          </Button>
        }
      />

      <Breadcrumb
        className="profile-breadcrumb"
        items={[
          { title: messages.navigation.dashboard },
          { title: messages.navigation.toursSection },
          { title: messages.tours.listTitle },
        ]}
      />

      <TourToolbar
        filters={filters}
        onChange={(patch) => setFilters((current) => ({ ...current, ...patch }))}
        onReset={() => setFilters(DEFAULT_TOUR_FILTERS)}
      />

      {visible.length === 0 ? (
        <Empty description={messages.tours.noResults} />
      ) : (
        <Row gutter={[16, 16]}>
          {visible.map((tour) => (
            <Col key={tour.id} xs={24} md={12} xl={8}>
              <TourCard tour={tour} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
