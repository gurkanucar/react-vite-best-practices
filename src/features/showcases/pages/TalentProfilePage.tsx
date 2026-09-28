import {
  CheckCircleFilled,
  DeleteOutlined,
  MailOutlined,
  PaperClipOutlined,
  PhoneOutlined,
  PlusOutlined,
  PrinterOutlined,
  UndoOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Progress,
  Row,
  Select,
  Switch,
  Tag,
  Typography,
  Upload,
} from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { CareersSiteShell } from '@/features/showcases/components/CareersSiteShell'
import {
  ALL_SKILLS,
  CITIES,
  CITY_NAMES,
  JOB_LOCATIONS,
  ROLE_TITLES,
  WORK_MODES,
  type City,
  type JobLocation,
  type WorkMode,
} from '@/features/showcases/data/careers'
import {
  COMPLETENESS_CHECKS,
  LANGUAGE_LEVELS,
  profileCompleteness,
  seedProfile,
  type CandidateProfile,
  type LanguageLevel,
} from '@/features/showcases/data/careersProfile'
import { useCareersCopy } from '@/features/showcases/hooks/useCareersCopy'
import { useCareersStore } from '@/features/showcases/hooks/useCareersStore'

interface TalentProfilePageProps {
  standalone?: boolean
}

interface PeriodFields {
  start?: Dayjs | null
  end?: Dayjs | null
  current?: boolean
}

interface ProfileForm {
  name: string
  headline: string
  email: string
  phone: string
  city: City
  summary: string
  portfolio: string
  experience: ({ title: string; company: string; description?: string } & PeriodFields)[]
  education: ({ school: string; degree: string } & PeriodFields)[]
  skills: string[]
  languages: { name: string; level: LanguageLevel }[]
  roles: string[]
  locations: JobLocation[]
  modes: WorkMode[]
  salary: number | null
  openToWork: boolean
}

const month = (value: string | null) => (value ? dayjs(`${value}-01`) : null)
const monthKey = (value: Dayjs | null | undefined) => (value ? value.format('YYYY-MM') : '')

function toForm(profile: CandidateProfile): ProfileForm {
  return {
    ...profile,
    experience: profile.experience.map((item) => ({
      ...item,
      start: month(item.start),
      end: month(item.end),
      current: item.end === null,
    })),
    education: profile.education.map((item) => ({
      ...item,
      start: month(item.start),
      end: month(item.end),
      current: item.end === null,
    })),
    roles: profile.preferences.roles,
    locations: profile.preferences.locations,
    modes: profile.preferences.modes,
    salary: profile.preferences.salary,
    openToWork: profile.preferences.openToWork,
  }
}

function fromForm(values: ProfileForm, cvFiles: string[]): CandidateProfile {
  const period = (item: PeriodFields) => ({
    start: monthKey(item.start),
    end: item.current ? null : monthKey(item.end) || null,
  })
  return {
    name: values.name ?? '',
    headline: values.headline ?? '',
    email: values.email ?? '',
    phone: values.phone ?? '',
    city: values.city,
    summary: values.summary ?? '',
    portfolio: values.portfolio ?? '',
    experience: (values.experience ?? []).filter(Boolean).map((item) => ({
      title: item.title ?? '',
      company: item.company ?? '',
      description: item.description,
      ...period(item),
    })),
    education: (values.education ?? []).filter(Boolean).map((item) => ({
      school: item.school ?? '',
      degree: item.degree ?? '',
      ...period(item),
    })),
    skills: values.skills ?? [],
    languages: (values.languages ?? []).filter((item) => item?.name),
    preferences: {
      roles: values.roles ?? [],
      locations: values.locations ?? [],
      modes: values.modes ?? [],
      salary: values.salary ?? null,
      openToWork: values.openToWork ?? false,
    },
    cvFiles,
  }
}

function PeriodInputs({ name, text }: { name: number; text: { period: string; current: string } }) {
  return (
    <Flex gap={8} wrap align="center" className="careers-period">
      <Form.Item name={[name, 'start']} label={text.period} className="careers-period__start">
        <DatePicker picker="month" format="MMM YYYY" />
      </Form.Item>
      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => {
          const current = getFieldValue(['experience', name, 'current']) ?? false
          return (
            <Form.Item name={[name, 'end']} label=" " className="careers-period__end">
              <DatePicker picker="month" format="MMM YYYY" disabled={current} />
            </Form.Item>
          )
        }}
      </Form.Item>
      <Form.Item name={[name, 'current']} valuePropName="checked" label=" ">
        <Checkbox>{text.current}</Checkbox>
      </Form.Item>
    </Flex>
  )
}

function CvPreview({ profile }: { profile: CandidateProfile }) {
  const { text, language } = useCareersCopy()
  const range = (start: string, end: string | null) =>
    `${start ? dayjs(`${start}-01`).format('MMM YYYY') : ''} – ${end ? dayjs(`${end}-01`).format('MMM YYYY') : text.profile.present}`
  return (
    <div className="careers-cv">
      <header>
        <h2>{profile.name || '—'}</h2>
        <p className="careers-cv__headline">{profile.headline}</p>
        <p className="careers-cv__contact">
          <span>
            <MailOutlined aria-hidden="true" /> {profile.email}
          </span>
          <span>
            <PhoneOutlined aria-hidden="true" /> {profile.phone}
          </span>
          <span>{CITY_NAMES[language][profile.city]}</span>
          {profile.portfolio && <span>{profile.portfolio}</span>}
        </p>
      </header>
      {profile.summary && <p>{profile.summary}</p>}
      {profile.experience.length > 0 && (
        <section>
          <h3>{text.profile.experience}</h3>
          {profile.experience.map((item, index) => (
            <div key={`${item.company}-${index}`} className="careers-cv__item">
              <strong>{item.title}</strong> · {item.company}
              <span className="careers-cv__dates">{range(item.start, item.end)}</span>
              {item.description && <p>{item.description}</p>}
            </div>
          ))}
        </section>
      )}
      {profile.education.length > 0 && (
        <section>
          <h3>{text.profile.education}</h3>
          {profile.education.map((item, index) => (
            <div key={`${item.school}-${index}`} className="careers-cv__item">
              <strong>{item.school}</strong> · {item.degree}
              <span className="careers-cv__dates">{range(item.start, item.end)}</span>
            </div>
          ))}
        </section>
      )}
      {profile.skills.length > 0 && (
        <section>
          <h3>{text.profile.skills}</h3>
          <p>{profile.skills.join(' · ')}</p>
        </section>
      )}
      {profile.languages.length > 0 && (
        <section>
          <h3>{text.profile.languages}</h3>
          <p>
            {profile.languages
              .map((item) => `${item.name} (${text.languageLevels[item.level]})`)
              .join(' · ')}
          </p>
        </section>
      )}
    </div>
  )
}

export function TalentProfilePage({ standalone = false }: TalentProfilePageProps) {
  const { text, language } = useCareersCopy()
  const profile = useCareersStore((state) => state.profile)
  const updateProfile = useCareersStore((state) => state.updateProfile)
  const [form] = Form.useForm<ProfileForm>()
  const completeness = profileCompleteness(profile)
  const roleOptions = [...new Set(ROLE_TITLES.flatMap((title) => [title.en, title.tr]))]

  const setCvFiles = (cvFiles: string[]) => updateProfile({ ...profile, cvFiles })
  const restore = () => {
    updateProfile(seedProfile)
    form.setFieldsValue(toForm(seedProfile))
  }

  return (
    <CareersSiteShell standalone={standalone}>
      <section className="careers-section careers-section--page careers-profile">
        <Flex justify="space-between" align="end" gap={12} wrap className="careers-section__head">
          <div>
            <Typography.Title level={1} className="careers-page-title">
              {text.profile.title}
            </Typography.Title>
            <Typography.Text type="secondary">{text.profile.subtitle}</Typography.Text>
          </div>
          <Button icon={<UndoOutlined />} onClick={restore}>
            {text.profile.reset}
          </Button>
        </Flex>

        <Row gutter={[24, 24]}>
          <Col xs={24} xl={15}>
            <Form<ProfileForm>
              form={form}
              layout="vertical"
              initialValues={toForm(profile)}
              onValuesChange={(_changed, all) => updateProfile(fromForm(all, profile.cvFiles))}
            >
              <Card title={text.profile.basics} className="careers-card">
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="name" label={text.profile.name}>
                      <Input autoComplete="name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="city" label={text.profile.city}>
                      <Select
                        options={CITIES.map((value) => ({
                          value,
                          label: CITY_NAMES[language][value],
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="headline" label={text.profile.headline}>
                      <Input placeholder={text.profile.headlinePlaceholder} maxLength={90} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="email" label={text.profile.email} rules={[{ type: 'email' }]}>
                      <Input autoComplete="email" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="phone" label={text.profile.phone}>
                      <Input autoComplete="tel" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="summary" label={text.profile.summary}>
                      <Input.TextArea
                        autoSize={{ minRows: 3, maxRows: 8 }}
                        maxLength={600}
                        showCount
                        placeholder={text.profile.summaryPlaceholder}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="portfolio" label={text.profile.portfolio}>
                      <Input placeholder="https://" inputMode="url" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card title={text.profile.experience} className="careers-card">
                <Form.List name="experience">
                  {(fields, { add, remove }) => (
                    <Flex vertical gap={16}>
                      {fields.map((field) => (
                        <div key={field.key} className="careers-list-item">
                          <Row gutter={16}>
                            <Col xs={24} md={12}>
                              <Form.Item name={[field.name, 'title']} label={text.profile.jobTitle}>
                                <Input />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                              <Form.Item
                                name={[field.name, 'company']}
                                label={text.profile.company}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                          </Row>
                          <PeriodInputs name={field.name} text={text.profile} />
                          <Form.Item
                            name={[field.name, 'description']}
                            label={text.profile.description}
                          >
                            <Input.TextArea autoSize={{ minRows: 2, maxRows: 5 }} />
                          </Form.Item>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                          >
                            {text.profile.remove}
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => add({ title: '', company: '', current: false })}
                      >
                        {text.profile.addExperience}
                      </Button>
                    </Flex>
                  )}
                </Form.List>
              </Card>

              <Card title={text.profile.education} className="careers-card">
                <Form.List name="education">
                  {(fields, { add, remove }) => (
                    <Flex vertical gap={16}>
                      {fields.map((field) => (
                        <div key={field.key} className="careers-list-item">
                          <Row gutter={16}>
                            <Col xs={24} md={12}>
                              <Form.Item name={[field.name, 'school']} label={text.profile.school}>
                                <Input />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                              <Form.Item name={[field.name, 'degree']} label={text.profile.degree}>
                                <Input />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Flex gap={8} wrap>
                            <Form.Item name={[field.name, 'start']} label={text.profile.period}>
                              <DatePicker picker="month" format="MMM YYYY" />
                            </Form.Item>
                            <Form.Item name={[field.name, 'end']} label=" ">
                              <DatePicker picker="month" format="MMM YYYY" />
                            </Form.Item>
                          </Flex>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                          >
                            {text.profile.remove}
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => add({ school: '', degree: '' })}
                      >
                        {text.profile.addEducation}
                      </Button>
                    </Flex>
                  )}
                </Form.List>
              </Card>

              <Card title={text.profile.skills} className="careers-card">
                <Form.Item name="skills" extra={text.profile.skillsHint}>
                  <Select
                    mode="tags"
                    aria-label={text.profile.skills}
                    options={ALL_SKILLS.map((skill) => ({ value: skill, label: skill }))}
                    tokenSeparators={[',']}
                  />
                </Form.Item>
              </Card>

              <Card title={text.profile.languages} className="careers-card">
                <Form.List name="languages">
                  {(fields, { add, remove }) => (
                    <Flex vertical gap={8}>
                      {fields.map((field) => (
                        <Flex
                          key={field.key}
                          gap={8}
                          align="start"
                          wrap
                          className="careers-language-row"
                        >
                          <Form.Item
                            name={[field.name, 'name']}
                            className="careers-language-row__name"
                          >
                            <Input
                              aria-label={text.profile.language}
                              placeholder={text.profile.language}
                            />
                          </Form.Item>
                          <Form.Item
                            name={[field.name, 'level']}
                            className="careers-language-row__level"
                          >
                            <Select
                              aria-label={text.profile.level}
                              options={LANGUAGE_LEVELS.map((value) => ({
                                value,
                                label: text.languageLevels[value],
                              }))}
                            />
                          </Form.Item>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            aria-label={text.profile.remove}
                            onClick={() => remove(field.name)}
                          />
                        </Flex>
                      ))}
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => add({ name: '', level: 'b2' })}
                      >
                        {text.profile.addLanguage}
                      </Button>
                    </Flex>
                  )}
                </Form.List>
              </Card>

              <Card title={text.profile.preferences} className="careers-card">
                <Form.Item name="roles" label={text.profile.roles}>
                  <Select
                    mode="tags"
                    options={roleOptions.map((value) => ({ value, label: value }))}
                  />
                </Form.Item>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="locations" label={text.profile.locations}>
                      <Select
                        mode="multiple"
                        options={JOB_LOCATIONS.map((value) => ({
                          value,
                          label: CITY_NAMES[language][value],
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="salary" label={text.profile.salary}>
                      <InputNumber<number>
                        className="full-width"
                        min={0}
                        step={5000}
                        prefix="₺"
                        formatter={(value) =>
                          value
                            ? new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US').format(
                                Number(value),
                              )
                            : ''
                        }
                        parser={(value) => Number((value ?? '').replace(/\D/g, ''))}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="modes" label={text.profile.modes}>
                  <Checkbox.Group
                    options={WORK_MODES.map((value) => ({ value, label: text.modes[value] }))}
                  />
                </Form.Item>
                <Form.Item
                  name="openToWork"
                  valuePropName="checked"
                  extra={text.profile.openToWorkHint}
                >
                  <Switch
                    checkedChildren={text.profile.openToWork}
                    unCheckedChildren={text.profile.openToWork}
                  />
                </Form.Item>
              </Card>

              <Card title={text.profile.cvs} className="careers-card">
                <Flex vertical gap={8}>
                  {profile.cvFiles.map((name) => (
                    <Flex
                      key={name}
                      justify="space-between"
                      align="center"
                      className="careers-cv-file"
                    >
                      <span>
                        <PaperClipOutlined aria-hidden="true" /> {name}
                      </span>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        aria-label={`${text.profile.remove}: ${name}`}
                        onClick={() => setCvFiles(profile.cvFiles.filter((file) => file !== name))}
                      />
                    </Flex>
                  ))}
                  <Upload
                    accept=".pdf,.doc,.docx"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      if (!profile.cvFiles.includes(file.name))
                        setCvFiles([...profile.cvFiles, file.name])
                      return Upload.LIST_IGNORE
                    }}
                  >
                    <Button icon={<UploadOutlined />}>{text.profile.cvUpload}</Button>
                  </Upload>
                </Flex>
              </Card>
            </Form>
          </Col>

          <Col xs={24} xl={9}>
            <div className="careers-sticky">
              <Card className="careers-card careers-strength">
                <Flex align="center" gap={16}>
                  <Progress
                    type="circle"
                    size={80}
                    percent={completeness.percent}
                    strokeColor={completeness.percent === 100 ? '#2b8a3e' : '#1f5eff'}
                  />
                  <div>
                    <Typography.Title level={4} className="careers-strength__title">
                      {text.profile.completeness}
                    </Typography.Title>
                    <Typography.Text type="secondary">
                      {completeness.missing.length
                        ? text.profile.completenessHint
                        : text.profile.completenessDone}
                    </Typography.Text>
                  </div>
                </Flex>
                <ul className="careers-checks">
                  {COMPLETENESS_CHECKS.map((check) => (
                    <li key={check} className={completeness.done[check] ? 'is-done' : undefined}>
                      {completeness.done[check] ? (
                        <CheckCircleFilled aria-hidden="true" />
                      ) : (
                        <span className="careers-checks__dot" aria-hidden="true" />
                      )}
                      <span>
                        <strong>{text.checks[check][0]}</strong>
                        {!completeness.done[check] && <span>{text.checks[check][1]}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
                {profile.preferences.openToWork && (
                  <Tag variant="filled" color="green">
                    {text.profile.openToWork}
                  </Tag>
                )}
              </Card>

              <Card
                className="careers-card"
                title={text.profile.preview}
                extra={
                  <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
                    {text.profile.print}
                  </Button>
                }
              >
                <CvPreview profile={profile} />
              </Card>
            </div>
          </Col>
        </Row>
      </section>
    </CareersSiteShell>
  )
}
