/** Every prompt, option label and explanation is a translation key, never a display string. */
export interface QuestionOption {
  id: string
  labelId?: string
  /** An option can be a picture instead of, or as well as, a label. */
  image?: string
}

export interface MatchingPair {
  /** Left-hand item; the reader drags or picks a right-hand item for it. */
  id: string
  promptId: string
  /** The id of the option that belongs to this prompt. */
  answerId: string
}

interface BaseQuestion {
  id: string
  promptId: string
  points: number
  /** A picture shown with the prompt. */
  image?: string
  explanationId?: string
}

export interface SingleChoiceQuestion extends BaseQuestion {
  kind: 'single'
  options: QuestionOption[]
  correctId: string
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  kind: 'multiple'
  options: QuestionOption[]
  correctIds: string[]
}

export interface TrueFalseQuestion extends BaseQuestion {
  kind: 'trueFalse'
  correct: boolean
}

export interface TextQuestion extends BaseQuestion {
  kind: 'text'
  /** Any of these counts as right, compared case- and space-insensitively. */
  acceptedAnswers: string[]
}

export interface FileQuestion extends BaseQuestion {
  kind: 'file'
  acceptedTypes: string[]
  maxBytes: number
}

export interface MatchingQuestion extends BaseQuestion {
  kind: 'matching'
  pairs: MatchingPair[]
  options: QuestionOption[]
}

export interface OrderingQuestion extends BaseQuestion {
  kind: 'ordering'
  options: QuestionOption[]
  /** Option ids in the order they belong. */
  correctOrder: string[]
}

export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | TextQuestion
  | FileQuestion
  | MatchingQuestion
  | OrderingQuestion

export type QuestionKind = Question['kind']

export type Answer =
  | { kind: 'single'; optionId: string | null }
  | { kind: 'multiple'; optionIds: string[] }
  | { kind: 'trueFalse'; value: boolean | null }
  | { kind: 'text'; value: string }
  | { kind: 'file'; fileName: string | null }
  | { kind: 'matching'; pairs: Record<string, string | null> }
  /**
   * `touched` is carried because an ordering answer always holds a full order: without it
   * a question nobody has looked at would count towards the progress the reader is shown.
   */
  | { kind: 'ordering'; optionIds: string[]; touched: boolean }

export type AnswerSheet = Record<string, Answer>

/** The empty answer for a question, so a sheet always has an entry for every question. */
export function blankAnswer(question: Question): Answer {
  switch (question.kind) {
    case 'single':
      return { kind: 'single', optionId: null }
    case 'multiple':
      return { kind: 'multiple', optionIds: [] }
    case 'trueFalse':
      return { kind: 'trueFalse', value: null }
    case 'text':
      return { kind: 'text', value: '' }
    case 'file':
      return { kind: 'file', fileName: null }
    case 'matching':
      return {
        kind: 'matching',
        pairs: Object.fromEntries(question.pairs.map((pair) => [pair.id, null])),
      }
    case 'ordering':
      // Starts in the order the options are given, which is deliberately not the answer.
      return {
        kind: 'ordering',
        optionIds: question.options.map((option) => option.id),
        touched: false,
      }
  }
}

export function isAnswered(answer: Answer): boolean {
  switch (answer.kind) {
    case 'single':
      return answer.optionId !== null
    case 'multiple':
      return answer.optionIds.length > 0
    case 'trueFalse':
      return answer.value !== null
    case 'text':
      return answer.value.trim().length > 0
    case 'file':
      return answer.fileName !== null
    case 'matching':
      return Object.values(answer.pairs).some((value) => value !== null)
    case 'ordering':
      return answer.touched
  }
}
