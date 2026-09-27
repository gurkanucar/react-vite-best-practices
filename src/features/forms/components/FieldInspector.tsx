import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Typography,
} from 'antd'
import type { FormBuilderCopy } from '@/features/forms/data'
import {
  conditionSources,
  hasOptions,
  moveItem,
  newId,
  TEXT_TYPES,
  type FieldOption,
  type FormField,
} from '@/features/forms/types'

interface FieldInspectorProps {
  field: FormField | undefined
  fields: FormField[]
  copy: FormBuilderCopy
  /** `key` groups keystrokes into one undo step: the same key within a second is one change. */
  onChange: (fieldId: string, patch: Partial<FormField>, key?: string) => void
}

function OptionsEditor({
  field,
  copy,
  onChange,
}: {
  field: FormField
  copy: FormBuilderCopy
  onChange: FieldInspectorProps['onChange']
}) {
  const options = field.options ?? []
  const update = (next: FieldOption[], key?: string) => onChange(field.id, { options: next }, key)

  return (
    <Form.Item label={copy.options}>
      <Flex vertical gap={6}>
        {options.map((option, index) => (
          <Flex key={option.id} gap={4} align="center">
            <Input
              value={option.label}
              aria-label={`${copy.options} ${index + 1}`}
              onChange={(event) =>
                update(
                  options.map((entry) =>
                    entry.id === option.id ? { ...entry, label: event.target.value } : entry,
                  ),
                  `${field.id}:option:${option.id}`,
                )
              }
            />
            <Button
              type="text"
              size="small"
              icon={<ArrowUpOutlined aria-hidden="true" />}
              aria-label={`${copy.moveUp}: ${option.label}`}
              disabled={index === 0}
              onClick={() => update(moveItem(options, index, index - 1))}
            />
            <Button
              type="text"
              size="small"
              icon={<ArrowDownOutlined aria-hidden="true" />}
              aria-label={`${copy.moveDown}: ${option.label}`}
              disabled={index === options.length - 1}
              onClick={() => update(moveItem(options, index, index + 1))}
            />
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined aria-hidden="true" />}
              aria-label={`${copy.removeOption}: ${option.label}`}
              // A choice question with no choices cannot be answered.
              disabled={options.length <= 1}
              onClick={() => update(options.filter((entry) => entry.id !== option.id))}
            />
          </Flex>
        ))}
        <Button
          type="dashed"
          icon={<PlusOutlined aria-hidden="true" />}
          onClick={() =>
            update([...options, { id: newId('opt'), label: copy.optionLabel(options.length + 1) }])
          }
        >
          {copy.addOption}
        </Button>
      </Flex>
    </Form.Item>
  )
}

function ConditionEditor({
  field,
  fields,
  copy,
  onChange,
}: {
  field: FormField
  fields: FormField[]
  copy: FormBuilderCopy
  onChange: FieldInspectorProps['onChange']
}) {
  // Only earlier questions: a field cannot depend on one the person has not reached yet.
  const sources = conditionSources(fields, field.id)
  const rule = field.visibleWhen
  const source = sources.find((candidate) => candidate.id === rule?.fieldId)

  if (sources.length === 0) {
    return <Typography.Paragraph type="secondary">{copy.noConditionSources}</Typography.Paragraph>
  }

  const valueControl = () => {
    if (!source || !rule) return null
    if (hasOptions(source.type)) {
      return (
        <Select
          aria-label={copy.conditionValue}
          value={rule.equals || undefined}
          placeholder={copy.selectPlaceholder}
          options={source.options?.map((option) => ({ value: option.id, label: option.label }))}
          onChange={(equals: string) =>
            onChange(field.id, { visibleWhen: { fieldId: source.id, equals } })
          }
        />
      )
    }
    if (source.type === 'yesNo') {
      return (
        <Select
          aria-label={copy.conditionValue}
          value={rule.equals || undefined}
          options={[
            { value: 'yes', label: copy.yes },
            { value: 'no', label: copy.no },
          ]}
          onChange={(equals: string) =>
            onChange(field.id, { visibleWhen: { fieldId: source.id, equals } })
          }
        />
      )
    }
    return (
      <Input
        aria-label={copy.conditionValue}
        value={rule.equals}
        placeholder={copy.conditionValue}
        onChange={(event) =>
          onChange(
            field.id,
            { visibleWhen: { fieldId: source.id, equals: event.target.value } },
            `${field.id}:condition`,
          )
        }
      />
    )
  }

  return (
    <Flex vertical gap={8}>
      <Select
        aria-label={copy.conditionField}
        value={rule?.fieldId ?? ''}
        options={[
          { value: '', label: copy.conditionNone },
          ...sources.map((candidate) => ({ value: candidate.id, label: candidate.label })),
        ]}
        onChange={(fieldId: string) => {
          if (!fieldId) {
            onChange(field.id, { visibleWhen: undefined })
            return
          }
          const next = sources.find((candidate) => candidate.id === fieldId)
          // Start from the first option, so a new condition is complete straight away.
          const equals = next?.options?.[0]?.id ?? (next?.type === 'yesNo' ? 'yes' : '')
          onChange(field.id, { visibleWhen: { fieldId, equals } })
        }}
      />
      {source && (
        <>
          <Typography.Text type="secondary">{copy.conditionEquals}</Typography.Text>
          {valueControl()}
        </>
      )}
    </Flex>
  )
}

/** Everything about the selected field, edited in place: the canvas redraws as you type. */
export function FieldInspector({ field, fields, copy, onChange }: FieldInspectorProps) {
  if (!field) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={copy.selectField} />
  }

  const text = (name: 'label' | 'help' | 'placeholder') => ({
    value: field[name] ?? '',
    onChange: (event: { target: { value: string } }) =>
      onChange(field.id, { [name]: event.target.value }, `${field.id}:${name}`),
  })
  const number = (name: 'min' | 'max' | 'minLength' | 'maxLength') => ({
    value: field[name] ?? null,
    onChange: (value: number | null) =>
      onChange(field.id, { [name]: value ?? undefined }, `${field.id}:${name}`),
  })
  const isSection = field.type === 'section'
  const takesPlaceholder = [...TEXT_TYPES, 'number', 'dropdown'].includes(field.type)

  return (
    <Form layout="vertical" component="div" className="form-inspector">
      <Typography.Text type="secondary" className="form-inspector__type">
        {copy.fieldTypes[field.type]}
      </Typography.Text>

      <Form.Item label={isSection ? copy.sectionTitle : copy.label} htmlFor="inspector-label">
        <Input id="inspector-label" {...text('label')} />
      </Form.Item>
      <Form.Item label={copy.help} htmlFor="inspector-help">
        <Input.TextArea
          id="inspector-help"
          autoSize={{ minRows: 1, maxRows: 4 }}
          placeholder={copy.helpPlaceholder}
          {...text('help')}
        />
      </Form.Item>
      {takesPlaceholder && (
        <Form.Item label={copy.placeholder} htmlFor="inspector-placeholder">
          <Input id="inspector-placeholder" {...text('placeholder')} />
        </Form.Item>
      )}
      {!isSection && field.type !== 'yesNo' && (
        <Form.Item label={copy.required} htmlFor="inspector-required">
          <Switch
            id="inspector-required"
            checked={field.required}
            onChange={(required) => onChange(field.id, { required })}
          />
        </Form.Item>
      )}

      {hasOptions(field.type) && <OptionsEditor field={field} copy={copy} onChange={onChange} />}

      {field.type === 'number' && (
        <Flex gap={12}>
          <Form.Item label={copy.minValue} htmlFor="inspector-min">
            <InputNumber id="inspector-min" {...number('min')} />
          </Form.Item>
          <Form.Item label={copy.maxValue} htmlFor="inspector-max">
            <InputNumber id="inspector-max" {...number('max')} />
          </Form.Item>
        </Flex>
      )}
      {field.type === 'rating' && (
        <Form.Item label={copy.stars} htmlFor="inspector-stars">
          <InputNumber
            id="inspector-stars"
            min={3}
            max={10}
            value={field.max ?? 5}
            onChange={(max) => onChange(field.id, { max: max ?? 5 })}
          />
        </Form.Item>
      )}
      {TEXT_TYPES.includes(field.type) && field.type !== 'email' && (
        <Flex gap={12}>
          <Form.Item label={copy.minLength} htmlFor="inspector-min-length">
            <InputNumber id="inspector-min-length" min={0} {...number('minLength')} />
          </Form.Item>
          <Form.Item label={copy.maxLength} htmlFor="inspector-max-length">
            <InputNumber id="inspector-max-length" min={1} {...number('maxLength')} />
          </Form.Item>
        </Flex>
      )}

      {!isSection && (
        <>
          <Divider />
          <Typography.Title level={5}>{copy.condition}</Typography.Title>
          <Typography.Paragraph type="secondary">{copy.conditionHint}</Typography.Paragraph>
          <ConditionEditor field={field} fields={fields} copy={copy} onChange={onChange} />
        </>
      )}
    </Form>
  )
}
