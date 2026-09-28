import {
  CheckCircleFilled,
  CheckOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  StarFilled,
  ThunderboltFilled,
} from '@ant-design/icons'
import { Button, Flex, Tag, Tooltip, Typography } from 'antd'
import { Link } from 'react-router'
import { BookmarkIcon } from '@/features/showcases/components/CareersIcons'
import {
  CITY_NAMES,
  companyOf,
  jobLocation,
  type Company,
  type Job,
} from '@/features/showcases/data/careers'
import { formatSalaryRange, postedLabel } from '@/features/showcases/data/careersSearch'
import { useCareersCopy } from '@/features/showcases/hooks/useCareersCopy'
import { useApplicationFor, useCareersStore } from '@/features/showcases/hooks/useCareersStore'

/** A square mark with the company's initials: never an oval, whatever box it sits in. */
export function CompanyLogo({ company, size = 44 }: { company: Company; size?: number }) {
  return (
    <span
      className="careers-logo"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        background: company.color,
        fontSize: Math.round(size * 0.38),
        borderRadius: Math.round(size * 0.24),
      }}
    >
      {company.initials}
    </span>
  )
}

export function RatingBadge({ rating }: { rating: number }) {
  return (
    <span className="careers-rating">
      <StarFilled aria-hidden="true" /> {rating.toFixed(1)}
    </span>
  )
}

export function SalaryText({ job }: { job: Job }) {
  const { text, language } = useCareersCopy()
  if (!job.salary) {
    return <Typography.Text type="secondary">{text.common.salaryHidden}</Typography.Text>
  }
  return (
    <Typography.Text strong className="careers-salary">
      {formatSalaryRange(job.salary, language)}{' '}
      <Typography.Text type="secondary">{text.common.perMonth}</Typography.Text>
    </Typography.Text>
  )
}

export function LocationText({ job }: { job: Job }) {
  const { text, language } = useCareersCopy()
  const location = jobLocation(job)
  return (
    <span className="careers-location">
      <EnvironmentOutlined aria-hidden="true" />{' '}
      {location === 'remote'
        ? `${text.modes.remote} · Türkiye`
        : `${CITY_NAMES[language][location]} · ${text.modes[job.mode]}`}
    </span>
  )
}

export function SaveJobButton({ job, withLabel = false }: { job: Job; withLabel?: boolean }) {
  const { text, language } = useCareersCopy()
  const saved = useCareersStore((state) => state.savedJobs.includes(job.id))
  const toggleSaved = useCareersStore((state) => state.toggleSaved)
  const label = saved
    ? text.common.unsaveJob(job.title[language])
    : text.common.saveJob(job.title[language])

  const button = (
    <Button
      className={`careers-save${saved ? ' is-saved' : ''}`}
      shape={withLabel ? undefined : 'circle'}
      size={withLabel ? 'large' : 'middle'}
      aria-label={label}
      aria-pressed={saved}
      icon={<BookmarkIcon filled={saved} />}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleSaved(job.id)
      }}
    >
      {withLabel && (saved ? text.common.saved : text.common.save)}
    </Button>
  )
  return withLabel ? (
    button
  ) : (
    <Tooltip title={saved ? text.common.saved : text.common.save}>{button}</Tooltip>
  )
}

interface JobCardProps {
  job: Job
  href: string
  selected?: boolean
  onSelect?: (job: Job) => void
  /** Hide the company name, for lists on the company's own page. */
  hideCompany?: boolean
}

/**
 * One job in a list. With `onSelect` it picks the job for the split view instead of
 * following the link, but the link stays, so it can still be opened in a new tab.
 */
export function JobCard({
  job,
  href,
  selected = false,
  onSelect,
  hideCompany = false,
}: JobCardProps) {
  const { text, language } = useCareersCopy()
  const company = companyOf(job)
  const viewed = useCareersStore((state) => state.viewedJobs.includes(job.id))
  const application = useApplicationFor(job.id)
  const fresh = job.postedMinutesAgo < 24 * 60

  return (
    <article className={`careers-job-card${selected ? ' is-selected' : ''}`}>
      <CompanyLogo company={company} size={44} />
      <div className="careers-job-card__body">
        <Link
          to={href}
          className="careers-job-card__title"
          aria-current={selected ? 'true' : undefined}
          onClick={(event) => {
            if (!onSelect || event.metaKey || event.ctrlKey || event.shiftKey) return
            event.preventDefault()
            onSelect(job)
          }}
        >
          {job.title[language]}
        </Link>
        {!hideCompany && (
          <Typography.Text className="careers-job-card__company">
            {company.name} <RatingBadge rating={company.rating} />
          </Typography.Text>
        )}
        <LocationText job={job} />
        <SalaryText job={job} />
        <Flex gap={6} wrap align="center" className="careers-job-card__meta">
          {application ? (
            <Tag variant="filled" color="green" icon={<CheckCircleFilled />}>
              {text.common.applied}
            </Tag>
          ) : (
            viewed && (
              <Tag variant="filled" icon={<EyeOutlined />}>
                {text.common.viewed}
              </Tag>
            )
          )}
          {job.easyApply && (
            <Tag variant="filled" color="blue" icon={<ThunderboltFilled />}>
              {text.common.easyApply}
            </Tag>
          )}
          {fresh && (
            <Tag variant="filled" color="gold">
              {text.common.new}
            </Tag>
          )}
          <Typography.Text type="secondary" className="careers-job-card__posted">
            {postedLabel(job.postedMinutesAgo, language)}
          </Typography.Text>
        </Flex>
      </div>
      <SaveJobButton job={job} />
    </article>
  )
}

export function FollowButton({ company }: { company: Company }) {
  const { text } = useCareersCopy()
  const following = useCareersStore((state) => state.followedCompanies.includes(company.id))
  const toggleFollow = useCareersStore((state) => state.toggleFollow)
  return (
    <Button
      type={following ? 'default' : 'primary'}
      ghost={!following}
      icon={following ? <CheckOutlined /> : <PlusOutlined />}
      aria-pressed={following}
      onClick={(event) => {
        event.preventDefault()
        toggleFollow(company.id)
      }}
    >
      {following ? text.companies.following : text.companies.follow}
    </Button>
  )
}
