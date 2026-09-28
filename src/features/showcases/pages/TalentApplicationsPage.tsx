import {
  CalendarOutlined,
  PaperClipOutlined,
  SyncOutlined,
  TrophyOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import {
  Alert,
  App,
  Button,
  Empty,
  Flex,
  Grid,
  Input,
  Popconfirm,
  Steps,
  Tabs,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { Link } from 'react-router'
import { CompanyLogo } from '@/features/showcases/components/CareersBits'
import { CareersSiteShell } from '@/features/showcases/components/CareersSiteShell'
import { careersRoot, companyOf } from '@/features/showcases/data/careers'
import {
  applicationState,
  canWithdraw,
  interviewIcs,
  type Application,
  type ApplicationStage,
} from '@/features/showcases/data/careersProfile'
import { useCareersCopy } from '@/features/showcases/hooks/useCareersCopy'
import { useCareersNow } from '@/features/showcases/hooks/useCareersNow'
import { useCareersJobs, useCareersStore } from '@/features/showcases/hooks/useCareersStore'

interface TalentApplicationsPageProps {
  standalone?: boolean
}

const STATUS_COLOR: Record<ApplicationStage, string | undefined> = {
  applied: undefined,
  viewed: 'blue',
  review: 'geekblue',
  interview: 'purple',
  offer: 'green',
  hired: 'green',
  rejected: 'red',
  withdrawn: undefined,
  decision: undefined,
}

function download(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}

function ApplicationCard({
  application,
  root,
  now,
}: {
  application: Application
  root: string
  now: number
}) {
  const { text, language } = useCareersCopy()
  const { message } = App.useApp()
  // Five step names need the room; the admin frame is narrower than the window.
  const vertical = !(Grid.useBreakpoint().xl ?? false)
  const { find } = useCareersJobs()
  const withdraw = useCareersStore((state) => state.withdraw)
  const setNotes = useCareersStore((state) => state.setNotes)
  const job = find(application.jobId)
  const state = applicationState(application, now)
  const format = (ms: number) => dayjs(ms).format('D MMM, HH:mm')
  const current = state.entries.findLastIndex((entry) => entry.reached)
  const final = state.status === 'rejected' || state.status === 'withdrawn'

  if (!job) {
    return (
      <article className="careers-application">
        <Typography.Text type="secondary">{text.applications.removedJob}</Typography.Text>
      </article>
    )
  }
  const company = companyOf(job)

  return (
    <article className="careers-application">
      <Flex gap={12} align="flex-start" wrap className="careers-application__head">
        <CompanyLogo company={company} size={48} />
        <div className="careers-application__title">
          <Link to={`${root}/jobs/${job.id}`}>{job.title[language]}</Link>
          <Typography.Text type="secondary">
            {company.name} ·{' '}
            {text.applications.appliedOn(dayjs(application.appliedAt).format('D MMM YYYY'))}
          </Typography.Text>
        </div>
        <Tag
          variant="filled"
          color={STATUS_COLOR[state.status]}
          className="careers-application__status"
        >
          {text.stages[state.status]}
        </Tag>
      </Flex>

      <Steps
        size="small"
        orientation={vertical ? 'vertical' : 'horizontal'}
        current={current}
        status={
          final
            ? 'error'
            : state.status === 'offer' || state.status === 'hired'
              ? 'finish'
              : 'process'
        }
        className="careers-application__steps"
        items={state.entries.map((entry) => ({
          title: text.stages[entry.stage],
          content: entry.reached ? format(entry.at) : undefined,
        }))}
      />

      {state.status === 'interview' && state.interviewAt && (
        <Alert
          type="info"
          showIcon
          icon={<VideoCameraOutlined />}
          className="careers-application__note"
          title={text.applications.interviewOn(
            dayjs(state.interviewAt).format('dddd, D MMMM · HH:mm'),
          )}
          description={text.applications.interviewText}
          action={
            <Button
              icon={<CalendarOutlined />}
              onClick={() =>
                download(
                  `interview-${job.id}.ics`,
                  interviewIcs(application, state.interviewAt!, language, Date.now()),
                )
              }
            >
              {text.applications.addToCalendar}
            </Button>
          }
        />
      )}
      {(state.status === 'offer' || state.status === 'hired') && (
        <Alert
          type="success"
          showIcon
          icon={<TrophyOutlined />}
          className="careers-application__note"
          title={text.applications.offerText}
        />
      )}
      {state.status === 'rejected' && (
        <Alert
          type="warning"
          showIcon
          className="careers-application__note"
          title={text.applications.rejectedText}
        />
      )}
      {state.status === 'withdrawn' && (
        <Alert
          className="careers-application__note"
          showIcon
          type="info"
          title={text.applications.withdrawnText}
        />
      )}

      <Flex gap={12} wrap align="flex-end" className="careers-application__foot">
        <label className="careers-application__notes">
          <Typography.Text type="secondary">{text.applications.notes}</Typography.Text>
          <Input.TextArea
            autoSize={{ minRows: 1, maxRows: 4 }}
            value={application.notes}
            placeholder={text.applications.notesPlaceholder}
            onChange={(event) => setNotes(application.id, event.target.value)}
          />
        </label>
        <Flex gap={8} wrap align="center">
          <Typography.Text type="secondary" className="careers-application__cv">
            <PaperClipOutlined aria-hidden="true" /> {text.applications.cvUsed(application.cvName)}
          </Typography.Text>
          <Link to={`${root}/jobs/${job.id}`}>
            <Button>{text.applications.viewJob}</Button>
          </Link>
          {canWithdraw(application, now) && (
            <Popconfirm
              title={text.applications.withdrawConfirm}
              description={text.applications.withdrawDescription}
              okText={text.applications.withdraw}
              okButtonProps={{ danger: true }}
              cancelText={text.common.back}
              onConfirm={() => {
                withdraw(application.id)
                void message.info(text.applications.withdrawn)
              }}
            >
              <Button danger>{text.applications.withdraw}</Button>
            </Popconfirm>
          )}
        </Flex>
      </Flex>
    </article>
  )
}

export function TalentApplicationsPage({ standalone = false }: TalentApplicationsPageProps) {
  const root = careersRoot(standalone)
  const { text } = useCareersCopy()
  const now = useCareersNow(5_000)
  const applications = useCareersStore((state) => state.applications)
  const sorted = [...applications].sort((a, b) => b.appliedAt - a.appliedAt)
  const active = sorted.filter((application) => !applicationState(application, now).archived)
  const archived = sorted.filter((application) => applicationState(application, now).archived)

  const list = (items: Application[], empty: string) =>
    items.length ? (
      <div className="careers-applications">
        {items.map((application) => (
          <ApplicationCard key={application.id} application={application} root={root} now={now} />
        ))}
      </div>
    ) : (
      <Empty description={empty}>
        <Link to={`${root}/jobs`}>
          <Button type="primary">{text.applications.findJobs}</Button>
        </Link>
      </Empty>
    )

  return (
    <CareersSiteShell standalone={standalone}>
      <section className="careers-section careers-section--page">
        <div className="careers-section__head">
          <Typography.Title level={1} className="careers-page-title">
            {text.applications.title}
          </Typography.Title>
          <Typography.Text type="secondary">{text.applications.subtitle}</Typography.Text>
          <br />
          <Typography.Text type="secondary" className="careers-live">
            <SyncOutlined aria-hidden="true" /> {text.applications.live}
          </Typography.Text>
        </div>
        <Tabs
          items={[
            {
              key: 'active',
              label: text.applications.active(active.length),
              children: list(active, text.applications.emptyActive),
            },
            {
              key: 'archived',
              label: text.applications.archived(archived.length),
              children: list(archived, text.applications.emptyArchived),
            },
          ]}
        />
      </section>
    </CareersSiteShell>
  )
}
