import { CheckCircleFilled, PaperClipOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  Radio,
  Segmented,
  Select,
  Upload,
  type UploadFile,
} from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { AgencySiteShell } from '@/features/showcases/components/AgencySiteShell'
import { agencyEmail, studios } from '@/features/showcases/data/agency'
import {
  BUDGET_BANDS,
  callSlots,
  SERVICES,
  TIMELINES,
  type BudgetBand,
  type Service,
  type Timeline,
} from '@/features/showcases/data/agencyLogic'
import { useAgencyCopy } from '@/features/showcases/hooks/useAgencyCopy'

interface AgencyContactPageProps {
  standalone?: boolean
}

interface BriefValues {
  name: string
  email: string
  company?: string
  services: Service[]
  budget: BudgetBand
  timeline: Timeline
  details: string
  files?: UploadFile[]
  consent: boolean
}

function BookCall() {
  const { text, language } = useAgencyCopy()
  const copy = text.contact
  const [days] = useState(() => callSlots(new Date()))
  const [day, setDay] = useState(days[0]!.date)
  const [slot, setSlot] = useState<string | null>(null)
  const [booked, setBooked] = useState<string | null>(null)
  const locale = language === 'tr' ? 'tr-TR' : 'en-GB'

  const dayLabel = (date: string) => {
    const value = dayjs(date).toDate()
    return (
      <span className="agency-day">
        <small>{new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(value)}</small>
        <strong>{value.getDate()}</strong>
      </span>
    )
  }
  const whenLabel = (id: string) =>
    new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dayjs(id).toDate())

  const current = days.find((entry) => entry.date === day) ?? days[0]!

  return (
    <div className="agency-call">
      <h2>{copy.callTitle}</h2>
      <p>{copy.callIntro}</p>

      {booked ? (
        <>
          <Alert
            type="success"
            showIcon
            icon={<CheckCircleFilled />}
            title={copy.callBooked(whenLabel(booked))}
          />
          <Button type="link" className="agency-call__change" onClick={() => setBooked(null)}>
            {copy.changeCall}
          </Button>
        </>
      ) : (
        <>
          <p className="agency-call__label">{copy.pickDay}</p>
          <div className="agency-call__days">
            <Segmented
              block
              value={day}
              onChange={(value) => {
                setDay(value)
                setSlot(null)
              }}
              options={days.map((entry) => ({ value: entry.date, label: dayLabel(entry.date) }))}
            />
          </div>
          <p className="agency-call__label">{copy.pickTime}</p>
          <fieldset className="agency-call__slots">
            <legend className="agency-visually-hidden">{copy.pickTime}</legend>
            {current.slots.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={`agency-slot${slot === entry.id ? ' is-active' : ''}`}
                aria-pressed={slot === entry.id}
                disabled={!entry.available}
                onClick={() => setSlot(entry.id)}
              >
                {entry.time}
                {!entry.available && <span className="agency-slot__taken">{copy.taken}</span>}
              </button>
            ))}
          </fieldset>
          <p className="agency-call__timezone">{copy.timezone}</p>
          <Button
            type="primary"
            block
            size="large"
            disabled={!slot}
            onClick={() => slot && setBooked(slot)}
          >
            {copy.bookCall}
          </Button>
        </>
      )}
    </div>
  )
}

export function AgencyContactPage({ standalone = false }: AgencyContactPageProps) {
  const { text, language } = useAgencyCopy()
  const copy = text.contact
  const [form] = Form.useForm<BriefValues>()
  const [sent, setSent] = useState<BriefValues | null>(null)

  const reset = () => {
    form.resetFields()
    setSent(null)
  }

  return (
    <AgencySiteShell standalone={standalone} page="contact">
      <section className="agency-page-hero">
        <div className="agency-wrap">
          <h1 className="agency-page-hero__title">{copy.title}</h1>
          <p className="agency-page-hero__intro">{copy.intro}</p>
        </div>
      </section>

      <section className="agency-section agency-section--flush">
        <div className="agency-wrap agency-contact">
          <div className="agency-contact__main">
            {sent ? (
              <div className="agency-sent" aria-live="polite">
                <span className="agency-sent__icon" aria-hidden="true">
                  <CheckCircleFilled />
                </span>
                <h2>{copy.successTitle}</h2>
                <p>{copy.successText(sent.name.trim().split(/\s+/)[0] ?? sent.name)}</p>
                <dl className="agency-sent__summary">
                  <div>
                    <dt>{copy.summary}</dt>
                    <dd>
                      {sent.services.map((service) => copy.serviceOptions[service]).join(', ')}
                    </dd>
                  </div>
                  <div>
                    <dt>{copy.budget}</dt>
                    <dd>{copy.budgetOptions[sent.budget]}</dd>
                  </div>
                  <div>
                    <dt>{copy.timeline}</dt>
                    <dd>{copy.timelineOptions[sent.timeline]}</dd>
                  </div>
                  {sent.files && sent.files.length > 0 && (
                    <div>
                      <dt>{copy.attach}</dt>
                      <dd>{sent.files.map((file) => file.name).join(', ')}</dd>
                    </div>
                  )}
                </dl>
                <Button size="large" onClick={reset}>
                  {copy.sendAnother}
                </Button>
              </div>
            ) : (
              <Form<BriefValues>
                form={form}
                layout="vertical"
                requiredMark={false}
                size="large"
                className="agency-form"
                onFinish={setSent}
                initialValues={{ services: [], consent: false }}
              >
                <div className="agency-form__row">
                  <Form.Item
                    name="name"
                    label={copy.name}
                    rules={[{ required: true, whitespace: true, message: copy.required.name }]}
                  >
                    <Input autoComplete="name" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label={copy.email}
                    rules={[
                      { required: true, message: copy.required.email },
                      { type: 'email', message: copy.required.emailInvalid },
                    ]}
                  >
                    <Input type="email" autoComplete="email" />
                  </Form.Item>
                </div>
                <Form.Item name="company" label={copy.company}>
                  <Input autoComplete="organization" placeholder={copy.companyPlaceholder} />
                </Form.Item>

                <Form.Item
                  name="services"
                  label={copy.services}
                  rules={[
                    { required: true, type: 'array', min: 1, message: copy.required.services },
                  ]}
                >
                  <Checkbox.Group
                    className="agency-choices"
                    options={SERVICES.map((service) => ({
                      value: service,
                      label: copy.serviceOptions[service],
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  name="budget"
                  label={copy.budget}
                  rules={[{ required: true, message: copy.required.budget }]}
                >
                  <Radio.Group
                    className="agency-choices"
                    optionType="button"
                    options={BUDGET_BANDS.map((band) => ({
                      value: band,
                      label: copy.budgetOptions[band],
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  name="timeline"
                  label={copy.timeline}
                  rules={[{ required: true, message: copy.required.timeline }]}
                >
                  <Select
                    options={TIMELINES.map((timeline) => ({
                      value: timeline,
                      label: copy.timelineOptions[timeline],
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  name="details"
                  label={copy.details}
                  rules={[
                    { required: true, whitespace: true, message: copy.required.details },
                    { min: 30, message: copy.required.detailsShort },
                  ]}
                >
                  <Input.TextArea
                    rows={5}
                    showCount
                    maxLength={2000}
                    placeholder={copy.detailsPlaceholder}
                  />
                </Form.Item>

                <Form.Item
                  name="files"
                  label={copy.attach}
                  extra={copy.attachHint}
                  valuePropName="fileList"
                  getValueFromEvent={(event: { fileList: UploadFile[] }) => event.fileList}
                >
                  <Upload beforeUpload={() => false} maxCount={5} multiple>
                    <Button icon={<PaperClipOutlined />}>{copy.attach}</Button>
                  </Upload>
                </Form.Item>

                <Form.Item
                  name="consent"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(new Error(copy.required.consent)),
                    },
                  ]}
                >
                  <Checkbox>{copy.consent}</Checkbox>
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="agency-form__submit"
                >
                  {copy.submit} <span aria-hidden="true">→</span>
                </Button>
              </Form>
            )}
          </div>

          <aside className="agency-contact__aside">
            <div className="agency-contact__block">
              <p className="agency-kicker">{copy.emailTitle}</p>
              <a className="agency-contact__email" href={`mailto:${agencyEmail}`}>
                {agencyEmail}
              </a>
            </div>
            <div className="agency-contact__block">
              <p className="agency-kicker">{copy.studiosTitle}</p>
              {studios.map((studio) => (
                <address key={studio.city.en} className="agency-contact__studio">
                  <strong>{studio.city[language]}</strong>
                  <span>{studio.address}</span>
                  <span>{studio.hours[language]}</span>
                  <a href={`tel:${studio.phone.replaceAll(' ', '')}`}>{studio.phone}</a>
                </address>
              ))}
            </div>
            <BookCall />
          </aside>
        </div>
      </section>
    </AgencySiteShell>
  )
}
