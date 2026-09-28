import { ArrowLeftOutlined, ArrowRightOutlined, SendOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Descriptions,
  Flex,
  Form,
  Grid,
  Input,
  InputNumber,
  Progress,
  Radio,
  Result,
  Row,
  Segmented,
  Select,
  Slider,
  Steps,
  Typography,
} from 'antd'
import type { Rule } from 'antd/es/form'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { MatchNotes, MatchScore } from '@/features/showcases/components/PetsBits'
import { PetsPortrait } from '@/features/showcases/components/PetsPortrait'
import { PetsSiteShell } from '@/features/showcases/components/PetsSiteShell'
import {
  CITY_IDS,
  COMPANIONS,
  ENERGIES,
  breeds,
  cities,
  findPet,
  findShelter,
  formatAge,
  petsRoot,
  type Companion,
  type Pet,
} from '@/features/showcases/data/pets'
import {
  MIN_REASON_LENGTH,
  applicationIssues,
  householdFrom,
  isAdult,
  isEmail,
  isTurkishMobile,
  matchPet,
  type ApplicationIssue,
  type ApplicationValues,
  type Experience,
  type HomeType,
} from '@/features/showcases/data/petsMatch'
import {
  useOpenApplication,
  usePetsCopy,
  usePetsStore,
} from '@/features/showcases/hooks/usePetsStore'

type FormValues = Omit<ApplicationValues, Companion> & { living: Companion[] }

const HOMES: HomeType[] = ['apartment', 'house', 'garden']
const EXPERIENCES: Experience[] = ['none', 'some', 'experienced']

/** The fields each step owns, validated before moving on. */
const STEP_FIELDS: (keyof FormValues)[][] = [
  ['fullName', 'email', 'phone', 'birthYear', 'city'],
  ['home', 'ownership', 'landlordConsent', 'living', 'hoursAlone'],
  ['activity', 'experience', 'previousPets', 'reason'],
  ['homeVisit', 'followUp', 'returnPolicy'],
]

function toApplication({ living, ...values }: FormValues): ApplicationValues {
  return {
    ...values,
    landlordConsent: values.landlordConsent ?? false,
    previousPets: values.previousPets ?? '',
    reason: values.reason ?? '',
    kids: living.includes('kids'),
    cats: living.includes('cats'),
    dogs: living.includes('dogs'),
  }
}

function useRules() {
  const { text } = usePetsCopy()
  const errors = text.apply.errors
  const required: Rule = { required: true, message: errors.required }
  const check =
    (ok: (value: never) => boolean, message: string): Rule =>
    () => ({
      validator: (_, value) =>
        value === undefined || value === null || value === '' || ok(value as never)
          ? Promise.resolve()
          : Promise.reject(new Error(message)),
    })
  const agreement: Rule = {
    validator: (_, value) =>
      value ? Promise.resolve() : Promise.reject(new Error(errors.agreement)),
  }
  return {
    required,
    agreement,
    name: [{ ...required, whitespace: true }],
    email: [required, check((value: string) => isEmail(value), errors.email)],
    phone: [required, check((value: string) => isTurkishMobile(value), errors.phone)],
    birthYear: [
      required,
      check((value: number) => isAdult(value, new Date().getFullYear()), errors.underage),
    ],
    reason: [
      required,
      check(
        (value: string) => value.trim().length >= MIN_REASON_LENGTH,
        errors.reason(MIN_REASON_LENGTH),
      ),
    ],
  }
}

function Aside({ pet, values }: { pet: Pet; values: FormValues | undefined }) {
  const { text, language } = usePetsCopy()
  const household = usePetsStore((state) => state.household)
  const match = matchPet(pet, values?.living ? householdFrom(toApplication(values)) : household)
  return (
    <aside className="pets-panel pets-apply__aside">
      <PetsPortrait
        species={pet.species}
        coat={pet.coat}
        breed={pet.breed}
        className="pets-apply__art"
      />
      <Typography.Title level={4}>{pet.name}</Typography.Title>
      <Typography.Text type="secondary">
        {breeds[pet.breed].name[language]} · {formatAge(pet.ageMonths, language)} ·{' '}
        {cities[pet.cityId][language]}
      </Typography.Text>
      <div className="pets-apply__match">
        <Typography.Text strong>{text.apply.matchTitle}</Typography.Text>
        <MatchScore match={match} compact />
        <MatchNotes match={match} />
      </div>
    </aside>
  )
}

export function PetApplyPage({ standalone = false }: { standalone?: boolean }) {
  const { text, language } = usePetsCopy()
  const root = petsRoot(standalone)
  const navigate = useNavigate()
  const { petId } = useParams()
  const pet = findPet(petId)
  const household = usePetsStore((state) => state.household)
  const apply = usePetsStore((state) => state.apply)
  const existing = useOpenApplication(pet?.id)
  const [form] = Form.useForm<FormValues>()
  const values = Form.useWatch([], { form, preserve: true }) as FormValues | undefined
  const [step, setStep] = useState(0)
  const [issues, setIssues] = useState<ApplicationIssue[]>([])
  const [sent, setSent] = useState(false)
  const rules = useRules()
  const narrow = !(Grid.useBreakpoint().md ?? false)

  if (!pet) {
    return (
      <PetsSiteShell standalone={standalone}>
        <Result
          status="404"
          title={text.common.notFound}
          extra={
            <Button type="primary" onClick={() => void navigate(`${root}/animals`)}>
              {text.common.backToList}
            </Button>
          }
        />
      </PetsSiteShell>
    )
  }
  const shelter = findShelter(pet.shelterId)!

  if (sent || existing) {
    return (
      <PetsSiteShell standalone={standalone}>
        <Result
          className="pets-apply__done"
          status={sent ? 'success' : 'info'}
          title={sent ? text.apply.successTitle : text.apply.already(pet.name)}
          subTitle={sent ? text.apply.successText(pet.name, shelter.name) : undefined}
          extra={[
            <Button
              type="primary"
              key="track"
              onClick={() => void navigate(`${root}/favorites?tab=applications`)}
            >
              {text.apply.track}
            </Button>,
            <Button key="more" onClick={() => void navigate(`${root}/animals`)}>
              {text.apply.keepLooking}
            </Button>,
          ]}
        />
      </PetsSiteShell>
    )
  }

  const next = async () => {
    try {
      await form.validateFields(STEP_FIELDS[step])
      setStep((current) => current + 1)
    } catch {
      // The form shows what is missing next to each field.
    }
  }
  const submit = async () => {
    try {
      await form.validateFields(STEP_FIELDS[3])
    } catch {
      return
    }
    const application = toApplication(form.getFieldsValue(true) as FormValues)
    const found = applicationIssues(application, pet, new Date().getFullYear())
    setIssues(found)
    if (found.length) return
    apply(pet.id, application, matchPet(pet, householdFrom(application)).score)
    setSent(true)
    window.scrollTo({ top: 0 })
  }

  const summary = values ? toApplication({ ...values, living: values.living ?? [] }) : undefined

  return (
    <PetsSiteShell standalone={standalone}>
      <div className="pets-wrap pets-apply">
        <Link to={`${root}/animals/${pet.id}`} className="pets-back">
          <ArrowLeftOutlined aria-hidden="true" /> {pet.name}
        </Link>
        <Typography.Title>{text.apply.title(pet.name)}</Typography.Title>
        <Typography.Paragraph type="secondary">{text.apply.lead}</Typography.Paragraph>

        <Row gutter={[32, 24]}>
          <Col xs={24} lg={16}>
            <div className="pets-panel">
              {narrow ? (
                <div className="pets-apply__progress">
                  <Typography.Text strong>
                    {step + 1}/{text.apply.steps.length} · {text.apply.steps[step]}
                  </Typography.Text>
                  <Progress
                    percent={((step + 1) / text.apply.steps.length) * 100}
                    steps={text.apply.steps.length}
                    showInfo={false}
                    size={[40, 8]}
                    strokeColor="#e0663e"
                  />
                </div>
              ) : (
                <Steps
                  className="pets-apply__steps"
                  current={step}
                  size="small"
                  responsive={false}
                  items={text.apply.steps.map((title) => ({ title }))}
                />
              )}
              <Form<FormValues>
                form={form}
                layout="vertical"
                requiredMark="optional"
                initialValues={{
                  city: pet.cityId,
                  home: household.home,
                  ownership: 'own',
                  landlordConsent: false,
                  living: COMPANIONS.filter((key) => household[key]),
                  hoursAlone: household.hoursAlone,
                  activity: household.activity,
                  experience: household.experience,
                  previousPets: '',
                  reason: '',
                  homeVisit: false,
                  followUp: false,
                  returnPolicy: false,
                }}
              >
                {step === 0 && (
                  <Row gutter={16}>
                    <Col xs={24}>
                      <Form.Item name="fullName" label={text.apply.fullName} rules={rules.name}>
                        <Input autoComplete="name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="email" label={text.apply.email} rules={rules.email}>
                        <Input type="email" autoComplete="email" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="phone" label={text.apply.phone} rules={rules.phone}>
                        <Input
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder={text.apply.phonePlaceholder}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="birthYear"
                        label={text.apply.birthYear}
                        rules={rules.birthYear}
                      >
                        <InputNumber<number>
                          min={1920}
                          max={2026}
                          className="pets-full"
                          placeholder="1990"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="city" label={text.apply.city} rules={[rules.required]}>
                        <Select
                          options={CITY_IDS.map((value) => ({
                            value,
                            label: cities[value][language],
                          }))}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                {step === 1 && (
                  <>
                    <Form.Item name="home" label={text.apply.home} rules={[rules.required]}>
                      <Radio.Group
                        optionType="button"
                        options={HOMES.map((value) => ({ value, label: text.match.homes[value] }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name="ownership"
                      label={text.apply.ownership}
                      rules={[rules.required]}
                    >
                      <Radio.Group
                        options={[
                          { value: 'own', label: text.apply.own },
                          { value: 'rent', label: text.apply.rent },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item noStyle dependencies={['ownership']}>
                      {({ getFieldValue }) =>
                        getFieldValue('ownership') === 'rent' && (
                          <Form.Item
                            name="landlordConsent"
                            valuePropName="checked"
                            rules={[
                              {
                                validator: (_, value) =>
                                  value
                                    ? Promise.resolve()
                                    : Promise.reject(new Error(text.apply.errors.landlord)),
                              },
                            ]}
                          >
                            <Checkbox>{text.apply.landlord}</Checkbox>
                          </Form.Item>
                        )
                      }
                    </Form.Item>
                    <Form.Item name="living" label={text.apply.living}>
                      <Checkbox.Group
                        options={COMPANIONS.map((value) => ({
                          value,
                          label: text.companions[value],
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name="hoursAlone"
                      label={`${text.apply.hoursAlone}: ${text.match.hours(values?.hoursAlone ?? household.hoursAlone)}`}
                    >
                      <Slider
                        min={0}
                        max={12}
                        tooltip={{ formatter: (value) => text.match.hours(value ?? 0) }}
                      />
                    </Form.Item>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Form.Item name="activity" label={text.apply.activity}>
                      <Segmented
                        options={ENERGIES.map((value) => ({ value, label: text.energies[value] }))}
                      />
                    </Form.Item>
                    <Form.Item name="experience" label={text.apply.experience}>
                      <Radio.Group
                        options={EXPERIENCES.map((value) => ({
                          value,
                          label: text.match.experiences[value],
                        }))}
                      />
                    </Form.Item>
                    <Form.Item name="previousPets" label={text.apply.previousPets}>
                      <Input.TextArea rows={2} placeholder={text.apply.previousPlaceholder} />
                    </Form.Item>
                    <Form.Item
                      name="reason"
                      label={text.apply.reason(pet.name)}
                      rules={rules.reason}
                      extra={text.apply.reasonCount(
                        (values?.reason ?? '').trim().length,
                        MIN_REASON_LENGTH,
                      )}
                    >
                      <Input.TextArea rows={4} placeholder={text.apply.reasonPlaceholder} />
                    </Form.Item>
                  </>
                )}

                {step === 3 && summary && (
                  <>
                    <Descriptions
                      title={text.apply.summary}
                      size="small"
                      column={{ xs: 1, md: 2 }}
                      className="pets-apply__summary"
                      items={[
                        { key: 'name', label: text.apply.fullName, children: summary.fullName },
                        { key: 'phone', label: text.apply.phone, children: summary.phone },
                        { key: 'email', label: text.apply.email, children: summary.email },
                        {
                          key: 'city',
                          label: text.apply.city,
                          children: cities[summary.city]?.[language],
                        },
                        {
                          key: 'home',
                          label: text.apply.home,
                          children: text.match.homes[summary.home],
                        },
                        {
                          key: 'ownership',
                          label: text.apply.ownership,
                          children: summary.ownership === 'rent' ? text.apply.rent : text.apply.own,
                        },
                        {
                          key: 'experience',
                          label: text.apply.experience,
                          children: text.match.experiences[summary.experience],
                        },
                        {
                          key: 'alone',
                          label: text.match.hoursAlone,
                          children: text.match.hours(summary.hoursAlone),
                        },
                      ]}
                    />
                    <Typography.Title level={5}>{text.apply.agreementsTitle}</Typography.Title>
                    {(['homeVisit', 'followUp', 'returnPolicy'] as const).map((key) => (
                      <Form.Item
                        key={key}
                        name={key}
                        valuePropName="checked"
                        rules={[rules.agreement]}
                        className="pets-apply__agree"
                      >
                        <Checkbox>{text.apply[key]}</Checkbox>
                      </Form.Item>
                    ))}
                    {issues.length > 0 && (
                      <Alert
                        type="error"
                        showIcon
                        title={
                          <ul className="pets-issues">
                            {issues.map((issue) => (
                              <li key={issue}>{text.apply.issues[issue]}</li>
                            ))}
                          </ul>
                        }
                      />
                    )}
                  </>
                )}

                <Flex justify="space-between" gap={12} className="pets-apply__nav">
                  <Button
                    icon={<ArrowLeftOutlined />}
                    disabled={step === 0}
                    onClick={() => setStep((current) => current - 1)}
                  >
                    {text.apply.back}
                  </Button>
                  {step < 3 ? (
                    <Button type="primary" onClick={() => void next()}>
                      {text.apply.next} <ArrowRightOutlined aria-hidden="true" />
                    </Button>
                  ) : (
                    <Button type="primary" icon={<SendOutlined />} onClick={() => void submit()}>
                      {text.apply.submit}
                    </Button>
                  )}
                </Flex>
              </Form>
            </div>
          </Col>
          <Col xs={24} lg={8}>
            <Aside pet={pet} values={values} />
          </Col>
        </Row>
      </div>
    </PetsSiteShell>
  )
}
