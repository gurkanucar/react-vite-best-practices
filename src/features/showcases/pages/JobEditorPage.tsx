import { ArrowLeftOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { RichTextEditor } from '@/features/showcases/components'
import { findShowcaseJob, showcaseJobs, talentCopy } from '@/features/showcases/data'
import type { JobEmploymentType, JobStatus, JobWorkMode } from '@/features/showcases/types'
import { usePreferencesStore } from '@/store/preferences-store'
import '../talent.css'

interface JobFormValues {
  title: string
  company: string
  location: string
  department: string
  employmentType: JobEmploymentType
  workMode: JobWorkMode
  experience: 'junior' | 'mid' | 'senior'
  skills: string[]
  expiryDate: Dayjs
  salaryMin?: number
  salaryMax?: number
  negotiable: boolean
  featured: boolean
  status: JobStatus
}

function jobBody(job: ReturnType<typeof findShowcaseJob>, language: 'en' | 'tr'): string {
  if (!job) return ''

  const paragraph = (value: { en: string; tr: string }) => `<p>${value[language]}</p>`
  const list = (items: { en: string; tr: string }[]) =>
    `<ul>${items.map((item) => `<li>${item[language]}</li>`).join('')}</ul>`
  const headings =
    language === 'tr'
      ? ['Pozisyon hakkında', 'Neler yapacaksınız', 'Sizden beklediklerimiz']
      : ['About the role', 'What you will do', 'What you will bring']

  return [
    `<h2>${headings[0]}</h2>`,
    ...job.description.map(paragraph),
    `<h2>${headings[1]}</h2>`,
    list(job.responsibilities),
    `<h2>${headings[2]}</h2>`,
    list(job.qualifications),
  ].join('')
}

export function JobEditorPage() {
  const { jobSlug } = useParams<{ jobSlug: string }>()
  const isEditing = Boolean(jobSlug)
  const job = findShowcaseJob(jobSlug)
  const language = usePreferencesStore((state) => state.language)
  const text = talentCopy[language]
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [form] = Form.useForm<JobFormValues>()
  const [content, setContent] = useState(() => jobBody(job, language))

  const companyOptions = useMemo(
    () =>
      [...new Set(showcaseJobs.map((item) => item.company))].map((value) => ({
        value,
        label: value,
      })),
    [],
  )

  if (isEditing && !job) {
    return (
      <div className="admin-page talent-page">
        <Empty description={text.notFound}>
          <Link to="/showcases/jobs">
            <Button icon={<ArrowLeftOutlined />}>{text.backToJobs}</Button>
          </Link>
        </Empty>
      </div>
    )
  }

  const initialValues: Partial<JobFormValues> = {
    title: job?.title[language],
    company: job?.company,
    location: job?.location[language],
    department: job?.department[language],
    employmentType: job?.employmentType ?? 'fullTime',
    workMode: job?.workMode ?? 'hybrid',
    experience: job?.experience.en.includes('5+') ? 'senior' : 'mid',
    skills: job?.skills ?? [],
    expiryDate: job ? dayjs(job.expiresAt) : dayjs().add(30, 'day'),
    negotiable: job?.salary.en.toLowerCase().includes('negotiable') ?? false,
    featured: false,
    status: job?.status ?? 'draft',
  }

  const submit = (_values: JobFormValues) => {
    void message.success(text.saved)
    void navigate(job ? `/showcases/jobs/${job.slug}` : '/showcases/jobs')
  }

  const title = isEditing ? text.editTitle : text.createTitle
  const description = isEditing ? text.editDescription : text.createDescription

  return (
    <div className="admin-page talent-page talent-form-page">
      <PageHeader title={title} description={description} />

      <Form<JobFormValues>
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={submit}
      >
        <Row gutter={[20, 20]} align="top">
          <Col xs={24} xl={16}>
            <Space className="talent-form-stack" orientation="vertical" size={20}>
              <Card className="talent-form-card" variant="borderless">
                <div className="talent-form-card__heading">
                  <Typography.Title level={3}>{text.details}</Typography.Title>
                  <Typography.Text type="secondary">{text.detailsHint}</Typography.Text>
                </div>
                <Row gutter={16}>
                  <Col xs={24} md={14}>
                    <Form.Item
                      label={text.title}
                      name="title"
                      rules={[{ required: true, message: text.required }]}
                    >
                      <Input size="large" placeholder={text.titlePlaceholder} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={10}>
                    <Form.Item
                      label={text.company}
                      name="company"
                      rules={[{ required: true, message: text.required }]}
                    >
                      <Select
                        size="large"
                        placeholder={text.companyPlaceholder}
                        options={companyOptions}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={text.location}
                      name="location"
                      rules={[{ required: true, message: text.required }]}
                    >
                      <Input size="large" placeholder={text.locationPlaceholder} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={text.department}
                      name="department"
                      rules={[{ required: true, message: text.required }]}
                    >
                      <Select
                        size="large"
                        placeholder={text.selectDepartment}
                        options={text.departments.map((value) => ({ value, label: value }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card className="talent-form-card" variant="borderless">
                <div className="talent-form-card__heading">
                  <Typography.Title level={3}>{text.content}</Typography.Title>
                  <Typography.Text type="secondary">{text.contentHint}</Typography.Text>
                </div>
                <RichTextEditor
                  key={`${jobSlug ?? 'new'}-${language}`}
                  initialValue={content}
                  language={language}
                  placeholder={text.editorPlaceholder}
                  onChange={setContent}
                />
              </Card>

              <Card className="talent-form-card" variant="borderless">
                <div className="talent-form-card__heading">
                  <Typography.Title level={3}>{text.properties}</Typography.Title>
                  <Typography.Text type="secondary">{text.propertiesHint}</Typography.Text>
                </div>
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item label={text.employmentType} name="employmentType">
                      <Select
                        size="large"
                        options={(
                          ['fullTime', 'partTime', 'contract', 'internship'] as JobEmploymentType[]
                        ).map((value) => ({ value, label: text[value] }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label={text.workMode} name="workMode">
                      <Select
                        size="large"
                        options={(['onSite', 'hybrid', 'remote'] as JobWorkMode[]).map((value) => ({
                          value,
                          label: text[value],
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label={text.experience} name="experience">
                      <Select
                        size="large"
                        options={(['junior', 'mid', 'senior'] as const).map((value) => ({
                          value,
                          label: text[value],
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label={text.skills} name="skills">
                      <Select
                        mode="tags"
                        size="large"
                        placeholder={text.skillsPlaceholder}
                        tokenSeparators={[',']}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label={text.salaryMin} name="salaryMin">
                      <InputNumber className="full-width" min={0} prefix="₺" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label={text.salaryMax} name="salaryMax">
                      <InputNumber className="full-width" min={0} prefix="₺" size="large" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="negotiable" valuePropName="checked">
                  <Checkbox>{text.negotiable}</Checkbox>
                </Form.Item>
              </Card>
            </Space>
          </Col>

          <Col xs={24} xl={8}>
            <Card className="talent-form-card talent-publish-card" variant="borderless">
              <div className="talent-form-card__heading">
                <Typography.Title level={3}>{text.publishSettings}</Typography.Title>
                <Typography.Text type="secondary">{text.publishHint}</Typography.Text>
              </div>
              <Form.Item label={text.status} name="status">
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="draft">{text.draft}</Radio.Button>
                  <Radio.Button value="published">{text.published}</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label={text.expiryDate}
                name="expiryDate"
                rules={[{ required: true, message: text.required }]}
              >
                <DatePicker className="full-width" size="large" />
              </Form.Item>
              <Form.Item name="featured" valuePropName="checked" label={text.featured}>
                <Switch />
              </Form.Item>
              <Flex vertical gap={8}>
                <Button
                  block
                  size="large"
                  icon={<SaveOutlined />}
                  onClick={() => {
                    form.setFieldValue('status', 'draft')
                    form.submit()
                  }}
                >
                  {text.saveDraft}
                </Button>
                <Button
                  block
                  size="large"
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={() => {
                    form.setFieldValue('status', 'published')
                    form.submit()
                  }}
                >
                  {isEditing ? text.saveChanges : text.publishJob}
                </Button>
                <Link to={job ? `/showcases/jobs/${job.slug}` : '/showcases/jobs'}>
                  <Button block size="large">
                    {text.backToJobs}
                  </Button>
                </Link>
              </Flex>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
