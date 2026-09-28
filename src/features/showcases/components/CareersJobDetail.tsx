import {
  CheckCircleFilled,
  CheckOutlined,
  ClockCircleOutlined,
  ExportOutlined,
  GiftOutlined,
  LinkOutlined,
  TeamOutlined,
  ThunderboltFilled,
} from '@ant-design/icons'
import { Alert, App, Avatar, Button, Card, Divider, Flex, Progress, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { CareersApplyModal } from '@/features/showcases/components/CareersApplyModal'
import {
  CompanyLogo,
  JobCard,
  LocationText,
  RatingBadge,
  SalaryText,
  SaveJobButton,
} from '@/features/showcases/components/CareersBits'
import { companyOf, type Job } from '@/features/showcases/data/careers'
import { postedLabel, similarJobs, skillMatch } from '@/features/showcases/data/careersSearch'
import { useCareersCopy } from '@/features/showcases/hooks/useCareersCopy'
import {
  useApplicationFor,
  useCareersJobs,
  useCareersStore,
} from '@/features/showcases/hooks/useCareersStore'

interface CareersJobDetailProps {
  job: Job
  root: string
  /** The split view's right pane: tighter, without similar jobs, with a link to the full page. */
  pane?: boolean
  /** The employer's live preview while writing: no actions, and nothing is recorded. */
  preview?: boolean
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
}

export function CareersJobDetail({
  job,
  root,
  pane = false,
  preview = false,
}: CareersJobDetailProps) {
  const { text, language } = useCareersCopy()
  const { message } = App.useApp()
  const company = companyOf(job)
  const profileSkills = useCareersStore((state) => state.profile.skills)
  const markViewed = useCareersStore((state) => state.markViewed)
  const application = useApplicationFor(job.id)
  const { published, isPublished } = useCareersJobs()
  const open = isPublished(job)
  const postingStatus = useCareersStore((state) => state.postings[job.id]?.status)
  const [applying, setApplying] = useState(false)
  const match = skillMatch(job, profileSkills)
  const jobPath = `${root}/jobs/${job.id}`

  useEffect(() => {
    if (!preview) markViewed(job.id)
  }, [job.id, markViewed, preview])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${jobPath}`)
      void message.success(text.job.linkCopied)
    } catch {
      void message.info(`${window.location.origin}${jobPath}`)
    }
  }

  return (
    <article className={`careers-detail${pane ? ' careers-detail--pane' : ''}`}>
      <header className="careers-detail__header">
        <Flex align="center" gap={12}>
          <CompanyLogo company={company} size={pane ? 48 : 56} />
          <div className="careers-detail__company">
            <Link to={`${root}/companies/${company.id}`}>{company.name}</Link>
            <RatingBadge rating={company.rating} />
          </div>
        </Flex>
        {pane ? (
          <Typography.Title level={3} className="careers-detail__title">
            <Link to={jobPath}>{job.title[language]}</Link>
          </Typography.Title>
        ) : (
          <Typography.Title level={1} className="careers-detail__title">
            {job.title[language]}
          </Typography.Title>
        )}
        <Flex gap={8} wrap align="center" className="careers-detail__facts">
          <LocationText job={job} />
          <span aria-hidden="true">·</span>
          <Typography.Text type="secondary">
            <ClockCircleOutlined aria-hidden="true" />{' '}
            {text.job.posted(postedLabel(job.postedMinutesAgo, language))}
          </Typography.Text>
          <span aria-hidden="true">·</span>
          <Typography.Text type="secondary">
            <TeamOutlined aria-hidden="true" /> {text.common.applicants(job.applicants)}
          </Typography.Text>
        </Flex>
        <Flex gap={6} wrap className="careers-detail__tags">
          <Tag variant="filled">{text.types[job.type]}</Tag>
          <Tag variant="filled">{text.levels[job.level]}</Tag>
          <Tag variant="filled">{text.modes[job.mode]}</Tag>
          <Tag variant="filled">{text.categories[job.category]}</Tag>
        </Flex>
        <SalaryText job={job} />

        {!preview && (
          <Flex gap={8} wrap align="center" className="careers-detail__actions">
            {!open ? null : application ? (
              <>
                <Tag
                  variant="filled"
                  color="green"
                  icon={<CheckCircleFilled />}
                  className="careers-detail__applied"
                >
                  {text.job.appliedOn(dayjs(application.appliedAt).format('D MMM YYYY'))}
                </Tag>
                <Link to={`${root}/applications`}>
                  <Button size="large">{text.job.viewApplication}</Button>
                </Link>
              </>
            ) : job.easyApply ? (
              <Button
                type="primary"
                size="large"
                icon={<ThunderboltFilled />}
                onClick={() => setApplying(true)}
              >
                {text.job.apply}
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                icon={<ExportOutlined />}
                href={`https://careers.example/${company.id}/${job.id}`}
                target="_blank"
                rel="noreferrer"
              >
                {text.job.applyExternal}
              </Button>
            )}
            <SaveJobButton job={job} withLabel />
            <Button size="large" icon={<LinkOutlined />} onClick={() => void copyLink()}>
              {text.job.copyLink}
            </Button>
          </Flex>
        )}
        {open && !application && !job.easyApply && (
          <Typography.Text type="secondary" className="careers-detail__external">
            {text.job.externalNote}
          </Typography.Text>
        )}
        {!open && !preview && (
          <Alert
            type="warning"
            showIcon
            title={text.job.unpublished[postingStatus === 'draft' ? 'draft' : 'closed']}
          />
        )}
        {pane && (
          <Link to={jobPath} className="careers-detail__full">
            {text.jobs.openFull} →
          </Link>
        )}
      </header>

      <Card variant="borderless" className="careers-match">
        <Flex align="center" gap={16}>
          <Progress
            type="circle"
            size={64}
            percent={match.percent}
            strokeColor={match.percent >= 60 ? '#2b8a3e' : '#1f5eff'}
            format={(value) => `${value}%`}
          />
          <div>
            <Typography.Text strong>
              {text.job.match(match.matched.length, job.skills.length)}
            </Typography.Text>
            <br />
            <Typography.Text type="secondary">{text.job.matchHint}</Typography.Text>
          </div>
        </Flex>
        <Flex gap={6} wrap className="careers-match__skills">
          {job.skills.map((skill) =>
            match.matched.includes(skill) ? (
              <Tag key={skill} color="green" variant="filled" icon={<CheckOutlined />}>
                {skill}
              </Tag>
            ) : (
              <Tag key={skill} variant="outlined">
                {skill}
              </Tag>
            ),
          )}
        </Flex>
        {match.missing.length > 0 && match.matched.length > 0 && (
          <Typography.Text type="secondary" className="careers-match__missing">
            {text.job.missing} {match.missing.join(', ')}
          </Typography.Text>
        )}
      </Card>

      <section className="careers-detail__section">
        <Typography.Title level={4}>{text.job.about}</Typography.Title>
        <Typography.Paragraph>
          {job.about?.[language] ?? text.job.aboutText(job.title[language], company.name)}
        </Typography.Paragraph>
        <Typography.Title level={5}>{text.job.responsibilities}</Typography.Title>
        <ul>
          {job.responsibilities.map((item) => (
            <li key={item.en}>{item[language]}</li>
          ))}
        </ul>
        <Typography.Title level={5}>{text.job.requirements}</Typography.Title>
        <ul>
          {job.requirements.map((item) => (
            <li key={item.en}>{item[language]}</li>
          ))}
        </ul>
        {job.niceToHave.length > 0 && (
          <>
            <Typography.Title level={5}>{text.job.niceToHave}</Typography.Title>
            <Flex gap={6} wrap>
              {job.niceToHave.map((skill) => (
                <Tag key={skill} variant="outlined">
                  {skill}
                </Tag>
              ))}
            </Flex>
          </>
        )}
      </section>

      <section className="careers-detail__section">
        <Typography.Title level={4}>{text.job.benefits}</Typography.Title>
        <ul className="careers-benefits">
          {(job.benefits?.length ? job.benefits : company.benefits).map((benefit) => (
            <li key={benefit}>
              <GiftOutlined aria-hidden="true" /> {text.benefits[benefit]}
            </li>
          ))}
        </ul>
      </section>

      <section className="careers-detail__section">
        <Typography.Title level={4}>{text.job.hiringTeam}</Typography.Title>
        <Flex align="center" gap={12}>
          <Avatar size={44} className="careers-avatar" style={{ background: company.color }}>
            {initials(job.recruiter.name)}
          </Avatar>
          <div>
            <Typography.Text strong>{job.recruiter.name}</Typography.Text>
            <br />
            <Typography.Text type="secondary">
              {job.recruiter.title[language]} · {company.name}
            </Typography.Text>
          </div>
        </Flex>
      </section>

      <Card variant="borderless" className="careers-detail__company-card">
        <Flex align="center" gap={12} wrap>
          <CompanyLogo company={company} size={40} />
          <div className="careers-detail__company-text">
            <Typography.Text strong>{text.job.aboutCompany}</Typography.Text>
            <br />
            <Typography.Text type="secondary">
              {company.industry[language]} · {text.sizes[company.size]}
            </Typography.Text>
          </div>
          <Link to={`${root}/companies/${company.id}`}>
            <Button>{text.job.viewCompany}</Button>
          </Link>
        </Flex>
        <Divider />
        <Typography.Paragraph type="secondary">{company.about[language]}</Typography.Paragraph>
      </Card>

      {!pane && !preview && (
        <section className="careers-detail__section">
          <Typography.Title level={4}>{text.job.similar}</Typography.Title>
          <div className="careers-list">
            {similarJobs(job, 4, published).map((other) => (
              <JobCard key={other.id} job={other} href={`${root}/jobs/${other.id}`} />
            ))}
          </div>
        </section>
      )}

      {!preview && (
        <CareersApplyModal
          job={job}
          root={root}
          open={applying}
          onClose={() => setApplying(false)}
        />
      )}
    </article>
  )
}
