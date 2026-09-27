import {
  ArrowRightOutlined,
  ExperimentOutlined,
  GlobalOutlined,
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
import {
  AnnouncementCard,
  ShowcasePreviewFrame,
  TechParkSiteShell,
} from '@/features/showcases/components'
import {
  campusAnnouncements,
  campusSectorShare,
  campusStatistics,
  companySectorAccents,
  companySectorLabels,
  residentCompanies,
  techParkCopy,
  techParkMonogram,
} from '@/features/showcases/data'
import type { CSSProperties } from 'react'
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

/** The notices list newest first, so the front page shows what the campus desk posted last. */
const latestAnnouncements = campusAnnouncements.slice(0, 3)

/**
 * Sectors riding the rings. A ring is drawn once, by its first satellite; the others share
 * its size and clock with an invisible ring of their own, so every badge moves in step.
 */
const orbitSatellites = [
  { ring: 'inner', label: 'AI', start: '-40deg' },
  { ring: 'inner', label: '5G', start: '140deg' },
  { ring: 'middle', label: 'BIO', start: '80deg' },
  { ring: 'middle', label: 'ROBO', start: '260deg' },
  { ring: 'outer', label: 'IoT', start: '200deg' },
  { ring: 'outer', label: 'AGRI', start: '320deg' },
  { ring: 'outer', label: 'CHIP', start: '20deg' },
]

const capabilityIcons = [
  <ExperimentOutlined key="lab" />,
  <RocketOutlined key="rocket" />,
  <GlobalOutlined key="global" />,
]

export function TechParkLandingPage({ standalone = false }: TechParkLandingPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = techParkCopy[language]
  const rootPath = standalone ? '/preview/technopark' : '/showcases/technopark'

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
    <TechParkSiteShell rootPath={rootPath}>
      <section className="showcase-hero techpark-hero">
        <div className="showcase-hero__copy">
          <Tag color="blue" variant="filled" icon={<SafetyCertificateOutlined />}>
            {text.eyebrow}
          </Tag>
          <Typography.Title>{text.title}</Typography.Title>
          <Typography.Paragraph>{text.description}</Typography.Paragraph>
          <Space wrap>
            <Button
              type="primary"
              size="large"
              href={`${rootPath}/contact`}
              icon={<RocketOutlined />}
            >
              {text.primary}
            </Button>
            <Button size="large" href={`${rootPath}/programs`} icon={<ArrowRightOutlined />}>
              {text.secondary}
            </Button>
          </Space>
        </div>
        <div
          className="techpark-hero__visual"
          // Decoration: the sectors it shows are listed in words further down the page.
          aria-hidden="true"
        >
          {/*
            One clock for every ring: they turn at the same speed, so the three sectors travel
            together round the core. Each badge turns back by the same amount to stay upright.
          */}
          {orbitSatellites.map((satellite, index) => (
            <span
              key={satellite.label}
              className={`techpark-orbit techpark-orbit--${satellite.ring}${
                orbitSatellites.findIndex((other) => other.ring === satellite.ring) === index
                  ? ''
                  : ' techpark-orbit--ghost'
              }`}
              style={{ '--orbit-start': satellite.start } as CSSProperties}
            >
              <span className="techpark-satellite">{satellite.label}</span>
            </span>
          ))}
          <div className="techpark-core">
            <RocketOutlined />
            <strong>AURORA / 01</strong>
          </div>
        </div>
      </section>

      <section className="showcase-section techpark-updates">
        <Flex justify="space-between" align="end" gap={16} wrap>
          <Typography.Title level={2}>{text.updatesTitle}</Typography.Title>
          <Button
            type="link"
            href={`${rootPath}/announcements`}
            icon={<ArrowRightOutlined />}
            iconPlacement="end"
          >
            {text.allUpdates}
          </Button>
        </Flex>
        <Typography.Paragraph type="secondary">{text.updatesDescription}</Typography.Paragraph>
        <Row gutter={[24, 24]}>
          {latestAnnouncements.map((item) => (
            <Col xs={24} md={12} xl={8} key={item.slug}>
              <AnnouncementCard item={item} detailPath={`${rootPath}/announcements/${item.slug}`} />
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
                <Button
                  type="link"
                  href={`${rootPath}/programs`}
                  icon={<ArrowRightOutlined />}
                  iconPlacement="end"
                >
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
          <Button type="primary" size="large" href={`${rootPath}/contact`}>
            {text.primary}
          </Button>
        </Space>
      </section>
    </TechParkSiteShell>
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
