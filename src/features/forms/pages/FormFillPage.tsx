import { ArrowLeftOutlined, EditOutlined, ShareAltOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Result, Tag, Typography } from 'antd'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { FormResponder, ShareFormModal } from '@/features/forms/components'
import { useFormCopy, useFormStore } from '@/features/forms/hooks'
import { STATUS_COLOR } from '@/features/forms/types'
import './forms.css'

/**
 * The form as the team tries it, inside the admin shell, where a draft can be tested too.
 * The people answering it use the public page at `/f/:formId` instead.
 */
export function FormFillPage() {
  const copy = useFormCopy()
  const { formId } = useParams<{ formId: string }>()
  const form = useFormStore((state) => state.forms.find((entry) => entry.id === formId))
  const [sharing, setSharing] = useState(false)

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

  return (
    <div className="admin-page form-fill">
      <Flex justify="space-between" gap={8} wrap className="form-fill__toolbar">
        <Link to="/forms">
          <Button icon={<ArrowLeftOutlined aria-hidden="true" />} tabIndex={-1}>
            {copy.back}
          </Button>
        </Link>
        <Flex gap={8}>
          <Button icon={<ShareAltOutlined aria-hidden="true" />} onClick={() => setSharing(true)}>
            {copy.share}
          </Button>
          <Link to={`/forms/${form.id}/edit`}>
            <Button icon={<EditOutlined aria-hidden="true" />} tabIndex={-1}>
              {copy.edit}
            </Button>
          </Link>
        </Flex>
      </Flex>

      <Card className="dashboard-panel form-fill__card">
        <Tag color={STATUS_COLOR[form.status]}>{copy.statuses[form.status]}</Tag>
        <Typography.Title level={2}>{form.title}</Typography.Title>
        {form.description && (
          <Typography.Paragraph type="secondary" className="form-fill__description">
            {form.description}
          </Typography.Paragraph>
        )}
        <FormResponder form={form} audience="team" />
      </Card>

      <ShareFormModal form={sharing ? form : null} onClose={() => setSharing(false)} />
    </div>
  )
}
