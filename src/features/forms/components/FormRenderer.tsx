import { Button, Form, Typography } from 'antd'
import type { Rule } from 'antd/es/form'
import { FieldControl } from '@/features/forms/components/FieldControl'
import type { FormBuilderCopy } from '@/features/forms/data'
import {
  isAnswerable,
  isVisible,
  rulesFor,
  toAnswers,
  type AnswerValue,
  type FormField,
  type FormSchema,
} from '@/features/forms/types'

interface FormRendererProps {
  form: FormSchema
  copy: FormBuilderCopy
  onSubmit: (answers: Record<string, AnswerValue>) => void
}

/** Where a control keeps its value, for the few that do not use `value`. */
function valuePropFor(field: FormField): string {
  if (field.type === 'yesNo') return 'checked'
  if (field.type === 'file') return 'fileList'
  return 'value'
}

function fileListFrom(event: unknown) {
  return Array.isArray(event) ? event : (event as { fileList?: unknown[] })?.fileList
}

/**
 * The form drawn from its schema, for the person filling it in. Visibility is worked out
 * from what the form holds right now, so a follow-up question appears as soon as the answer
 * that asks for it is given, and a hidden field is neither validated nor submitted.
 */
export function FormRenderer({ form, copy, onSubmit }: FormRendererProps) {
  const [antdForm] = Form.useForm<Record<string, unknown>>()
  // Every value, watched: an empty name path subscribes to the whole form.
  const values = Form.useWatch([], antdForm) as Record<string, unknown> | undefined
  const answers = toAnswers(form.fields, values)
  const shown = form.fields.filter((field) => isVisible(field, form.fields, answers))

  return (
    <Form
      form={antdForm}
      layout="vertical"
      requiredMark="optional"
      className="form-renderer"
      onFinish={(finished) => {
        const submitted = toAnswers(form.fields, finished)
        // Only what was on screen is kept; a hidden follow-up has no answer.
        onSubmit(
          Object.fromEntries(
            shown.filter(isAnswerable).map((field) => [field.id, submitted[field.id] ?? null]),
          ),
        )
      }}
    >
      {shown.map((field) =>
        field.type === 'section' ? (
          <div className="form-renderer__section" key={field.id}>
            <Typography.Title level={4}>{field.label}</Typography.Title>
            {field.help && (
              <Typography.Paragraph type="secondary">{field.help}</Typography.Paragraph>
            )}
          </div>
        ) : (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.label}
            extra={field.help}
            required={field.required}
            rules={rulesFor(field, copy.validation) as Rule[]}
            valuePropName={valuePropFor(field)}
            getValueFromEvent={field.type === 'file' ? fileListFrom : undefined}
          >
            <FieldControl field={field} copy={copy} />
          </Form.Item>
        ),
      )}

      <Button type="primary" htmlType="submit" size="large">
        {form.submitLabel}
      </Button>
    </Form>
  )
}
