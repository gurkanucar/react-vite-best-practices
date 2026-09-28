import { BellOutlined, DeleteOutlined } from '@ant-design/icons'
import { Badge, Button, Drawer, Empty, Flex, Segmented, Tabs, Tag, Typography } from 'antd'
import { Link } from 'react-router'
import { JobCard } from '@/features/showcases/components/CareersBits'
import { describeSearch, parseFilters, searchJobs } from '@/features/showcases/data/careersSearch'
import { useCareersCopy } from '@/features/showcases/hooks/useCareersCopy'
import { useCareersJobs, useCareersStore } from '@/features/showcases/hooks/useCareersStore'

interface CareersSavedDrawerProps {
  open: boolean
  onClose: () => void
  root: string
  tab: 'saved' | 'alerts'
  onTabChange: (tab: 'saved' | 'alerts') => void
}

export function CareersSavedDrawer({
  open,
  onClose,
  root,
  tab,
  onTabChange,
}: CareersSavedDrawerProps) {
  const { text, language } = useCareersCopy()
  const savedJobs = useCareersStore((state) => state.savedJobs)
  const alerts = useCareersStore((state) => state.alerts)
  const removeAlert = useCareersStore((state) => state.removeAlert)
  const setAlertFrequency = useCareersStore((state) => state.setAlertFrequency)
  const { find, published } = useCareersJobs()
  const jobs = savedJobs.map(find).filter((job) => job !== undefined)

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={text.jobs.savedTitle}
      size="large"
      className="careers-saved"
    >
      <Tabs
        activeKey={tab}
        onChange={(key) => onTabChange(key as 'saved' | 'alerts')}
        items={[
          {
            key: 'saved',
            label: text.jobs.saved(jobs.length),
            children: jobs.length ? (
              <div className="careers-list">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} href={`${root}/jobs/${job.id}`} />
                ))}
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={text.jobs.savedEmpty} />
            ),
          },
          {
            key: 'alerts',
            label: text.jobs.alerts(alerts.length),
            children: alerts.length ? (
              <ul className="careers-alerts">
                {alerts.map((alert) => {
                  const filters = parseFilters(new URLSearchParams(alert.query))
                  const fresh = searchJobs(filters, [], published).filter(
                    (job) => job.postedMinutesAgo < 24 * 60,
                  ).length
                  return (
                    <li key={alert.id} className="careers-alert">
                      <Flex align="flex-start" gap={12}>
                        <Badge dot={fresh > 0} offset={[-2, 2]}>
                          <span className="careers-alert__icon">
                            <BellOutlined aria-hidden="true" />
                          </span>
                        </Badge>
                        <div className="careers-alert__body">
                          <Typography.Text strong>
                            {describeSearch(filters, text, language)}
                          </Typography.Text>
                          <Flex gap={8} wrap align="center">
                            {fresh > 0 && (
                              <Tag variant="filled" color="blue">
                                {text.jobs.alertNew(fresh)}
                              </Tag>
                            )}
                            <Segmented<'daily' | 'weekly'>
                              size="small"
                              value={alert.frequency}
                              onChange={(frequency) => setAlertFrequency(alert.id, frequency)}
                              options={[
                                { value: 'daily', label: text.jobs.frequency.daily },
                                { value: 'weekly', label: text.jobs.frequency.weekly },
                              ]}
                            />
                            <Link to={`${root}/jobs?${alert.query}`} onClick={onClose}>
                              {text.jobs.alertOpen}
                            </Link>
                          </Flex>
                        </div>
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          aria-label={text.common.remove}
                          onClick={() => removeAlert(alert.id)}
                        />
                      </Flex>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={text.jobs.alertsEmpty} />
            ),
          },
        ]}
      />
    </Drawer>
  )
}
