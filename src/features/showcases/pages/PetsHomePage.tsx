import {
  ArrowRightOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  HomeOutlined,
  PhoneOutlined,
  SearchOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Result,
  Row,
  Segmented,
  Select,
  Switch,
  Tag,
  Typography,
} from 'antd'
import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { PetCard } from '@/features/showcases/components/PetsBits'
import { PetsPortrait } from '@/features/showcases/components/PetsPortrait'
import { PetsSiteShell } from '@/features/showcases/components/PetsSiteShell'
import {
  AGE_GROUPS,
  CITY_IDS,
  SPECIES,
  cities,
  featuredPets,
  pets,
  petsOfShelter,
  petsRoot,
  petsStats,
  shelters,
  successStories,
  type AgeGroup,
  type CityId,
  type Species,
} from '@/features/showcases/data/pets'
import {
  emptyPetFilters,
  filtersToParams,
  isTurkishMobile,
} from '@/features/showcases/data/petsMatch'
import { usePetsCopy } from '@/features/showcases/hooks/usePetsStore'

type HelpKey = 'donate' | 'volunteer' | 'foster'

const speciesCoats: Record<Species, Parameters<typeof PetsPortrait>[0]['coat']> = {
  cat: 'orange',
  dog: 'golden',
  rabbit: 'white',
  bird: 'green',
}

function QuickSearch({ root }: { root: string }) {
  const { text, language } = usePetsCopy()
  const navigate = useNavigate()
  const [species, setSpecies] = useState<Species | 'all'>('all')
  const [city, setCity] = useState<CityId | 'all'>('all')
  const [age, setAge] = useState<AgeGroup | 'all'>('all')
  const submit = () => {
    const params = filtersToParams({
      ...emptyPetFilters,
      species: species === 'all' ? [] : [species],
      city: city === 'all' ? null : city,
      ages: age === 'all' ? [] : [age],
    })
    const query = params.toString()
    void navigate(`${root}/animals${query ? `?${query}` : ''}`)
  }
  return (
    <search className="pets-quick" aria-label={text.home.searchLabel}>
      <Select<Species | 'all'>
        size="large"
        aria-label={text.list.groups.species}
        value={species}
        onChange={setSpecies}
        options={[
          { value: 'all', label: text.home.searchSpecies },
          ...SPECIES.map((value) => ({ value, label: text.speciesPlural[value] })),
        ]}
      />
      <Select<CityId | 'all'>
        size="large"
        aria-label={text.list.groups.city}
        value={city}
        onChange={setCity}
        options={[
          { value: 'all', label: text.home.searchCity },
          ...CITY_IDS.map((value) => ({ value, label: cities[value][language] })),
        ]}
      />
      <Select<AgeGroup | 'all'>
        size="large"
        aria-label={text.list.groups.age}
        value={age}
        onChange={setAge}
        options={[
          { value: 'all', label: text.home.searchAge },
          ...AGE_GROUPS.map((value) => ({ value, label: text.ages[value] })),
        ]}
      />
      <Button type="primary" size="large" icon={<SearchOutlined />} onClick={submit}>
        {text.home.search}
      </Button>
    </search>
  )
}

function SectionHead({ title, lead, extra }: { title: string; lead: string; extra?: ReactNode }) {
  return (
    <Flex justify="space-between" align="end" gap={16} wrap className="pets-section__head">
      <div>
        <Typography.Title level={2}>{title}</Typography.Title>
        <Typography.Paragraph type="secondary">{lead}</Typography.Paragraph>
      </div>
      {extra}
    </Flex>
  )
}

interface JoinValues {
  name: string
  phone: string
  city: CityId
}

interface DonateValues {
  amount: number
  monthly: boolean
  shelter: string
}

function useAmountText() {
  const { language } = usePetsCopy()
  return (amount: number) =>
    language === 'tr' ? `${amount.toLocaleString('tr')} ₺` : `₺${amount.toLocaleString('en')}`
}

function DonateForm({ onDone }: { onDone: (message: string) => void }) {
  const { text } = usePetsCopy()
  const amountText = useAmountText()
  const [form] = Form.useForm<DonateValues>()
  const amount = Form.useWatch('amount', form)
  return (
    <Form<DonateValues>
      form={form}
      layout="vertical"
      initialValues={{ amount: 500, monthly: false, shelter: 'any' }}
      onFinish={(values) => onDone(text.home.donateThanks(amountText(values.amount)))}
    >
      <Form.Item label={text.home.donateAmount} required>
        <Flex vertical gap={8}>
          <Segmented<number>
            block
            value={amount}
            onChange={(value) => form.setFieldValue('amount', value)}
            options={[250, 500, 1000, 2500].map((value) => ({
              value,
              label: amountText(value),
            }))}
          />
          <Form.Item
            noStyle
            name="amount"
            rules={[{ required: true, message: text.home.required }]}
          >
            <InputNumber<number>
              min={50}
              max={100_000}
              step={50}
              aria-label={text.home.donateAmount}
              suffix="₺"
              className="pets-full"
            />
          </Form.Item>
        </Flex>
      </Form.Item>
      <Form.Item name="shelter" label={text.home.donateShelter}>
        <Select
          options={[
            { value: 'any', label: text.home.donateAnyShelter },
            ...shelters.map((shelter) => ({ value: shelter.id, label: shelter.name })),
          ]}
        />
      </Form.Item>
      <Form.Item name="monthly" label={text.home.donateMonthly} valuePropName="checked">
        <Switch />
      </Form.Item>
      <Button type="primary" htmlType="submit" block icon={<GiftOutlined />}>
        {text.home.donateSubmit}
      </Button>
    </Form>
  )
}

function JoinForm({ onDone }: { onDone: (message: string) => void }) {
  const { text, language } = usePetsCopy()
  const [form] = Form.useForm<JoinValues>()
  return (
    <Form<JoinValues> form={form} layout="vertical" onFinish={() => onDone(text.home.joinThanks)}>
      <Form.Item
        name="name"
        label={text.home.joinName}
        rules={[{ required: true, whitespace: true, message: text.home.required }]}
      >
        <Input autoComplete="name" />
      </Form.Item>
      <Form.Item
        name="phone"
        label={text.home.joinPhone}
        rules={[
          { required: true, message: text.home.required },
          {
            validator: (_, value: string | undefined) =>
              !value || isTurkishMobile(value)
                ? Promise.resolve()
                : Promise.reject(new Error(text.home.phoneInvalid)),
          },
        ]}
      >
        <Input inputMode="tel" autoComplete="tel" placeholder="0532 123 45 67" />
      </Form.Item>
      <Form.Item
        name="city"
        label={text.home.joinCity}
        rules={[{ required: true, message: text.home.required }]}
      >
        <Select options={CITY_IDS.map((value) => ({ value, label: cities[value][language] }))} />
      </Form.Item>
      <Button type="primary" htmlType="submit" block>
        {text.home.joinSubmit}
      </Button>
    </Form>
  )
}

function HelpModal({ open, onClose }: { open: HelpKey | null; onClose: () => void }) {
  const { text } = usePetsCopy()
  const [done, setDone] = useState<string | null>(null)
  const close = () => {
    onClose()
    setDone(null)
  }
  const title =
    open === 'donate'
      ? text.home.donateTitle
      : open === 'foster'
        ? text.home.fosterTitle
        : text.home.volunteerTitle
  return (
    <Modal open={open !== null} title={title} onCancel={close} footer={null} destroyOnHidden>
      {done ? (
        <Result
          status="success"
          title={done}
          extra={<Button onClick={close}>OK</Button>}
          className="pets-help__result"
        />
      ) : open === 'donate' ? (
        <DonateForm onDone={setDone} />
      ) : (
        <JoinForm onDone={setDone} />
      )}
    </Modal>
  )
}

const helpIcons: Record<HelpKey, ReactNode> = {
  donate: <GiftOutlined />,
  volunteer: <TeamOutlined />,
  foster: <HomeOutlined />,
}

export function PetsHomePage({ standalone = false }: { standalone?: boolean }) {
  const { text, language } = usePetsCopy()
  const root = petsRoot(standalone)
  const [help, setHelp] = useState<HelpKey | null>(null)
  const waiting = pets.filter((pet) => pet.status === 'available').length
  const stats = [
    [waiting, text.home.stats.waiting],
    [petsStats.adoptedThisYear, text.home.stats.adopted],
    [shelters.length, text.home.stats.shelters],
    [petsStats.volunteers, text.home.stats.volunteers],
  ] as const

  return (
    <PetsSiteShell standalone={standalone}>
      <section className="pets-hero">
        <div className="pets-wrap pets-hero__inner">
          <div className="pets-hero__copy">
            <span className="pets-eyebrow">{text.home.eyebrow}</span>
            <Typography.Title>{text.home.title}</Typography.Title>
            <Typography.Paragraph className="pets-hero__lead">
              {text.home.lead}
            </Typography.Paragraph>
            <QuickSearch root={root} />
          </div>
          <div className="pets-hero__art" aria-hidden="true">
            <PetsPortrait
              species="dog"
              coat="golden"
              breed="golden"
              variant={1}
              className="pets-hero__pic pets-hero__pic--a"
            />
            <PetsPortrait
              species="cat"
              coat="orange"
              breed="tabby"
              variant={3}
              className="pets-hero__pic pets-hero__pic--b"
            />
            <PetsPortrait
              species="rabbit"
              coat="white"
              breed="lop"
              variant={0}
              className="pets-hero__pic pets-hero__pic--c"
            />
          </div>
        </div>
      </section>

      <section className="pets-stats" aria-label={text.home.eyebrow}>
        <div className="pets-wrap pets-stats__grid">
          {stats.map(([value, label]) => (
            <div key={label} className="pets-stat">
              <strong>{value.toLocaleString(language)}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="pets-section">
        <div className="pets-wrap">
          <SectionHead title={text.home.browse} lead={text.list.lead} />
          <div className="pets-species">
            {SPECIES.map((species) => (
              <Link
                key={species}
                to={`${root}/animals?species=${species}`}
                className="pets-species__item"
              >
                <PetsPortrait
                  species={species}
                  coat={speciesCoats[species]}
                  breed={species === 'bird' ? 'lovebird' : undefined}
                  className="pets-species__art"
                />
                <span className="pets-species__label">{text.speciesPlural[species]}</span>
                <span className="pets-species__count">
                  {text.home.animalsHere(pets.filter((pet) => pet.species === species).length)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pets-section pets-section--soft">
        <div className="pets-wrap">
          <SectionHead
            title={text.home.featuredTitle}
            lead={text.home.featuredLead}
            extra={
              <Link to={`${root}/animals`} className="pets-more">
                {text.home.viewAll} <ArrowRightOutlined aria-hidden="true" />
              </Link>
            }
          />
          <div className="pets-grid">
            {featuredPets(8).map((pet) => (
              <PetCard key={pet.id} pet={pet} root={root} />
            ))}
          </div>
        </div>
      </section>

      <section className="pets-section" id="how">
        <div className="pets-wrap">
          <SectionHead title={text.home.howTitle} lead={text.home.howLead} />
          <ol className="pets-steps">
            {text.home.steps.map((step, index) => (
              <li key={step.title} className="pets-step">
                <span className="pets-step__number" aria-hidden="true">
                  {index + 1}
                </span>
                <Typography.Title level={4}>{step.title}</Typography.Title>
                <Typography.Paragraph type="secondary">{step.text}</Typography.Paragraph>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="pets-section pets-section--warm">
        <div className="pets-wrap">
          <SectionHead title={text.home.storiesTitle} lead={text.home.storiesLead} />
          <Row gutter={[20, 20]}>
            {successStories.map((story) => (
              <Col xs={24} md={12} xl={6} key={story.id}>
                <figure className="pets-story">
                  <PetsPortrait
                    species={story.species}
                    coat={story.coat}
                    variant={2}
                    className="pets-story__art"
                  />
                  <blockquote>{story.quote[language]}</blockquote>
                  <figcaption>
                    <strong>
                      {story.petName} · {story.family}
                    </strong>
                    <span>{text.home.adoptedIn(cities[story.cityId][language])}</span>
                  </figcaption>
                </figure>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className="pets-section" id="shelters">
        <div className="pets-wrap">
          <SectionHead title={text.home.sheltersTitle} lead={text.home.sheltersLead} />
          <Row gutter={[20, 20]}>
            {shelters.map((shelter) => (
              <Col xs={24} md={12} xl={6} key={shelter.id}>
                <div className="pets-shelter">
                  <Flex justify="space-between" align="center" gap={8}>
                    <Tag color={shelter.kind === 'foster' ? 'green' : 'orange'}>
                      {text.home.shelterKinds[shelter.kind]}
                    </Tag>
                    <Typography.Text type="secondary">
                      {text.home.animalsHere(petsOfShelter(shelter.id).length)}
                    </Typography.Text>
                  </Flex>
                  <Typography.Title level={4}>{shelter.name}</Typography.Title>
                  <Typography.Paragraph type="secondary">
                    {shelter.about[language]}
                  </Typography.Paragraph>
                  <Typography.Text className="pets-shelter__line">
                    <EnvironmentOutlined aria-hidden="true" /> {shelter.district},{' '}
                    {cities[shelter.cityId][language]}
                  </Typography.Text>
                  <Typography.Text className="pets-shelter__line">
                    <PhoneOutlined aria-hidden="true" />{' '}
                    <a href={`tel:${shelter.phone.replaceAll(' ', '')}`}>{shelter.phone}</a>
                  </Typography.Text>
                  <Link
                    to={`${root}/animals?city=${shelter.cityId}`}
                    className="pets-more pets-shelter__more"
                  >
                    {text.home.viewAll} <ArrowRightOutlined aria-hidden="true" />
                  </Link>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className="pets-section pets-help">
        <div className="pets-wrap">
          <Typography.Title level={2} className="pets-help__title">
            {text.home.helpTitle}
          </Typography.Title>
          <Row gutter={[20, 20]}>
            {text.home.help.map((item) => (
              <Col xs={24} md={8} key={item.key}>
                <div className="pets-help__card">
                  <span className="pets-help__icon" aria-hidden="true">
                    {helpIcons[item.key as HelpKey]}
                  </span>
                  <Typography.Title level={4}>{item.title}</Typography.Title>
                  <Typography.Paragraph>{item.text}</Typography.Paragraph>
                  <Button onClick={() => setHelp(item.key as HelpKey)}>{item.action}</Button>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>
      <HelpModal open={help} onClose={() => setHelp(null)} />
    </PetsSiteShell>
  )
}
