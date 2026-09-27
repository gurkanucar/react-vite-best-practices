import { ArrowLeftOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Empty,
  Flex,
  Progress,
  Rate,
  Result,
  Row,
  Statistic,
  Table,
  Typography,
  type TableColumnsType,
} from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import type { FormBuilderCopy } from '@/features/forms/data'
import { selectResponses, useFormCopy, useFormStore } from '@/features/forms/hooks'
import {
  exportFileName,
  formatAnswer,
  isAnswerable,
  summarize,
  toCsv,
  type FieldSummary,
  type FormField,
  type FormResponse,
} from '@/features/forms/types'
import './forms.css'

/** How many text answers a summary card lists before it just counts the rest. */
const TEXT_PREVIEW = 4

const percent = (count: number, total: number) => (total ? Math.round((count / total) * 100) : 0)

function Bar({ label, count, total }: { label: string; count: number; total: number }) {
  return (
    <div className="form-summary__bar">
      <Flex justify="space-between" gap={8}>
        <Typography.Text>{label}</Typography.Text>
        <Typography.Text type="secondary">
          {count} · {percent(count, total)}%
        </Typography.Text>
      </Flex>
      <Progress percent={percent(count, total)} showInfo={false} size="small" />
    </div>
  )
}

function SummaryBody({ summary, copy }: { summary: FieldSummary; copy: FormBuilderCopy }) {
  if (summary.answered === 0) {
    return <Typography.Text type="secondary">{copy.noAnswers}</Typography.Text>
  }

  switch (summary.kind) {
    case 'choice':
      return (
        <Flex vertical gap={8}>
          {summary.counts.map((entry) => (
            <Bar key={entry.id} label={entry.label} count={entry.count} total={summary.answered} />
          ))}
        </Flex>
      )
    case 'rating':
      return (
        <Flex vertical gap={8}>
          <Flex align="center" gap={12}>
            <Statistic value={summary.average} precision={1} suffix={`/ ${summary.max}`} />
            <Rate
              disabled
              allowHalf
              value={Math.round(summary.average * 2) / 2}
              count={summary.max}
            />
          </Flex>
          {summary.counts
            .map((count, index) => ({ stars: index + 1, count }))
            .reverse()
            .map((entry) => (
              <Bar
                key={entry.stars}
                label={'★'.repeat(entry.stars)}
                count={entry.count}
                total={summary.answered}
              />
            ))}
        </Flex>
      )
    case 'nps':
      return (
        <Flex vertical gap={8}>
          <Flex gap={24} wrap>
            <Statistic title={copy.npsScore} value={summary.score} className="form-summary__nps" />
            <Statistic title={copy.average} value={summary.average} precision={1} />
          </Flex>
          <Bar label={copy.promoters} count={summary.promoters} total={summary.answered} />
          <Bar label={copy.passives} count={summary.passives} total={summary.answered} />
          <Bar label={copy.detractors} count={summary.detractors} total={summary.answered} />
        </Flex>
      )
    case 'yesNo':
      return (
        <Flex vertical gap={8}>
          <Bar label={copy.yes} count={summary.yes} total={summary.answered} />
          <Bar label={copy.no} count={summary.no} total={summary.answered} />
        </Flex>
      )
    case 'number':
      return (
        <Flex gap={24} wrap>
          <Statistic title={copy.average} value={summary.average} precision={1} />
          <Typography.Text type="secondary">{copy.range(summary.min, summary.max)}</Typography.Text>
        </Flex>
      )
    case 'text':
      return (
        <ul className="form-summary__answers">
          {summary.answers.slice(0, TEXT_PREVIEW).map((answer, index) => (
            <li key={`${index}-${answer}`}>{answer}</li>
          ))}
          {summary.answers.length > TEXT_PREVIEW && (
            <li className="form-summary__more">
              {copy.moreAnswers(summary.answers.length - TEXT_PREVIEW)}
            </li>
          )}
        </ul>
      )
  }
}

function SummaryCard({
  field,
  responses,
  copy,
}: {
  field: FormField
  responses: FormResponse[]
  copy: FormBuilderCopy
}) {
  const summary = summarize(field, responses)

  return (
    <Card
      className="dashboard-panel form-summary"
      title={field.label}
      extra={<Typography.Text type="secondary">{copy.answered(summary.answered)}</Typography.Text>}
    >
      <SummaryBody summary={summary} copy={copy} />
    </Card>
  )
}

function download(fileName: string, content: string) {
  // A byte-order mark, so a spreadsheet opens Turkish letters as UTF-8 rather than guessing.
  const blob = new Blob(['﻿', content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export function FormResponsesPage() {
  const copy = useFormCopy()
  const { formId } = useParams<{ formId: string }>()
  const form = useFormStore((state) => state.forms.find((entry) => entry.id === formId))
  const allResponses = useFormStore((state) => state.responses)
  const responses = useMemo(
    () => (formId ? selectResponses(allResponses, formId) : []),
    [allResponses, formId],
  )
  const [openId, setOpenId] = useState<string | null>(null)

  if (!form) {
    return (
      <div className="admin-page">
        <Result
          status="404"
          title={copy.notFoundTitle}
          subTitle={copy.notFoundDescription}
          extra={
            <Link to="/forms">
              <Button type="primary">{copy.back}</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const questions = form.fields.filter(isAnswerable)
  const yesNo = { yes: copy.yes, no: copy.no }
  const open = responses.find((response) => response.id === openId)
  const answeredShare = responses.length
    ? Math.round(
        (responses.reduce(
          (sum, response) =>
            sum +
            questions.filter((field) => formatAnswer(field, response.answers[field.id], yesNo))
              .length,
          0,
        ) /
          (responses.length * Math.max(questions.length, 1))) *
          100,
      )
    : 0

  const columns: TableColumnsType<FormResponse> = [
    {
      key: 'submittedAt',
      title: copy.submittedAt,
      dataIndex: 'submittedAt',
      width: 170,
      fixed: 'left',
      render: (value: string) => dayjs(value).format('D MMM YYYY HH:mm'),
      sorter: (left, right) => left.submittedAt.localeCompare(right.submittedAt),
      defaultSortOrder: 'descend',
    },
    ...questions.map((field) => ({
      key: field.id,
      title: field.label,
      width: 200,
      ellipsis: true,
      render: (_: unknown, response: FormResponse) =>
        formatAnswer(field, response.answers[field.id], yesNo) || copy.notAnswered,
    })),
  ]

  return (
    <div className="admin-page">
      <Card className="dashboard-panel form-builder__bar">
        <Flex justify="space-between" align="center" gap={12} wrap>
          <Flex align="center" gap={10} className="form-builder__title">
            <Link to="/forms" aria-label={copy.back}>
              <Button icon={<ArrowLeftOutlined aria-hidden="true" />} tabIndex={-1} />
            </Link>
            <Typography.Title level={4} ellipsis>
              {form.title}
            </Typography.Title>
          </Flex>
          <Flex gap={8} wrap>
            <Link to={`/forms/${form.id}/fill`}>
              <Button icon={<EyeOutlined aria-hidden="true" />} tabIndex={-1}>
                {copy.fill}
              </Button>
            </Link>
            <Button
              type="primary"
              icon={<DownloadOutlined aria-hidden="true" />}
              disabled={responses.length === 0}
              onClick={() =>
                download(
                  exportFileName(form.title),
                  toCsv(form, responses, { submittedAt: copy.submittedAt, ...yesNo }),
                )
              }
            >
              {copy.exportCsv}
            </Button>
          </Flex>
        </Flex>
      </Card>

      <Row gutter={[16, 16]} className="form-responses__stats">
        <Col xs={24} sm={8}>
          <Card className="dashboard-panel">
            <Statistic title={copy.totalResponses} value={responses.length} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="dashboard-panel">
            <Statistic
              title={copy.lastResponse}
              value={
                responses[0] ? dayjs(responses[0].submittedAt).format('D MMM HH:mm') : copy.never
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="dashboard-panel">
            <Statistic title={copy.answerRate} value={answeredShare} suffix="%" />
          </Card>
        </Col>
      </Row>

      {responses.length === 0 ? (
        <Card className="dashboard-panel">
          <Empty description={copy.noResponses} />
        </Card>
      ) : (
        <>
          <Typography.Title level={4} className="form-responses__heading">
            {copy.summary}
          </Typography.Title>
          <Row gutter={[16, 16]}>
            {questions.map((field) => (
              <Col xs={24} lg={12} key={field.id}>
                <SummaryCard field={field} responses={responses} copy={copy} />
              </Col>
            ))}
          </Row>

          <Typography.Title level={4} className="form-responses__heading">
            {copy.individual}
          </Typography.Title>
          <Card className="dashboard-panel">
            <Table<FormResponse>
              rowKey="id"
              size="middle"
              columns={columns}
              dataSource={responses}
              scroll={{ x: 170 + questions.length * 200 }}
              pagination={{ pageSize: 10, hideOnSinglePage: true }}
              onRow={(response) => ({
                onClick: () => setOpenId(response.id),
                className: 'form-responses__row',
              })}
            />
          </Card>
        </>
      )}

      <Drawer
        open={open !== undefined}
        onClose={() => setOpenId(null)}
        title={
          open ? `${copy.response} · ${dayjs(open.submittedAt).format('D MMM YYYY HH:mm')}` : ''
        }
        size="large"
      >
        {open && (
          <Descriptions column={1} bordered size="small">
            {questions.map((field) => (
              <Descriptions.Item key={field.id} label={field.label}>
                {formatAnswer(field, open.answers[field.id], yesNo) || copy.notAnswered}
              </Descriptions.Item>
            ))}
          </Descriptions>
        )}
      </Drawer>
    </div>
  )
}
