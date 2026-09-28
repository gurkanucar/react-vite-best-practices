import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons'
import { Empty, Flex, Input, Select, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { CompanyLogo, FollowButton, RatingBadge } from '@/features/showcases/components/CareersBits'
import { CareersSiteShell } from '@/features/showcases/components/CareersSiteShell'
import {
  CITY_NAMES,
  COMPANY_SIZES,
  careersCompanies,
  careersRoot,
  jobsOfCompany,
  type CompanySize,
} from '@/features/showcases/data/careers'
import { fold } from '@/features/showcases/data/careersSearch'
import { useCareersCopy } from '@/features/showcases/hooks/useCareersCopy'
import { useCareersJobs } from '@/features/showcases/hooks/useCareersStore'

interface TalentCompaniesPageProps {
  standalone?: boolean
}

type CompanySort = 'rating' | 'jobs' | 'name'

export function TalentCompaniesPage({ standalone = false }: TalentCompaniesPageProps) {
  const root = careersRoot(standalone)
  const { text, language } = useCareersCopy()
  const { published } = useCareersJobs()
  const [query, setQuery] = useState('')
  const [industry, setIndustry] = useState<string>()
  const [size, setSize] = useState<CompanySize>()
  const [sort, setSort] = useState<CompanySort>('rating')

  const industries = useMemo(
    () =>
      [
        ...new Map(
          careersCompanies.map((company) => [company.industryKey, company.industry[language]]),
        ),
      ]
        .map(([value, label]) => ({ value, label }))
        .sort((a, b) => a.label.localeCompare(b.label, language)),
    [language],
  )

  const companies = careersCompanies
    .map((company) => ({ company, open: jobsOfCompany(company.id, published).length }))
    .filter(({ company }) => {
      const needle = fold(query.trim())
      const haystack = fold(
        `${company.name} ${company.industry.en} ${company.industry.tr} ${company.tagline[language]}`,
      )
      return (
        (!needle || haystack.includes(needle)) &&
        (!industry || company.industryKey === industry) &&
        (!size || company.size === size)
      )
    })
    .sort((a, b) => {
      if (sort === 'jobs') return b.open - a.open || b.company.rating - a.company.rating
      if (sort === 'name') return a.company.name.localeCompare(b.company.name, language)
      return b.company.rating - a.company.rating
    })

  return (
    <CareersSiteShell standalone={standalone}>
      <section className="careers-section careers-section--page">
        <div className="careers-section__head">
          <Typography.Title level={1} className="careers-page-title">
            {text.companies.title}
          </Typography.Title>
          <Typography.Text type="secondary">{text.companies.subtitle}</Typography.Text>
        </div>

        <Flex gap={8} wrap className="careers-company-filters">
          <Input
            allowClear
            prefix={<SearchOutlined aria-hidden="true" />}
            placeholder={text.companies.search}
            aria-label={text.companies.search}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="careers-company-filters__search"
          />
          <Select
            allowClear
            aria-label={text.companies.anyIndustry}
            placeholder={text.companies.anyIndustry}
            value={industry}
            onChange={setIndustry}
            options={industries}
            className="careers-company-filters__select"
          />
          <Select
            allowClear
            aria-label={text.companies.anySize}
            placeholder={text.companies.anySize}
            value={size}
            onChange={setSize}
            options={COMPANY_SIZES.map((value) => ({ value, label: text.sizes[value] }))}
            className="careers-company-filters__select"
          />
          <Select<CompanySort>
            aria-label={text.jobs.sortLabel}
            value={sort}
            onChange={setSort}
            options={[
              { value: 'rating', label: text.companies.sortRating },
              { value: 'jobs', label: text.companies.sortJobs },
              { value: 'name', label: text.companies.sortName },
            ]}
            className="careers-company-filters__select"
          />
        </Flex>
        <Typography.Text type="secondary" className="careers-count">
          {text.companies.count(companies.length)}
        </Typography.Text>

        {companies.length === 0 ? (
          <Empty description={text.companies.empty} />
        ) : (
          <div className="careers-company-cards">
            {companies.map(({ company, open }) => (
              <article key={company.id} className="careers-company-card">
                <div
                  className="careers-company-card__cover"
                  style={{ background: company.color }}
                />
                <div className="careers-company-card__body">
                  <CompanyLogo company={company} size={56} />
                  <Link
                    to={`${root}/companies/${company.id}`}
                    className="careers-company-card__name"
                  >
                    {company.name}
                  </Link>
                  <Typography.Text type="secondary">{company.tagline[language]}</Typography.Text>
                  <Flex gap={8} wrap align="center" className="careers-company-card__meta">
                    <RatingBadge rating={company.rating} />
                    <Typography.Text type="secondary">
                      {text.companies.reviews(company.reviewCount)}
                    </Typography.Text>
                  </Flex>
                  <Typography.Text type="secondary">
                    {company.industry[language]} · {text.sizes[company.size]}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    <EnvironmentOutlined aria-hidden="true" /> {CITY_NAMES[language][company.city]}
                  </Typography.Text>
                  <Flex
                    justify="space-between"
                    align="center"
                    gap={8}
                    wrap
                    className="careers-company-card__foot"
                  >
                    <Link to={`${root}/jobs?company=${company.id}`}>
                      {text.home.openRoles(open)}
                    </Link>
                    <FollowButton company={company} />
                  </Flex>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </CareersSiteShell>
  )
}
