import { describe, expect, it } from 'vitest'
import {
  conditionSources,
  dropIndex,
  duplicateField,
  exportFileName,
  formatAnswer,
  insertAt,
  isVisible,
  moveItem,
  npsScore,
  removeField,
  rulesFor,
  summarize,
  toAnswer,
  toCsv,
  type FormField,
  type FormResponse,
  type FormSchema,
} from '@/features/forms/types'

const field = (id: string, overrides: Partial<FormField> = {}): FormField => ({
  id,
  type: 'shortText',
  label: id,
  required: false,
  ...overrides,
})

const choice = field('attendance', {
  type: 'singleChoice',
  label: 'How will you attend?',
  options: [
    { id: 'in-person', label: 'In person' },
    { id: 'online', label: 'Online' },
  ],
})

const response = (answers: FormResponse['answers'], id = 'r'): FormResponse => ({
  id,
  formId: 'form',
  submittedAt: '2026-09-27T10:00:00.000Z',
  answers,
})

const validation = {
  required: 'required',
  email: 'email',
  min: (value: number) => `min ${value}`,
  max: (value: number) => `max ${value}`,
  minLength: (value: number) => `minLength ${value}`,
  maxLength: (value: number) => `maxLength ${value}`,
}

describe('form schema helpers', () => {
  it('moves, inserts and clamps like a drop on the canvas', () => {
    expect(moveItem(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a'])
    expect(moveItem(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b'])
    expect(moveItem(['a', 'b'], 1, 9)).toEqual(['a', 'b'])
    expect(insertAt(['a', 'c'], 1, 'b')).toEqual(['a', 'b', 'c'])
    expect(insertAt(['a'], 99, 'b')).toEqual(['a', 'b'])
  })

  it('duplicates a field right after itself, with new ids for it and its options', () => {
    const [original, copy] = duplicateField([choice], 'attendance')

    expect(copy!.label).toBe(original!.label)
    expect(copy!.id).not.toBe(original!.id)
    expect(copy!.options![0]!.id).not.toBe(original!.options![0]!.id)
  })

  it('drops the conditions that pointed at a removed field', () => {
    const diet = field('diet', { visibleWhen: { fieldId: 'attendance', equals: 'in-person' } })

    expect(removeField([choice, diet], 'attendance')).toEqual([{ ...diet, visibleWhen: undefined }])
  })

  it('offers only earlier, answerable fields as condition sources', () => {
    const fields = [
      choice,
      field('heading', { type: 'section' }),
      field('cv', { type: 'file' }),
      field('diet'),
      field('later'),
    ]

    expect(conditionSources(fields, 'diet').map(({ id }) => id)).toEqual(['attendance'])
  })

  it('places a palette drop before or after a field by the pointer’s half', () => {
    expect(dropIndex(2, 110, 100, 40)).toBe(2)
    expect(dropIndex(2, 130, 100, 40)).toBe(3)
  })
})

describe('conditional visibility', () => {
  const diet = field('diet', { visibleWhen: { fieldId: 'attendance', equals: 'in-person' } })
  const allergy = field('allergy', { visibleWhen: { fieldId: 'diet', equals: 'nuts' } })
  const fields = [choice, diet, allergy]

  it('shows a follow-up only for the answer that asks for it', () => {
    expect(isVisible(diet, fields, {})).toBe(false)
    expect(isVisible(diet, fields, { attendance: 'online' })).toBe(false)
    expect(isVisible(diet, fields, { attendance: 'in-person' })).toBe(true)
  })

  it('hides a chain together when its first link is hidden', () => {
    expect(isVisible(allergy, fields, { attendance: 'in-person', diet: 'nuts' })).toBe(true)
    // The diet answer still says "nuts", but the diet question itself is no longer shown.
    expect(isVisible(allergy, fields, { attendance: 'online', diet: 'nuts' })).toBe(false)
  })

  it('reads yes/no, lists and text the way a person would compare them', () => {
    const email = field('email', { visibleWhen: { fieldId: 'ok', equals: 'yes' } })
    const tags = field('tags', { visibleWhen: { fieldId: 'topics', equals: 'b' } })
    const city = field('city', { visibleWhen: { fieldId: 'country', equals: 'Turkey' } })
    const all = [
      field('ok', { type: 'yesNo' }),
      field('topics'),
      field('country'),
      email,
      tags,
      city,
    ]

    expect(isVisible(email, all, { ok: true })).toBe(true)
    expect(isVisible(email, all, { ok: false })).toBe(false)
    expect(isVisible(tags, all, { topics: ['a', 'b'] })).toBe(true)
    expect(isVisible(city, all, { country: '  turkey ' })).toBe(true)
  })

  it('does not loop on a condition cycle', () => {
    const a = field('a', { visibleWhen: { fieldId: 'b', equals: 'x' } })
    const b = field('b', { visibleWhen: { fieldId: 'a', equals: 'x' } })

    expect(isVisible(a, [a, b], { a: 'x', b: 'x' })).toBe(false)
  })
})

describe('validation rules from the schema', () => {
  it('requires a list for multiple choice and trims text', () => {
    expect(rulesFor(field('name', { required: true }), validation)).toEqual([
      { required: true, whitespace: true, message: 'required' },
    ])
    expect(
      rulesFor(field('diet', { type: 'multipleChoice', required: true }), validation)[0],
    ).toMatchObject({ type: 'array', min: 1 })
    // Untyped rules are checked as strings, which a score or a date never is.
    expect(rulesFor(field('nps', { type: 'nps', required: true }), validation)[0]).toMatchObject({
      type: 'number',
    })
    expect(rulesFor(field('d', { type: 'date', required: true }), validation)[0]).toMatchObject({
      type: 'object',
    })
  })

  it('adds email, range and length checks where they apply', () => {
    expect(rulesFor(field('email', { type: 'email' }), validation)).toEqual([
      { type: 'email', message: 'email' },
    ])
    expect(rulesFor(field('age', { type: 'number', min: 0, max: 40 }), validation)).toEqual([
      { type: 'number', min: 0, message: 'min 0' },
      { type: 'number', max: 40, message: 'max 40' },
    ])
    expect(rulesFor(field('bio', { type: 'longText', minLength: 50 }), validation)).toEqual([
      { min: 50, message: 'minLength 50' },
    ])
  })

  it('never validates a section heading or a yes/no switch as required', () => {
    expect(rulesFor(field('s', { type: 'section', required: true }), validation)).toEqual([])
    expect(rulesFor(field('ok', { type: 'yesNo', required: true }), validation)).toEqual([])
  })
})

describe('answers', () => {
  it('stores dates, uploads, text and switches in their saved form', () => {
    const date = { format: () => '2026-10-01', isValid: () => true }

    expect(toAnswer(field('d', { type: 'date' }), date)).toBe('2026-10-01')
    expect(toAnswer(field('cv', { type: 'file' }), [{ name: 'cv.pdf' }])).toEqual(['cv.pdf'])
    expect(toAnswer(field('t'), '  hi  ')).toBe('hi')
    expect(toAnswer(field('ok', { type: 'yesNo' }), undefined)).toBe(false)
    expect(toAnswer(field('t'), undefined)).toBeNull()
  })

  it('formats option ids as labels and booleans as words', () => {
    const yesNo = { yes: 'Yes', no: 'No' }

    expect(formatAnswer(choice, 'online', yesNo)).toBe('Online')
    expect(formatAnswer(field('ok', { type: 'yesNo' }), true, yesNo)).toBe('Yes')
    expect(formatAnswer(field('t'), null, yesNo)).toBe('')
  })
})

describe('response summaries', () => {
  it('scores NPS as promoters minus detractors', () => {
    expect(npsScore([10, 9, 8, 7, 6, 0])).toBe(0)
    expect(npsScore([10, 10, 9, 3])).toBe(50)
    expect(npsScore([])).toBe(0)
  })

  it('counts each option, and every option of a multiple choice answer', () => {
    const summary = summarize(choice, [
      response({ attendance: 'in-person' }),
      response({ attendance: 'in-person' }),
      response({ attendance: 'online' }),
      response({}),
    ])

    expect(summary).toMatchObject({
      kind: 'choice',
      answered: 3,
      counts: [
        { id: 'in-person', count: 2 },
        { id: 'online', count: 1 },
      ],
    })
  })

  it('averages ratings and splits NPS answers into their three groups', () => {
    const rating = summarize(field('stars', { type: 'rating', max: 5 }), [
      response({ stars: 5 }),
      response({ stars: 4 }),
    ])
    expect(rating).toMatchObject({ kind: 'rating', average: 4.5, counts: [0, 0, 0, 1, 1] })

    const nps = summarize(field('nps', { type: 'nps' }), [
      response({ nps: 10 }),
      response({ nps: 7 }),
      response({ nps: 2 }),
    ])
    expect(nps).toMatchObject({ kind: 'nps', promoters: 1, passives: 1, detractors: 1, score: 0 })
  })
})

describe('CSV export', () => {
  it('quotes cells that need it and writes labels, not ids', () => {
    const form: FormSchema = {
      id: 'form',
      title: 'Feedback',
      description: '',
      submitLabel: 'Send',
      successMessage: 'Thanks',
      status: 'published',
      createdAt: '',
      updatedAt: '',
      fields: [choice, field('note', { label: 'Note, please' }), field('h', { type: 'section' })],
    }
    const csv = toCsv(form, [response({ attendance: 'online', note: 'He said "hi"\nthen left' })], {
      submittedAt: 'Submitted',
      yes: 'Yes',
      no: 'No',
    })

    expect(csv.split('\r\n')[0]).toBe('Submitted,How will you attend?,"Note, please"')
    expect(csv).toContain('Online,"He said ""hi""\nthen left"')
  })

  it('names the file after the form, keeping Turkish titles readable', () => {
    expect(exportFileName('Müşteri geri bildirimi')).toBe('musteri-geri-bildirimi-responses.csv')
    expect(exportFileName('!!!')).toBe('form-responses.csv')
  })
})
