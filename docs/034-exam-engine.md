# 034 — An Exam Engine

`/learning` is a course list, an exam, flashcards and a results page. The exam is the part
worth reading: seven kinds of question, partial credit, a timer, and one question no code
can score.

## A closed union of question kinds

```ts
export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | TextQuestion
  | FileQuestion
  | MatchingQuestion
  | OrderingQuestion
```

Every renderer and the grader switch over `question.kind` with no `default` branch. Adding
a kind then fails to compile in both places until it is handled, which is the whole reason
to model questions this way rather than as one object with optional fields.

Answers are a union of the same shape, and `blankAnswer(question)` produces the empty one,
so a sheet always has an entry for every question and no component has to guard for
`undefined`.

## Prompts and options are keys, not strings

A question stores `promptId`, and an option stores `labelId` — translation keys. An option
may carry an `image` instead of, or as well as, a label, which is how one screen supports
a picture in the prompt (a cache diagram) and pictures as the options themselves (four
charts, pick the treemap).

## Partial credit, and what it costs

Multiple choice, matching and ordering award part of the marks:

- **Multiple choice**: right ticks minus wrong ticks, floored at zero. Ticking every option
  therefore scores nothing rather than full marks, which is the property that makes partial
  credit safe to offer at all.
- **Matching**: one share per correct pair.
- **Ordering**: one share per item already in its final position.

Single choice, true/false and short answer are all or nothing. Short answers are compared
with case and repeated spaces normalised, against a list of accepted spellings.

## The question nobody can score

An uploaded file is checked for type and size and then marked `manual`. Its points are kept
**out of the percentage** rather than counted as zero:

```ts
const possible = total - pendingReview
const percentage = possible === 0 ? 0 : Math.round((earned / possible) * 100)
```

A reader who uploaded their diagram has not failed that question yet. The result names the
points that are waiting on a marker. An upload that was never made is a different thing and
does count against the total.

## Two bugs the numbers found

An ordering answer always holds a full order, so it first counted as **answered** before
anyone had looked at it — the progress bar said "1 of 8" on a paper nobody had touched. The
answer carries an explicit `touched` flag now.

The same shape then leaked into the score: an untouched ordering question was awarding marks
for the items that happened to start in place. Handing in a blank paper scored 20%. Grading
respects `touched` as well, so the two agree.

## The timer

One interval, started when the phase becomes `running` and cleared when it leaves. Time
running out hands the paper in as it stands rather than discarding it.

The sheet is mirrored into a ref for that, because the timer fires long after the effect
that created it: reading `answers` from that closure would grade whatever was on screen when
the exam started. The ref is written in the answer handler — an event — not during render.

## The engine is testable because it is not in a component

`gradeQuestion`, `gradeExam` and `useExamSession` hold everything; the components only
render. That is what lets the awkward cases — cancelling ticks, a discount larger than the
paper, every question awaiting a marker, a clock reaching zero — be pinned by tests instead
of clicked through by hand.
