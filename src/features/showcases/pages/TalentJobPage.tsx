import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'
import { Link, useParams } from 'react-router'
import { CareersJobDetail } from '@/features/showcases/components/CareersJobDetail'
import { CareersSiteShell } from '@/features/showcases/components/CareersSiteShell'
import { careersRoot } from '@/features/showcases/data/careers'
import { useCareersCopy } from '@/features/showcases/hooks/useCareersCopy'
import { useCareersJobs } from '@/features/showcases/hooks/useCareersStore'

interface TalentJobPageProps {
  standalone?: boolean
}

export function TalentJobPage({ standalone = false }: TalentJobPageProps) {
  const root = careersRoot(standalone)
  const { text } = useCareersCopy()
  const { jobId } = useParams<{ jobId: string }>()
  const { find } = useCareersJobs()
  const job = find(jobId)

  return (
    <CareersSiteShell standalone={standalone}>
      <div className="careers-job-page">
        <Link to={`${root}/jobs`} className="careers-back">
          <ArrowLeftOutlined aria-hidden="true" /> {text.job.backToJobs}
        </Link>
        {job ? (
          <CareersJobDetail key={job.id} job={job} root={root} />
        ) : (
          <Result
            status="404"
            title={text.job.notFoundTitle}
            subTitle={text.job.notFoundText}
            extra={
              <Link to={`${root}/jobs`}>
                <Button type="primary">{text.job.backToJobs}</Button>
              </Link>
            }
          />
        )}
      </div>
    </CareersSiteShell>
  )
}
