import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EditOutlined,
  EnvironmentOutlined,
  ShareAltOutlined,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { App, Avatar, Button, Card, Col, Empty, Flex, Row, Space, Tag, Typography } from 'antd'
import { Link, useParams } from 'react-router'
import { findShowcaseJob, talentCopy } from '@/features/showcases/data'
import { localize, type LocalizedText } from '@/features/showcases/types'
import { usePreferencesStore } from '@/store/preferences-store'
import '../talent.css'

function DetailList({ items }: { items: LocalizedText[] }) {
  const language = usePreferencesStore((state) => state.language)

  return (
    <ul className="talent-detail-list">
      {items.map((item) => (
        <li key={item.en}>{localize(item, language)}</li>
      ))}
    </ul>
  )
}

export function JobDetailPage() {
  const { jobSlug } = useParams<{ jobSlug: string }>()
  const language = usePreferencesStore((state) => state.language)
  const text = talentCopy[language]
  const { message } = App.useApp()
  const job = findShowcaseJob(jobSlug)

  if (!job) {
    return (
      <div className="admin-page talent-page">
        <Empty description={text.notFound}>
          <Link to="/showcases/jobs">
            <Button icon={<ArrowLeftOutlined />}>{text.backToJobs}</Button>
          </Link>
        </Empty>
      </div>
    )
  }

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(`${value}T12:00:00`))

  return (
    <div className="admin-page talent-page">
      <Flex className="talent-detail-actions" justify="space-between" align="center" gap={16} wrap>
        <Link to="/showcases/jobs">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            {text.backToJobs}
          </Button>
        </Link>
        <Space wrap>
          <Button
            icon={<ShareAltOutlined />}
            onClick={() => {
              void navigator.clipboard?.writeText(window.location.href)
              void message.success(text.shareCopied)
            }}
          >
            {text.share}
          </Button>
          <Link to={`/showcases/jobs/${job.slug}/edit`}>
            <Button icon={<EditOutlined />}>{text.editJob}</Button>
          </Link>
          <Tag
            className="talent-status-tag"
            color={job.status === 'published' ? 'success' : 'gold'}
          >
            {text[job.status]}
          </Tag>
        </Space>
      </Flex>

      <section className="talent-detail-hero">
        <Flex gap={18} align="center">
          <Avatar shape="square" size={68} style={{ backgroundColor: job.companyColor }}>
            {job.companyInitials}
          </Avatar>
          <div>
            <Typography.Text>{job.company}</Typography.Text>
            <Typography.Title>{localize(job.title, language)}</Typography.Title>
            <Space size={[8, 8]} wrap>
              <Tag icon={<EnvironmentOutlined />}>{localize(job.location, language)}</Tag>
              <Tag icon={<ClockCircleOutlined />}>{text[job.employmentType]}</Tag>
              <Tag>{text[job.workMode]}</Tag>
            </Space>
          </div>
        </Flex>
      </section>

      <Row className="talent-detail-layout" gutter={[20, 20]} align="top">
        <Col xs={24} xl={16}>
          <Card className="talent-detail-content" variant="borderless">
            <section>
              <Typography.Title level={2}>{text.aboutRole}</Typography.Title>
              {job.description.map((paragraph) => (
                <Typography.Paragraph key={paragraph.en}>
                  {localize(paragraph, language)}
                </Typography.Paragraph>
              ))}
            </section>

            <section>
              <Typography.Title level={2}>{text.responsibilities}</Typography.Title>
              <DetailList items={job.responsibilities} />
            </section>

            <section>
              <Typography.Title level={2}>{text.qualifications}</Typography.Title>
              <DetailList items={job.qualifications} />
            </section>

            <section>
              <Typography.Title level={2}>{text.skills}</Typography.Title>
              <Flex gap={8} wrap>
                {job.skills.map((skill) => (
                  <Tag color="blue" key={skill}>
                    {skill}
                  </Tag>
                ))}
              </Flex>
            </section>

            <section>
              <Typography.Title level={2}>{text.benefits}</Typography.Title>
              <DetailList items={job.benefits} />
            </section>
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <aside className="talent-detail-aside">
            <Card className="talent-facts" variant="borderless">
              <Typography.Title level={3}>{text.overview}</Typography.Title>
              <dl>
                <div>
                  <dt>
                    <CalendarOutlined />
                  </dt>
                  <dd>
                    <span>{text.posted}</span>
                    <strong>{formatDate(job.postedAt)}</strong>
                  </dd>
                </div>
                <div>
                  <dt>
                    <CalendarOutlined />
                  </dt>
                  <dd>
                    <span>{text.expires}</span>
                    <strong>{formatDate(job.expiresAt)}</strong>
                  </dd>
                </div>
                <div>
                  <dt>
                    <ClockCircleOutlined />
                  </dt>
                  <dd>
                    <span>{text.workMode}</span>
                    <strong>{text[job.workMode]}</strong>
                  </dd>
                </div>
                <div>
                  <dt>
                    <SolutionOutlined />
                  </dt>
                  <dd>
                    <span>{text.experience}</span>
                    <strong>{localize(job.experience, language)}</strong>
                  </dd>
                </div>
                <div>
                  <dt>
                    <DollarOutlined />
                  </dt>
                  <dd>
                    <span>{text.salary}</span>
                    <strong>{localize(job.salary, language)}</strong>
                  </dd>
                </div>
                <div>
                  <dt>
                    <TeamOutlined />
                  </dt>
                  <dd>
                    <span>{text.candidates}</span>
                    <strong>{job.applicants}</strong>
                  </dd>
                </div>
              </dl>
              <Button
                block
                size="large"
                type="primary"
                href={`mailto:talent@aurora.example?subject=${encodeURIComponent(localize(job.title, language))}`}
              >
                {text.apply}
              </Button>
            </Card>

            <Card className="talent-company-card" variant="borderless">
              <Flex gap={12} align="center">
                <Avatar shape="square" size={44} style={{ backgroundColor: job.companyColor }}>
                  {job.companyInitials}
                </Avatar>
                <div>
                  <Typography.Text type="secondary">{text.company}</Typography.Text>
                  <Typography.Title level={4}>{job.company}</Typography.Title>
                </div>
              </Flex>
              <Typography.Paragraph type="secondary">
                {language === 'tr'
                  ? 'Aurora Teknopark yerleşik şirketi'
                  : 'Resident company at Aurora Tech Park'}
              </Typography.Paragraph>
            </Card>
          </aside>
        </Col>
      </Row>
    </div>
  )
}
