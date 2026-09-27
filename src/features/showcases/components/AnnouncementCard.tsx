import {
  ArrowRightOutlined,
  BellOutlined,
  CalendarOutlined,
  PaperClipOutlined,
} from '@ant-design/icons'
import { Button, Card, Flex, Tag, Typography } from 'antd'
import { formatPublicationDate, localize, type Publication } from '@/features/showcases/types'
import { usePreferencesStore } from '@/store/preferences-store'

const labels = {
  en: { view: 'View announcement' },
  tr: { view: 'Duyuruyu görüntüle' },
}

export function PublicationTags({ publication }: { publication: Publication }) {
  const language = usePreferencesStore((state) => state.language)

  if (!publication.tags?.length) return null

  return (
    <Flex className="publication-tags" gap={6} wrap>
      {publication.tags.map((tag) => (
        <Tag key={tag.en}>{localize(tag, language)}</Tag>
      ))}
    </Flex>
  )
}

/** The campus notice card, shared by the announcement list and the tech park's front page. */
export function AnnouncementCard({ item, detailPath }: { item: Publication; detailPath: string }) {
  const language = usePreferencesStore((state) => state.language)
  const text = labels[language]

  return (
    <Card className="announcement-card">
      {item.coverImage ? (
        // The cover is a way into the announcement, not a gallery; the detail page enlarges it.
        <a
          href={detailPath}
          className="announcement-card__cover-wrap"
          tabIndex={-1}
          aria-hidden="true"
        >
          <img
            className="announcement-card__cover"
            src={item.coverImage.src}
            alt=""
            loading="lazy"
          />
        </a>
      ) : (
        <div className="announcement-card__placeholder" aria-hidden="true">
          <BellOutlined />
        </div>
      )}
      <div className="announcement-card__content">
        <Flex className="announcement-card__meta" justify="space-between" gap={8} wrap>
          <Tag color="geekblue">{localize(item.category, language)}</Tag>
          <Typography.Text type="secondary">
            <CalendarOutlined /> {formatPublicationDate(item.date, language)}
          </Typography.Text>
        </Flex>
        <Typography.Title level={3}>{localize(item.title, language)}</Typography.Title>
        <Typography.Paragraph type="secondary">
          {localize(item.summary, language)}
        </Typography.Paragraph>
        <PublicationTags publication={item} />
        <Flex className="announcement-card__footer" align="center" justify="space-between" gap={12}>
          <Typography.Text type="secondary">
            {item.attachments?.length ? (
              <>
                <PaperClipOutlined /> {item.attachments.length}
              </>
            ) : null}
          </Typography.Text>
          <Button
            href={detailPath}
            type="primary"
            icon={<ArrowRightOutlined />}
            iconPlacement="end"
          >
            {text.view}
          </Button>
        </Flex>
      </div>
    </Card>
  )
}
