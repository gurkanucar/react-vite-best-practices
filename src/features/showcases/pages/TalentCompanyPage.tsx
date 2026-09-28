import { ArrowLeftOutlined, GiftOutlined, StarFilled } from '@ant-design/icons'
import {
  Button,
  Col,
  Descriptions,
  Empty,
  Flex,
  Progress,
  Rate,
  Result,
  Row,
  Tag,
  Typography,
} from 'antd'
import { Link, useParams } from 'react-router'
import { CompanyLogo, FollowButton, JobCard } from '@/features/showcases/components/CareersBits'
import { CareersSiteShell } from '@/features/showcases/components/CareersSiteShell'
import {
  CITY_NAMES,
  REVIEW_ASPECTS,
  careersRoot,
  findCompany,
  jobsOfCompany,
} from '@/features/showcases/data/careers'
import { useCareersCopy } from '@/features/showcases/hooks/useCareersCopy'
import { useCareersJobs } from '@/features/showcases/hooks/useCareersStore'

interface TalentCompanyPageProps {
  standalone?: boolean
}

export function TalentCompanyPage({ standalone = false }: TalentCompanyPageProps) {
  const root = careersRoot(standalone)
  const { text, language } = useCareersCopy()
  const { companyId } = useParams<{ companyId: string }>()
  const { published } = useCareersJobs()
  const company = findCompany(companyId)

  if (!company) {
    return (
      <CareersSiteShell standalone={standalone}>
        <Result
          status="404"
          title={text.company.notFoundTitle}
          subTitle={text.company.notFoundText}
          extra={
            <Link to={`${root}/companies`}>
              <Button type="primary">{text.company.backToCompanies}</Button>
            </Link>
          }
        />
      </CareersSiteShell>
    )
  }

  const jobs = jobsOfCompany(company.id, published)
  const followers = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US').format(
    company.followers,
  )

  return (
    <CareersSiteShell standalone={standalone}>
      <div className="careers-company-top">
        <Link to={`${root}/companies`} className="careers-back">
          <ArrowLeftOutlined aria-hidden="true" /> {text.company.backToCompanies}
        </Link>
      </div>
      <div
        className="careers-company-cover"
        style={{
          background: `linear-gradient(120deg, ${company.color}, ${company.color}99 60%, #0b1a3a)`,
        }}
      />
      <section className="careers-section careers-company-page">
        <Flex gap={20} align="flex-end" wrap className="careers-company-header">
          <span className="careers-company-header__logo">
            <CompanyLogo company={company} size={96} />
          </span>
          <div className="careers-company-header__text">
            <Typography.Title level={1}>{company.name}</Typography.Title>
            <Typography.Text type="secondary">
              {company.tagline[language]} · {company.industry[language]} ·{' '}
              {CITY_NAMES[language][company.city]}
            </Typography.Text>
            <br />
            <Typography.Text type="secondary">
              {text.companies.followers(followers)}
            </Typography.Text>
          </div>
          <FollowButton company={company} />
        </Flex>

        <Row gutter={[32, 32]}>
          <Col xs={24} xl={16}>
            <section className="careers-detail__section">
              <Typography.Title level={3}>{text.company.about}</Typography.Title>
              <Typography.Paragraph>{company.about[language]}</Typography.Paragraph>
            </section>

            <section className="careers-detail__section">
              <Typography.Title level={3}>{text.company.culture}</Typography.Title>
              <Flex gap={8} wrap>
                {company.culture.map((item) => (
                  <Tag key={item.en} variant="filled" color="blue" className="careers-culture-tag">
                    {item[language]}
                  </Tag>
                ))}
              </Flex>
            </section>

            <section className="careers-detail__section">
              <Typography.Title level={3}>{text.company.benefits}</Typography.Title>
              <ul className="careers-benefits">
                {company.benefits.map((benefit) => (
                  <li key={benefit}>
                    <GiftOutlined aria-hidden="true" /> {text.benefits[benefit]}
                  </li>
                ))}
              </ul>
            </section>

            <section className="careers-detail__section">
              <Typography.Title level={3}>{text.company.reviewsTitle}</Typography.Title>
              <Row gutter={[32, 24]} className="careers-reviews-summary">
                <Col xs={24} md={9}>
                  <div className="careers-reviews-score">
                    <strong>{company.rating.toFixed(1)}</strong>
                    <Rate disabled allowHalf value={Math.round(company.rating * 2) / 2} />
                    <Typography.Text type="secondary">
                      {text.company.basedOn(company.reviewCount)}
                    </Typography.Text>
                  </div>
                  <ul className="careers-stars">
                    {company.starShare.map((share, index) => (
                      <li key={5 - index}>
                        <span>
                          {5 - index} <StarFilled aria-hidden="true" />
                        </span>
                        <Progress
                          percent={share}
                          size="small"
                          showInfo={false}
                          strokeColor="#f5a623"
                        />
                        <Typography.Text type="secondary">{share}%</Typography.Text>
                      </li>
                    ))}
                  </ul>
                </Col>
                <Col xs={24} md={15}>
                  <ul className="careers-aspects">
                    {REVIEW_ASPECTS.map((aspect) => (
                      <li key={aspect}>
                        <Flex justify="space-between">
                          <span>{text.aspects[aspect]}</span>
                          <strong>{company.aspects[aspect].toFixed(1)}</strong>
                        </Flex>
                        <Progress
                          percent={(company.aspects[aspect] / 5) * 100}
                          size="small"
                          showInfo={false}
                          strokeColor={company.color}
                        />
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
              <ul className="careers-reviews">
                {company.reviews.map((review) => (
                  <li key={review.id} className="careers-review">
                    <Flex justify="space-between" gap={8} wrap align="center">
                      <Rate disabled value={review.rating} className="careers-review__rate" />
                      <Typography.Text type="secondary">
                        {text.company.daysAgo(review.daysAgo)}
                      </Typography.Text>
                    </Flex>
                    <Typography.Text strong>
                      {review.role[language]} ·{' '}
                      {review.current ? text.company.current : text.company.former}
                    </Typography.Text>
                    <p>
                      <Typography.Text type="success" strong>
                        {text.company.pros}:
                      </Typography.Text>{' '}
                      {review.pros[language]}
                    </p>
                    <p>
                      <Typography.Text type="danger" strong>
                        {text.company.cons}:
                      </Typography.Text>{' '}
                      {review.cons[language]}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </Col>

          <Col xs={24} xl={8}>
            <div className="careers-sticky">
              <Descriptions
                column={1}
                size="small"
                bordered
                className="careers-company-facts"
                items={[
                  { key: 'founded', label: text.company.founded, children: company.founded },
                  { key: 'size', label: text.company.size, children: text.sizes[company.size] },
                  {
                    key: 'hq',
                    label: text.company.hq,
                    children: CITY_NAMES[language][company.city],
                  },
                  {
                    key: 'rating',
                    label: text.company.rating,
                    children: `${company.rating.toFixed(1)} / 5`,
                  },
                ]}
              />
              <Typography.Title level={3} className="careers-company-jobs-title">
                {text.company.openJobs} ({jobs.length})
              </Typography.Title>
              {jobs.length ? (
                <div className="careers-list">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} href={`${root}/jobs/${job.id}`} hideCompany />
                  ))}
                </div>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={text.company.noJobs} />
              )}
            </div>
          </Col>
        </Row>
      </section>
    </CareersSiteShell>
  )
}
