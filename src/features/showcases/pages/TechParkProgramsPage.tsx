import {
  ArrowRightOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  ExperimentOutlined,
  FundOutlined,
  RocketOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Collapse, Flex, Row, Steps, Tag, Typography } from 'antd'
import type { ReactNode } from 'react'
import { ShowcasePreviewFrame, TechParkSiteShell } from '@/features/showcases/components'
import { techParkCopy, techParkPrograms, techParkProgramsCopy } from '@/features/showcases/data'
import { localize } from '@/features/showcases/types'
import { usePreferencesStore } from '@/store/preferences-store'
import '../showcases.css'

interface TechParkProgramsPageProps {
  standalone?: boolean
}

const programIcons: Record<string, ReactNode> = {
  'pre-incubation': <ExperimentOutlined />,
  incubation: <RocketOutlined />,
  acceleration: <FundOutlined />,
  'rd-support': <CheckCircleFilled />,
}

export function TechParkProgramsPage({ standalone = false }: TechParkProgramsPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = techParkProgramsCopy[language]
  const campus = techParkCopy[language]
  const rootPath = standalone ? '/preview/technopark' : '/showcases/technopark'
  const contactPath = `${rootPath}/contact`

  const page = (
    <TechParkSiteShell rootPath={rootPath}>
      <section className="showcase-section techpark-about-hero">
        <Tag color="blue" variant="filled" icon={<RocketOutlined />}>
          {text.eyebrow}
        </Tag>
        <Typography.Title>{text.title}</Typography.Title>
        <Typography.Paragraph className="techpark-about-hero__description">
          {text.description}
        </Typography.Paragraph>
      </section>

      <section className="showcase-section techpark-about-section">
        <Row gutter={[20, 20]}>
          {techParkPrograms.map((program) => (
            <Col xs={24} md={12} key={program.id}>
              <Card className="techpark-program-card" variant="borderless" id={program.id}>
                <Flex align="center" gap={12}>
                  <div className="showcase-feature-card__icon">{programIcons[program.id]}</div>
                  <Typography.Title level={3}>{localize(program.name, language)}</Typography.Title>
                </Flex>
                <Typography.Paragraph>{localize(program.summary, language)}</Typography.Paragraph>
                <dl className="techpark-program-card__facts">
                  <div>
                    <dt>
                      <ClockCircleOutlined /> {text.duration}
                    </dt>
                    <dd>{localize(program.duration, language)}</dd>
                  </div>
                  <div>
                    <dt>
                      <UserOutlined /> {text.audience}
                    </dt>
                    <dd>{localize(program.audience, language)}</dd>
                  </div>
                </dl>
                <Typography.Text strong>{text.benefits}</Typography.Text>
                <ul className="techpark-goals techpark-goals--compact">
                  {program.benefits.map((benefit) => (
                    <li key={benefit.en}>
                      <CheckCircleFilled aria-hidden="true" />
                      <Typography.Text>{localize(benefit, language)}</Typography.Text>
                    </li>
                  ))}
                </ul>
                <Button
                  type="primary"
                  href={contactPath}
                  icon={<ArrowRightOutlined />}
                  iconPlacement="end"
                  aria-label={`${text.apply}: ${localize(program.name, language)}`}
                >
                  {text.apply}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="showcase-section techpark-about-section">
        <div className="showcase-section__heading">
          <Typography.Title level={2}>{text.stepsTitle}</Typography.Title>
        </div>
        <Card className="techpark-about-card" variant="borderless">
          <Steps
            current={-1}
            responsive
            items={text.steps.map(([title, description]) => ({ title, content: description }))}
          />
        </Card>
      </section>

      <section className="showcase-section techpark-about-section">
        <div className="showcase-section__heading">
          <Typography.Title level={2}>{text.faqTitle}</Typography.Title>
        </div>
        <Collapse
          className="techpark-equality"
          items={text.faq.map(([question, answer], index) => ({
            key: String(index),
            label: question,
            children: <Typography.Paragraph type="secondary">{answer}</Typography.Paragraph>,
          }))}
        />
      </section>

      <section className="showcase-section showcase-cta">
        <Flex vertical gap={16} align="start">
          <Typography.Title level={2}>{campus.ctaTitle}</Typography.Title>
          <Typography.Paragraph className="techpark-cta__description">
            {campus.ctaText}
          </Typography.Paragraph>
          <Button type="primary" size="large" href={contactPath}>
            {campus.primary}
          </Button>
        </Flex>
      </section>
    </TechParkSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath="/preview/technopark/programs"
      title={{ en: 'Tech park programs page', tr: 'Teknopark programlar sayfası' }}
      description={{
        en: 'Programme cards, the application steps and answers to common questions.',
        tr: 'Program kartları, başvuru adımları ve sık sorulan sorular.',
      }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
