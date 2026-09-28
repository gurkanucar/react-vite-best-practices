import { HeartOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Badge, Button, Empty, Flex, Popconfirm, Steps, Tabs, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { PetCard } from '@/features/showcases/components/PetsBits'
import { PetsPortrait } from '@/features/showcases/components/PetsPortrait'
import { PetsSiteShell } from '@/features/showcases/components/PetsSiteShell'
import { findPet, findShelter, petsRoot } from '@/features/showcases/data/pets'
import { APPLICATION_STAGES, applicationProgress } from '@/features/showcases/data/petsMatch'
import {
  usePetsCopy,
  usePetsNow,
  usePetsStore,
  type PetApplication,
} from '@/features/showcases/hooks/usePetsStore'

const outcomeColors = {
  pending: 'processing',
  approved: 'success',
  waitlist: 'warning',
  withdrawn: 'default',
} as const

function ApplicationCard({
  application,
  root,
  now,
}: {
  application: PetApplication
  root: string
  now: number
}) {
  const { text, language } = usePetsCopy()
  const navigate = useNavigate()
  const withdraw = usePetsStore((state) => state.withdraw)
  const pet = findPet(application.petId)
  if (!pet) return null
  const shelter = findShelter(pet.shelterId)
  const withdrawn = application.withdrawnAt !== undefined
  const progress = applicationProgress(
    application.submittedAt,
    application.score,
    application.withdrawnAt ?? now,
    withdrawn,
  )
  const format = (time: number) => dayjs(time).locale(language).format('D MMM, HH:mm')
  const decided = progress.outcome === 'approved' || progress.outcome === 'waitlist'

  return (
    <article className={`pets-panel pets-app${withdrawn ? ' is-withdrawn' : ''}`}>
      <div className="pets-app__head">
        <PetsPortrait
          species={pet.species}
          coat={pet.coat}
          breed={pet.breed}
          className="pets-app__art"
        />
        <div className="pets-app__title">
          <Typography.Title level={4}>{pet.name}</Typography.Title>
          <Typography.Text type="secondary">
            {shelter?.name} · {text.mine.submittedOn(format(application.submittedAt))}
          </Typography.Text>
          <Flex gap={6} wrap>
            <Tag color={outcomeColors[progress.outcome]}>
              {text.mine.outcomes[progress.outcome]}
            </Tag>
            <Tag>{text.mine.matchScore(application.score)}</Tag>
          </Flex>
        </div>
      </div>
      <Steps
        className="pets-app__steps"
        orientation="vertical"
        size="small"
        current={progress.index}
        status={
          withdrawn
            ? 'error'
            : progress.outcome === 'waitlist'
              ? 'wait'
              : decided
                ? 'finish'
                : 'process'
        }
        items={APPLICATION_STAGES.map((stage, index) => ({
          title: text.mine.stages[stage],
          content:
            index <= progress.index
              ? `${text.mine.stageHints[stage]} · ${format(progress.reachedAt[index]!)}`
              : text.mine.stageHints[stage],
        }))}
      />
      <Flex gap={8} wrap>
        <Button onClick={() => void navigate(`${root}/animals/${pet.id}`)}>
          {text.mine.viewPet}
        </Button>
        {withdrawn ? (
          <Button type="primary" onClick={() => void navigate(`${root}/apply/${pet.id}`)}>
            {text.mine.reapply}
          </Button>
        ) : (
          !decided && (
            <Popconfirm
              title={text.mine.withdrawConfirm}
              okText={text.mine.withdrawYes}
              cancelText={text.mine.withdrawNo}
              okButtonProps={{ danger: true }}
              onConfirm={() => withdraw(application.id)}
            >
              <Button danger>{text.mine.withdraw}</Button>
            </Popconfirm>
          )
        )}
      </Flex>
    </article>
  )
}

export function PetsFavoritesPage({ standalone = false }: { standalone?: boolean }) {
  const { text } = usePetsCopy()
  const root = petsRoot(standalone)
  const now = usePetsNow()
  const [params, setParams] = useSearchParams()
  const favorites = usePetsStore((state) => state.favorites)
  const applications = usePetsStore((state) => state.applications)
  const tab = params.get('tab') === 'applications' ? 'applications' : 'favorites'
  const saved = favorites.map((id) => findPet(id)).filter((pet) => pet !== undefined)
  const browse = (
    <Link to={`${root}/animals`}>
      <Button type="primary" icon={<HeartOutlined />}>
        {text.mine.browse}
      </Button>
    </Link>
  )

  return (
    <PetsSiteShell standalone={standalone}>
      <div className="pets-wrap pets-mine">
        <Typography.Title>{text.mine.title}</Typography.Title>
        <Typography.Paragraph type="secondary">{text.mine.lead}</Typography.Paragraph>
        <Tabs
          activeKey={tab}
          onChange={(key) =>
            setParams(key === 'applications' ? { tab: key } : {}, { replace: true })
          }
          items={[
            {
              key: 'favorites',
              label: (
                <Flex gap={8} align="center">
                  {text.mine.favorites}
                  <Badge count={saved.length} showZero color="#e0663e" />
                </Flex>
              ),
              children: saved.length ? (
                <div className="pets-grid">
                  {saved.map((pet) => (
                    <PetCard key={pet.id} pet={pet} root={root} />
                  ))}
                </div>
              ) : (
                <Empty description={text.mine.noFavorites} className="pets-empty">
                  {browse}
                </Empty>
              ),
            },
            {
              key: 'applications',
              label: (
                <Flex gap={8} align="center">
                  {text.mine.applications}
                  <Badge count={applications.length} showZero color="#e0663e" />
                </Flex>
              ),
              children: applications.length ? (
                <>
                  <Typography.Paragraph type="secondary" className="pets-mine__note">
                    <InfoCircleOutlined aria-hidden="true" /> {text.mine.demoNote}
                  </Typography.Paragraph>
                  <div className="pets-apps">
                    {applications.map((application) => (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        root={root}
                        now={now}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <Empty description={text.mine.noApplications} className="pets-empty">
                  {browse}
                </Empty>
              ),
            },
          ]}
        />
      </div>
    </PetsSiteShell>
  )
}
