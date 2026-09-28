import {
  ArrowRightOutlined,
  BellOutlined,
  CalendarOutlined,
  PaperClipOutlined,
  ReadOutlined,
} from '@ant-design/icons'
import { Button, Card, Flex, Tag, Typography } from 'antd'
import { formatPublicationDate, localize, type Publication } from '@/features/showcases/types'
import { usePreferencesStore } from '@/store/preferences-store'

const labels = {
  en: {
    view: 'View announcement',
    read: 'Read story',
    type: { news: 'News', announcement: 'Announcement' },
  },
  tr: {
    view: 'Duyuruyu görüntüle',
    read: 'Haberi oku',
    type: { news: 'Haber', announcement: 'Duyuru' },
  },
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
  const isStory = item.type === 'news'

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
          {isStory ? <ReadOutlined /> : <BellOutlined />}
        </div>
      )}
      <div className="announcement-card__content">
        <Flex className="announcement-card__meta" justify="space-between" gap={8} wrap>
          <Flex gap={6} wrap>
            {item.type && (
              <Tag color={isStory ? 'cyan' : 'gold'} variant="solid">
                {text.type[item.type]}
              </Tag>
            )}
            <Tag color="geekblue">{localize(item.category, language)}</Tag>
          </Flex>
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
            {isStory ? text.read : text.view}
          </Button>
        </Flex>
      </div>
    </Card>
  )
}
