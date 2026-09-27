import { Form, Input, Segmented } from 'antd'
import type { FormBuilderCopy } from '@/features/forms/data'
import { FORM_STATUSES, type FormSchema, type FormStatus } from '@/features/forms/types'

interface FormSettingsPanelProps {
  form: FormSchema
  copy: FormBuilderCopy
  onChange: (patch: Partial<FormSchema>, key?: string) => void
}

export function FormSettingsPanel({ form, copy, onChange }: FormSettingsPanelProps) {
  const text = (name: 'title' | 'description' | 'submitLabel' | 'successMessage') => ({
    value: form[name],
    onChange: (event: { target: { value: string } }) =>
      onChange({ [name]: event.target.value }, `form:${name}`),
  })

  return (
    <Form layout="vertical" component="div">
      <Form.Item label={copy.formTitle} htmlFor="settings-title">
        <Input id="settings-title" {...text('title')} />
      </Form.Item>
      <Form.Item label={copy.formDescription} htmlFor="settings-description">
        <Input.TextArea
          id="settings-description"
          autoSize={{ minRows: 2, maxRows: 6 }}
          {...text('description')}
        />
      </Form.Item>
      <Form.Item label={copy.submitLabel} htmlFor="settings-submit">
        <Input id="settings-submit" {...text('submitLabel')} />
      </Form.Item>
      <Form.Item label={copy.successMessage} htmlFor="settings-success">
        <Input.TextArea
          id="settings-success"
          autoSize={{ minRows: 2, maxRows: 4 }}
          {...text('successMessage')}
        />
      </Form.Item>
      <Form.Item label={copy.status}>
        <Segmented<FormStatus>
          block
          value={form.status}
          onChange={(status) => onChange({ status })}
          options={FORM_STATUSES.map((status) => ({
            value: status,
            label: copy.statuses[status],
          }))}
        />
      </Form.Item>
    </Form>
  )
}
