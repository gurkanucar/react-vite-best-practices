import {
  ArrowRightOutlined,
  BarChartOutlined,
  BulbOutlined,
  CalculatorOutlined,
  CodeOutlined,
  CustomerServiceOutlined,
  DatabaseOutlined,
  FormatPainterOutlined,
  NotificationOutlined,
  ProfileOutlined,
  RiseOutlined,
  SendOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Button, Col, Flex, Progress, Row, Typography } from 'antd'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { CompanyLogo, JobCard, RatingBadge } from '@/features/showcases/components/CareersBits'
import { CareersSearchBar } from '@/features/showcases/components/CareersSearchBar'
import { CareersSiteShell } from '@/features/showcases/components/CareersSiteShell'
import {
  CAREERS_CATEGORIES,
  careersCompanies,
  careersRoot,
  jobsOfCompany,
  type CareersCategory,
} from '@/features/showcases/data/careers'
import { profileCompleteness } from '@/features/showcases/data/careersProfile'
import {
  formatSalaryRange,
  salaryInsight,
  searchJobs,
  skillMatch,
  emptyFilters,
} from '@/features/showcases/data/careersSearch'
import { useCareersCopy } from '@/features/showcases/hooks/useCareersCopy'
import { useCareersJobs, useCareersStore } from '@/features/showcases/hooks/useCareersStore'

interface TalentHomePageProps {
  standalone?: boolean
}

const CATEGORY_ICONS: Record<CareersCategory, ReactNode> = {
  software: <CodeOutlined />,
  design: <FormatPainterOutlined />,
  product: <BulbOutlined />,
  data: <DatabaseOutlined />,
  marketing: <NotificationOutlined />,
  sales: <RiseOutlined />,
  finance: <CalculatorOutlined />,
  hr: <TeamOutlined />,
  operations: <ToolOutlined />,
  success: <CustomerServiceOutlined />,
}

const INSIGHT_ROLES = [
  'backend',
  'frontend',
  'product-manager',
  'data-analyst',
  'product-designer',
  'growth-marketer',
]

const HOW_ICONS = [<UserOutlined key="1" />, <SendOutlined key="2" />, <BarChartOutlined key="3" />]

export function TalentHomePage({ standalone = false }: TalentHomePageProps) {
  const root = careersRoot(standalone)
  const { text, language } = useCareersCopy()
  const { published } = useCareersJobs()
  const profile = useCareersStore((state) => state.profile)
  const completeness = profileCompleteness(profile)

  const recommended = published
    .map((job) => ({ job, match: skillMatch(job, profile.skills).matched.length }))
    .filter(({ match }) => match > 0)
    .sort((a, b) => b.match - a.match || a.job.postedMinutesAgo - b.job.postedMinutesAgo)
    .slice(0, 6)
    .map(({ job }) => job)
  const latest = searchJobs({ ...emptyFilters, sort: 'newest' }, [], published).slice(0, 6)
  const hiring = careersCompanies
    .map((company) => ({ company, open: jobsOfCompany(company.id, published).length }))
    .filter(({ open }) => open > 0)
    .sort((a, b) => b.company.rating - a.company.rating)
    .slice(0, 6)
  const insights = INSIGHT_ROLES.map((role) => salaryInsight(role, published)).filter(
    (insight) => insight !== undefined,
  )
  const insightMax = Math.max(...insights.map((insight) => insight.high), 1)
  const salaryShare = Math.round(
    (published.filter((job) => job.salary).length / Math.max(published.length, 1)) * 100,
  )
  const stats = [
    [String(published.length), text.home.stats.jobs],
    [String(new Set(published.map((job) => job.companyId)).size), text.home.stats.companies],
    [String(published.filter((job) => job.mode === 'remote').length), text.home.stats.remote],
    [language === 'tr' ? `%${salaryShare}` : `${salaryShare}%`, text.home.stats.salary],
  ]

  return (
    <CareersSiteShell standalone={standalone}>
      <section className="careers-hero">
        <div className="careers-hero__inner">
          <div className="showcase-hero__copy careers-hero__copy">
            <span className="careers-eyebrow">{text.home.eyebrow}</span>
            <Typography.Title>{text.home.title}</Typography.Title>
            <Typography.Paragraph className="careers-hero__lead">
              {text.home.subtitle}
            </Typography.Paragraph>
          </div>
          <CareersSearchBar root={root} />
          <Flex gap={8} wrap align="center" className="careers-hero__popular">
            <Typography.Text type="secondary">{text.home.popular}</Typography.Text>
            {text.home.popularSearches.map((search) => (
              <Link
                key={search}
                to={`${root}/jobs?q=${encodeURIComponent(search)}`}
                className="careers-pill"
              >
                {search}
              </Link>
            ))}
          </Flex>
          <dl className="careers-stats">
            {stats.map(([value, label]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="careers-section">
        <Flex justify="space-between" align="end" gap={16} wrap className="careers-section__head">
          <div>
            <Typography.Title level={2}>{text.home.recommendedTitle}</Typography.Title>
            <Typography.Text type="secondary">{text.home.recommendedSubtitle}</Typography.Text>
          </div>
          <Link to={`${root}/jobs`}>
            {text.common.viewAll} <ArrowRightOutlined aria-hidden="true" />
          </Link>
        </Flex>
        <Row gutter={[24, 24]}>
          <Col xs={24} xl={17}>
            <div className="careers-grid">
              {recommended.map((job) => (
                <JobCard key={job.id} job={job} href={`${root}/jobs/${job.id}`} />
              ))}
            </div>
          </Col>
          <Col xs={24} xl={7}>
            <div className="careers-profile-nudge">
              <Flex align="center" gap={16}>
                <Progress
                  type="circle"
                  size={72}
                  percent={completeness.percent}
                  strokeColor="#1f5eff"
                />
                <div>
                  <Typography.Text strong>{text.profile.completeness}</Typography.Text>
                  <br />
                  <Typography.Text type="secondary">{profile.name}</Typography.Text>
                </div>
              </Flex>
              <Typography.Paragraph type="secondary">
                {completeness.missing.length
                  ? text.profile.completenessHint
                  : text.profile.completenessDone}
              </Typography.Paragraph>
              {completeness.missing.length > 0 && (
                <ul className="careers-nudge-list">
                  {completeness.missing.slice(0, 3).map((check) => (
                    <li key={check}>{text.checks[check][0]}</li>
                  ))}
                </ul>
              )}
              <Link to={`${root}/profile`}>
                <Button type="primary" block icon={<ProfileOutlined />}>
                  {text.home.profileCta}
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </section>

      <section className="careers-section careers-section--tinted">
        <div className="careers-section__head">
          <Typography.Title level={2}>{text.home.categoriesTitle}</Typography.Title>
          <Typography.Text type="secondary">{text.home.categoriesSubtitle}</Typography.Text>
        </div>
        <div className="careers-categories">
          {CAREERS_CATEGORIES.map((category) => (
            <Link
              key={category}
              to={`${root}/jobs?category=${category}`}
              className="careers-category"
            >
              <span className="careers-category__icon" aria-hidden="true">
                {CATEGORY_ICONS[category]}
              </span>
              <span className="careers-category__text">
                <strong>{text.categories[category]}</strong>
                <span>
                  {text.home.jobsCount(published.filter((job) => job.category === category).length)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="careers-section">
        <Flex justify="space-between" align="end" gap={16} wrap className="careers-section__head">
          <div>
            <Typography.Title level={2}>{text.home.companiesTitle}</Typography.Title>
            <Typography.Text type="secondary">{text.home.companiesSubtitle}</Typography.Text>
          </div>
          <Link to={`${root}/companies`}>
            {text.common.viewAll} <ArrowRightOutlined aria-hidden="true" />
          </Link>
        </Flex>
        <div className="careers-company-grid">
          {hiring.map(({ company, open }) => (
            <Link
              key={company.id}
              to={`${root}/companies/${company.id}`}
              className="careers-company-tile"
            >
              <CompanyLogo company={company} size={48} />
              <span className="careers-company-tile__text">
                <strong>{company.name}</strong>
                <span>{company.industry[language]}</span>
                <span>
                  <RatingBadge rating={company.rating} /> · {text.home.openRoles(open)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="careers-section careers-section--tinted">
        <Row gutter={[32, 32]}>
          <Col xs={24} xl={14}>
            <div className="careers-section__head">
              <Typography.Title level={2}>{text.home.salaryTitle}</Typography.Title>
              <Typography.Text type="secondary">{text.home.salarySubtitle}</Typography.Text>
            </div>
            <ul className="careers-insights">
              {insights.map((insight) => (
                <li key={insight.role}>
                  <Flex justify="space-between" gap={12} wrap>
                    <Link to={`${root}/jobs?q=${encodeURIComponent(insight.title[language])}`}>
                      <strong>{insight.title[language]}</strong>
                    </Link>
                    <span>
                      {formatSalaryRange({ min: insight.low, max: insight.high }, language)}{' '}
                      <Typography.Text type="secondary">{text.common.perMonth}</Typography.Text>
                    </span>
                  </Flex>
                  <div className="careers-insights__track" aria-hidden="true">
                    <span
                      style={{
                        left: `${(insight.low / insightMax) * 100}%`,
                        width: `${((insight.high - insight.low) / insightMax) * 100}%`,
                      }}
                    />
                  </div>
                  <Typography.Text type="secondary" className="careers-insights__count">
                    {text.home.salaryListings(insight.jobs)}
                  </Typography.Text>
                </li>
              ))}
            </ul>
          </Col>
          <Col xs={24} xl={10}>
            <div className="careers-section__head">
              <Typography.Title level={2}>{text.home.howTitle}</Typography.Title>
            </div>
            <ol className="careers-how">
              {text.home.howSteps.map(([title, body], index) => (
                <li key={title}>
                  <span className="careers-how__icon" aria-hidden="true">
                    {HOW_ICONS[index]}
                  </span>
                  <span>
                    <strong>{title}</strong>
                    <span>{body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Col>
        </Row>
      </section>

      <section className="careers-section">
        <Flex justify="space-between" align="end" gap={16} wrap className="careers-section__head">
          <Typography.Title level={2}>{text.home.latestTitle}</Typography.Title>
          <Link to={`${root}/jobs?sort=newest`}>
            {text.common.viewAll} <ArrowRightOutlined aria-hidden="true" />
          </Link>
        </Flex>
        <div className="careers-grid careers-grid--three">
          {latest.map((job) => (
            <JobCard key={job.id} job={job} href={`${root}/jobs/${job.id}`} />
          ))}
        </div>
      </section>

      <section className="careers-section">
        <div className="careers-employer-cta">
          <div>
            <Typography.Title level={2}>{text.home.employerTitle}</Typography.Title>
            <Typography.Paragraph>{text.home.employerText}</Typography.Paragraph>
          </div>
          <Link to={`${root}/employer`}>
            <Button size="large" icon={<ArrowRightOutlined />} iconPlacement="end">
              {text.home.employerCta}
            </Button>
          </Link>
        </div>
      </section>
    </CareersSiteShell>
  )
}
