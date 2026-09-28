import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
  SendOutlined,
  StopOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import {
  App,
  Avatar,
  Button,
  Drawer,
  Dropdown,
  Empty,
  Flex,
  Input,
  Segmented,
  Select,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { CompanyLogo, LocationText } from '@/features/showcases/components/CareersBits'
import { CareersSiteShell } from '@/features/showcases/components/CareersSiteShell'
import { CITY_NAMES, careersRoot, findCompany, type Job } from '@/features/showcases/data/careers'
import {
  EMPLOYER_COMPANY_ID,
  POSTING_STATUSES,
  applicantMatch,
  defaultApplicantStage,
  generatedApplicants,
  isEmployerJob,
  postingOf,
  postingViews,
  type Applicant,
  type PostingStatus,
} from '@/features/showcases/data/careersEmployer'
import {
  EMPLOYER_STAGES,
  employerStageOf,
  type EmployerStage,
} from '@/features/showcases/data/careersProfile'
import { fold, postedLabel } from '@/features/showcases/data/careersSearch'
import { useCareersCopy } from '@/features/showcases/hooks/useCareersCopy'
import { useCareersNow } from '@/features/showcases/hooks/useCareersNow'
import { useCareersJobs, useCareersStore } from '@/features/showcases/hooks/useCareersStore'

interface TalentEmployerPageProps {
  standalone?: boolean
}

type PostingSort = 'newest' | 'applicants' | 'closing'

const STATUS_COLOR: Record<PostingStatus, string | undefined> = {
  published: 'green',
  draft: 'gold',
  closed: undefined,
}

interface ApplicantRow {
  applicant: Applicant
  stage: EmployerStage | 'withdrawn'
  match: number
  me: boolean
}

/** Everyone who applied to a listing, with the stage the employer has them in. */
function useApplicants(job: Job | undefined, now: number): ApplicantRow[] {
  const applicantStages = useCareersStore((state) => state.applicantStages)
  const applications = useCareersStore((state) => state.applications)
  const profile = useCareersStore((state) => state.profile)
  if (!job) return []
  const rows: ApplicantRow[] = generatedApplicants(job).map((applicant) => ({
    applicant,
    stage:
      applicantStages[`${job.id}:${applicant.id}`] ?? defaultApplicantStage(job.id, applicant.id),
    match: applicantMatch(job, applicant),
    me: false,
  }))
  const mine = applications.find((application) => application.jobId === job.id)
  if (mine) {
    const applicant: Applicant = {
      id: 'me',
      name: profile.name,
      headline: profile.headline,
      city: profile.city,
      skills: profile.skills,
      appliedMinutesAgo: Math.max(1, Math.round((now - mine.appliedAt) / 60_000)),
      years: mine.answers.years,
    }
    rows.unshift({
      applicant,
      stage: employerStageOf(mine, now),
      match: applicantMatch(job, applicant),
      me: true,
    })
  }
  return rows.sort((a, b) => Number(b.me) - Number(a.me) || b.match - a.match)
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

function ApplicantsDrawer({
  job,
  onClose,
  now,
}: {
  job: Job | undefined
  onClose: () => void
  now: number
}) {
  const { text, language } = useCareersCopy()
  const { message } = App.useApp()
  const setApplicantStage = useCareersStore((state) => state.setApplicantStage)
  const rows = useApplicants(job, now)
  const [stage, setStage] = useState<EmployerStage | 'all'>('all')
  const shown = stage === 'all' ? rows : rows.filter((row) => row.stage === stage)
  const note = job
    ? text.employer.applicantsShown(rows.length, Math.max(job.applicants, rows.length))
    : ''

  return (
    <Drawer
      open={job !== undefined}
      onClose={onClose}
      size="large"
      title={job ? text.employer.applicantsTitle(job.title[language]) : undefined}
      className="careers-applicants"
      destroyOnHidden
    >
      {job && (
        <>
          <div className="careers-applicants__stages">
            <Segmented<EmployerStage | 'all'>
              value={stage}
              onChange={setStage}
              options={[
                { value: 'all', label: `${text.employer.all} (${rows.length})` },
                ...EMPLOYER_STAGES.map((value) => ({
                  value,
                  label: `${text.employer.stages[value]} (${rows.filter((row) => row.stage === value).length})`,
                })),
              ]}
            />
          </div>
          {note && (
            <Typography.Paragraph type="secondary" className="careers-applicants__note">
              {note}
            </Typography.Paragraph>
          )}
          {shown.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={text.employer.applicantsEmpty}
            />
          ) : (
            <ul className="careers-applicant-list">
              {shown.map(({ applicant, stage: current, match, me }) => (
                <li key={applicant.id} className={`careers-applicant${me ? ' is-me' : ''}`}>
                  <Avatar size={44} className="careers-avatar careers-applicant__avatar">
                    {initials(applicant.name)}
                  </Avatar>
                  <div className="careers-applicant__body">
                    <Typography.Text strong>
                      {applicant.name}
                      {me && (
                        <Tag variant="filled" color="blue" className="careers-applicant__me">
                          {text.employer.you}
                        </Tag>
                      )}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      {me ? applicant.headline : job.title[language]}
                    </Typography.Text>
                    <Flex gap={8} wrap align="center" className="careers-applicant__meta">
                      <Tag
                        variant="filled"
                        color={match >= 60 ? 'green' : match >= 40 ? 'gold' : undefined}
                      >
                        {text.employer.match(match)}
                      </Tag>
                      <Typography.Text type="secondary">
                        {CITY_NAMES[language][applicant.city]} ·{' '}
                        {text.employer.years(applicant.years)} ·{' '}
                        {text.employer.appliedAgo(
                          postedLabel(applicant.appliedMinutesAgo, language),
                        )}
                      </Typography.Text>
                    </Flex>
                    {me && (
                      <Typography.Text type="secondary" className="careers-applicant__hint">
                        {text.employer.youHint}
                      </Typography.Text>
                    )}
                  </div>
                  {current === 'withdrawn' ? (
                    <Tag variant="filled">{text.employer.withdrawnStage}</Tag>
                  ) : (
                    <Select<EmployerStage>
                      className={`careers-applicant__stage careers-stage--${current}`}
                      value={current}
                      aria-label={`${text.employer.moveTo}: ${applicant.name}`}
                      onChange={(next) => {
                        setApplicantStage(job.id, applicant.id, next)
                        void message.success(
                          text.employer.moved(applicant.name, text.employer.stages[next]),
                        )
                      }}
                      options={EMPLOYER_STAGES.map((value) => ({
                        value,
                        label: (
                          <span>
                            <span
                              className={`careers-stage-dot careers-stage-dot--${value}`}
                              aria-hidden="true"
                            />
                            {text.employer.stages[value]}
                          </span>
                        ),
                      }))}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Drawer>
  )
}

export function TalentEmployerPage({ standalone = false }: TalentEmployerPageProps) {
  const root = careersRoot(standalone)
  const { text, language } = useCareersCopy()
  const { message, modal } = App.useApp()
  const now = useCareersNow(30_000)
  const [params, setParams] = useSearchParams()
  const { all } = useCareersJobs()
  const postings = useCareersStore((state) => state.postings)
  const applicantStages = useCareersStore((state) => state.applicantStages)
  const viewedJobs = useCareersStore((state) => state.viewedJobs)
  const setPostingStatus = useCareersStore((state) => state.setPostingStatus)
  const duplicatePosting = useCareersStore((state) => state.duplicatePosting)
  const deletePosting = useCareersStore((state) => state.deletePosting)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<PostingStatus>()
  const [sort, setSort] = useState<PostingSort>('newest')
  const company = findCompany(EMPLOYER_COMPANY_ID)!

  const own = useMemo(
    () =>
      all.filter(isEmployerJob).map((job) => ({
        job,
        info: postingOf(job, { postings }, now),
        views: postingViews(job) + (viewedJobs.includes(job.id) ? 1 : 0),
      })),
    [all, postings, now, viewedJobs],
  )
  const reviewing = params.get('applicants')
  const reviewJob = own.find(({ job }) => job.id === reviewing)?.job

  const shown = own
    .filter(({ job, info }) => {
      const needle = fold(query.trim())
      return (
        (!needle || fold(job.title[language]).includes(needle)) &&
        (!status || info.status === status)
      )
    })
    .sort((a, b) => {
      if (sort === 'applicants') return b.job.applicants - a.job.applicants
      if (sort === 'closing') return a.info.closesOn.localeCompare(b.info.closesOn)
      return a.job.postedMinutesAgo - b.job.postedMinutesAgo
    })

  const live = own.filter(({ info }) => info.status === 'published')
  const awaiting = own.reduce(
    (sum, { job }) =>
      sum +
      generatedApplicants(job).filter(
        (applicant) =>
          (applicantStages[`${job.id}:${applicant.id}`] ??
            defaultApplicantStage(job.id, applicant.id)) === 'new',
      ).length,
    0,
  )
  const stats = [
    [text.employer.stats.live, live.length],
    [text.employer.stats.applicants, own.reduce((sum, { job }) => sum + job.applicants, 0)],
    [text.employer.stats.views, own.reduce((sum, { views }) => sum + views, 0)],
    [text.employer.stats.newApplicants, awaiting],
  ] as const

  const openApplicants = (jobId: string | null) => {
    const next = new URLSearchParams(params)
    if (jobId) next.set('applicants', jobId)
    else next.delete('applicants')
    setParams(next, { replace: true })
  }

  const changeStatus = (job: Job, next: PostingStatus, closesOn: string) => {
    const reopenDate =
      next === 'published' && dayjs(closesOn).isBefore(dayjs(now), 'day')
        ? dayjs(now).add(30, 'day').format('YYYY-MM-DD')
        : closesOn
    setPostingStatus(job.id, next, next === 'closed' ? dayjs(now).format('YYYY-MM-DD') : reopenDate)
    void message.success(text.employer.statusChanged(text.employer.statuses[next]))
  }

  const duplicate = (job: Job) => {
    duplicatePosting(
      job,
      `${job.title[language]} (2)`,
      dayjs(now).add(30, 'day').format('YYYY-MM-DD'),
    )
    void message.success(text.employer.duplicated)
  }

  const remove = (job: Job) => {
    modal.confirm({
      title: text.employer.deleteConfirm,
      content: text.employer.deleteDescription,
      okText: text.employer.delete,
      okButtonProps: { danger: true },
      cancelText: text.common.back,
      onOk: () => {
        deletePosting(job.id)
        void message.success(text.employer.deleted)
      },
    })
  }

  return (
    <CareersSiteShell standalone={standalone}>
      <section className="careers-section careers-section--page careers-employer">
        <Flex justify="space-between" align="end" gap={16} wrap className="careers-section__head">
          <Flex align="center" gap={16}>
            <CompanyLogo company={company} size={56} />
            <div>
              <Typography.Title level={1} className="careers-page-title">
                {text.employer.title}
              </Typography.Title>
              <Typography.Text type="secondary">
                {text.employer.subtitle(company.name)}
              </Typography.Text>
            </div>
          </Flex>
          <Link to={`${root}/employer/new`}>
            <Button type="primary" size="large" icon={<PlusOutlined />}>
              {text.employer.postJob}
            </Button>
          </Link>
        </Flex>

        <dl className="careers-employer-stats">
          {stats.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US').format(value)}</dd>
            </div>
          ))}
        </dl>

        <Flex gap={8} wrap className="careers-company-filters">
          <Input
            allowClear
            prefix={<SearchOutlined aria-hidden="true" />}
            placeholder={text.employer.search}
            aria-label={text.employer.search}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="careers-company-filters__search"
          />
          <Select
            allowClear
            aria-label={text.employer.allStatuses}
            placeholder={text.employer.allStatuses}
            value={status}
            onChange={setStatus}
            options={POSTING_STATUSES.map((value) => ({
              value,
              label: `${text.employer.statuses[value]} (${own.filter(({ info }) => info.status === value).length})`,
            }))}
            className="careers-company-filters__select"
          />
          <Select<PostingSort>
            aria-label={text.jobs.sortLabel}
            value={sort}
            onChange={setSort}
            options={[
              { value: 'newest', label: text.employer.sortNewest },
              { value: 'applicants', label: text.employer.sortApplicants },
              { value: 'closing', label: text.employer.sortClosing },
            ]}
            className="careers-company-filters__select"
          />
        </Flex>

        {shown.length === 0 ? (
          <Empty description={text.employer.empty} />
        ) : (
          <ul className="careers-postings">
            {shown.map(({ job, info, views }) => (
              <li key={job.id} className={`careers-posting careers-posting--${info.status}`}>
                <div className="careers-posting__main">
                  <Flex gap={8} align="center" wrap>
                    <Link to={`${root}/jobs/${job.id}`} className="careers-posting__title">
                      {job.title[language]}
                    </Link>
                    <Tag variant="filled" color={STATUS_COLOR[info.status]}>
                      {text.employer.statuses[info.status]}
                    </Tag>
                  </Flex>
                  <Flex gap={8} wrap align="center" className="careers-posting__meta">
                    <LocationText job={job} />
                    <Typography.Text type="secondary">· {text.levels[job.level]}</Typography.Text>
                    <Typography.Text type="secondary">
                      · {postedLabel(job.postedMinutesAgo, language)}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      ·{' '}
                      {(info.status === 'closed' ? text.employer.closedOn : text.employer.closesOn)(
                        dayjs(info.closesOn).format('D MMM YYYY'),
                      )}
                    </Typography.Text>
                  </Flex>
                </div>
                <dl className="careers-posting__numbers">
                  <div>
                    <dt>
                      <TeamOutlined aria-hidden="true" />
                    </dt>
                    <dd>{text.employer.applicants(job.applicants)}</dd>
                  </div>
                  <div>
                    <dt>
                      <EyeOutlined aria-hidden="true" />
                    </dt>
                    <dd>{text.employer.views(views)}</dd>
                  </div>
                </dl>
                <Flex gap={8} wrap align="center" className="careers-posting__actions">
                  <Button type="primary" ghost onClick={() => openApplicants(job.id)}>
                    {text.employer.reviewApplicants}
                  </Button>
                  <Link to={`${root}/employer/${job.id}/edit`}>
                    <Button icon={<EditOutlined />}>{text.employer.edit}</Button>
                  </Link>
                  <Dropdown
                    trigger={['click']}
                    menu={{
                      items: [
                        {
                          key: 'view',
                          icon: <EyeOutlined />,
                          label: (
                            <Link to={`${root}/jobs/${job.id}`}>{text.employer.viewListing}</Link>
                          ),
                        },
                        info.status === 'published'
                          ? {
                              key: 'close',
                              icon: <StopOutlined />,
                              label: text.employer.close,
                              onClick: () => changeStatus(job, 'closed', info.closesOn),
                            }
                          : {
                              key: 'publish',
                              icon: <SendOutlined />,
                              label:
                                info.status === 'closed'
                                  ? text.employer.reopen
                                  : text.employer.publish,
                              onClick: () => changeStatus(job, 'published', info.closesOn),
                            },
                        {
                          key: 'duplicate',
                          icon: <CopyOutlined />,
                          label: text.employer.duplicate,
                          onClick: () => duplicate(job),
                        },
                        { type: 'divider' },
                        {
                          key: 'delete',
                          icon: <DeleteOutlined />,
                          danger: true,
                          label: text.employer.delete,
                          onClick: () => remove(job),
                        },
                      ],
                    }}
                  >
                    <Button icon={<MoreOutlined />} aria-label={text.employer.more} />
                  </Dropdown>
                </Flex>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ApplicantsDrawer job={reviewJob} onClose={() => openApplicants(null)} now={now} />
    </CareersSiteShell>
  )
}
