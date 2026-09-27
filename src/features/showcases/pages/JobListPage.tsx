import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Empty,
  Flex,
  Input,
  Pagination,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { showcaseJobs, talentCopy } from '@/features/showcases/data'
import { localize, type JobStatus, type JobWorkMode } from '@/features/showcases/types'
import { usePreferencesStore } from '@/store/preferences-store'
import '../talent.css'

const PAGE_SIZE = 6

type SortMode = 'latest' | 'applicants' | 'closing'

export function JobListPage() {
  const language = usePreferencesStore((state) => state.language)
  const text = talentCopy[language]
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState<string>()
  const [workMode, setWorkMode] = useState<JobWorkMode>()
  const [sort, setSort] = useState<SortMode>('latest')
  const [page, setPage] = useState(1)

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-US')

    return showcaseJobs
      .filter((job) => {
        const haystack = [
          localize(job.title, language),
          job.company,
          localize(job.department, language),
          ...job.skills,
        ]
          .join(' ')
          .toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-US')

        return (
          (!normalizedQuery || haystack.includes(normalizedQuery)) &&
          (!department || localize(job.department, language) === department) &&
          (!workMode || job.workMode === workMode)
        )
      })
      .sort((first, second) => {
        if (sort === 'applicants') return second.applicants - first.applicants
        if (sort === 'closing') return first.expiresAt.localeCompare(second.expiresAt)
        return second.postedAt.localeCompare(first.postedAt)
      })
  }, [department, language, query, sort, workMode])

  const visibleJobs = filteredJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const departmentOptions = [
    ...new Set(showcaseJobs.map((job) => localize(job.department, language))),
  ]
  const activeJobs = showcaseJobs.filter((job) => job.status === 'published')
  const hiringCompanies = new Set(activeJobs.map((job) => job.company)).size
  const candidates = activeJobs.reduce((total, job) => total + job.applicants, 0)

  const updateFilter = (setter: () => void) => {
    setter()
    setPage(1)
  }

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(`${value}T12:00:00`))

  const workModeLabel = (mode: JobWorkMode) => text[mode]
  const statusLabel = (status: JobStatus) => text[status]

  return (
    <div className="admin-page talent-page">
      <PageHeader
        title={text.listTitle}
        description={text.listDescription}
        extra={
          <Link to="/showcases/jobs/new">
            <Button type="primary" size="large" icon={<PlusOutlined />}>
              {text.addJob}
            </Button>
          </Link>
        }
      />

      <section className="talent-overview" aria-label={text.overview}>
        <Row gutter={[12, 12]}>
          <Col xs={12} lg={6}>
            <Statistic title={text.openRoles} value={activeJobs.length} />
          </Col>
          <Col xs={12} lg={6}>
            <Statistic title={text.candidates} value={candidates} />
          </Col>
          <Col xs={12} lg={6}>
            <Statistic title={text.companiesHiring} value={hiringCompanies} />
          </Col>
          <Col xs={12} lg={6}>
            <Statistic title={text.closingSoon} value={3} />
          </Col>
        </Row>
      </section>

      <Card className="talent-filterbar" variant="borderless">
        <Flex align="center" justify="space-between" gap={12} wrap>
          <Input
            allowClear
            className="talent-filterbar__search"
            prefix={<SearchOutlined />}
            placeholder={text.searchPlaceholder}
            value={query}
            onChange={(event) => updateFilter(() => setQuery(event.target.value))}
          />
          <Flex gap={8} wrap>
            <Select
              allowClear
              className="talent-filterbar__select"
              placeholder={text.allDepartments}
              value={department}
              options={departmentOptions.map((value) => ({ value, label: value }))}
              onChange={(value) => updateFilter(() => setDepartment(value))}
            />
            <Select
              allowClear
              className="talent-filterbar__select"
              placeholder={text.allModes}
              value={workMode}
              options={(['onSite', 'hybrid', 'remote'] as JobWorkMode[]).map((value) => ({
                value,
                label: workModeLabel(value),
              }))}
              onChange={(value) => updateFilter(() => setWorkMode(value))}
            />
            <Select<SortMode>
              className="talent-filterbar__sort"
              value={sort}
              options={[
                { value: 'latest', label: text.sortLatest },
                { value: 'applicants', label: text.sortApplicants },
                { value: 'closing', label: text.sortClosing },
              ]}
              onChange={(value) => updateFilter(() => setSort(value))}
            />
          </Flex>
        </Flex>
      </Card>

      <Flex className="talent-result-count" justify="space-between" align="center">
        <Typography.Text strong>{text.results(filteredJobs.length)}</Typography.Text>
      </Flex>

      {visibleJobs.length ? (
        <Row gutter={[16, 16]}>
          {visibleJobs.map((job) => (
            <Col xs={24} xl={12} key={job.slug}>
              <Card className="talent-job-card" variant="borderless">
                <Flex justify="space-between" align="start" gap={16}>
                  <Flex gap={14} align="center">
                    <Avatar shape="square" size={48} style={{ backgroundColor: job.companyColor }}>
                      {job.companyInitials}
                    </Avatar>
                    <div>
                      <Typography.Text type="secondary">{job.company}</Typography.Text>
                      <Link to={`/showcases/jobs/${job.slug}`}>
                        <Typography.Title level={3}>
                          {localize(job.title, language)}
                        </Typography.Title>
                      </Link>
                    </div>
                  </Flex>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'edit',
                          label: <Link to={`/showcases/jobs/${job.slug}/edit`}>{text.edit}</Link>,
                        },
                        { key: 'duplicate', label: text.duplicate },
                        { key: 'close', label: text.closeRole, danger: true },
                      ],
                    }}
                    trigger={['click']}
                  >
                    <Button
                      aria-label={`${localize(job.title, language)} actions`}
                      icon={<MoreOutlined />}
                      type="text"
                    />
                  </Dropdown>
                </Flex>

                <Typography.Paragraph className="talent-job-card__summary" type="secondary">
                  {localize(job.summary, language)}
                </Typography.Paragraph>

                <Space className="talent-job-card__facts" size={[8, 8]} wrap>
                  <Tag icon={<EnvironmentOutlined />}>{localize(job.location, language)}</Tag>
                  <Tag icon={<ClockCircleOutlined />}>{text[job.employmentType]}</Tag>
                  <Tag>{workModeLabel(job.workMode)}</Tag>
                  <Tag
                    color={
                      job.status === 'published'
                        ? 'success'
                        : job.status === 'draft'
                          ? 'gold'
                          : 'default'
                    }
                  >
                    {statusLabel(job.status)}
                  </Tag>
                </Space>

                <Flex
                  className="talent-job-card__footer"
                  align="center"
                  justify="space-between"
                  gap={12}
                  wrap
                >
                  <Space size="large">
                    <Typography.Text type="secondary">
                      <TeamOutlined /> {text.candidatesCount(job.applicants)}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      <CalendarOutlined /> {formatDate(job.postedAt)}
                    </Typography.Text>
                  </Space>
                  <Link to={`/showcases/jobs/${job.slug}`}>
                    <Button type="link">{text.viewRole}</Button>
                  </Link>
                </Flex>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description={text.noResults}>
          <Button
            onClick={() => {
              setQuery('')
              setDepartment(undefined)
              setWorkMode(undefined)
              setPage(1)
            }}
          >
            {text.clearFilters}
          </Button>
        </Empty>
      )}

      {filteredJobs.length > PAGE_SIZE && (
        <Pagination
          className="talent-pagination"
          current={page}
          pageSize={PAGE_SIZE}
          total={filteredJobs.length}
          showSizeChanger={false}
          onChange={setPage}
        />
      )}
    </div>
  )
}
