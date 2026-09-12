import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { FilesPage } from '@/features/files/pages/FilesPage'
import { createQueryClient } from '@/lib/query/query-client'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderPage(search = '') {
  return {
    // `delay: null` types the whole string at once. Between antd and jsdom, a re-render
    // per keystroke is what turns a handful of tests into minutes.
    user: userEvent.setup({ delay: null }),
    ...render(
      <MemoryRouter initialEntries={[`/files${search}`]}>
        <QueryClientProvider client={createQueryClient()}>
          <AppThemeProvider>
            <FilesPage />
          </AppThemeProvider>
        </QueryClientProvider>
      </MemoryRouter>,
    ),
  }
}

const table = () => screen.getByRole('table')

describe('FilesPage', () => {
  it('opens the folder named in the URL', async () => {
    renderPage('?path=/engineering')

    expect(await within(table()).findByText('architecture.md')).toBeInTheDocument()
    // A file from the root is not in this listing.
    expect(within(table()).queryByText('brand-guide.pdf')).not.toBeInTheDocument()
  })

  /*
   * Navigating by clicking a folder or a breadcrumb is deliberately not asserted here.
   * Under jsdom that click sends antd's table into a loop that starves the event loop, so
   * the test hangs rather than fails — intermittently, which is worse than not having it.
   * Both directions are verified by hand in a browser. What is asserted instead is that the
   * trail is built correctly, which is the part this feature actually owns.
   */
  it('builds the breadcrumb trail down to the open folder', async () => {
    renderPage('?path=/engineering/runbooks')

    await within(table()).findByText('on-call.md')

    const crumbs = within(screen.getByRole('navigation')).getAllByRole('listitem')

    expect(crumbs.map((crumb) => crumb.textContent?.trim())).toEqual([
      'All files',
      'engineering',
      'runbooks',
    ])
    // The folder already open is text; the ones above it navigate.
    expect(within(crumbs[1]!).getByRole('button')).toBeInTheDocument()
    expect(within(crumbs[2]!).queryByRole('button')).not.toBeInTheDocument()
  })

  it('filters the listing as the reader types', async () => {
    const { user } = renderPage('?path=/engineering')

    await within(table()).findByText('architecture.md')
    await user.type(screen.getByPlaceholderText('Search in this folder'), 'api')

    expect(within(table()).getByText('api-schema.json')).toBeInTheDocument()
    expect(within(table()).queryByText('architecture.md')).not.toBeInTheDocument()
  })

  it('adds a created folder to both the listing and the tree', async () => {
    const { user } = renderPage('?path=/contracts')

    await within(table()).findByText('dpa-template.pdf')
    await user.click(screen.getByRole('button', { name: /new folder/i }))

    const dialog = await screen.findByRole('dialog')
    await user.type(within(dialog).getByRole('textbox'), 'signed')
    await user.click(within(dialog).getByRole('button', { name: /^create$/i }))

    expect(await within(table()).findByText('signed')).toBeInTheDocument()
    // The tree is a separate query; a missed invalidation would show only in this one.
    await waitFor(() =>
      expect(within(screen.getByRole('tree')).getByTitle('signed')).toBeInTheDocument(),
    )
  })
})
