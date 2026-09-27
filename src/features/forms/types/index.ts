export type FieldType =
  | 'shortText'
  | 'longText'
  | 'email'
  | 'number'
  | 'phone'
  | 'singleChoice'
  | 'multipleChoice'
  | 'dropdown'
  | 'date'
  | 'rating'
  | 'nps'
  | 'yesNo'
  | 'file'
  | 'section'

/** The palette order, which groups the types the way a reader looks for them. */
export const FIELD_TYPES: FieldType[] = [
  'shortText',
  'longText',
  'email',
  'number',
  'phone',
  'singleChoice',
  'multipleChoice',
  'dropdown',
  'date',
  'rating',
  'nps',
  'yesNo',
  'file',
  'section',
]

export type FormStatus = 'draft' | 'published' | 'closed'

export const FORM_STATUSES: FormStatus[] = ['draft', 'published', 'closed']

export interface FieldOption {
  id: string
  label: string
}

/**
 * "Show this field only when another one has a given answer". One condition, not a rule
 * engine: it covers the follow-up question, which is what most forms need, and stays
 * something a person can set up from two dropdowns.
 */
export interface VisibilityRule {
  fieldId: string
  /** An option id for a choice field, `yes`/`no` for a yes/no field, or the text itself. */
  equals: string
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  help?: string
  placeholder?: string
  required: boolean
  /** Choice fields only. */
  options?: FieldOption[]
  /** Numbers: the smallest and largest value. Rating: `max` is the number of stars. */
  min?: number
  max?: number
  /** Text: length limits in characters. */
  minLength?: number
  maxLength?: number
  visibleWhen?: VisibilityRule
}

export interface FormSchema {
  id: string
  title: string
  description: string
  submitLabel: string
  successMessage: string
  status: FormStatus
  fields: FormField[]
  createdAt: string
  updatedAt: string
}

/**
 * What a response stores per field: text as text, a choice as its option id (a list of ids
 * for multiple choice), a date as `YYYY-MM-DD`, a yes/no as a boolean and an upload as the
 * file names. Ids rather than labels, so renaming an option does not orphan old answers.
 */
export type AnswerValue = string | number | boolean | string[] | null

export interface FormResponse {
  id: string
  formId: string
  submittedAt: string
  answers: Record<string, AnswerValue>
}

export const CHOICE_TYPES: FieldType[] = ['singleChoice', 'multipleChoice', 'dropdown']
export const TEXT_TYPES: FieldType[] = ['shortText', 'longText', 'email', 'phone']

export function hasOptions(type: FieldType): boolean {
  return CHOICE_TYPES.includes(type)
}

/** A section heading is layout, not a question: it has no answer and no validation. */
export function isAnswerable(field: FormField): boolean {
  return field.type !== 'section'
}

let sequence = 0
export function newId(prefix: string): string {
  sequence += 1
  return `${prefix}-${Date.now().toString(36)}-${sequence}`
}

/** What a new field of each type starts with; the label comes from the copy, per language. */
export function createField(
  type: FieldType,
  label: string,
  optionLabels: (index: number) => string,
): FormField {
  const field: FormField = { id: newId('field'), type, label, required: false }

  if (hasOptions(type)) {
    field.options = [1, 2, 3].map((index) => ({ id: newId('opt'), label: optionLabels(index) }))
  }
  if (type === 'rating') field.max = 5
  if (type === 'longText') field.maxLength = 1000

  return field
}

/** A copy placed right after the original, with fresh ids so the two never share answers. */
export function duplicateField(fields: FormField[], fieldId: string): FormField[] {
  const index = fields.findIndex((field) => field.id === fieldId)
  if (index === -1) return fields

  const source = fields[index]!
  const copy: FormField = {
    ...source,
    id: newId('field'),
    options: source.options?.map((option) => ({ ...option, id: newId('opt') })),
  }

  return insertAt(fields, index + 1, copy)
}

export function insertAt<T>(items: T[], index: number, item: T): T[] {
  const at = Math.min(Math.max(index, 0), items.length)
  return [...items.slice(0, at), item, ...items.slice(at)]
}

/** Moves one item to another position, the way a drag drop or an up/down button does. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || from >= items.length) return items

  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(Math.min(Math.max(to, 0), next.length), 0, moved!)

  return next
}

/**
 * Removes a field and every condition that pointed at it: a follow-up whose trigger is gone
 * would otherwise stay hidden forever with no way to see why.
 */
export function removeField(fields: FormField[], fieldId: string): FormField[] {
  return fields
    .filter((field) => field.id !== fieldId)
    .map((field) =>
      field.visibleWhen?.fieldId === fieldId ? { ...field, visibleWhen: undefined } : field,
    )
}

/** The fields before this one that can drive its visibility: an answerable, earlier field. */
export function conditionSources(fields: FormField[], fieldId: string): FormField[] {
  const index = fields.findIndex((field) => field.id === fieldId)
  return fields
    .slice(0, Math.max(index, 0))
    .filter((field) => isAnswerable(field) && field.type !== 'file')
}

function answerMatches(value: AnswerValue | undefined, equals: string): boolean {
  if (value === undefined || value === null) return false
  if (typeof value === 'boolean') return (value ? 'yes' : 'no') === equals
  if (Array.isArray(value)) return value.includes(equals)
  return String(value).trim().toLowerCase() === equals.trim().toLowerCase()
}

/**
 * Whether a field is shown for the answers so far. A field whose trigger is itself hidden is
 * hidden too, so a chain of follow-ups collapses together rather than leaving an orphan.
 */
export function isVisible(
  field: FormField,
  fields: FormField[],
  answers: Record<string, AnswerValue | undefined>,
  seen: Set<string> = new Set(),
): boolean {
  const rule = field.visibleWhen
  if (!rule) return true
  // A condition loop cannot be built from the inspector, but imported data might hold one.
  if (seen.has(field.id)) return false

  const source = fields.find((candidate) => candidate.id === rule.fieldId)
  if (!source) return true

  seen.add(field.id)
  return isVisible(source, fields, answers, seen) && answerMatches(answers[source.id], rule.equals)
}

export function visibleFields(
  fields: FormField[],
  answers: Record<string, AnswerValue | undefined>,
): FormField[] {
  return fields.filter((field) => isVisible(field, fields, answers))
}

export interface ValidationText {
  required: string
  email: string
  min: (value: number) => string
  max: (value: number) => string
  minLength: (value: number) => string
  maxLength: (value: number) => string
}

/** The shape of an antd rule this builder produces; a subset of antd's own `Rule`. */
export interface FieldRule {
  required?: boolean
  whitespace?: boolean
  type?: 'email' | 'number' | 'array' | 'object'
  min?: number
  max?: number
  message: string
}

/**
 * A rule with no type is checked as a string, so a required rating or NPS score would fail
 * even when given. The type follows what the control holds: a number, a list, or the dayjs
 * object a date picker keeps.
 */
function requiredRule(type: FieldType, message: string): FieldRule {
  if (type === 'multipleChoice' || type === 'file') {
    return { required: true, type: 'array', min: 1, message }
  }
  if (type === 'number' || type === 'rating' || type === 'nps') {
    return { required: true, type: 'number', message }
  }
  if (type === 'date') return { required: true, type: 'object', message }

  return { required: true, whitespace: TEXT_TYPES.includes(type) || undefined, message }
}

/** The antd rules for a field, from its schema, so the fill page never repeats them. */
export function rulesFor(field: FormField, text: ValidationText): FieldRule[] {
  if (!isAnswerable(field)) return []

  const rules: FieldRule[] = []
  const isText = TEXT_TYPES.includes(field.type)

  if (field.required && field.type !== 'yesNo') {
    rules.push(requiredRule(field.type, text.required))
  }
  if (field.type === 'email') rules.push({ type: 'email', message: text.email })
  if (field.type === 'number') {
    if (field.min !== undefined) {
      rules.push({ type: 'number', min: field.min, message: text.min(field.min) })
    }
    if (field.max !== undefined) {
      rules.push({ type: 'number', max: field.max, message: text.max(field.max) })
    }
  }
  if (isText) {
    if (field.minLength) {
      rules.push({ min: field.minLength, message: text.minLength(field.minLength) })
    }
    if (field.maxLength) {
      rules.push({ max: field.maxLength, message: text.maxLength(field.maxLength) })
    }
  }

  return rules
}

/** An answer as a person reads it: option labels instead of ids, "Yes" instead of `true`. */
export function formatAnswer(
  field: FormField,
  value: AnswerValue | undefined,
  yesNo: { yes: string; no: string },
): string {
  if (value === undefined || value === null || value === '') return ''
  if (typeof value === 'boolean') return value ? yesNo.yes : yesNo.no

  const label = (id: string) => field.options?.find((option) => option.id === id)?.label ?? id

  if (Array.isArray(value)) return value.map(hasOptions(field.type) ? label : String).join(', ')
  if (hasOptions(field.type)) return label(String(value))

  return String(value)
}

/**
 * Net Promoter Score: the share of 9–10s minus the share of 0–6s, as a whole number from
 * -100 to 100. Sevens and eights count towards the total but neither side.
 */
export function npsScore(values: number[]): number {
  if (values.length === 0) return 0

  const promoters = values.filter((value) => value >= 9).length
  const detractors = values.filter((value) => value <= 6).length

  return Math.round(((promoters - detractors) / values.length) * 100)
}

export type FieldSummary =
  | { kind: 'choice'; answered: number; counts: { id: string; label: string; count: number }[] }
  | { kind: 'rating'; answered: number; average: number; max: number; counts: number[] }
  | {
      kind: 'nps'
      answered: number
      score: number
      average: number
      promoters: number
      passives: number
      detractors: number
    }
  | { kind: 'yesNo'; answered: number; yes: number; no: number }
  | { kind: 'number'; answered: number; average: number; min: number; max: number }
  | { kind: 'text'; answered: number; answers: string[] }

const round1 = (value: number) => Math.round(value * 10) / 10

/** What the responses say about one field, in the form its summary card draws. */
export function summarize(field: FormField, responses: FormResponse[]): FieldSummary {
  const values = responses
    .map((response) => response.answers[field.id])
    .filter(
      (value): value is Exclude<AnswerValue, null> =>
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0),
    )
  const answered = values.length

  if (hasOptions(field.type)) {
    const counts = (field.options ?? []).map((option) => ({
      id: option.id,
      label: option.label,
      count: values.filter((value) =>
        Array.isArray(value) ? value.includes(option.id) : value === option.id,
      ).length,
    }))
    return { kind: 'choice', answered, counts }
  }

  const numbers = values.map(Number).filter((value) => Number.isFinite(value))
  const average = numbers.length
    ? round1(numbers.reduce((sum, value) => sum + value, 0) / numbers.length)
    : 0

  if (field.type === 'rating') {
    const max = field.max ?? 5
    const counts = Array.from(
      { length: max },
      (_, index) => numbers.filter((value) => value === index + 1).length,
    )
    return { kind: 'rating', answered, average, max, counts }
  }

  if (field.type === 'nps') {
    return {
      kind: 'nps',
      answered,
      average,
      score: npsScore(numbers),
      promoters: numbers.filter((value) => value >= 9).length,
      passives: numbers.filter((value) => value === 7 || value === 8).length,
      detractors: numbers.filter((value) => value <= 6).length,
    }
  }

  if (field.type === 'yesNo') {
    const yes = values.filter((value) => value === true).length
    return { kind: 'yesNo', answered, yes, no: answered - yes }
  }

  if (field.type === 'number') {
    return {
      kind: 'number',
      answered,
      average,
      min: numbers.length ? Math.min(...numbers) : 0,
      max: numbers.length ? Math.max(...numbers) : 0,
    }
  }

  return {
    kind: 'text',
    answered,
    answers: values.map((value) => (Array.isArray(value) ? value.join(', ') : String(value))),
  }
}

/** One CSV cell: quoted when it holds a comma, a quote or a line break, quotes doubled. */
function csvCell(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value
}

/**
 * The responses as CSV, one row per response and one column per question, in the order the
 * form asks them. Labels, not ids, so the file opens readable in a spreadsheet.
 */
export function toCsv(
  form: FormSchema,
  responses: FormResponse[],
  headings: { submittedAt: string; yes: string; no: string },
): string {
  const fields = form.fields.filter(isAnswerable)
  const header = [headings.submittedAt, ...fields.map((field) => field.label)]
  const rows = responses.map((response) => [
    response.submittedAt,
    ...fields.map((field) => formatAnswer(field, response.answers[field.id], headings)),
  ])

  // CRLF is what RFC 4180 and spreadsheet programs expect.
  return [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')
}

/** A file-system-safe name for an export, from the form's title. */
export function exportFileName(title: string): string {
  const base = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${base || 'form'}-responses.csv`
}

/** An empty form for `/forms/new`; the texts come from the copy, per language. */
export function blankForm(texts: { title: string; submitLabel: string; successMessage: string }) {
  const now = new Date().toISOString()
  const form: FormSchema = {
    id: newId('form'),
    title: texts.title,
    description: '',
    submitLabel: texts.submitLabel,
    successMessage: texts.successMessage,
    status: 'draft',
    fields: [],
    createdAt: now,
    updatedAt: now,
  }
  return form
}

interface DateLike {
  format: (template: string) => string
}

function isDateLike(value: unknown): value is DateLike {
  return typeof value === 'object' && value !== null && 'format' in value && 'isValid' in value
}

/**
 * Turns what an antd control holds into what a response stores: a dayjs date becomes
 * `YYYY-MM-DD`, an upload list becomes its file names, text is trimmed and nothing is `null`.
 */
export function toAnswer(field: FormField, raw: unknown): AnswerValue {
  if (raw === undefined || raw === null) return field.type === 'yesNo' ? false : null
  if (field.type === 'file' && Array.isArray(raw)) {
    return raw.map((file: { name?: string }) => file.name ?? '').filter(Boolean)
  }
  if (isDateLike(raw)) return raw.format('YYYY-MM-DD')
  if (typeof raw === 'string') return raw.trim()
  if (typeof raw === 'number' || typeof raw === 'boolean') return raw
  if (Array.isArray(raw)) return raw.map(String)
  return null
}

/** The answers the fill form holds so far, as responses store them, for its visibility rules. */
export function toAnswers(
  fields: FormField[],
  values: Record<string, unknown> | undefined,
): Record<string, AnswerValue> {
  return Object.fromEntries(
    fields.filter(isAnswerable).map((field) => [field.id, toAnswer(field, values?.[field.id])]),
  )
}

/**
 * Where a palette item dropped over a field lands: before it when the dragged item's middle
 * is above the field's middle, after it otherwise, so the drop line follows the pointer.
 */
export function dropIndex(
  overIndex: number,
  draggedCenterY: number,
  overTop: number,
  overHeight: number,
) {
  return draggedCenterY > overTop + overHeight / 2 ? overIndex + 1 : overIndex
}

/** The antd preset each status tag uses, shared by the list, the builder and the fill page. */
/** Where the people answering a form open it: outside the admin shell, with no menu around it. */
export function publicFormPath(formId: string): string {
  return `/f/${formId}`
}

export const STATUS_COLOR: Record<FormStatus, string> = {
  draft: 'default',
  published: 'green',
  closed: 'red',
}
