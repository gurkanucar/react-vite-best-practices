import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { useTodoStore } from '@/features/todos/hooks'
import { TodoPage } from '@/features/todos/pages/TodoPage'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderPage() {
  return render(
    <MemoryRouter>
      <AppThemeProvider>
        <TodoPage />
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

const row = (title: string) => screen.getByText(title).closest('.todo-item') as HTMLElement
const group = (label: string) =>
  screen
    .getByText(label, { selector: '.ant-collapse-header *' })
    .closest('.ant-collapse-item') as HTMLElement

describe('TodoPage', () => {
  beforeEach(() => {
    useTodoStore.getState().reset()
  })

  it('groups the tasks by when they are due', () => {
    renderPage()

    expect(within(group('Overdue')).getByText('Rotate the staging API keys')).toBeInTheDocument()
    expect(within(group('Today')).getByText('Review the Q4 roadmap draft')).toBeInTheDocument()
    expect(within(group('Completed')).getByText('Set up the CI cache')).toBeInTheDocument()
  })

  it('adds a task from the quick-add box, reading its tags and priority', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.type(screen.getByLabelText('Add a task'), 'Write unit tests #testing !urgent{Enter}')

    const added = row('Write unit tests')
    expect(within(added).getByText('#testing')).toBeInTheDocument()
    expect(within(added).getByText('Urgent')).toBeInTheDocument()
    expect(screen.getByLabelText('Add a task')).toHaveValue('')
  })

  it('moves a task to Completed when it is ticked, and back when unticked', () => {
    renderPage()

    fireEvent.click(screen.getByLabelText('Mark “Reply to the design feedback” as done'))
    expect(within(group('Completed')).getByText('Reply to the design feedback')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Mark “Reply to the design feedback” as not done'))
    expect(within(group('Today')).getByText('Reply to the design feedback')).toBeInTheDocument()
  })

  it('narrows the list by tag and by list', () => {
    renderPage()

    fireEvent.click(
      screen.getByText('#infra', { selector: '.todo-sidebar__tag, .todo-sidebar__tag *' }),
    )
    expect(screen.getByText('Rotate the staging API keys')).toBeInTheDocument()
    expect(screen.queryByText('Review the Q4 roadmap draft')).toBeNull()

    // jsdom matches no media query, so the lists are the phone's segmented control.
    fireEvent.click(screen.getByText('Completed 2'))
    expect(screen.getByText('Set up the CI cache')).toBeInTheDocument()
    expect(screen.queryByText('Rotate the staging API keys')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByText('Onboard the new designer')).toBeInTheDocument()
  })

  it('edits a task in the side panel and refuses one without a title', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByText('Reply to the design feedback'))
    const drawer = await screen.findByRole('dialog')
    const title = within(drawer).getByLabelText('Title')
    expect(title).toHaveValue('Reply to the design feedback')

    await user.clear(title)
    await user.click(within(drawer).getByRole('button', { name: 'Save' }))
    expect(await within(drawer).findByText('Give the task a title.')).toBeInTheDocument()

    await user.type(title, 'Answer the design review')
    // A button-style radio hides its input from the pointer; the label is what a person clicks.
    await user.click(within(drawer).getByText('Urgent'))
    await user.click(within(drawer).getByRole('button', { name: 'Save' }))

    const edited = await screen.findByText('Answer the design review')
    expect(
      within(edited.closest('.todo-item') as HTMLElement).getByText('Urgent'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Reply to the design feedback')).toBeNull()
  })

  it('deletes a task at once and offers it back', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(
      screen.getByRole('button', { name: 'More actions: Book a room for the team offsite' }),
    )
    await user.click(await screen.findByRole('menuitem', { name: /Delete/ }))
    expect(screen.queryByText('Book a room for the team offsite')).toBeNull()

    await user.click(await screen.findByRole('button', { name: 'Undo' }))
    expect(screen.getByText('Book a room for the team offsite')).toBeInTheDocument()
  })

  it('shows a task’s notes and ticks its subtasks in place', async () => {
    const user = userEvent.setup()
    renderPage()

    const item = row('Fix login redirect loop on Safari')
    expect(within(item).getByText('1/3 subtasks')).toBeInTheDocument()

    await user.click(within(item).getByRole('button', { name: /Show details/ }))
    expect(within(item).getByText('Reproduce with a stale cookie')).toBeInTheDocument()

    await user.click(within(item).getByRole('checkbox', { name: 'Write a failing test' }))
    expect(within(item).getByText('2/3 subtasks')).toBeInTheDocument()
  })

  it('archives the completed tasks without deleting them, and can take that back', async () => {
    const user = userEvent.setup()
    renderPage()

    // The collapse header is a button too, so the query goes by the link's own text.
    await user.click(within(group('Completed')).getByText('Archive completed'))
    expect(screen.queryByText('Set up the CI cache')).toBeNull()

    await user.click(await screen.findByRole('button', { name: 'Undo' }))
    expect(within(group('Completed')).getByText('Set up the CI cache')).toBeInTheDocument()
  })

  it('keeps archived tasks in the archive, where they can be restored', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Archive: Set up the CI cache' }))
    await user.click(screen.getByText('Archive 3'))
    expect(screen.getByText('Set up the CI cache')).toBeInTheDocument()
    expect(screen.getByText('Migrate the docs site to Vite')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Restore from archive: Set up the CI cache' }),
    )
    expect(screen.queryByText('Set up the CI cache')).toBeNull()
    expect(
      useTodoStore.getState().todos.find((todo) => todo.title === 'Set up the CI cache'),
    ).toMatchObject({ done: true, archivedAt: undefined })
  })

  it('deletes for good only when the archive is emptied, after asking', async () => {
    const user = userEvent.setup()
    renderPage()
    const total = useTodoStore.getState().todos.length

    await user.click(screen.getByText('Archive 2'))
    await user.click(within(group('Archived')).getByText('Empty archive'))
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText(/Permanently delete 2 archived tasks/)).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    expect(
      await screen.findByText('The archive is empty. Finished tasks you archive wait here.'),
    ).toBeInTheDocument()
    expect(useTodoStore.getState().todos).toHaveLength(total - 2)
  })
})
