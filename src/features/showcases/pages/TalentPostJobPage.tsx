import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  SendOutlined,
} from '@ant-design/icons'
import {
  App,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Result,
  Row,
  Segmented,
  Select,
  Typography,
} from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { CareersJobDetail } from '@/features/showcases/components/CareersJobDetail'
import { CareersSiteShell } from '@/features/showcases/components/CareersSiteShell'
import {
  ALL_SKILLS,
  BENEFITS,
  CAREERS_CATEGORIES,
  CITIES,
  CITY_NAMES,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  WORK_MODES,
  careersRoot,
  findCompany,
} from '@/features/showcases/data/careers'
import {
  EMPLOYER_COMPANY_ID,
  POSTING_STATUSES,
  isEmployerJob,
  jobToPosting,
  newPostingId,
  postingOf,
  postingToJob,
  type PostingDraft,
  type PostingStatus,
} from '@/features/showcases/data/careersEmployer'
import { useCareersCopy } from '@/features/showcases/hooks/useCareersCopy'
import { useCareersNow } from '@/features/showcases/hooks/useCareersNow'
import { useCareersJobs, useCareersStore } from '@/features/showcases/hooks/useCareersStore'

interface TalentPostJobPageProps {
  standalone?: boolean
}

type PostingForm = Omit<PostingDraft, 'closesOn'> & { closesOn: Dayjs }

export function TalentPostJobPage({ standalone = false }: TalentPostJobPageProps) {
  const root = careersRoot(standalone)
  const { text, language } = useCareersCopy()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const now = useCareersNow(60_000)
  const { jobId } = useParams<{ jobId: string }>()
  const { find } = useCareersJobs()
  const postings = useCareersStore((state) => state.postings)
  const savePosting = useCareersStore((state) => state.savePosting)
  const [form] = Form.useForm<PostingForm>()
  const editing = jobId ? find(jobId) : undefined
  const company = findCompany(EMPLOYER_COMPANY_ID)!
  // Fixed on first render, so a posting written over midnight keeps its id and dates.
  const [initial] = useState<PostingForm>(() => {
    if (editing) {
      const draft = jobToPosting(editing, postingOf(editing, { postings }, now), language)
      return {
        ...draft,
        benefits: draft.benefits.length ? draft.benefits : company.benefits,
        closesOn: dayjs(draft.closesOn),
      }
    }
    return {
      title: '',
      category: 'software',
      level: 'mid',
      type: 'fullTime',
      mode: 'hybrid',
      city: company.city,
      salaryMin: undefined,
      salaryMax: undefined,
      showSalary: true,
      about: '',
      responsibilities: '',
      requirements: '',
      skills: [],
      benefits: company.benefits,
      questions: [],
      closesOn: dayjs(now).add(30, 'day'),
      status: 'published',
    }
  })
  const watched = Form.useWatch([], form) as PostingForm | undefined

  if (jobId && (!editing || !isEmployerJob(editing))) {
    return (
      <CareersSiteShell standalone={standalone}>
        <Result
          status="404"
          title={text.post.editTitle}
          subTitle={text.post.notFound}
          extra={
            <Link to={`${root}/employer`}>
              <Button type="primary">{text.post.back}</Button>
            </Link>
          }
        />
      </CareersSiteShell>
    )
  }

  const toDraft = (values: PostingForm): PostingDraft => ({
    ...values,
    title: values.title ?? '',
    about: values.about ?? '',
    responsibilities: values.responsibilities ?? '',
    requirements: values.requirements ?? '',
    skills: values.skills ?? [],
    benefits: values.benefits ?? [],
    questions: values.questions ?? [],
    closesOn: (values.closesOn ?? dayjs(now)).format('YYYY-MM-DD'),
  })

  const previewJob = postingToJob(
    toDraft({ ...initial, ...watched, title: watched?.title?.trim() || text.post.untitled }),
    editing,
    editing?.id ?? 'preview',
  )

  const save = async (status: PostingStatus) => {
    try {
      const values = await form.validateFields()
      const draft = toDraft({ ...values, status })
      const id = editing?.id ?? newPostingId(draft.title, Date.now())
      savePosting(postingToJob(draft, editing, id), { status, closesOn: draft.closesOn })
      void message.success(status === 'published' ? text.post.published : text.post.savedDraft)
      void navigate(`${root}/employer`)
    } catch {
      void message.error(text.post.fix)
    }
  }

  const lineRule = { required: true, whitespace: true, message: text.post.linesRequired }

  return (
    <CareersSiteShell standalone={standalone}>
      <section className="careers-section careers-section--page careers-post">
        <Link to={`${root}/employer`} className="careers-back">
          <ArrowLeftOutlined aria-hidden="true" /> {text.post.back}
        </Link>
        <Flex justify="space-between" align="end" gap={12} wrap className="careers-section__head">
          <div>
            <Typography.Title level={1} className="careers-page-title">
              {editing ? text.post.editTitle : text.post.newTitle}
            </Typography.Title>
            <Typography.Text type="secondary">
              {text.employer.company}: {company.name}
            </Typography.Text>
          </div>
        </Flex>

        <Row gutter={[24, 24]}>
          <Col xs={24} xl={13}>
            <Form<PostingForm>
              form={form}
              layout="vertical"
              initialValues={initial}
              requiredMark="optional"
            >
              <Card title={text.post.basics} className="careers-card">
                <Form.Item
                  name="title"
                  label={text.post.title}
                  rules={[{ required: true, whitespace: true, message: text.post.titleRequired }]}
                >
                  <Input placeholder={text.post.titlePlaceholder} maxLength={80} />
                </Form.Item>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="category" label={text.post.category}>
                      <Select
                        options={CAREERS_CATEGORIES.map((value) => ({
                          value,
                          label: text.categories[value],
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="level" label={text.post.level}>
                      <Select
                        options={EXPERIENCE_LEVELS.map((value) => ({
                          value,
                          label: text.levels[value],
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="type" label={text.post.type}>
                      <Select
                        options={EMPLOYMENT_TYPES.map((value) => ({
                          value,
                          label: text.types[value],
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="city" label={text.post.city}>
                      <Select
                        options={CITIES.map((value) => ({
                          value,
                          label: CITY_NAMES[language][value],
                        }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="mode" label={text.post.mode}>
                  <Segmented
                    block
                    options={WORK_MODES.map((value) => ({ value, label: text.modes[value] }))}
                  />
                </Form.Item>
              </Card>

              <Card title={text.post.pay} className="careers-card">
                <Row gutter={16}>
                  <Col xs={12}>
                    <Form.Item name="salaryMin" label={text.post.salaryMin}>
                      <InputNumber<number> className="full-width" min={0} step={5000} prefix="₺" />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      name="salaryMax"
                      label={text.post.salaryMax}
                      dependencies={['salaryMin']}
                      rules={[
                        ({ getFieldValue }) => ({
                          validator: (_rule, value: number | undefined) => {
                            const min = getFieldValue('salaryMin') as number | undefined
                            return value !== undefined &&
                              value !== null &&
                              min !== undefined &&
                              min !== null &&
                              value < min
                              ? Promise.reject(new Error(text.post.salaryOrder))
                              : Promise.resolve()
                          },
                        }),
                      ]}
                    >
                      <InputNumber<number> className="full-width" min={0} step={5000} prefix="₺" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="showSalary"
                  valuePropName="checked"
                  extra={text.post.showSalaryHint}
                >
                  <Checkbox>{text.post.showSalary}</Checkbox>
                </Form.Item>
              </Card>

              <Card title={text.post.description} className="careers-card">
                <Form.Item name="about" label={text.post.about}>
                  <Input.TextArea
                    autoSize={{ minRows: 3, maxRows: 8 }}
                    maxLength={800}
                    showCount
                    placeholder={text.post.aboutPlaceholder}
                  />
                </Form.Item>
                <Form.Item
                  name="responsibilities"
                  label={text.post.responsibilities}
                  extra={text.post.linesHint}
                  rules={[lineRule]}
                >
                  <Input.TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
                </Form.Item>
                <Form.Item
                  name="requirements"
                  label={text.post.requirements}
                  extra={text.post.linesHint}
                  rules={[lineRule]}
                >
                  <Input.TextArea autoSize={{ minRows: 3, maxRows: 10 }} />
                </Form.Item>
                <Form.Item
                  name="skills"
                  label={text.post.skills}
                  extra={text.post.skillsHint}
                  rules={[
                    { required: true, type: 'array', min: 3, message: text.post.skillsRequired },
                  ]}
                >
                  <Select
                    mode="tags"
                    options={ALL_SKILLS.map((skill) => ({ value: skill, label: skill }))}
                    tokenSeparators={[',']}
                  />
                </Form.Item>
                <Form.Item name="benefits" label={text.post.benefits}>
                  <Checkbox.Group
                    className="careers-post__benefits"
                    options={BENEFITS.map((value) => ({ value, label: text.benefits[value] }))}
                  />
                </Form.Item>
              </Card>

              <Card title={text.post.questions} className="careers-card">
                <Typography.Paragraph type="secondary">
                  {text.post.questionsHint}
                </Typography.Paragraph>
                <Form.List name="questions">
                  {(fields, { add, remove }) => (
                    <Flex vertical gap={8}>
                      {fields.map((field, index) => (
                        <Flex key={field.key} gap={8} align="start">
                          <Form.Item
                            name={field.name}
                            className="careers-post__question"
                            rules={[
                              { required: true, whitespace: true, message: text.apply.required },
                            ]}
                          >
                            <Input
                              aria-label={`${text.post.questions} ${index + 1}`}
                              placeholder={text.post.questionPlaceholder}
                              maxLength={160}
                            />
                          </Form.Item>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            aria-label={text.common.remove}
                            onClick={() => remove(field.name)}
                          />
                        </Flex>
                      ))}
                      {fields.length < 5 && (
                        <Button type="dashed" icon={<PlusOutlined />} onClick={() => add('')}>
                          {text.post.addQuestion}
                        </Button>
                      )}
                    </Flex>
                  )}
                </Form.List>
              </Card>

              <Card title={text.post.publishing} className="careers-card">
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="closesOn"
                      label={text.post.closesOn}
                      rules={[{ required: true, message: text.post.closesRequired }]}
                    >
                      <DatePicker
                        className="full-width"
                        format="D MMM YYYY"
                        disabledDate={(date) => date.isBefore(dayjs(now), 'day')}
                      />
                    </Form.Item>
                  </Col>
                  {editing && (
                    <Col xs={24} md={12}>
                      <Form.Item name="status" label={text.post.status}>
                        <Select
                          options={POSTING_STATUSES.map((value) => ({
                            value,
                            label: text.employer.statuses[value],
                          }))}
                        />
                      </Form.Item>
                    </Col>
                  )}
                </Row>
                <Flex gap={8} wrap justify="end">
                  {editing ? (
                    <Button
                      type="primary"
                      size="large"
                      icon={<SaveOutlined />}
                      onClick={() =>
                        void save((form.getFieldValue('status') as PostingStatus) ?? 'published')
                      }
                    >
                      {text.post.update}
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="large"
                        icon={<SaveOutlined />}
                        onClick={() => void save('draft')}
                      >
                        {text.post.saveDraft}
                      </Button>
                      <Button
                        type="primary"
                        size="large"
                        icon={<SendOutlined />}
                        onClick={() => void save('published')}
                      >
                        {text.post.publish}
                      </Button>
                    </>
                  )}
                </Flex>
              </Card>
            </Form>
          </Col>

          <Col xs={24} xl={11}>
            <div className="careers-sticky careers-post__preview">
              <Typography.Title level={4}>{text.post.preview}</Typography.Title>
              <Typography.Text type="secondary">{text.post.previewHint}</Typography.Text>
              <div className="careers-post__frame">
                <CareersJobDetail job={previewJob} root={root} pane preview />
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </CareersSiteShell>
  )
}
