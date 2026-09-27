import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { NewsAdminPage } from '@/features/content/pages/PublicationAdminPage'
import { PublicationEditorPage } from '@/features/content/pages/PublicationEditorPage'
import { usePreferencesStore } from '@/store/preferences-store'

describe('content management pages', () => {
  it('provides a bilingual news and announcement publishing screen', () => {
    usePreferencesStore.setState({ language: 'tr' })
    render(
      <MemoryRouter initialEntries={['/content/news/new']}>
        <Routes>
          <Route path="/content/:publicationKind/new" element={<PublicationEditorPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Haber oluştur' })).toBeVisible()
    expect(screen.getByText('Haber')).toBeVisible()
    expect(screen.getByText('Duyuru')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Kalın' })).toBeVisible()
    expect(screen.getByRole('button', { name: /Yayınla$/ })).toBeVisible()
  })

  it('lists news in an Ant Design management table with create and edit routes', () => {
    usePreferencesStore.setState({ language: 'en' })
    render(
      <MemoryRouter>
        <NewsAdminPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'News management' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Add news' })).toHaveAttribute(
      'href',
      '/content/news/new',
    )
    expect(
      screen.getByText('Northstar begins construction of its low-carbon data center'),
    ).toBeVisible()
    expect(
      screen.getByRole('link', {
        name: 'Northstar begins construction of its low-carbon data center',
      }),
    ).toHaveAttribute('href', '/content/news/green-data-center-investment/edit')
  })

  it('prefills an existing publication in the Tiptap editing form', () => {
    usePreferencesStore.setState({ language: 'en' })
    render(
      <MemoryRouter initialEntries={['/content/news/green-data-center-investment/edit']}>
        <Routes>
          <Route path="/content/:publicationKind/:slug/edit" element={<PublicationEditorPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Edit news' })).toBeVisible()
    expect(
      screen.getByDisplayValue('Northstar begins construction of its low-carbon data center'),
    ).toBeVisible()
    expect(screen.getByRole('button', { name: 'Bold' })).toBeVisible()
    expect(screen.getByLabelText('Write the full story or announcement here.')).toHaveAttribute(
      'contenteditable',
      'true',
    )
  })
})
