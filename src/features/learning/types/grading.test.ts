import { describe, expect, it } from 'vitest'
import { blankAnswer, gradeExam, gradeQuestion, isAnswered } from '@/features/learning/types'
import type { Question } from '@/features/learning/types'

const single: Question = {
  id: 'q-single',
  kind: 'single',
  promptId: 'p',
  points: 4,
  options: [{ id: 'a' }, { id: 'b' }],
  correctId: 'b',
}

const multiple: Question = {
  id: 'q-multi',
  kind: 'multiple',
  promptId: 'p',
  points: 6,
  options: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }],
  correctIds: ['a', 'b', 'c'],
}

const trueFalse: Question = {
  id: 'q-tf',
  kind: 'trueFalse',
  promptId: 'p',
  points: 2,
  correct: true,
}

const text: Question = {
  id: 'q-text',
  kind: 'text',
  promptId: 'p',
  points: 3,
  acceptedAnswers: ['Cascading Style Sheets', 'CSS'],
}

const file: Question = {
  id: 'q-file',
  kind: 'file',
  promptId: 'p',
  points: 10,
  acceptedTypes: ['application/pdf'],
  maxBytes: 1024,
}

const matching: Question = {
  id: 'q-match',
  kind: 'matching',
  promptId: 'p',
  points: 8,
  options: [{ id: 'x' }, { id: 'y' }, { id: 'z' }, { id: 'w' }],
  pairs: [
    { id: 'p1', promptId: 'p1', answerId: 'x' },
    { id: 'p2', promptId: 'p2', answerId: 'y' },
    { id: 'p3', promptId: 'p3', answerId: 'z' },
    { id: 'p4', promptId: 'p4', answerId: 'w' },
  ],
}

const ordering: Question = {
  id: 'q-order',
  kind: 'ordering',
  promptId: 'p',
  points: 4,
  options: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
  correctOrder: ['1', '2', '3', '4'],
}

describe('gradeQuestion', () => {
  it('scores a single choice all or nothing', () => {
    expect(gradeQuestion(single, { kind: 'single', optionId: 'b' })).toMatchObject({
      outcome: 'correct',
      earned: 4,
    })
    expect(gradeQuestion(single, { kind: 'single', optionId: 'a' })).toMatchObject({
      outcome: 'wrong',
      earned: 0,
    })
    expect(gradeQuestion(single, { kind: 'single', optionId: null })).toMatchObject({
      outcome: 'unanswered',
    })
  })

  it('gives partial credit on a multiple choice', () => {
    expect(gradeQuestion(multiple, { kind: 'multiple', optionIds: ['a', 'b', 'c'] })).toMatchObject(
      { outcome: 'correct', earned: 6 },
    )
    // Two of three right and nothing wrong ticked.
    expect(gradeQuestion(multiple, { kind: 'multiple', optionIds: ['a', 'b'] })).toMatchObject({
      outcome: 'partial',
      earned: 4,
    })
  })

  it('cancels a right tick with a wrong one, so ticking everything scores nothing', () => {
    expect(
      gradeQuestion(multiple, { kind: 'multiple', optionIds: ['a', 'b', 'c', 'd'] }),
    ).toMatchObject({
      outcome: 'partial',
      earned: 4,
    })
    expect(gradeQuestion(multiple, { kind: 'multiple', optionIds: ['d'] })).toMatchObject({
      outcome: 'wrong',
      earned: 0,
    })
  })

  it('ignores case and spacing in a short answer', () => {
    expect(
      gradeQuestion(text, { kind: 'text', value: '  cascading   style sheets ' }),
    ).toMatchObject({ outcome: 'correct' })
    expect(gradeQuestion(text, { kind: 'text', value: 'css' })).toMatchObject({
      outcome: 'correct',
    })
    expect(gradeQuestion(text, { kind: 'text', value: 'stylesheets' })).toMatchObject({
      outcome: 'wrong',
    })
  })

  it('sends an uploaded file to a person rather than scoring it', () => {
    expect(gradeQuestion(file, { kind: 'file', fileName: 'diagram.pdf' })).toMatchObject({
      outcome: 'manual',
      earned: 0,
      possible: 10,
    })
    expect(gradeQuestion(file, { kind: 'file', fileName: null })).toMatchObject({
      outcome: 'unanswered',
    })
  })

  it('scores matching pair by pair', () => {
    const pairs = { p1: 'x', p2: 'y', p3: 'w', p4: 'z' }

    expect(gradeQuestion(matching, { kind: 'matching', pairs })).toMatchObject({
      outcome: 'partial',
      earned: 4,
    })
    expect(
      gradeQuestion(matching, { kind: 'matching', pairs: { p1: 'x', p2: 'y', p3: 'z', p4: 'w' } }),
    ).toMatchObject({ outcome: 'correct', earned: 8 })
  })

  it('counts only the items an ordering answer already has in place', () => {
    const order = (optionIds: string[]) => ({ kind: 'ordering' as const, optionIds, touched: true })

    expect(gradeQuestion(ordering, order(['1', '2', '3', '4']))).toMatchObject({
      outcome: 'correct',
      earned: 4,
    })
    expect(gradeQuestion(ordering, order(['1', '2', '4', '3']))).toMatchObject({
      outcome: 'partial',
      earned: 2,
    })
    expect(gradeQuestion(ordering, order(['4', '3', '2', '1']))).toMatchObject({
      outcome: 'wrong',
      earned: 0,
    })
  })

  it('scores an untouched ordering question as unanswered, however it started', () => {
    // Two of the four happen to start in place; none of them are earned.
    expect(
      gradeQuestion(ordering, {
        kind: 'ordering',
        optionIds: ['1', '2', '4', '3'],
        touched: false,
      }),
    ).toMatchObject({ outcome: 'unanswered', earned: 0 })
  })

  it('treats a missing answer as unanswered rather than throwing', () => {
    expect(gradeQuestion(trueFalse, undefined)).toMatchObject({ outcome: 'unanswered', earned: 0 })
  })
})

describe('gradeExam', () => {
  const questions = [single, multiple, trueFalse, text, file]

  it('keeps points awaiting a marker out of the percentage', () => {
    const result = gradeExam(
      questions,
      {
        'q-single': { kind: 'single', optionId: 'b' },
        'q-multi': { kind: 'multiple', optionIds: ['a', 'b', 'c'] },
        'q-tf': { kind: 'trueFalse', value: true },
        'q-text': { kind: 'text', value: 'CSS' },
        'q-file': { kind: 'file', fileName: 'diagram.pdf' },
      },
      70,
    )

    // 4 + 6 + 2 + 3 automatic points, all earned; the file's 10 wait for a person.
    expect(result).toMatchObject({
      earned: 15,
      possible: 15,
      pendingReview: 10,
      percentage: 100,
      passed: true,
    })
  })

  it('fails a paper under the pass mark', () => {
    const result = gradeExam(questions, { 'q-single': { kind: 'single', optionId: 'b' } }, 70)

    expect(result.percentage).toBe(16)
    expect(result.passed).toBe(false)
  })

  it('does not divide by zero when every question awaits a marker', () => {
    const result = gradeExam([file], { 'q-file': { kind: 'file', fileName: 'a.pdf' } }, 50)

    expect(result.percentage).toBe(0)
    expect(result.possible).toBe(0)
  })
})

describe('blankAnswer', () => {
  it('gives every question kind an empty answer of its own shape', () => {
    expect(blankAnswer(single)).toEqual({ kind: 'single', optionId: null })
    expect(blankAnswer(matching)).toEqual({
      kind: 'matching',
      pairs: { p1: null, p2: null, p3: null, p4: null },
    })
    // An ordering question starts in the order it was given, which is not the answer.
    expect(blankAnswer(ordering)).toEqual({
      kind: 'ordering',
      optionIds: ['1', '2', '3', '4'],
      touched: false,
    })
  })

  it('reports which blanks count as answered', () => {
    expect(isAnswered(blankAnswer(single))).toBe(false)
    expect(isAnswered(blankAnswer(text))).toBe(false)
    expect(isAnswered(blankAnswer(matching))).toBe(false)
    // An untouched ordering holds a full order, but the reader has not answered it.
    expect(isAnswered(blankAnswer(ordering))).toBe(false)
    expect(isAnswered({ kind: 'ordering', optionIds: ['1'], touched: true })).toBe(true)
    expect(isAnswered({ kind: 'text', value: '  ' })).toBe(false)
    expect(isAnswered({ kind: 'multiple', optionIds: ['a'] })).toBe(true)
  })
})
