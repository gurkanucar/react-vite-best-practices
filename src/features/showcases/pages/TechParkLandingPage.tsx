import {
  ArrowRightOutlined,
  ExperimentOutlined,
  GlobalOutlined,
  PictureOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd'
import { PublicSiteShell, ShowcasePreviewFrame } from '@/features/showcases/components'
import {
  campusSectorShare,
  campusStatistics,
  campusUpdates,
  companySectorAccents,
  companySectorLabels,
  residentCompanies,
  techParkCopy,
  techParkLinks,
  techParkMonogram,
} from '@/features/showcases/data'
import { localize } from '@/features/showcases/types'
import { usePreferencesStore } from '@/store/preferences-store'
import '../showcases.css'

interface TechParkLandingPageProps {
  standalone?: boolean
}

/**
 * Enough names for the strip to read as a crowd without putting the whole directory in the
 * DOM twice — the track is duplicated, so every entry here costs two nodes.
 */
const stripCompanies = residentCompanies.slice(0, 21)

const capabilityIcons = [
  <ExperimentOutlined key="lab" />,
  <RocketOutlined key="rocket" />,
  <GlobalOutlined key="global" />,
]

export function TechParkLandingPage({ standalone = false }: TechParkLandingPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = techParkCopy[language]
  const rootPath = standalone ? '/preview/technopark' : '/showcases/technopark'

  const dateFormatter = new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const companyChips = stripCompanies.map((company) => (
    // A link inside a moving track is only usable because hovering pauses the animation.
    <a
      className="techpark-strip__chip"
      href={`${rootPath}/companies/${company.slug}`}
      key={company.name}
    >
      <Avatar
        shape="square"
        size={34}
        className="techpark-strip__mark"
        style={{ backgroundColor: companySectorAccents[company.sector] }}
      >
        {techParkMonogram(company.name)}
      </Avatar>
      <Typography.Text strong>{company.name}</Typography.Text>
    </a>
  ))

  const page = (
    <PublicSiteShell
      brand="Aurora Tech Park"
      tagline={{ en: techParkCopy.en.tagline, tr: techParkCopy.tr.tagline }}
      className="techpark-site"
      primary="#3157d5"
      links={techParkLinks(rootPath)}
    >
      <section className="showcase-hero techpark-hero">
        <div className="showcase-hero__copy">
          <Tag color="blue" variant="filled" icon={<SafetyCertificateOutlined />}>
            {text.eyebrow}
          </Tag>
          <Typography.Title>{text.title}</Typography.Title>
          <Typography.Paragraph>{text.description}</Typography.Paragraph>
          <Space wrap>
            <Button type="primary" size="large" icon={<RocketOutlined />}>
              {text.primary}
            </Button>
            <Button size="large" href="#section-1" icon={<ArrowRightOutlined />}>
              {text.secondary}
            </Button>
          </Space>
        </div>
        <div
          className="techpark-hero__visual"
          aria-label="Connected innovation campus illustration"
        >
          <span className="techpark-orbit techpark-orbit--one" />
          <span className="techpark-orbit techpark-orbit--two" />
          <div className="techpark-core">
            <RocketOutlined />
            <strong>AURORA / 01</strong>
          </div>
          <div className="techpark-signal">AI</div>
          <div className="techpark-signal techpark-signal--lower">BIO</div>
        </div>
      </section>

      <section className="showcase-section techpark-updates">
        <Flex justify="space-between" align="end" gap={16} wrap>
          <Typography.Title level={2}>{text.updatesTitle}</Typography.Title>
          <Button type="link" icon={<ArrowRightOutlined />} iconPlacement="end">
            {text.allUpdates}
          </Button>
        </Flex>
        <Typography.Paragraph type="secondary">{text.updatesDescription}</Typography.Paragraph>
        <Row gutter={[20, 20]}>
          {campusUpdates.map((update) => (
            <Col xs={24} lg={8} key={update.id}>
              <Card className="techpark-update" variant="borderless">
                {update.image ? (
                  <img
                    className="techpark-update__cover"
                    src={update.image.src}
                    alt={localize(update.image.alt, language)}
                    loading="lazy"
                  />
                ) : (
                  /*
                   * Not every notice comes with a picture, and a card that simply lost its
                   * top would sit shorter than its neighbours in the same row. The stand-in
                   * keeps the rhythm and says plainly that there is no image, rather than
                   * pretending to be one.
                   */
                  <div className="techpark-update__cover techpark-update__cover--empty">
                    <PictureOutlined />
                  </div>
                )}
                <Flex gap={8} align="center" wrap>
                  <Tag color={update.kind === 'announcement' ? 'orange' : 'blue'} variant="filled">
                    {update.kind === 'announcement' ? text.announcement : text.news}
                  </Tag>
                  <Typography.Text type="secondary">
                    {localize(update.category, language)}
                  </Typography.Text>
                </Flex>
                <Typography.Title level={4}>{localize(update.title, language)}</Typography.Title>
                <Typography.Paragraph type="secondary">
                  {localize(update.summary, language)}
                </Typography.Paragraph>
                <Typography.Text type="secondary" className="techpark-update__date">
                  <time dateTime={update.date}>{dateFormatter.format(new Date(update.date))}</time>
                </Typography.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="showcase-section techpark-metrics">
        <Row gutter={[16, 16]}>
          {text.metrics.map(([title, value, suffix]) => (
            <Col xs={24} sm={12} lg={6} key={title}>
              <Card variant="borderless">
                <Statistic title={title} value={value} />
                <Typography.Text type="secondary">{suffix}</Typography.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="showcase-section techpark-strip-section">
        <Flex justify="space-between" align="end" gap={16} wrap>
          <Space orientation="vertical" size={0}>
            <Typography.Text strong>{text.stripTitle}</Typography.Text>
            <Typography.Text type="secondary">{text.stripNote}</Typography.Text>
          </Space>
          <Button
            type="link"
            href={`${rootPath}/companies`}
            icon={<ArrowRightOutlined />}
            iconPlacement="end"
          >
            {text.allCompanies}
          </Button>
        </Flex>
      </section>

      {/*
        Full-bleed rather than inside the content column: the point of the strip is that it
        runs past both edges, which a centred container would cut short.
      */}
      <div className="techpark-strip">
        <div className="techpark-strip__track">
          {/*
            Two groups, not one list plus a tail: the animation travels exactly half the
            track, so the halves have to be the same width down to the last gap. Each group
            carries its own trailing space for that reason.
          */}
          <div className="techpark-strip__group">{companyChips}</div>
          {/* The second group is what makes the loop seamless; it repeats names already read. */}
          <div className="techpark-strip__group" aria-hidden="true">
            {companyChips}
          </div>
        </div>
      </div>

      <section className="showcase-section" id="section-1">
        <div className="showcase-section__heading">
          <Typography.Title level={2}>{text.capabilitiesTitle}</Typography.Title>
          <Typography.Paragraph>{text.capabilitiesDescription}</Typography.Paragraph>
        </div>
        <Row gutter={[20, 20]}>
          {text.capabilities.map(([title, description], index) => (
            <Col xs={24} lg={8} key={title}>
              <Card className="showcase-feature-card" variant="borderless">
                <div className="showcase-feature-card__icon">{capabilityIcons[index]}</div>
                <Typography.Title level={4}>{title}</Typography.Title>
                <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
                <Button type="link" icon={<ArrowRightOutlined />} iconPlacement="end">
                  {language === 'tr' ? 'Detayları gör' : 'See details'}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="showcase-section techpark-program">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={10}>
            <Tag variant="filled">{language === 'tr' ? 'Büyüme yolculuğu' : 'Growth journey'}</Tag>
            <Typography.Title level={2}>{text.programTitle}</Typography.Title>
            <Typography.Paragraph className="techpark-program__description">
              {text.programText}
            </Typography.Paragraph>
          </Col>
          <Col xs={24} lg={14}>
            <Flex className="techpark-steps" gap={12} wrap>
              {text.programSteps.map((step, index) => (
                <Card variant="borderless" key={step}>
                  <Typography.Text className="techpark-step__number" type="secondary">
                    0{index + 1}
                  </Typography.Text>
                  <Typography.Title level={4}>{step}</Typography.Title>
                </Card>
              ))}
            </Flex>
          </Col>
        </Row>
      </section>

      <section className="showcase-section techpark-stats">
        <div className="showcase-section__heading">
          <Tag variant="filled">{text.statsEyebrow}</Tag>
          <Typography.Title level={2}>{text.statsTitle}</Typography.Title>
          <Typography.Paragraph>{text.statsDescription}</Typography.Paragraph>
        </div>
        <Row gutter={[16, 16]}>
          {campusStatistics.map((statistic) => (
            <Col xs={12} md={8} xl={6} key={statistic.value + statistic.label.en}>
              <Card className="techpark-stat" variant="borderless">
                <Typography.Text type="secondary">
                  {localize(statistic.label, language)}
                </Typography.Text>
                <Typography.Title level={3}>{statistic.value}</Typography.Title>
                <Typography.Text type="secondary">
                  {localize(statistic.note, language)}
                </Typography.Text>
              </Card>
            </Col>
          ))}
        </Row>

        <Card className="techpark-share" variant="borderless">
          <Typography.Title level={4}>{text.sectorShareTitle}</Typography.Title>
          <Typography.Paragraph type="secondary">{text.sectorShareNote}</Typography.Paragraph>
          {campusSectorShare.map((entry) => (
            <div className="techpark-share__row" key={entry.sector}>
              <Typography.Text>
                {localize(companySectorLabels[entry.sector], language)}
              </Typography.Text>
              <Progress
                percent={entry.share}
                strokeColor={companySectorAccents[entry.sector]}
                format={(percent) => `${percent}%`}
              />
            </div>
          ))}
        </Card>
      </section>

      <section className="showcase-section showcase-cta" id="section-3">
        <Space orientation="vertical" size="middle">
          <Typography.Title level={2}>{text.ctaTitle}</Typography.Title>
          <Typography.Paragraph className="techpark-cta__description">
            {text.ctaText}
          </Typography.Paragraph>
          <Button type="primary" size="large">
            {text.primary}
          </Button>
        </Space>
      </section>
    </PublicSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath="/preview/technopark"
      title={{ en: 'Technology park landing page', tr: 'Teknopark landing page' }}
      description={{
        en: 'A focused B2B landing experience built with Ant Design primitives.',
        tr: 'Ant Design yapı taşlarıyla oluşturulmuş odaklı bir B2B landing deneyimi.',
      }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
