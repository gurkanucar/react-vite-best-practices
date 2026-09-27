import { useDraggable } from '@dnd-kit/core'
import { Typography } from 'antd'
import { fieldIcons } from '@/features/forms/components/fieldIcons'
import type { FormBuilderCopy } from '@/features/forms/data'
import { FIELD_TYPES, type FieldType } from '@/features/forms/types'

interface FieldPaletteProps {
  copy: FormBuilderCopy
  /** Dragging is for a mouse on a wide screen; a tap always adds the field at the end. */
  draggable: boolean
  onAdd: (type: FieldType) => void
}

function PaletteItem({
  type,
  copy,
  draggable,
  onAdd,
}: {
  type: FieldType
  copy: FormBuilderCopy
  draggable: boolean
  onAdd: (type: FieldType) => void
}) {
  const { setNodeRef, listeners, isDragging } = useDraggable({
    id: `palette:${type}`,
    data: { source: 'palette', type },
    disabled: !draggable,
  })

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={`form-palette__item${isDragging ? ' form-palette__item--dragging' : ''}`}
      onClick={() => onAdd(type)}
      {...(draggable ? listeners : {})}
      // No dnd-kit attributes: the button's job is the click that adds, so it keeps its own
      // role, and a keyboard user adds with Enter rather than dragging.
    >
      <span className="form-palette__icon">{fieldIcons[type]}</span>
      {copy.fieldTypes[type]}
    </button>
  )
}

export function FieldPalette({ copy, draggable, onAdd }: FieldPaletteProps) {
  return (
    <div className="form-palette">
      <Typography.Paragraph type="secondary" className="form-palette__hint">
        {draggable ? copy.paletteHint : copy.paletteHintTouch}
      </Typography.Paragraph>
      <div className="form-palette__grid">
        {FIELD_TYPES.map((type) => (
          <PaletteItem key={type} type={type} copy={copy} draggable={draggable} onAdd={onAdd} />
        ))}
      </div>
    </div>
  )
}

/** The chip that follows the pointer while a palette item is dragged. */
export function PaletteDragPreview({ type, copy }: { type: FieldType; copy: FormBuilderCopy }) {
  return (
    <div className="form-palette__item form-palette__item--overlay">
      <span className="form-palette__icon">{fieldIcons[type]}</span>
      {copy.fieldTypes[type]}
    </div>
  )
}
