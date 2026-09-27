# 037 — Form Builder

`/forms` is a small form builder: drag fields onto a form, set them up, publish it, fill it
in, and read the answers. Everything is Ant Design plus `@dnd-kit`, which the board and the
calendar already use; no form-builder package was added.

## Routes

| Route                      | Page                | What it does                                             |
| -------------------------- | ------------------- | -------------------------------------------------------- |
| `/forms`                   | `FormListPage`      | Cards per form: status, questions, responses, actions    |
| `/forms/new`               | `FormBuilderPage`   | An empty form; saving it moves to its edit address       |
| `/forms/:formId/edit`      | `FormBuilderPage`   | Palette, canvas and inspector, with undo and preview     |
| `/forms/:formId/fill`      | `FormFillPage`      | The team trying the form in the admin, drafts included   |
| `/forms/:formId/responses` | `FormResponsesPage` | Per-question summaries, a response table and CSV export  |
| `/f/:formId`               | `PublicFormPage`    | What respondents open: the form alone, outside the admin |

An unknown id on any of the last three shows a 404 result with a way back.

## The public page

Respondents never see the admin. `/f/:formId` is a route of its own, next to the `/preview/...` showcase pages rather than inside `AdminLayout`: no menu, no status tag, no link back into the app. The page has only the form and the language and colour controls a stranger might need, and it sets the browser tab's title to the form's.

Both pages answer through one `FormResponder`, so validation, conditional fields, the success screen and "submit another" cannot drift apart. They differ in one rule, set by its `audience` prop:

| Status    | Team (`/forms/:id/fill`)       | Public (`/f/:id`)           |
| --------- | ------------------------------ | --------------------------- |
| Published | The form                       | The form                    |
| Draft     | The form, with a draft warning | "This form is not open yet" |
| Closed    | "This form is closed"          | "This form is closed"       |

A draft stays off the public page because its questions may still change, and answers to them would not fit the final form.

**Sharing.** The list cards, the builder bar and the team fill page open `ShareFormModal`:

- The absolute link, with a copy button that falls back to a warning when the clipboard is unavailable.
- An "open public page" link.
- A QR code for posters, downloadable as PNG. It keeps a white tile in dark mode, because a QR code only scans dark on light.

A draft or closed form gets a warning saying what the link will show. The builder only offers sharing once the form is saved, because an unsaved form has no page yet.

Responses are stored in the browser like the rest of the demo, so the public page only records answers in the browser it is opened in. A real deployment would put `submitResponse` behind an API.

## The schema

A form is data, and every page draws from the same shape (`src/features/forms/types`):

```ts
interface FormField {
  id: string
  type: FieldType // shortText, longText, email, number, phone, singleChoice,
  // multipleChoice, dropdown, date, rating, nps, yesNo, file, section
  label: string
  help?: string
  placeholder?: string
  required: boolean
  options?: { id: string; label: string }[] // choice fields
  min?: number // number; `max` is also the star count of a rating
  max?: number
  minLength?: number // text
  maxLength?: number
  visibleWhen?: { fieldId: string; equals: string }
}
```

Responses store **ids, not labels**: a choice answer is its option id, a multiple choice a
list of ids. Renaming an option therefore does not orphan old answers, and the responses page
turns ids back into labels with `formatAnswer()` when it draws them.

### Validation comes from the schema

`rulesFor(field)` turns a field into antd `Form` rules — required, email, number range, text
length — so the fill page never writes a rule by hand. One detail is worth knowing: a rule
with no `type` is validated **as a string**. A required rating or NPS score (a number) or
date (a dayjs object) would then fail even when answered, so the required rule carries the
type of what the control holds: `number`, `array` or `object`.

### Conditional fields

One condition per field — "show only when an earlier answer equals X" — rather than a rule
engine. It covers the follow-up question, which is what most forms need, and stays something
you set up from two dropdowns. The inspector only offers fields **above** the one being edited
as the trigger, so a respondent never depends on a question they have not reached.

`isVisible()` also hides a field whose trigger is itself hidden, so a chain of follow-ups
collapses together. Deleting a field removes every condition that pointed at it; otherwise its
follow-ups would stay hidden with no visible reason. Hidden fields are neither validated nor
submitted.

## Drag and drop

The canvas is a `@dnd-kit/sortable` list; each palette item is a plain draggable. Two
collision rules share one `DndContext`:

- **Sorting a field** uses the usual nearest-centre rule against the other fields only.
- **Dropping from the palette** uses the field under the pointer, and the half of it the
  dragged item's middle is in (`dropIndex()`), so the "Drop here" line sits exactly where the
  field will land. The whole canvas is also a droppable, which catches a drop on an empty form
  or below the last field.

Dragging is for a mouse on a wide screen (`Grid.useBreakpoint().lg`), as in the calendar. On
a phone the palette and inspector are drawers and a tap adds a field at the end. Every field
also has move up/down, duplicate and delete buttons, and its drag handle works with the
keyboard sensor, so nothing needs a mouse.

## Undo and redo

The builder edits a local copy of the form through `useBuilderHistory`, a reducer that keeps
past and future versions (up to 100). A change is a new form object, which makes each step
cheap to keep. Keystrokes into the same input within a second are **one** step, so undo takes
back a word, not a letter. Ctrl+Z / Ctrl+Shift+Z work anywhere except inside a text box,
which keeps its own native undo. The store only sees the form on Save or Publish, and the bar
shows an "Unsaved changes" dot until then.

## Store

`useFormStore` is a zustand store persisted to local storage under `rvbp-forms`, like the
task list: there is no API behind it. It is seeded with four example forms (event
registration, customer feedback with NPS, a draft job application, a closed equipment request)
and a few dozen responses, in the language active when the store is created. Deleting a form
deletes its responses. The list page has a button that restores the examples.

## Responses

Each question gets a summary card by type: option counts with bars, the average and
distribution of a rating, the NPS score with promoters, passives and detractors, yes/no split,
number average and range, or the latest text answers. The table below has one column per
question; a row opens the full response in a drawer.

The CSV export is built by `toCsv()`: labels rather than ids, cells quoted when they hold a
comma, a quote or a line break, CRLF line endings, and a UTF-8 byte-order mark so a
spreadsheet opens Turkish letters correctly.

## Testing

- `types/index.test.ts` covers the pure logic: reordering, duplicating, removing a field and
  its conditions, visibility chains and cycles, rules per type, answer conversion, summaries,
  NPS, CSV escaping and file names.
- `pages/FormPages.test.tsx` renders the pages in the phone layout jsdom gives: the list and
  its search, adding a field from the palette drawer and renaming it from the inspector, undo
  grouping, saving a new form, filling in a form with a follow-up question, a closed form, the
  responses summary and a missing form.

Role queries are slow over the builder's many antd buttons in jsdom, so the tests find
controls by label and text, or inside a narrowed container.
