import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BellOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Empty, Flex, Row, Space, Tag, Typography } from 'antd'
import { useParams } from 'react-router'
import { CorporateSiteShell, ShowcasePreviewFrame } from '@/features/showcases/components'
import { corporateAnnouncements, corporateNews } from '@/features/showcases/data'
import { localize, type Publication } from '@/features/showcases/types'
import { usePreferencesStore } from '@/store/preferences-store'
import '../showcases.css'

type PublicationKind = 'news' | 'announcements'

interface PublicationPageProps {
  kind: PublicationKind
  standalone?: boolean
}

const labels = {
  en: {
    news: 'Newsroom',
    announcements: 'Announcements',
    newsDescription: 'Reporting on the decisions, people, and projects moving our group forward.',
    announcementsDescription: 'Formal notices and operational updates from Northstar Group.',
    read: 'Read article',
    view: 'View announcement',
    back: 'Back to all',
    notFound: 'This publication could not be found.',
    home: 'Northstar Group',
  },
  tr: {
    news: 'Haberler',
    announcements: 'Duyurular',
    newsDescription: 'Grubumuzu ileri taşıyan kararlar, insanlar ve projelerden haberler.',
    announcementsDescription: 'Northstar Group resmî bildirimleri ve operasyon güncellemeleri.',
    read: 'Haberi oku',
    view: 'Duyuruyu görüntüle',
    back: 'Tümüne dön',
    notFound: 'Bu yayın bulunamadı.',
    home: 'Northstar Group',
  },
}

function dataFor(kind: PublicationKind): Publication[] {
  return kind === 'news' ? corporateNews : corporateAnnouncements
}

function pathsFor(kind: PublicationKind, standalone: boolean) {
  const root = standalone ? '/preview/corporate' : '/showcases/corporate'
  return { home: root, list: `${root}/${kind}` }
}

function formatDate(date: string, language: 'en' | 'tr'): string {
  return new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}

function PublicationListPage({ kind, standalone = false }: PublicationPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = labels[language]
  const publications = dataFor(kind)
  const paths = pathsFor(kind, standalone)
  const title = kind === 'news' ? text.news : text.announcements
  const description = kind === 'news' ? text.newsDescription : text.announcementsDescription
  const englishDescription =
    kind === 'news' ? labels.en.newsDescription : labels.en.announcementsDescription
  const turkishDescription =
    kind === 'news' ? labels.tr.newsDescription : labels.tr.announcementsDescription

  const page = (
    <CorporateSiteShell standalone={standalone}>
      <section className="publication-hero">
        <Tag variant="filled" icon={kind === 'news' ? <FileTextOutlined /> : <BellOutlined />}>
          {language === 'tr' ? 'Medya merkezi' : 'Media center'}
        </Tag>
        <Typography.Title>{title}</Typography.Title>
        <Typography.Paragraph>{description}</Typography.Paragraph>
      </section>

      <section className="showcase-section publication-grid">
        <Row gutter={[24, 24]}>
          {publications.map((item, index) => (
            <Col xs={24} md={index === 0 ? 24 : 12} key={item.slug}>
              <Card
                className={
                  index === 0 ? 'publication-card publication-card--lead' : 'publication-card'
                }
                variant="borderless"
              >
                <div className="publication-card__content">
                  <Flex className="publication-card__meta" gap={8} align="center" wrap>
                    <Tag variant="filled">{localize(item.category, language)}</Tag>
                    <Typography.Text type="secondary">
                      <CalendarOutlined /> {formatDate(item.date, language)}
                    </Typography.Text>
                  </Flex>
                  <Typography.Title level={index === 0 ? 2 : 3}>
                    {localize(item.title, language)}
                  </Typography.Title>
                  <Typography.Paragraph type="secondary">
                    {localize(item.summary, language)}
                  </Typography.Paragraph>
                  <Button
                    href={`${paths.list}/${item.slug}`}
                    type="link"
                    icon={<ArrowRightOutlined />}
                    iconPlacement="end"
                  >
                    {kind === 'news' ? text.read : text.view}
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </CorporateSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={`/preview/corporate/${kind}`}
      title={{
        en: kind === 'news' ? 'Corporate news' : 'Corporate announcements',
        tr: kind === 'news' ? labels.tr.news : labels.tr.announcements,
      }}
      description={{ en: englishDescription, tr: turkishDescription }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}

function PublicationDetailPage({ kind, standalone = false }: PublicationPageProps) {
  const { slug } = useParams<{ slug: string }>()
  const language = usePreferencesStore((state) => state.language)
  const text = labels[language]
  const publication = dataFor(kind).find((item) => item.slug === slug)
  const paths = pathsFor(kind, standalone)
  const listTitle = kind === 'news' ? text.news : text.announcements

  const page = (
    <CorporateSiteShell standalone={standalone}>
      {publication ? (
        <article className="publication-detail">
          <Breadcrumb
            items={[
              { title: <a href={paths.home}>{text.home}</a> },
              { title: <a href={paths.list}>{listTitle}</a> },
              { title: localize(publication.category, language) },
            ]}
          />
          <div className="publication-detail__heading">
            <Tag variant="filled">{localize(publication.category, language)}</Tag>
            <Typography.Title>{localize(publication.title, language)}</Typography.Title>
            <Typography.Paragraph>{localize(publication.summary, language)}</Typography.Paragraph>
            <Space separator="·">
              <Typography.Text type="secondary">
                {formatDate(publication.date, language)}
              </Typography.Text>
              {publication.readingTime && (
                <Typography.Text type="secondary">
                  {localize(publication.readingTime, language)}
                </Typography.Text>
              )}
            </Space>
          </div>
          <div className="publication-detail__visual" aria-hidden="true">
            <span>NORTHSTAR / 2026</span>
          </div>
          <div className="publication-detail__body">
            {publication.body.map((paragraph) => (
              <Typography.Paragraph key={paragraph.en}>
                {localize(paragraph, language)}
              </Typography.Paragraph>
            ))}
            <Button href={paths.list} icon={<ArrowLeftOutlined />}>
              {text.back} {listTitle.toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-GB')}
            </Button>
          </div>
        </article>
      ) : (
        <div className="publication-empty">
          <Empty description={text.notFound}>
            <Button href={paths.list}>{text.back}</Button>
          </Empty>
        </div>
      )}
    </CorporateSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={`/preview/corporate/${kind}/${slug ?? ''}`}
      title={{
        en: kind === 'news' ? 'News detail' : 'Announcement detail',
        tr: `${listTitle} detayı`,
      }}
      description={{
        en: 'A standalone editorial detail template with breadcrumb navigation.',
        tr: 'Breadcrumb navigasyonlu bağımsız editoryal detay şablonu.',
      }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}

export function CorporateNewsPage({ standalone = false }: Omit<PublicationPageProps, 'kind'>) {
  return <PublicationListPage kind="news" standalone={standalone} />
}

export function CorporateNewsDetailPage({
  standalone = false,
}: Omit<PublicationPageProps, 'kind'>) {
  return <PublicationDetailPage kind="news" standalone={standalone} />
}

export function CorporateAnnouncementsPage({
  standalone = false,
}: Omit<PublicationPageProps, 'kind'>) {
  return <PublicationListPage kind="announcements" standalone={standalone} />
}

export function CorporateAnnouncementDetailPage({
  standalone = false,
}: Omit<PublicationPageProps, 'kind'>) {
  return <PublicationDetailPage kind="announcements" standalone={standalone} />
}
