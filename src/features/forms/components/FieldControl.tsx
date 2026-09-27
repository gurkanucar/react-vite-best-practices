import { UploadOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  DatePicker,
  Flex,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Space,
  Switch,
  Typography,
  Upload,
} from 'antd'
import type { FormBuilderCopy } from '@/features/forms/data'
import type { FormField } from '@/features/forms/types'

interface FieldControlProps {
  field: FormField
  copy: FormBuilderCopy
  /** `value`, `checked`, `fileList` and `onChange` arrive from the Form.Item around it. */
  [prop: string]: unknown
}

const NPS_SCORES = Array.from({ length: 11 }, (_, score) => score)

/**
 * The antd control for one field type. The fill page and the builder canvas draw the same
 * control, so what the builder shows is what the person filling it in will get.
 */
export function FieldControl({ field, copy, ...control }: FieldControlProps) {
  const options = field.options?.map((option) => ({ value: option.id, label: option.label }))

  switch (field.type) {
    case 'shortText':
      return <Input placeholder={field.placeholder} maxLength={field.maxLength} {...control} />
    case 'email':
      return (
        <Input type="email" autoComplete="email" placeholder={field.placeholder} {...control} />
      )
    case 'phone':
      return <Input type="tel" autoComplete="tel" placeholder={field.placeholder} {...control} />
    case 'longText':
      return (
        <Input.TextArea
          rows={4}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          showCount={Boolean(field.maxLength)}
          {...control}
        />
      )
    case 'number':
      return (
        <InputNumber
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
          style={{ width: '100%' }}
          {...control}
        />
      )
    case 'singleChoice':
      return (
        <Radio.Group {...control}>
          <Space orientation="vertical">
            {options?.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      )
    case 'multipleChoice':
      return (
        <Checkbox.Group {...control}>
          <Space orientation="vertical">
            {options?.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      )
    case 'dropdown':
      return (
        <Select
          options={options}
          placeholder={field.placeholder || copy.selectPlaceholder}
          allowClear
          {...control}
        />
      )
    case 'date':
      return <DatePicker style={{ width: '100%' }} {...control} />
    case 'rating':
      return <Rate count={field.max ?? 5} {...control} />
    case 'nps':
      return (
        <Flex vertical gap={6} className="form-nps">
          <Radio.Group
            optionType="button"
            options={NPS_SCORES.map((score) => ({ value: score, label: String(score) }))}
            {...control}
          />
          <Flex justify="space-between">
            <Typography.Text type="secondary">{copy.npsLow}</Typography.Text>
            <Typography.Text type="secondary">{copy.npsHigh}</Typography.Text>
          </Flex>
        </Flex>
      )
    case 'yesNo':
      return <Switch checkedChildren={copy.yes} unCheckedChildren={copy.no} {...control} />
    case 'file':
      return (
        <Upload beforeUpload={() => false} multiple {...control}>
          <Button icon={<UploadOutlined aria-hidden="true" />}>{copy.uploadButton}</Button>
        </Upload>
      )
    case 'section':
      return null
  }
}
