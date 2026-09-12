import { Card, Col, Image, Row, Typography } from 'antd'
import { gallery } from '@/features/profile/data'
import { useMessages } from '@/i18n/messages'

export function ProfileGallery() {
  const messages = useMessages()

  return (
    <Card title={messages.profile.gallery}>
      {/* One preview group, so the arrows step through the whole gallery. */}
      <Image.PreviewGroup>
        <Row gutter={[16, 16]}>
          {gallery.map((item) => {
            // A gallery image is the content, not decoration, so it is named rather than
            // hidden from assistive technology with an empty alt.
            const subject =
              messages.profile.gallerySubjects[
                item.titleId as keyof typeof messages.profile.gallerySubjects
              ]

            return (
              <Col key={item.id} xs={24} sm={12} xl={8}>
                <Card
                  cover={
                    <Image src={item.image} alt={subject} className="profile-gallery__image" />
                  }
                >
                  <Card.Meta
                    title={subject}
                    description={<Typography.Text type="secondary">{item.takenAt}</Typography.Text>}
                  />
                </Card>
              </Col>
            )
          })}
        </Row>
      </Image.PreviewGroup>
    </Card>
  )
}
