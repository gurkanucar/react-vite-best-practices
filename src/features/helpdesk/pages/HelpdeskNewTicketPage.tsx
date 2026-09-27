import { ArrowLeftOutlined, PaperClipOutlined } from '@ant-design/icons'
import {
  Alert,
  App,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Segmented,
  Select,
  Typography,
  Upload,
  type UploadFile,
} from 'antd'
import { Link, useNavigate } from 'react-router'
import { agents } from '@/features/helpdesk/data'
import { useHelpdeskStore, useHelpdeskText } from '@/features/helpdesk/hooks'
import {
  formatDuration,
  SLA_TARGETS,
  TICKET_CATEGORIES,
  TICKET_CHANNELS,
  TICKET_PRIORITIES,
  type TicketCategory,
  type TicketChannel,
  type TicketPriority,
} from '@/features/helpdesk/types'
import './helpdesk.css'

interface NewTicketValues {
  requesterMode: 'existing' | 'new'
  contactId?: string
  name?: string
  email?: string
  company?: string
  subject: string
  category: TicketCategory
  priority: TicketPriority
  channel: TicketChannel
  assigneeId?: string
  description: string
  tags: string[]
  attachments?: UploadFile[]
}

function formatSize(bytes = 0): string {
  return bytes >= 1_048_576
    ? `${(bytes / 1_048_576).toFixed(1)} MB`
    : `${Math.max(Math.round(bytes / 1024), 1)} KB`
}

export function HelpdeskNewTicketPage() {
  const { text, language } = useHelpdeskText()
  const copy = text.form
  const { message } = App.useApp()
  const navigate = useNavigate()
  const { contacts, createTicket } = useHelpdeskStore()
  const [form] = Form.useForm<NewTicketValues>()
  const requesterMode = Form.useWatch('requesterMode', form) ?? 'existing'
  const priority = Form.useWatch('priority', form) ?? 'normal'
  const target = SLA_TARGETS[priority]

  const submit = (values: NewTicketValues) => {
    const ticket = createTicket({
      requester:
        values.requesterMode === 'existing'
          ? { id: values.contactId! }
          : {
              name: values.name!.trim(),
              email: values.email!.trim(),
              company: values.company?.trim() ?? '',
            },
      subject: values.subject,
      description: values.description,
      category: values.category,
      priority: values.priority,
      channel: values.channel,
      assigneeId: values.assigneeId,
      tags: values.tags ?? [],
      attachments: (values.attachments ?? []).map((file) => ({
        name: file.name,
        size: formatSize(file.size),
      })),
    })
    void message.success(copy.created(ticket.id))
    void navigate(`/helpdesk/${ticket.id}`)
  }

  return (
    <div className="admin-page helpdesk">
      <Flex vertical gap={12} className="helpdesk-ticket__header">
        <div>
          <Link to="/helpdesk">
            <Button icon={<ArrowLeftOutlined aria-hidden="true" />}>{text.back}</Button>
          </Link>
        </div>
        <Typography.Title level={3} className="helpdesk-ticket__subject">
          {copy.title}
        </Typography.Title>
      </Flex>

      <Form<NewTicketValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          requesterMode: 'existing',
          category: 'technical',
          priority: 'normal',
          channel: 'email',
          tags: [],
        }}
        onFinish={submit}
      >
        <Row gutter={[16, 16]} align="top">
          <Col xs={24} xl={16}>
            <Card className="dashboard-panel">
              <Form.Item name="requesterMode" label={copy.requesterMode}>
                <Segmented
                  options={[
                    { value: 'existing', label: copy.existing },
                    { value: 'new', label: copy.newContact },
                  ]}
                />
              </Form.Item>

              {requesterMode === 'existing' ? (
                <Form.Item
                  name="contactId"
                  label={copy.contact}
                  rules={[{ required: true, message: copy.contactRequired }]}
                >
                  <Select
                    showSearch={{ optionFilterProp: 'label' }}
                    options={contacts.map((contact) => ({
                      value: contact.id,
                      label: `${contact.name} · ${contact.company}`,
                    }))}
                  />
                </Form.Item>
              ) : (
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="name"
                      label={copy.name}
                      rules={[{ required: true, whitespace: true, message: copy.nameRequired }]}
                    >
                      <Input autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="email"
                      label={copy.email}
                      rules={[
                        { required: true, message: copy.emailRequired },
                        { type: 'email', message: copy.emailInvalid },
                      ]}
                    >
                      <Input type="email" autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="company" label={copy.company}>
                      <Input autoComplete="off" />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Form.Item
                name="subject"
                label={copy.subject}
                rules={[{ required: true, whitespace: true, message: copy.subjectRequired }]}
              >
                <Input placeholder={copy.subjectPlaceholder} maxLength={140} />
              </Form.Item>
              <Form.Item
                name="description"
                label={copy.description}
                rules={[{ required: true, whitespace: true, message: copy.descriptionRequired }]}
              >
                <Input.TextArea rows={7} placeholder={copy.descriptionPlaceholder} />
              </Form.Item>
              <Form.Item
                name="attachments"
                label={copy.attachments}
                extra={copy.attachmentsHint}
                valuePropName="fileList"
                getValueFromEvent={(event: { fileList: UploadFile[] }) => event.fileList}
              >
                {/* Kept in the form rather than uploaded: there is no server to send them to. */}
                <Upload beforeUpload={() => false} multiple>
                  <Button icon={<PaperClipOutlined aria-hidden="true" />}>{copy.addFiles}</Button>
                </Upload>
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} xl={8}>
            <Card className="dashboard-panel" title={text.properties}>
              <Form.Item name="priority" label={text.priority}>
                <Select
                  options={TICKET_PRIORITIES.map((value) => ({
                    value,
                    label: text.priorities[value],
                  }))}
                />
              </Form.Item>
              <Alert
                type="info"
                showIcon
                className="helpdesk-sla-preview"
                title={copy.slaPreview(
                  formatDuration(target.firstResponse, language),
                  formatDuration(target.resolution, language),
                )}
              />
              <Form.Item name="category" label={text.category}>
                <Select
                  options={TICKET_CATEGORIES.map((value) => ({
                    value,
                    label: text.categories[value],
                  }))}
                />
              </Form.Item>
              <Form.Item name="channel" label={text.channel}>
                <Select
                  options={TICKET_CHANNELS.map((value) => ({ value, label: text.channels[value] }))}
                />
              </Form.Item>
              <Form.Item name="assigneeId" label={text.assignee}>
                <Select
                  allowClear
                  placeholder={text.unassigned}
                  options={agents.map((agent) => ({ value: agent.id, label: agent.name }))}
                />
              </Form.Item>
              <Form.Item name="tags" label={text.tags}>
                <Select mode="tags" tokenSeparators={[',']} />
              </Form.Item>
              <Flex gap={8} justify="end">
                <Link to="/helpdesk">
                  <Button>{copy.cancel}</Button>
                </Link>
                <Button type="primary" htmlType="submit">
                  {copy.create}
                </Button>
              </Flex>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
