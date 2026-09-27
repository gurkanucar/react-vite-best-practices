import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BranchesOutlined,
  CopyOutlined,
  DeleteOutlined,
  HolderOutlined,
} from '@ant-design/icons'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button, Empty, Flex, Form, Tag, Tooltip, Typography } from 'antd'
import { FieldControl } from '@/features/forms/components/FieldControl'
import type { FormBuilderCopy } from '@/features/forms/data'
import type { FormField, FormSchema } from '@/features/forms/types'

export const CANVAS_ID = 'form-canvas'

interface BuilderCanvasProps {
  form: FormSchema
  copy: FormBuilderCopy
  selectedId: string | null
  draggable: boolean
  /** Where a palette item being dragged would land, drawn as a line between fields. */
  dropIndex: number | null
  onSelect: (fieldId: string) => void
  onMove: (fieldId: string, direction: -1 | 1) => void
  onDuplicate: (fieldId: string) => void
  onDelete: (fieldId: string) => void
}

interface CanvasFieldProps {
  field: FormField
  index: number
  count: number
  copy: FormBuilderCopy
  selected: boolean
  draggable: boolean
  onSelect: (fieldId: string) => void
  onMove: (fieldId: string, direction: -1 | 1) => void
  onDuplicate: (fieldId: string) => void
  onDelete: (fieldId: string) => void
}

function CanvasField({
  field,
  index,
  count,
  copy,
  selected,
  draggable,
  onSelect,
  onMove,
  onDuplicate,
  onDelete,
}: CanvasFieldProps) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    attributes,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id, data: { source: 'canvas' }, disabled: !draggable })

  const select = () => onSelect(field.id)

  const actions = (
    <Flex gap={2} className="form-canvas__actions">
      <Tooltip title={copy.moveUp}>
        <Button
          type="text"
          size="small"
          icon={<ArrowUpOutlined aria-hidden="true" />}
          aria-label={`${copy.moveUp}: ${field.label}`}
          disabled={index === 0}
          onClick={(event) => {
            event.stopPropagation()
            onMove(field.id, -1)
          }}
        />
      </Tooltip>
      <Tooltip title={copy.moveDown}>
        <Button
          type="text"
          size="small"
          icon={<ArrowDownOutlined aria-hidden="true" />}
          aria-label={`${copy.moveDown}: ${field.label}`}
          disabled={index === count - 1}
          onClick={(event) => {
            event.stopPropagation()
            onMove(field.id, 1)
          }}
        />
      </Tooltip>
      <Tooltip title={copy.duplicateField}>
        <Button
          type="text"
          size="small"
          icon={<CopyOutlined aria-hidden="true" />}
          aria-label={`${copy.duplicateField}: ${field.label}`}
          onClick={(event) => {
            event.stopPropagation()
            onDuplicate(field.id)
          }}
        />
      </Tooltip>
      <Tooltip title={copy.deleteField}>
        <Button
          type="text"
          size="small"
          danger
          icon={<DeleteOutlined aria-hidden="true" />}
          aria-label={`${copy.deleteField}: ${field.label}`}
          onClick={(event) => {
            event.stopPropagation()
            onDelete(field.id)
          }}
        />
      </Tooltip>
    </Flex>
  )

  return (
    <div
      ref={setNodeRef}
      data-field-id={field.id}
      className={[
        'form-canvas__field',
        selected && 'form-canvas__field--selected',
        isDragging && 'form-canvas__field--dragging',
        field.type === 'section' && 'form-canvas__field--section',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      // The whole card selects on a click; keyboard users use the button in its bar, since a
      // card that holds buttons of its own cannot itself be one. Delete removes the field.
      role="presentation"
      onClick={select}
      onKeyDown={(event) => {
        if (event.key === 'Delete' && event.target instanceof HTMLElement) {
          if (event.target.classList.contains('form-canvas__select')) onDelete(field.id)
        }
      }}
    >
      <Flex align="center" gap={6} className="form-canvas__bar">
        {draggable && (
          <button
            type="button"
            ref={setActivatorNodeRef}
            className="form-canvas__handle"
            onClick={(event) => event.stopPropagation()}
            {...listeners}
            {...attributes}
            aria-label={`${copy.dragToReorder}: ${field.label}`}
          >
            <HolderOutlined aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          className="form-canvas__select"
          aria-pressed={selected}
          aria-label={`${copy.edit}: ${field.label || copy.fieldTypes[field.type]}`}
          onClick={(event) => {
            event.stopPropagation()
            select()
          }}
        >
          {copy.fieldTypes[field.type]}
        </button>
        {field.visibleWhen && (
          <Tag icon={<BranchesOutlined aria-hidden="true" />} color="purple" variant="filled">
            {copy.conditional}
          </Tag>
        )}
        {actions}
      </Flex>

      {field.type === 'section' ? (
        <>
          <Typography.Title level={4} className="form-canvas__section-title">
            {field.label}
          </Typography.Title>
          {field.help && <Typography.Paragraph type="secondary">{field.help}</Typography.Paragraph>}
        </>
      ) : (
        // `inert` keeps the preview control out of reach: a click selects the field instead.
        <div inert className="form-canvas__preview">
          <Form.Item
            label={field.label}
            required={field.required}
            extra={field.help}
            className="form-canvas__item"
          >
            <FieldControl field={field} copy={copy} />
          </Form.Item>
        </div>
      )}
    </div>
  )
}

/**
 * The form as it will look, with every field selectable and sortable. The whole list is one
 * droppable too, so a palette item dropped below the last field, or on an empty form, lands.
 */
export function BuilderCanvas({
  form,
  copy,
  selectedId,
  draggable,
  dropIndex,
  onSelect,
  onMove,
  onDuplicate,
  onDelete,
}: BuilderCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({ id: CANVAS_ID })
  const line = <div className="form-canvas__drop-line">{copy.dropHere}</div>

  return (
    <Form layout="vertical" component="div" requiredMark="optional" className="form-canvas-form">
      <div
        ref={setNodeRef}
        className={`form-canvas${isOver && form.fields.length === 0 ? ' form-canvas--over' : ''}`}
      >
        <header className="form-canvas__header">
          <Typography.Title level={3}>{form.title}</Typography.Title>
          {form.description && (
            <Typography.Paragraph type="secondary">{form.description}</Typography.Paragraph>
          )}
        </header>

        {form.fields.length === 0 ? (
          <Empty
            className="form-canvas__empty"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={copy.emptyCanvas}
          />
        ) : (
          <SortableContext
            items={form.fields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            <Flex vertical gap={10}>
              {form.fields.map((field, index) => (
                <div key={field.id}>
                  {dropIndex === index && line}
                  <CanvasField
                    field={field}
                    index={index}
                    count={form.fields.length}
                    copy={copy}
                    selected={field.id === selectedId}
                    draggable={draggable}
                    onSelect={onSelect}
                    onMove={onMove}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                  />
                </div>
              ))}
              {dropIndex === form.fields.length && line}
            </Flex>
          </SortableContext>
        )}

        <Button type="primary" size="large" className="form-canvas__submit" tabIndex={-1}>
          {form.submitLabel}
        </Button>
      </div>
    </Form>
  )
}
