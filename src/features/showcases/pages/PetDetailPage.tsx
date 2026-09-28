import {
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseCircleFilled,
  EnvironmentOutlined,
  FileDoneOutlined,
  HeartOutlined,
  MailOutlined,
  PhoneOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import {
  Alert,
  App,
  Breadcrumb,
  Button,
  Descriptions,
  Flex,
  Result,
  Space,
  Tag,
  Typography,
} from 'antd'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { FavoriteButton, PetCard, SexIcon } from '@/features/showcases/components/PetsBits'
import { PetsMatchCheck } from '@/features/showcases/components/PetsMatchCheck'
import { PetsPortrait } from '@/features/showcases/components/PetsPortrait'
import { PetsSiteShell } from '@/features/showcases/components/PetsSiteShell'
import {
  breeds,
  cities,
  coats,
  COMPANIONS,
  findPet,
  findShelter,
  formatAge,
  petsRoot,
  similarPets,
  specialNeeds,
  traits,
  type Pet,
} from '@/features/showcases/data/pets'
import { useOpenApplication, usePetsCopy } from '@/features/showcases/hooks/usePetsStore'

const GALLERY = [0, 1, 2, 3]

function Gallery({ pet }: { pet: Pet }) {
  const { text } = usePetsCopy()
  const [current, setCurrent] = useState(0)
  return (
    <section className="pets-gallery" aria-label={text.detail.gallery(pet.name)}>
      <div className="pets-gallery__main">
        <PetsPortrait
          species={pet.species}
          coat={pet.coat}
          breed={pet.breed}
          variant={current}
          className="pets-gallery__art"
        />
        <div className="pets-gallery__heart">
          <FavoriteButton pet={pet} size="large" />
        </div>
      </div>
      <div className="pets-gallery__thumbs">
        {GALLERY.map((variant) => (
          <button
            key={variant}
            type="button"
            className={`pets-gallery__thumb${variant === current ? ' is-current' : ''}`}
            aria-label={text.detail.photo(pet.name, variant + 1)}
            aria-pressed={variant === current}
            onClick={() => setCurrent(variant)}
          >
            <PetsPortrait
              species={pet.species}
              coat={pet.coat}
              breed={pet.breed}
              variant={variant}
            />
          </button>
        ))}
      </div>
    </section>
  )
}

function Check({ ok, yes, no }: { ok: boolean; yes: string; no: string }) {
  return (
    <li className={ok ? 'is-good' : 'is-muted'}>
      {ok ? <CheckCircleFilled aria-hidden="true" /> : <CloseCircleFilled aria-hidden="true" />}
      <span>{ok ? yes : no}</span>
    </li>
  )
}

export function PetDetailPage({ standalone = false }: { standalone?: boolean }) {
  const { text, language } = usePetsCopy()
  const { message } = App.useApp()
  const root = petsRoot(standalone)
  const { petId } = useParams()
  const pet = findPet(petId)
  const application = useOpenApplication(pet?.id)

  if (!pet) {
    return (
      <PetsSiteShell standalone={standalone}>
        <Result
          status="404"
          title={text.common.notFound}
          extra={
            <Link to={`${root}/animals`}>
              <Button type="primary">{text.common.backToList}</Button>
            </Link>
          }
        />
      </PetsSiteShell>
    )
  }

  const shelter = findShelter(pet.shelterId)!
  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: pet.name, url })
        return
      }
      await navigator.clipboard.writeText(url)
      void message.success(text.detail.copied)
    } catch {
      // The visitor closed the share sheet; nothing to report.
    }
  }
  const good = COMPANIONS.filter((companion) => pet.goodWith[companion])
  const notGood = COMPANIONS.filter((companion) => !pet.goodWith[companion])

  return (
    <PetsSiteShell standalone={standalone}>
      <div className="pets-wrap pets-detail">
        <Breadcrumb
          className="pets-crumbs"
          items={[
            { title: <Link to={root}>Patiyuva</Link> },
            { title: <Link to={`${root}/animals`}>{text.nav.animals}</Link> },
            { title: pet.name },
          ]}
        />

        <div className="pets-detail__top">
          <Gallery pet={pet} />

          <div className="pets-detail__summary">
            <Flex align="center" gap={10}>
              <Typography.Title className="pets-detail__name">{pet.name}</Typography.Title>
              <SexIcon sex={pet.sex} />
            </Flex>
            <Typography.Paragraph className="pets-detail__meta">
              {breeds[pet.breed].name[language]} · {formatAge(pet.ageMonths, language)} ·{' '}
              <EnvironmentOutlined aria-hidden="true" /> {cities[pet.cityId][language]}
            </Typography.Paragraph>
            <Flex gap={6} wrap>
              <Tag color={pet.status === 'available' ? 'green' : 'gold'}>
                {pet.status === 'available' ? text.common.available : text.common.reserved}
              </Tag>
              <Tag>{text.species[pet.species]}</Tag>
              <Tag>{text.sizes[pet.size]}</Tag>
              {pet.apartmentFriendly && <Tag color="blue">{text.common.apartment}</Tag>}
              {pet.specialNeed && <Tag color="purple">{text.common.specialNeeds}</Tag>}
            </Flex>
            <Typography.Text type="secondary" className="pets-detail__waiting">
              <ClockCircleOutlined aria-hidden="true" /> {text.common.waiting(pet.waitingDays)}
            </Typography.Text>

            {pet.status === 'reserved' && (
              <Alert type="warning" showIcon title={text.detail.reserved(pet.name)} />
            )}

            <div className="pets-detail__fee">
              <Typography.Text type="secondary">{text.common.fee}</Typography.Text>
              <strong>{text.detail.feeValue(pet.adoptionFee)}</strong>
              <Typography.Text type="secondary" className="pets-detail__feenote">
                {text.detail.feeNote}
              </Typography.Text>
            </div>

            <Space wrap size={10}>
              {application ? (
                <Link to={`${root}/favorites?tab=applications`}>
                  <Button type="primary" size="large" icon={<FileDoneOutlined />}>
                    {text.detail.viewApplication}
                  </Button>
                </Link>
              ) : (
                <Link to={`${root}/apply/${pet.id}`}>
                  <Button type="primary" size="large" icon={<HeartOutlined />}>
                    {text.detail.apply(pet.name)}
                  </Button>
                </Link>
              )}
              <Button size="large" icon={<ShareAltOutlined />} onClick={() => void share()}>
                {text.detail.share}
              </Button>
            </Space>

            <Descriptions
              className="pets-detail__facts"
              title={text.detail.facts}
              column={{ xs: 1, sm: 2, lg: 2 }}
              size="small"
              items={[
                {
                  key: 'breed',
                  label: text.detail.breed,
                  children: breeds[pet.breed].name[language],
                },
                {
                  key: 'age',
                  label: text.detail.age,
                  children: formatAge(pet.ageMonths, language),
                },
                { key: 'sex', label: text.detail.sex, children: text.sexes[pet.sex] },
                { key: 'size', label: text.detail.size, children: text.sizes[pet.size] },
                {
                  key: 'weight',
                  label: text.detail.weight,
                  children: text.detail.kg(pet.weightKg),
                },
                { key: 'coat', label: text.detail.coat, children: coats[pet.coat].name[language] },
                { key: 'energy', label: text.detail.energy, children: text.energies[pet.energy] },
                { key: 'city', label: text.detail.city, children: cities[pet.cityId][language] },
              ]}
            />
          </div>
        </div>

        <div className="pets-detail__body">
          <div className="pets-detail__main">
            <section className="pets-panel">
              <Typography.Title level={3}>{text.detail.story(pet.name)}</Typography.Title>
              <Typography.Paragraph className="pets-detail__story">
                {pet.story[language]}
              </Typography.Paragraph>
              <Typography.Title level={5}>{text.detail.personality}</Typography.Title>
              <Flex gap={8} wrap>
                {pet.traits.map((trait) => (
                  <Tag key={trait} className="pets-trait">
                    {traits[trait][language]}
                  </Tag>
                ))}
              </Flex>
              {pet.specialNeed && (
                <Alert
                  className="pets-detail__need"
                  type="info"
                  showIcon
                  title={text.detail.specialNeed}
                  description={specialNeeds[pet.specialNeed][language]}
                />
              )}
            </section>

            <div className="pets-detail__pair">
              <section className="pets-panel">
                <Typography.Title level={4}>{text.detail.health}</Typography.Title>
                <ul className="pets-checks">
                  <Check
                    ok={pet.vaccinated}
                    yes={text.detail.vaccinated}
                    no={text.detail.notVaccinated}
                  />
                  <Check
                    ok={pet.neutered}
                    yes={text.detail.neutered}
                    no={text.detail.notNeutered}
                  />
                  <Check
                    ok={pet.microchipped}
                    yes={text.detail.microchipped}
                    no={text.detail.notMicrochipped}
                  />
                </ul>
              </section>
              <section className="pets-panel">
                <Typography.Title level={4}>{text.detail.goodWith}</Typography.Title>
                <ul className="pets-checks">
                  {good.map((companion) => (
                    <Check key={companion} ok yes={text.companions[companion]} no="" />
                  ))}
                  {notGood.map((companion) => (
                    <Check
                      key={companion}
                      ok={false}
                      yes=""
                      no={`${text.detail.notWith}: ${text.companions[companion].toLocaleLowerCase(language)}`}
                    />
                  ))}
                </ul>
              </section>
            </div>

            <PetsMatchCheck pet={pet} />
          </div>

          <aside className="pets-detail__aside">
            <section className="pets-panel pets-shelter-card">
              <Typography.Text type="secondary">{text.detail.shelter}</Typography.Text>
              <Typography.Title level={4}>{shelter.name}</Typography.Title>
              <Typography.Paragraph type="secondary">
                {shelter.about[language]}
              </Typography.Paragraph>
              <ul className="pets-shelter-card__lines">
                <li>
                  <EnvironmentOutlined aria-hidden="true" />
                  <span>
                    {shelter.district}, {cities[shelter.cityId][language]}
                  </span>
                </li>
                <li>
                  <ClockCircleOutlined aria-hidden="true" />
                  <span>
                    {text.detail.hours}: {shelter.hours[language]}
                  </span>
                </li>
              </ul>
              <Space wrap>
                <Button href={`tel:${shelter.phone.replaceAll(' ', '')}`} icon={<PhoneOutlined />}>
                  {text.detail.call}
                </Button>
                <Button href={`mailto:${shelter.email}`} icon={<MailOutlined />}>
                  {text.detail.email}
                </Button>
              </Space>
            </section>
          </aside>
        </div>

        <section className="pets-similar">
          <Typography.Title level={2}>{text.detail.similar}</Typography.Title>
          <div className="pets-grid">
            {similarPets(pet).map((other) => (
              <PetCard key={other.id} pet={other} root={root} />
            ))}
          </div>
        </section>
      </div>
    </PetsSiteShell>
  )
}
