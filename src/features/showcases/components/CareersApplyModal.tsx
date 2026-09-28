import { InboxOutlined, PaperClipOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Descriptions,
  Flex,
  Form,
  Grid,
  Input,
  InputNumber,
  Modal,
  Radio,
  Result,
  Select,
  Steps,
  Typography,
  Upload,
} from 'antd'
import { useState } from 'react'
import { Link } from 'react-router'
import { CompanyLogo } from '@/features/showcases/components/CareersBits'
import { companyOf, LEVEL_YEARS, type Job } from '@/features/showcases/data/careers'
import { yearsOfExperience } from '@/features/showcases/data/careersProfile'
import { useCareersCopy } from '@/features/showcases/hooks/useCareersCopy'
import { useCareersNow } from '@/features/showcases/hooks/useCareersNow'
import { useCareersStore } from '@/features/showcases/hooks/useCareersStore'

interface ApplyValues {
  name: string
  email: string
  phone: string
  cvName: string
  years: number
  authorized: boolean
  notice: string
  note?: string
  extra?: string[]
}

const STEP_FIELDS: (keyof ApplyValues)[][] = [
  ['name', 'email', 'phone'],
  ['cvName'],
  ['years', 'authorized', 'notice', 'note'],
  [],
]

interface CareersApplyModalProps {
  job: Job
  root: string
  open: boolean
  onClose: () => void
}

/**
 * Easy apply: the profile fills the contact step and the CV, so most people only answer the
 * screening questions. Every step checks its own fields before moving on.
 */
export function CareersApplyModal({ job, root, open, onClose }: CareersApplyModalProps) {
  const { text, language } = useCareersCopy()
  const profile = useCareersStore((state) => state.profile)
  const apply = useCareersStore((state) => state.apply)
  const [form] = Form.useForm<ApplyValues>()
  const [step, setStep] = useState(0)
  const [sent, setSent] = useState(false)
  const [uploaded, setUploaded] = useState<string[]>([])
  const now = useCareersNow(60_000)
  const company = companyOf(job)
  const questions = job.questions ?? []
  const cvOptions = [
    ...profile.cvFiles,
    ...uploaded.filter((name) => !profile.cvFiles.includes(name)),
  ]
  const values = Form.useWatch([], form) as ApplyValues | undefined
  // On a phone only the current step keeps its title; four would break mid-word.
  const roomy = Grid.useBreakpoint().sm ?? false

  const close = () => {
    onClose()
    // Start over next time, after the closing animation.
    window.setTimeout(() => {
      setStep(0)
      setSent(false)
      form.resetFields()
    }, 300)
  }

  const next = async () => {
    try {
      const extra = step === 2 ? questions.map((_question, index) => ['extra', index]) : []
      await form.validateFields([...STEP_FIELDS[step]!, ...extra])
      setStep((current) => current + 1)
    } catch {
      // The fields show their own errors.
    }
  }

  const submit = () => {
    const all = form.getFieldsValue(true) as ApplyValues
    apply({
      jobId: job.id,
      cvName: all.cvName,
      answers: {
        years: all.years,
        authorized: all.authorized,
        notice: all.notice,
        note: all.note?.trim() || undefined,
        extra: questions.length
          ? questions.map((question, index) => ({
              question,
              answer: all.extra?.[index]?.trim() ?? '',
            }))
          : undefined,
      },
    })
    setSent(true)
  }

  return (
    <Modal
      open={open}
      onCancel={close}
      title={sent ? null : text.apply.title(job.title[language])}
      footer={null}
      width={620}
      destroyOnHidden
      className="careers-apply"
    >
      {sent ? (
        <Result
          status="success"
          title={text.apply.successTitle}
          subTitle={text.apply.successText(company.name)}
          extra={[
            <Link key="track" to={`${root}/applications`} onClick={close}>
              <Button type="primary">{text.apply.track}</Button>
            </Link>,
            <Button key="close" onClick={close}>
              {text.apply.close}
            </Button>,
          ]}
        />
      ) : (
        <>
          <Flex align="center" gap={12} className="careers-apply__job">
            <CompanyLogo company={company} size={40} />
            <div>
              <Typography.Text strong>{job.title[language]}</Typography.Text>
              <br />
              <Typography.Text type="secondary">{company.name}</Typography.Text>
            </div>
          </Flex>
          <Steps
            size="small"
            responsive={false}
            current={step}
            className="careers-apply__steps"
            items={text.apply.steps.map((title, index) => ({
              title: roomy || index === step ? title : undefined,
              'aria-label': title,
            }))}
          />
          <Form<ApplyValues>
            form={form}
            layout="vertical"
            requiredMark="optional"
            preserve
            initialValues={{
              name: profile.name,
              email: profile.email,
              phone: profile.phone,
              cvName: profile.cvFiles[0],
              years: Math.max(yearsOfExperience(profile, now), 0),
              authorized: true,
              notice: '1month',
            }}
          >
            <div hidden={step !== 0}>
              <Form.Item
                name="name"
                label={text.apply.name}
                rules={[{ required: true, whitespace: true, message: text.apply.required }]}
              >
                <Input autoComplete="name" />
              </Form.Item>
              <Form.Item
                name="email"
                label={text.apply.email}
                rules={[
                  { required: true, message: text.apply.required },
                  { type: 'email', message: text.apply.emailInvalid },
                ]}
              >
                <Input autoComplete="email" />
              </Form.Item>
              <Form.Item
                name="phone"
                label={text.apply.phone}
                rules={[{ required: true, whitespace: true, message: text.apply.required }]}
              >
                <Input autoComplete="tel" />
              </Form.Item>
            </div>

            <div hidden={step !== 1}>
              <Form.Item
                name="cvName"
                label={text.apply.cv}
                extra={text.apply.cvHint}
                rules={[{ required: true, message: text.apply.cvRequired }]}
              >
                <Radio.Group className="careers-apply__cvs">
                  {cvOptions.map((name) => (
                    <Radio.Button key={name} value={name}>
                      <PaperClipOutlined aria-hidden="true" /> {name}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Upload.Dragger
                accept=".pdf,.doc,.docx"
                showUploadList={false}
                beforeUpload={(file) => {
                  setUploaded((current) =>
                    current.includes(file.name) ? current : [...current, file.name],
                  )
                  form.setFieldValue('cvName', file.name)
                  void form.validateFields(['cvName'])
                  return Upload.LIST_IGNORE
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">{text.apply.cvUpload}</p>
                <p className="ant-upload-hint">{text.apply.cvUploadHint}</p>
              </Upload.Dragger>
            </div>

            <div hidden={step !== 2}>
              <Form.Item
                name="years"
                label={text.apply.years}
                extra={job.level === 'intern' ? undefined : `${LEVEL_YEARS[job.level]}+`}
                rules={[{ required: true, message: text.apply.required }]}
              >
                <InputNumber min={0} max={40} className="careers-apply__years" />
              </Form.Item>
              <Form.Item
                name="authorized"
                label={text.apply.authorized}
                rules={[{ required: true, message: text.apply.required }]}
              >
                <Radio.Group
                  options={[
                    { value: true, label: text.apply.yes },
                    { value: false, label: text.apply.no },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="notice"
                label={text.apply.notice}
                rules={[{ required: true, message: text.apply.required }]}
              >
                <Select
                  options={Object.entries(text.apply.noticeOptions).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
              </Form.Item>
              {questions.map((question, index) => (
                <Form.Item
                  key={question}
                  name={['extra', index]}
                  label={question}
                  tooltip={text.apply.customQuestion}
                  rules={[{ required: true, whitespace: true, message: text.apply.required }]}
                >
                  <Input.TextArea rows={2} maxLength={300} />
                </Form.Item>
              ))}
              <Form.Item name="note" label={text.apply.note}>
                <Input.TextArea
                  rows={3}
                  maxLength={500}
                  showCount
                  placeholder={text.apply.notePlaceholder}
                />
              </Form.Item>
            </div>

            {step === 3 && values && (
              <div>
                <Typography.Title level={5}>{text.apply.reviewTitle}</Typography.Title>
                <Descriptions
                  column={1}
                  size="small"
                  bordered
                  items={[
                    { key: 'name', label: text.apply.name, children: values.name },
                    { key: 'email', label: text.apply.email, children: values.email },
                    { key: 'phone', label: text.apply.phone, children: values.phone },
                    { key: 'cv', label: text.apply.cv, children: values.cvName },
                    { key: 'years', label: text.apply.years, children: values.years },
                    {
                      key: 'authorized',
                      label: text.apply.authorized,
                      children: values.authorized ? text.apply.yes : text.apply.no,
                    },
                    {
                      key: 'notice',
                      label: text.apply.notice,
                      children: text.apply.noticeOptions[values.notice],
                    },
                    ...questions.map((question, index) => ({
                      key: `extra-${index}`,
                      label: question,
                      children: values.extra?.[index],
                    })),
                    ...(values.note?.trim()
                      ? [{ key: 'note', label: text.apply.note, children: values.note }]
                      : []),
                  ]}
                />
                <Alert
                  className="careers-apply__note"
                  type="info"
                  showIcon
                  title={text.apply.reviewProfile}
                  description={text.common.demo}
                />
              </div>
            )}
          </Form>

          <Flex justify="space-between" gap={8} className="careers-apply__footer">
            <Button onClick={step === 0 ? close : () => setStep((current) => current - 1)}>
              {step === 0 ? text.apply.close : text.apply.back}
            </Button>
            {step < 3 ? (
              <Button type="primary" onClick={() => void next()}>
                {text.apply.next}
              </Button>
            ) : (
              <Button type="primary" onClick={submit}>
                {text.apply.submit}
              </Button>
            )}
          </Flex>
        </>
      )}
    </Modal>
  )
}
