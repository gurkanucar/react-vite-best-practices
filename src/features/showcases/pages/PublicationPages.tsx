import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BellOutlined,
  CalendarOutlined,
  DownloadOutlined,
  FileTextOutlined,
  PaperClipOutlined,
  PictureOutlined,
} from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Flex,
  Image,
  Pagination,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd'
import type { ReactNode } from 'react'
import { useParams, useSearchParams } from 'react-router'
import {
  AnnouncementCard,
  CorporateSiteShell,
  PublicationTags,
  ShowcasePreviewFrame,
  TechParkSiteShell,
} from '@/features/showcases/components'
import { campusAnnouncements, corporateNews } from '@/features/showcases/data'
import { formatPublicationDate, localize, type Publication } from '@/features/showcases/types'
import { usePreferencesStore } from '@/store/preferences-store'
import '../showcases.css'

type PublicationKind = 'news' | 'announcements'

interface PublicationPageProps {
  kind: PublicationKind
  standalone?: boolean
}

const PAGE_SIZE = 6

const labels = {
  en: {
    news: 'Newsroom',
    announcements: 'Campus announcements',
    newsDescription: 'Reporting on the decisions, people, and projects moving our group forward.',
    announcementsDescription:
      'Deadlines, campus operations, programs, and service updates for the Aurora community.',
    read: 'Read article',
    back: 'Back to all',
    notFound: 'This publication could not be found.',
    newsHome: 'Northstar Group',
    announcementHome: 'Aurora Tech Park',
    mediaCenter: 'Media center',
    campusDesk: 'Campus desk',
    activeNotices: 'Active notices',
    withAttachments: 'With attachments',
    visualUpdates: 'Visual updates',
    attachments: 'Attachments',
    gallery: 'Image gallery',
    previewImage: 'Preview image',
    download: 'Download',
    showing: (start: number, end: number, total: number) => `Showing ${start}–${end} of ${total}`,
  },
  tr: {
    news: 'Haberler',
    announcements: 'Kampüs duyuruları',
    newsDescription: 'Grubumuzu ileri taşıyan kararlar, insanlar ve projelerden haberler.',
    announcementsDescription:
      'Aurora topluluğu için tarihler, kampüs operasyonları, programlar ve servis güncellemeleri.',
    read: 'Haberi oku',
    back: 'Tümüne dön',
    notFound: 'Bu yayın bulunamadı.',
    newsHome: 'Northstar Group',
    announcementHome: 'Aurora Teknopark',
    mediaCenter: 'Medya merkezi',
    campusDesk: 'Kampüs masası',
    activeNotices: 'Aktif duyuru',
    withAttachments: 'Ek dosyalı',
    visualUpdates: 'Görsel içerikli',
    attachments: 'Ek dosyalar',
    gallery: 'Görsel galeri',
    previewImage: 'Görseli büyüt',
    download: 'İndir',
    showing: (start: number, end: number, total: number) =>
      `${total} kaydın ${start}–${end} arası gösteriliyor`,
  },
}

function dataFor(kind: PublicationKind): Publication[] {
  return kind === 'news' ? corporateNews : campusAnnouncements
}

function pathsFor(kind: PublicationKind, standalone: boolean) {
  const routeRoot = standalone ? '/preview' : '/showcases'
  // News belongs to Northstar's site; announcements are the tech park's own notices.
  const home = kind === 'news' ? `${routeRoot}/corporate` : `${routeRoot}/technopark`
  return { home, list: `${home}/${kind}` }
}

function PublicationSite({
  children,
  kind,
  standalone,
}: {
  children: ReactNode
  kind: PublicationKind
  standalone: boolean
}) {
  return kind === 'news' ? (
    <CorporateSiteShell standalone={standalone}>{children}</CorporateSiteShell>
  ) : (
    <TechParkSiteShell rootPath={pathsFor(kind, standalone).home} className="announcement-site">
      {children}
    </TechParkSiteShell>
  )
}

function NewsCard({
  item,
  lead,
  detailPath,
}: {
  item: Publication
  lead: boolean
  detailPath: string
}) {
  const language = usePreferencesStore((state) => state.language)
  const text = labels[language]

  return (
    <Card
      className={lead ? 'publication-card publication-card--lead' : 'publication-card'}
      variant="borderless"
    >
      <div className="publication-card__layout">
        {item.coverImage && (
          <Image
            rootClassName="publication-card__cover-wrap"
            className="publication-card__cover"
            src={item.coverImage.src}
            alt={localize(item.coverImage.alt, language)}
            preview={{
              cover: (
                <Space size={6}>
                  <PictureOutlined /> {text.previewImage}
                </Space>
              ),
            }}
          />
        )}
        <div className="publication-card__content">
          <Flex className="publication-card__meta" gap={8} align="center" wrap>
            <Tag color="volcano">{localize(item.category, language)}</Tag>
            <Typography.Text type="secondary">
              <CalendarOutlined /> {formatPublicationDate(item.date, language)}
            </Typography.Text>
          </Flex>
          <Typography.Title level={lead ? 2 : 3}>{localize(item.title, language)}</Typography.Title>
          <Typography.Paragraph type="secondary">
            {localize(item.summary, language)}
          </Typography.Paragraph>
          <PublicationTags publication={item} />
          <Button href={detailPath} type="link" icon={<ArrowRightOutlined />} iconPlacement="end">
            {text.read}
          </Button>
        </div>
      </div>
    </Card>
  )
}

function PublicationListPage({ kind, standalone = false }: PublicationPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = labels[language]
  const publications = dataFor(kind)
  const paths = pathsFor(kind, standalone)
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedPage = Number(searchParams.get('page'))
  const pageCount = Math.max(1, Math.ceil(publications.length / PAGE_SIZE))
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, pageCount) : 1
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const visiblePublications = publications.slice(pageStart, pageStart + PAGE_SIZE)
  const title = kind === 'news' ? text.news : text.announcements
  const description = kind === 'news' ? text.newsDescription : text.announcementsDescription
  const englishDescription =
    kind === 'news' ? labels.en.newsDescription : labels.en.announcementsDescription
  const turkishDescription =
    kind === 'news' ? labels.tr.newsDescription : labels.tr.announcementsDescription
  const isNews = kind === 'news'

  const changePage = (page: number) => {
    const nextSearchParams = new URLSearchParams(searchParams)
    if (page === 1) nextSearchParams.delete('page')
    else nextSearchParams.set('page', String(page))
    setSearchParams(nextSearchParams)
  }

  const page = (
    <PublicationSite kind={kind} standalone={standalone}>
      <section
        className={isNews ? 'publication-hero' : 'publication-hero publication-hero--modern'}
      >
        <Tag
          color={isNews ? 'volcano' : 'geekblue'}
          icon={isNews ? <FileTextOutlined /> : <BellOutlined />}
        >
          {isNews ? text.mediaCenter : text.campusDesk}
        </Tag>
        <Typography.Title>{title}</Typography.Title>
        <Typography.Paragraph className="publication-hero__description">
          {description}
        </Typography.Paragraph>

        {!isNews && (
          <Row className="announcement-overview" gutter={[16, 16]}>
            <Col xs={8}>
              <Card size="small">
                <Typography.Text type="secondary">{text.activeNotices}</Typography.Text>
                <Typography.Title level={3}>{publications.length}</Typography.Title>
              </Card>
            </Col>
            <Col xs={8}>
              <Card size="small">
                <Typography.Text type="secondary">{text.withAttachments}</Typography.Text>
                <Typography.Title level={3}>
                  {publications.filter((item) => item.attachments?.length).length}
                </Typography.Title>
              </Card>
            </Col>
            <Col xs={8}>
              <Card size="small">
                <Typography.Text type="secondary">{text.visualUpdates}</Typography.Text>
                <Typography.Title level={3}>
                  {publications.filter((item) => item.coverImage).length}
                </Typography.Title>
              </Card>
            </Col>
          </Row>
        )}
      </section>

      <section className="showcase-section publication-grid">
        <Row gutter={[24, 24]}>
          {visiblePublications.map((item, index) => {
            const detailPath = `${paths.list}/${item.slug}`
            const lead = isNews && currentPage === 1 && index === 0

            return (
              <Col xs={24} md={lead ? 24 : 12} xl={isNews || lead ? undefined : 8} key={item.slug}>
                {isNews ? (
                  <NewsCard item={item} lead={lead} detailPath={detailPath} />
                ) : (
                  <AnnouncementCard item={item} detailPath={detailPath} />
                )}
              </Col>
            )
          })}
        </Row>

        <Flex className="publication-pagination" vertical align="center" gap={12}>
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={publications.length}
            showSizeChanger={false}
            onChange={changePage}
          />
          <Typography.Text type="secondary">
            {text.showing(
              pageStart + 1,
              Math.min(pageStart + PAGE_SIZE, publications.length),
              publications.length,
            )}
          </Typography.Text>
        </Flex>
      </section>
    </PublicationSite>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={pathsFor(kind, true).list}
      title={{
        en: kind === 'news' ? 'Corporate news' : 'Tech park announcements',
        tr: kind === 'news' ? labels.tr.news : labels.tr.announcements,
      }}
      description={{ en: englishDescription, tr: turkishDescription }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}

function PublicationGallery({ publication }: { publication: Publication }) {
  const language = usePreferencesStore((state) => state.language)
  const text = labels[language]

  if (!publication.gallery?.length) return null

  return (
    <section className="publication-gallery">
      <Divider titlePlacement="start">
        <PictureOutlined /> {text.gallery}
      </Divider>
      <Row gutter={[16, 16]}>
        {publication.gallery.map((image) => (
          <Col xs={24} sm={12} key={`${publication.slug}-${image.src}`}>
            <figure>
              <Image src={image.src} alt={localize(image.alt, language)} />
              {image.caption && (
                <Typography.Text type="secondary">
                  {localize(image.caption, language)}
                </Typography.Text>
              )}
            </figure>
          </Col>
        ))}
      </Row>
    </section>
  )
}

function PublicationAttachments({ publication }: { publication: Publication }) {
  const language = usePreferencesStore((state) => state.language)
  const text = labels[language]

  if (!publication.attachments?.length) return null

  return (
    <Card
      className="publication-attachments"
      title={
        <Space>
          <PaperClipOutlined />
          {text.attachments}
        </Space>
      }
    >
      <Space orientation="vertical" size="middle">
        {publication.attachments.map((attachment) => (
          <Flex
            className="publication-attachment"
            key={attachment.href}
            justify="space-between"
            align="center"
            gap={16}
          >
            <Space orientation="vertical" size={0}>
              <Typography.Text strong>{localize(attachment.name, language)}</Typography.Text>
              <Typography.Text type="secondary">
                {attachment.format} · {attachment.size}
              </Typography.Text>
            </Space>
            <Button
              href={attachment.href}
              download
              aria-label={`${text.download}: ${localize(attachment.name, language)}`}
              icon={<DownloadOutlined />}
            />
          </Flex>
        ))}
      </Space>
    </Card>
  )
}

function PublicationDetailPage({ kind, standalone = false }: PublicationPageProps) {
  const { slug } = useParams<{ slug: string }>()
  const language = usePreferencesStore((state) => state.language)
  const text = labels[language]
  const publication = dataFor(kind).find((item) => item.slug === slug)
  const paths = pathsFor(kind, standalone)
  const listTitle = kind === 'news' ? text.news : text.announcements
  const homeTitle = kind === 'news' ? text.newsHome : text.announcementHome
  const isNews = kind === 'news'

  const page = (
    <PublicationSite kind={kind} standalone={standalone}>
      {publication ? (
        <article
          className={
            isNews ? 'publication-detail' : 'publication-detail publication-detail--modern'
          }
        >
          <Breadcrumb
            items={[
              { title: <a href={paths.home}>{homeTitle}</a> },
              { title: <a href={paths.list}>{listTitle}</a> },
              { title: localize(publication.category, language) },
            ]}
          />
          <div className="publication-detail__heading">
            <Tag color={isNews ? 'volcano' : 'geekblue'}>
              {localize(publication.category, language)}
            </Tag>
            <Typography.Title>{localize(publication.title, language)}</Typography.Title>
            <Typography.Paragraph>{localize(publication.summary, language)}</Typography.Paragraph>
            <Space separator="·" wrap>
              <Typography.Text type="secondary">
                {formatPublicationDate(publication.date, language)}
              </Typography.Text>
              {publication.readingTime && (
                <Typography.Text type="secondary">
                  {localize(publication.readingTime, language)}
                </Typography.Text>
              )}
            </Space>
            <PublicationTags publication={publication} />
          </div>

          <Image.PreviewGroup>
            {publication.coverImage ? (
              <Image
                rootClassName="publication-detail__cover-wrap"
                className="publication-detail__cover"
                src={publication.coverImage.src}
                alt={localize(publication.coverImage.alt, language)}
                preview={{
                  cover: (
                    <Space size={6}>
                      <PictureOutlined /> {text.previewImage}
                    </Space>
                  ),
                }}
              />
            ) : (
              <div className="publication-detail__visual" aria-hidden="true">
                <span>{isNews ? 'NORTHSTAR / 2026' : 'AURORA / CAMPUS UPDATE'}</span>
              </div>
            )}

            <div
              className={
                publication.attachments?.length
                  ? 'publication-detail__content publication-detail__content--with-aside'
                  : 'publication-detail__content'
              }
            >
              <div className="publication-detail__body">
                {publication.body.map((paragraph) => (
                  <Typography.Paragraph key={paragraph.en}>
                    {localize(paragraph, language)}
                  </Typography.Paragraph>
                ))}
                <PublicationGallery publication={publication} />
                <Button href={paths.list} icon={<ArrowLeftOutlined />}>
                  {text.back} {listTitle.toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-GB')}
                </Button>
              </div>
              <PublicationAttachments publication={publication} />
            </div>
          </Image.PreviewGroup>
        </article>
      ) : (
        <div className="publication-empty">
          <Empty description={text.notFound}>
            <Button href={paths.list}>{text.back}</Button>
          </Empty>
        </div>
      )}
    </PublicationSite>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={`${pathsFor(kind, true).list}/${slug ?? ''}`}
      title={{
        en: kind === 'news' ? 'News detail' : 'Announcement detail',
        tr: `${listTitle} detayı`,
      }}
      description={{
        en: 'A standalone publication detail with optional media, tags, and downloadable files.',
        tr: 'Opsiyonel medya, etiket ve indirilebilir dosyalar içeren bağımsız yayın detay şablonu.',
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

export function TechParkAnnouncementsPage({
  standalone = false,
}: Omit<PublicationPageProps, 'kind'>) {
  return <PublicationListPage kind="announcements" standalone={standalone} />
}

export function TechParkAnnouncementDetailPage({
  standalone = false,
}: Omit<PublicationPageProps, 'kind'>) {
  return <PublicationDetailPage kind="announcements" standalone={standalone} />
}
