import {
  AimOutlined,
  ArrowRightOutlined,
  BankOutlined,
  CheckCircleFilled,
  EnvironmentOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Collapse, Flex, Progress, Row, Space, Tag, Typography } from 'antd'
import { CampusMap } from '@/features/showcases/components/CampusMap'
import { ShowcasePreviewFrame, TechParkSiteShell } from '@/features/showcases/components'
import { techParkAboutCopy, techParkContact } from '@/features/showcases/data'
import { usePreferencesStore } from '@/store/preferences-store'
import '../showcases.css'

interface TechParkAboutPageProps {
  standalone?: boolean
}

const shareholderColors = ['#3157d5', '#00b8d9', '#7c5cff', '#22c55e']

export function TechParkAboutPage({ standalone = false }: TechParkAboutPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = techParkAboutCopy[language]
  const rootPath = standalone ? '/preview/technopark' : '/showcases/technopark'
  const [lat, lng] = techParkContact.position

  const page = (
    <TechParkSiteShell rootPath={rootPath}>
      <section className="showcase-section techpark-about-hero">
        <Tag color="blue" variant="filled" icon={<InfoCircleOutlined />}>
          {text.eyebrow}
        </Tag>
        <Typography.Title>{text.title}</Typography.Title>
        <Typography.Paragraph className="techpark-about-hero__description">
          {text.description}
        </Typography.Paragraph>
      </section>

      <section className="showcase-section techpark-about-section" id="mission">
        <Row gutter={[24, 24]}>
          {[
            { icon: <EyeOutlined />, title: text.visionTitle, paragraphs: text.vision },
            { icon: <AimOutlined />, title: text.missionTitle, paragraphs: text.mission },
          ].map((block) => (
            <Col xs={24} lg={12} key={block.title}>
              <Card className="techpark-about-card" variant="borderless">
                <div className="showcase-feature-card__icon">{block.icon}</div>
                <Typography.Title level={3}>{block.title}</Typography.Title>
                {block.paragraphs.map((paragraph) => (
                  <Typography.Paragraph type="secondary" key={paragraph}>
                    {paragraph}
                  </Typography.Paragraph>
                ))}
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="showcase-section techpark-about-section">
        <div className="showcase-section__heading">
          <Typography.Title level={2}>{text.goalsTitle}</Typography.Title>
          <Typography.Paragraph>{text.goalsDescription}</Typography.Paragraph>
        </div>
        <ul className="techpark-goals">
          {text.goals.map((goal) => (
            <li key={goal}>
              <CheckCircleFilled aria-hidden="true" />
              <Typography.Text>{goal}</Typography.Text>
            </li>
          ))}
        </ul>
      </section>

      <section className="showcase-section techpark-about-section" id="structure">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card className="techpark-about-card" variant="borderless">
              <div className="showcase-feature-card__icon">
                <BankOutlined />
              </div>
              <Typography.Title level={3}>{text.structureTitle}</Typography.Title>
              <Typography.Paragraph type="secondary">
                {text.structureDescription}
              </Typography.Paragraph>
              {text.shareholders.map(([name, share], index) => (
                <div className="techpark-share__row" key={name}>
                  <Typography.Text>{name}</Typography.Text>
                  <Progress
                    percent={share}
                    strokeColor={shareholderColors[index]}
                    format={(percent) => `${percent}%`}
                  />
                </div>
              ))}
            </Card>
          </Col>
          <Col xs={24} lg={12} id="legal">
            <Card className="techpark-about-card" variant="borderless">
              <div className="showcase-feature-card__icon">
                <SafetyCertificateOutlined />
              </div>
              <Typography.Title level={3}>{text.legalTitle}</Typography.Title>
              <Typography.Paragraph type="secondary">{text.legalDescription}</Typography.Paragraph>
              <ol className="techpark-duties">
                {text.duties.map((duty) => (
                  <li key={duty}>{duty}</li>
                ))}
              </ol>
            </Card>
          </Col>
        </Row>
      </section>

      <section className="showcase-section techpark-about-section">
        <div className="showcase-section__heading">
          <Typography.Title level={2}>{text.equalityTitle}</Typography.Title>
        </div>
        <Collapse
          className="techpark-equality"
          defaultActiveKey={['0']}
          items={text.equality.map(([title, body], index) => ({
            key: String(index),
            label: title,
            children: <Typography.Paragraph type="secondary">{body}</Typography.Paragraph>,
          }))}
        />
      </section>

      <section className="showcase-section techpark-about-section" id="location">
        <Row gutter={[32, 24]} align="middle">
          <Col xs={24} lg={9}>
            <Space orientation="vertical" size="middle">
              <Typography.Title level={2}>{text.locationTitle}</Typography.Title>
              <Typography.Paragraph type="secondary">
                {text.locationDescription}
              </Typography.Paragraph>
              <Typography.Text>
                <EnvironmentOutlined /> {techParkContact.address[language]}, {techParkContact.city}
              </Typography.Text>
              <Flex gap={8} wrap>
                <Button
                  href={`https://www.openstreetmap.org/directions?to=${lat}%2C${lng}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {text.directions}
                </Button>
                <Button
                  type="primary"
                  href={`${rootPath}/contact`}
                  icon={<ArrowRightOutlined />}
                  iconPlacement="end"
                >
                  {text.contactCta}
                </Button>
              </Flex>
            </Space>
          </Col>
          <Col xs={24} lg={15}>
            <CampusMap
              position={techParkContact.position}
              label="Aurora Tech Park"
              address={`${techParkContact.address[language]}, ${techParkContact.city}`}
            />
          </Col>
        </Row>
      </section>
    </TechParkSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath="/preview/technopark/about"
      title={{ en: 'Tech park about page', tr: 'Teknopark hakkımızda sayfası' }}
      description={{
        en: 'Vision, mission, company structure and a Leaflet map of the campus.',
        tr: 'Vizyon, misyon, şirket yapısı ve kampüsün Leaflet haritası.',
      }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
