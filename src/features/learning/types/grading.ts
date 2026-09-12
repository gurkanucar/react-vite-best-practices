import type { Answer, AnswerSheet, Question } from '@/features/learning/types/questions'

export type QuestionOutcome = 'correct' | 'partial' | 'wrong' | 'unanswered' | 'manual'

export interface QuestionResult {
  questionId: string
  outcome: QuestionOutcome
  /** Points awarded, which for a partially correct answer is a fraction of the total. */
  earned: number
  possible: number
}

export interface ExamResult {
  results: QuestionResult[]
  earned: number
  /** Points that could be earned automatically; a file question is not among them. */
  possible: number
  /** Points waiting on a person to look at them. */
  pendingReview: number
  percentage: number
  passed: boolean
}

/** Spaces and case are not what a short-answer question is testing. */
function normalise(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, ' ')
}

function sameSet(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value) => right.includes(value))
}

/**
 * Scores one answer. Multiple-choice and matching award partial credit, because a reader
 * who got three of four right has not done the same thing as one who guessed. A wrong
 * selection on a multiple-choice question cancels a right one, so ticking everything
 * scores nothing rather than full marks.
 */
export function gradeQuestion(question: Question, answer: Answer | undefined): QuestionResult {
  const possible = question.points
  const miss = (outcome: QuestionOutcome): QuestionResult => ({
    questionId: question.id,
    outcome,
    earned: 0,
    possible,
  })

  if (!answer) return miss('unanswered')

  switch (question.kind) {
    case 'single': {
      if (answer.kind !== 'single' || answer.optionId === null) return miss('unanswered')

      const correct = answer.optionId === question.correctId

      return {
        questionId: question.id,
        outcome: correct ? 'correct' : 'wrong',
        earned: correct ? possible : 0,
        possible,
      }
    }

    case 'multiple': {
      if (answer.kind !== 'multiple' || answer.optionIds.length === 0) return miss('unanswered')

      const hits = answer.optionIds.filter((id) => question.correctIds.includes(id)).length
      const misses = answer.optionIds.length - hits
      const score = Math.max(hits - misses, 0) / question.correctIds.length
      const earned = Math.round(possible * score * 100) / 100

      if (sameSet(answer.optionIds, question.correctIds)) {
        return { questionId: question.id, outcome: 'correct', earned: possible, possible }
      }

      return {
        questionId: question.id,
        outcome: earned > 0 ? 'partial' : 'wrong',
        earned,
        possible,
      }
    }

    case 'trueFalse': {
      if (answer.kind !== 'trueFalse' || answer.value === null) return miss('unanswered')

      const correct = answer.value === question.correct

      return {
        questionId: question.id,
        outcome: correct ? 'correct' : 'wrong',
        earned: correct ? possible : 0,
        possible,
      }
    }

    case 'text': {
      if (answer.kind !== 'text' || answer.value.trim() === '') return miss('unanswered')

      const correct = question.acceptedAnswers.some(
        (accepted) => normalise(accepted) === normalise(answer.value),
      )

      return {
        questionId: question.id,
        outcome: correct ? 'correct' : 'wrong',
        earned: correct ? possible : 0,
        possible,
      }
    }

    case 'file': {
      if (answer.kind !== 'file' || answer.fileName === null) return miss('unanswered')

      // Nothing here can decide whether an uploaded file is right.
      return { questionId: question.id, outcome: 'manual', earned: 0, possible }
    }

    case 'matching': {
      if (answer.kind !== 'matching') return miss('unanswered')

      const answered = question.pairs.filter((pair) => answer.pairs[pair.id])

      if (answered.length === 0) return miss('unanswered')

      const hits = question.pairs.filter((pair) => answer.pairs[pair.id] === pair.answerId).length
      const earned = Math.round(((possible * hits) / question.pairs.length) * 100) / 100

      if (hits === question.pairs.length) {
        return { questionId: question.id, outcome: 'correct', earned: possible, possible }
      }

      return { questionId: question.id, outcome: hits > 0 ? 'partial' : 'wrong', earned, possible }
    }

    case 'ordering': {
      /*
       * An untouched question scores nothing even though it holds a full order. Awarding
       * the items that happen to start in place would pay a reader for a question they
       * never opened, and would disagree with the progress they are shown.
       */
      if (answer.kind !== 'ordering' || !answer.touched) return miss('unanswered')

      const correct =
        answer.optionIds.length === question.correctOrder.length &&
        answer.optionIds.every((id, index) => id === question.correctOrder[index])

      if (correct) {
        return { questionId: question.id, outcome: 'correct', earned: possible, possible }
      }

      // Partial credit for every item already in its final position.
      const inPlace = answer.optionIds.filter(
        (id, index) => id === question.correctOrder[index],
      ).length
      const earned = Math.round(((possible * inPlace) / question.correctOrder.length) * 100) / 100

      return {
        questionId: question.id,
        outcome: inPlace > 0 ? 'partial' : 'wrong',
        earned,
        possible,
      }
    }
  }
}

/**
 * The whole paper. Points waiting on a marker are kept out of the percentage rather than
 * counted as zero — a reader who uploaded their file has not failed that question yet.
 */
export function gradeExam(
  questions: Question[],
  answers: AnswerSheet,
  passMark: number,
): ExamResult {
  const results = questions.map((question) => gradeQuestion(question, answers[question.id]))

  const pendingReview = results
    .filter((result) => result.outcome === 'manual')
    .reduce((sum, result) => sum + result.possible, 0)

  const possible = results.reduce((sum, result) => sum + result.possible, 0) - pendingReview
  const earned = results.reduce((sum, result) => sum + result.earned, 0)
  const percentage = possible === 0 ? 0 : Math.round((earned / possible) * 100)

  return { results, earned, possible, pendingReview, percentage, passed: percentage >= passMark }
}
