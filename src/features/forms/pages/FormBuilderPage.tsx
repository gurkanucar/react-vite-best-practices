import {
  AppstoreAddOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  EyeOutlined,
  RedoOutlined,
  SaveOutlined,
  SendOutlined,
  SettingOutlined,
  UndoOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import {
  Alert,
  App,
  Badge,
  Button,
  Card,
  Drawer,
  Flex,
  Grid,
  Result,
  Segmented,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
// import { PageHeader } from '@/components/PageHeader/PageHeader'
import {
  BuilderCanvas,
  CANVAS_ID,
  FieldInspector,
  FieldPalette,
  FormRenderer,
  FormSettingsPanel,
  PaletteDragPreview,
  ShareFormModal,
} from '@/features/forms/components'
import type { FormBuilderCopy } from '@/features/forms/data'
import { useBuilderHistory, useFormCopy, useFormStore } from '@/features/forms/hooks'
import {
  blankForm,
  createField,
  dropIndex,
  duplicateField,
  insertAt,
  moveItem,
  removeField,
  STATUS_COLOR,
  type FieldType,
  type FormField,
  type FormSchema,
} from '@/features/forms/types'
import './forms.css'

type DragSource = { source: 'palette'; type: FieldType } | { source: 'canvas'; id: string }

/** Pressing in a text box keeps its own undo; only elsewhere does Ctrl+Z step the form back. */
function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

function Builder({ initial, copy }: { initial: FormSchema | undefined; copy: FormBuilderCopy }) {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const saveForm = useFormStore((state) => state.saveForm)
  const history = useBuilderHistory(
    () =>
      initial ??
      blankForm({
        title: copy.untitled,
        submitLabel: copy.defaultSubmit,
        successMessage: copy.defaultSuccess,
      }),
  )
  const { form, change } = history
  const [savedForm, setSavedForm] = useState<FormSchema | undefined>(initial)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode, setMode] = useState<'build' | 'preview'>('build')
  const [sharing, setSharing] = useState(false)
  // Only a saved form has a link; the stored copy is what the public page will show.
  const saved = useFormStore((state) => state.forms.find((entry) => entry.id === form.id))
  const [inspectorTab, setInspectorTab] = useState<'field' | 'settings'>('settings')
  const [drawer, setDrawer] = useState<'palette' | 'inspector' | null>(null)
  const [dragging, setDragging] = useState<DragSource | null>(null)
  const [dropAt, setDropAt] = useState<number | null>(null)
  // Three panels and dragging need a wide screen; on a phone the side panels are drawers.
  const wide = Grid.useBreakpoint().lg ?? false
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const selected = form.fields.find((field) => field.id === selectedId)
  const dirty = form !== savedForm

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || isEditable(event.target)) return
      const key = event.key.toLowerCase()
      if (key === 'z' && !event.shiftKey) {
        event.preventDefault()
        history.undo()
      } else if ((key === 'z' && event.shiftKey) || key === 'y') {
        event.preventDefault()
        history.redo()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [history])

  const updateFields = (update: (fields: FormField[]) => FormField[], key?: string) =>
    change((current) => ({ ...current, fields: update(current.fields) }), key)

  const select = (fieldId: string) => {
    setSelectedId(fieldId)
    setInspectorTab('field')
    if (!wide) setDrawer('inspector')
  }

  const addField = (type: FieldType, index?: number) => {
    const field = createField(type, copy.defaultLabels[type], copy.optionLabel)
    updateFields((fields) => insertAt(fields, index ?? fields.length, field))
    setSelectedId(field.id)
    setInspectorTab('field')
    setDrawer(wide ? null : 'inspector')
    // The new field may land below the fold; bring it into view once it is drawn.
    requestAnimationFrame(() =>
      document
        .querySelector(`[data-field-id="${field.id}"]`)
        ?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' }),
    )
  }

  const moveField = (fieldId: string, direction: -1 | 1) =>
    updateFields((fields) => {
      const index = fields.findIndex((field) => field.id === fieldId)
      return moveItem(fields, index, index + direction)
    })

  const deleteField = (fieldId: string) => {
    updateFields((fields) => removeField(fields, fieldId))
    if (selectedId === fieldId) {
      setSelectedId(null)
      setInspectorTab('settings')
      setDrawer(null)
    }
  }

  const save = (status?: FormSchema['status']) => {
    const next = status ? { ...form, status } : form
    if (status) change(() => next)
    saveForm(next)
    setSavedForm(next)
    void message.success(status === 'published' ? copy.published : copy.saved)
    // A new form gets its own address once it exists, so a reload keeps editing it.
    if (!initial) void navigate(`/forms/${next.id}/edit`, { replace: true })
  }

  /*
   * A palette item is dropped between fields, so its target is the field under the pointer
   * and not whichever one its middle is nearest; the canvas itself catches the rest. A field
   * being sorted uses the usual nearest-centre rule against the other fields only.
   */
  const collisionDetection: CollisionDetection = (args) => {
    const source = (args.active.data.current as DragSource | undefined)?.source
    if (source === 'canvas') {
      return closestCenter({
        ...args,
        droppableContainers: args.droppableContainers.filter(({ id }) => id !== CANVAS_ID),
      })
    }
    const hits = pointerWithin(args)
    const field = hits.find(({ id }) => id !== CANVAS_ID)
    return field ? [field] : hits
  }

  const onDragStart = ({ active }: DragStartEvent) => {
    const data = active.data.current as { source: string; type?: FieldType } | undefined
    setDragging(
      data?.source === 'palette' && data.type
        ? { source: 'palette', type: data.type }
        : { source: 'canvas', id: String(active.id) },
    )
  }

  const onDragMove = ({ active, over }: DragMoveEvent) => {
    if ((active.data.current as { source?: string } | undefined)?.source !== 'palette') return

    let next: number | null = null
    if (over?.id === CANVAS_ID) next = form.fields.length
    else if (over) {
      const index = form.fields.findIndex((field) => field.id === over.id)
      const rect = active.rect.current.translated
      if (index !== -1 && rect) {
        next = dropIndex(index, rect.top + rect.height / 2, over.rect.top, over.rect.height)
      }
    }
    if (next !== dropAt) setDropAt(next)
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    const source = dragging
    setDragging(null)
    setDropAt(null)
    if (!source || !over) return

    if (source.source === 'palette') {
      if (dropAt !== null) addField(source.type, dropAt)
      return
    }
    if (over.id === active.id) return
    updateFields((fields) =>
      moveItem(
        fields,
        fields.findIndex((field) => field.id === active.id),
        fields.findIndex((field) => field.id === over.id),
      ),
    )
  }

  const inspector = (
    <Tabs
      activeKey={inspectorTab}
      onChange={(key) => setInspectorTab(key as 'field' | 'settings')}
      items={[
        {
          key: 'field',
          label: copy.fieldTab,
          children: (
            <FieldInspector
              field={selected}
              fields={form.fields}
              copy={copy}
              onChange={(fieldId, patch, key) =>
                updateFields(
                  (fields) =>
                    fields.map((field) => (field.id === fieldId ? { ...field, ...patch } : field)),
                  key,
                )
              }
            />
          ),
        },
        {
          key: 'settings',
          label: copy.settingsTab,
          children: (
            <FormSettingsPanel
              form={form}
              copy={copy}
              onChange={(patch, key) => change((current) => ({ ...current, ...patch }), key)}
            />
          ),
        },
      ]}
    />
  )

  const palette = <FieldPalette copy={copy} draggable={wide} onAdd={(type) => addField(type)} />

  const canvas = (
    <BuilderCanvas
      form={form}
      copy={copy}
      selectedId={selectedId}
      draggable={wide}
      dropIndex={dragging?.source === 'palette' ? dropAt : null}
      onSelect={select}
      onMove={moveField}
      onDuplicate={(fieldId) => updateFields((fields) => duplicateField(fields, fieldId))}
      onDelete={deleteField}
    />
  )

  return (
    <div className="admin-page form-builder-page">
      {/* <PageHeader title={copy.listTitle} description={copy.listDescription} /> */}

      <Card className="dashboard-panel form-builder__bar">
        <Flex justify="space-between" align="center" gap={12} wrap>
          <Flex align="center" gap={10} className="form-builder__title">
            <Link to="/forms" aria-label={copy.back}>
              <Button icon={<ArrowLeftOutlined aria-hidden="true" />} tabIndex={-1}>
                {wide ? copy.back : null}
              </Button>
            </Link>
            <Typography.Title level={4} ellipsis>
              {form.title || copy.untitled}
            </Typography.Title>
            <Tag color={STATUS_COLOR[form.status]}>{copy.statuses[form.status]}</Tag>
            {dirty && (
              <Tooltip title={copy.unsaved}>
                <Badge
                  status="warning"
                  text={wide ? copy.unsaved : undefined}
                  className="form-builder__unsaved"
                  aria-label={copy.unsaved}
                />
              </Tooltip>
            )}
          </Flex>

          <Flex gap={8} wrap align="center">
            <Tooltip title={`${copy.undo} (Ctrl+Z)`}>
              <Button
                icon={<UndoOutlined aria-hidden="true" />}
                aria-label={copy.undo}
                disabled={!history.canUndo}
                onClick={history.undo}
              />
            </Tooltip>
            <Tooltip title={`${copy.redo} (Ctrl+Shift+Z)`}>
              <Button
                icon={<RedoOutlined aria-hidden="true" />}
                aria-label={copy.redo}
                disabled={!history.canRedo}
                onClick={history.redo}
              />
            </Tooltip>
            <Segmented<'build' | 'preview'>
              value={mode}
              onChange={setMode}
              options={[
                { value: 'build', label: copy.build, icon: <EditOutlined aria-hidden="true" /> },
                {
                  value: 'preview',
                  label: copy.preview,
                  icon: <EyeOutlined aria-hidden="true" />,
                },
              ]}
            />
            <Tooltip title={saved ? undefined : copy.saveBeforeShare}>
              <Button
                icon={<ShareAltOutlined aria-hidden="true" />}
                disabled={!saved}
                onClick={() => setSharing(true)}
                aria-label={copy.share}
              >
                {wide ? copy.share : null}
              </Button>
            </Tooltip>
            <Button icon={<SaveOutlined aria-hidden="true" />} onClick={() => save()}>
              {copy.save}
            </Button>
            <Button
              type="primary"
              icon={<SendOutlined aria-hidden="true" />}
              onClick={() => save('published')}
            >
              {copy.publish}
            </Button>
          </Flex>
        </Flex>
      </Card>

      {mode === 'preview' ? (
        <Card className="dashboard-panel form-fill__card form-builder__preview">
          <Alert type="info" showIcon title={copy.previewNotice} className="form-fill__notice" />
          <Typography.Title level={2}>{form.title}</Typography.Title>
          {form.description && (
            <Typography.Paragraph type="secondary">{form.description}</Typography.Paragraph>
          )}
          <FormRenderer
            form={form}
            copy={copy}
            onSubmit={() => void message.success(copy.previewSubmitted)}
          />
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetection}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          onDragCancel={() => {
            setDragging(null)
            setDropAt(null)
          }}
        >
          {wide ? (
            <div className="form-builder">
              <Card className="dashboard-panel form-builder__side" title={copy.palette}>
                {palette}
              </Card>
              <div className="form-builder__canvas">{canvas}</div>
              <Card className="dashboard-panel form-builder__side form-builder__inspector">
                {inspector}
              </Card>
            </div>
          ) : (
            <>
              <Flex gap={8} className="form-builder__mobile-actions">
                <Button
                  type="primary"
                  icon={<AppstoreAddOutlined aria-hidden="true" />}
                  onClick={() => setDrawer('palette')}
                >
                  {copy.addField}
                </Button>
                <Button
                  icon={<SettingOutlined aria-hidden="true" />}
                  onClick={() => {
                    setInspectorTab('settings')
                    setDrawer('inspector')
                  }}
                >
                  {copy.settingsTab}
                </Button>
              </Flex>
              <div className="form-builder__canvas">{canvas}</div>
              <Drawer
                open={drawer === 'palette'}
                onClose={() => setDrawer(null)}
                placement="bottom"
                title={copy.palette}
                size="large"
              >
                {palette}
              </Drawer>
              <Drawer
                open={drawer === 'inspector'}
                onClose={() => setDrawer(null)}
                title={copy.inspector}
                size="large"
              >
                {inspector}
              </Drawer>
            </>
          )}

          <DragOverlay dropAnimation={null}>
            {dragging?.source === 'palette' && (
              <PaletteDragPreview type={dragging.type} copy={copy} />
            )}
          </DragOverlay>
        </DndContext>
      )}

      <ShareFormModal form={sharing ? (saved ?? null) : null} onClose={() => setSharing(false)} />
    </div>
  )
}

export function FormBuilderPage() {
  const copy = useFormCopy()
  const { formId } = useParams<{ formId?: string }>()
  const stored = useFormStore((state) => state.forms.find((form) => form.id === formId))

  if (formId && !stored) {
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

  // Keyed by the route, so switching forms starts a fresh history rather than mixing two.
  return <Builder key={formId ?? 'new'} initial={stored} copy={copy} />
}
