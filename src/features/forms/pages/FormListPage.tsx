import {
  BarChartOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import {
  App,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Input,
  Popconfirm,
  Row,
  Segmented,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
// import { PageHeader } from '@/components/PageHeader/PageHeader'
import { ShareFormModal } from '@/features/forms/components'
import { useFormCopy, useFormStore } from '@/features/forms/hooks'
import {
  FORM_STATUSES,
  isAnswerable,
  STATUS_COLOR,
  type FormSchema,
  type FormStatus,
} from '@/features/forms/types'
import './forms.css'

type StatusFilter = 'all' | FormStatus

export function FormListPage() {
  const copy = useFormCopy()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const { forms, responses, duplicateForm, deleteForm, reset } = useFormStore()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [sharing, setSharing] = useState<FormSchema | null>(null)

  const responseCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const response of responses) {
      counts.set(response.formId, (counts.get(response.formId) ?? 0) + 1)
    }
    return counts
  }, [responses])

  const query = search.trim().toLocaleLowerCase()
  const shown = forms
    .filter((form) => status === 'all' || form.status === status)
    .filter(
      (form) =>
        !query ||
        form.title.toLocaleLowerCase().includes(query) ||
        form.description.toLocaleLowerCase().includes(query),
    )
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))

  return (
    <div className="admin-page">
      {/* <PageHeader title={copy.listTitle} description={copy.listDescription} /> */}

      <Card className="dashboard-panel form-list__toolbar">
        <Flex gap={12} wrap justify="space-between" align="center">
          <Flex gap={12} wrap align="center" className="form-list__filters">
            <Input
              allowClear
              prefix={<SearchOutlined aria-hidden="true" />}
              placeholder={copy.search}
              aria-label={copy.search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="form-list__search"
            />
            <Segmented<StatusFilter>
              value={status}
              onChange={setStatus}
              options={[
                { value: 'all', label: copy.allStatuses },
                ...FORM_STATUSES.map((entry) => ({ value: entry, label: copy.statuses[entry] })),
              ]}
            />
          </Flex>
          <Flex gap={8}>
            <Tooltip title={copy.resetDemo}>
              <Button
                icon={<ReloadOutlined aria-hidden="true" />}
                aria-label={copy.resetDemo}
                onClick={reset}
              />
            </Tooltip>
            <Link to="/forms/new">
              <Button type="primary" icon={<PlusOutlined aria-hidden="true" />} tabIndex={-1}>
                {copy.newForm}
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Card>

      {shown.length === 0 ? (
        <Card className="dashboard-panel">
          <Empty description={copy.noForms} />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {shown.map((form) => {
            const questions = form.fields.filter(isAnswerable).length
            const answers = responseCounts.get(form.id) ?? 0

            return (
              <Col xs={24} md={12} xl={8} key={form.id}>
                <Card
                  className="dashboard-panel form-list__card"
                  actions={[
                    <Tooltip title={copy.edit} key="edit">
                      <Button
                        type="text"
                        icon={<EditOutlined aria-hidden="true" />}
                        aria-label={`${copy.edit}: ${form.title}`}
                        onClick={() => void navigate(`/forms/${form.id}/edit`)}
                      />
                    </Tooltip>,
                    <Tooltip title={copy.fill} key="fill">
                      <Button
                        type="text"
                        icon={<EyeOutlined aria-hidden="true" />}
                        aria-label={`${copy.fill}: ${form.title}`}
                        onClick={() => void navigate(`/forms/${form.id}/fill`)}
                      />
                    </Tooltip>,
                    <Tooltip title={copy.share} key="share">
                      <Button
                        type="text"
                        icon={<ShareAltOutlined aria-hidden="true" />}
                        aria-label={`${copy.share}: ${form.title}`}
                        onClick={() => setSharing(form)}
                      />
                    </Tooltip>,
                    <Tooltip title={copy.responses} key="responses">
                      <Button
                        type="text"
                        icon={<BarChartOutlined aria-hidden="true" />}
                        aria-label={`${copy.responses}: ${form.title}`}
                        onClick={() => void navigate(`/forms/${form.id}/responses`)}
                      />
                    </Tooltip>,
                    <Tooltip title={copy.duplicate} key="duplicate">
                      <Button
                        type="text"
                        icon={<CopyOutlined aria-hidden="true" />}
                        aria-label={`${copy.duplicate}: ${form.title}`}
                        onClick={() => {
                          duplicateForm(form.id, copy.copyOf(form.title))
                          void message.success(copy.duplicated)
                        }}
                      />
                    </Tooltip>,
                    <Popconfirm
                      key="delete"
                      title={copy.deleteConfirm}
                      description={copy.deleteConfirmDescription}
                      okText={copy.delete}
                      cancelText={copy.cancel}
                      okButtonProps={{ danger: true }}
                      onConfirm={() => {
                        deleteForm(form.id)
                        void message.success(copy.deleted)
                      }}
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined aria-hidden="true" />}
                        aria-label={`${copy.delete}: ${form.title}`}
                      />
                    </Popconfirm>,
                  ]}
                >
                  <Flex vertical gap={8} className="form-list__body">
                    <Flex justify="space-between" align="start" gap={8}>
                      <Link to={`/forms/${form.id}/edit`} className="form-list__title">
                        <Typography.Title level={4}>{form.title}</Typography.Title>
                      </Link>
                      <Tag color={STATUS_COLOR[form.status]}>{copy.statuses[form.status]}</Tag>
                    </Flex>
                    <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                      {form.description}
                    </Typography.Paragraph>
                    <Flex gap={16} wrap className="form-list__meta">
                      <Typography.Text>{copy.fieldCount(questions)}</Typography.Text>
                      <Link to={`/forms/${form.id}/responses`}>{copy.responseCount(answers)}</Link>
                      <Typography.Text type="secondary">
                        {copy.updated(dayjs(form.updatedAt).format('D MMM YYYY'))}
                      </Typography.Text>
                    </Flex>
                  </Flex>
                </Card>
              </Col>
            )
          })}
        </Row>
      )}

      <ShareFormModal form={sharing} onClose={() => setSharing(null)} />
    </div>
  )
}
