import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
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
    // One editor per content language, both mounted so either can fail validation.
    expect(screen.getAllByRole('button', { name: 'Kalın' })).toHaveLength(2)
    expect(screen.getByRole('tab', { name: /Türkçe/ })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: /İngilizce/ })).toBeVisible()
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
    expect(screen.getByDisplayValue('green-data-center-investment')).toBeVisible()
    // Turkish has its own headline and an address made from it.
    expect(
      screen.getByDisplayValue('Northstar düşük karbonlu veri merkezinin inşasına başladı'),
    ).toBeInTheDocument()
    expect(
      screen.getByDisplayValue('northstar-dusuk-karbonlu-veri-merkezinin-insasina-basladi'),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Bold' })).toHaveLength(2)
    expect(
      screen.getByLabelText('Write the full story or announcement here. (English)'),
    ).toHaveAttribute('contenteditable', 'true')
  })

  it('fills each language’s slug from its own headline until the slug is edited', () => {
    usePreferencesStore.setState({ language: 'en' })
    render(
      <MemoryRouter initialEntries={['/content/news/new']}>
        <Routes>
          <Route path="/content/:publicationKind/new" element={<PublicationEditorPage />} />
        </Routes>
      </MemoryRouter>,
    )

    const [englishHeadline, turkishHeadline] = screen.getAllByPlaceholderText(
      'A clear, specific headline',
    )
    const [englishSlug, turkishSlug] = screen.getAllByPlaceholderText('e.g. campus-open-day')
    fireEvent.change(englishHeadline!, { target: { value: 'Open Day & Demo Night 2026' } })
    fireEvent.change(turkishHeadline!, { target: { value: 'Açık Gün ve Şirket Tanıtımları' } })
    expect(englishSlug).toHaveValue('open-day-demo-night-2026')
    expect(turkishSlug).toHaveValue('acik-gun-ve-sirket-tanitimlari')

    fireEvent.change(englishSlug!, { target: { value: 'open-day' } })
    fireEvent.change(englishHeadline!, { target: { value: 'Open Day moved to Friday' } })
    expect(englishSlug).toHaveValue('open-day')

    fireEvent.click(screen.getByRole('button', { name: 'Generate from headline (English)' }))
    expect(englishSlug).toHaveValue('open-day-moved-to-friday')
  })

  it('rejects malformed and taken slugs and opens the language that failed', async () => {
    usePreferencesStore.setState({ language: 'en' })
    render(
      <MemoryRouter initialEntries={['/content/news/new']}>
        <Routes>
          <Route path="/content/:publicationKind/new" element={<PublicationEditorPage />} />
        </Routes>
      </MemoryRouter>,
    )

    const [, turkishSlug] = screen.getAllByPlaceholderText('e.g. campus-open-day')
    fireEvent.change(turkishSlug!, { target: { value: 'Kötü Slug' } })
    expect(
      await screen.findByText('Use lowercase letters, numbers and single hyphens only'),
    ).toBeInTheDocument()

    fireEvent.change(turkishSlug!, {
      target: { value: 'northstar-dusuk-karbonlu-veri-merkezinin-insasina-basladi' },
    })
    expect(
      await screen.findByText('Another publication already uses this slug'),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Publish$/ }))
    await waitFor(() =>
      expect(screen.getByRole('tab', { name: /English/ })).toHaveAttribute('aria-selected', 'true'),
    )
    expect(
      within(screen.getByRole('tab', { name: /Turkish/ })).getByLabelText(
        'Missing or invalid fields',
      ),
    ).toBeInTheDocument()
  })
})
