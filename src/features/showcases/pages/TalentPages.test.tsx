import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import { JobDetailPage } from '@/features/showcases/pages/JobDetailPage'
import { JobEditorPage } from '@/features/showcases/pages/JobEditorPage'
import { JobListPage } from '@/features/showcases/pages/JobListPage'
import { TechParkPublicationEditorPage } from '@/features/showcases/pages/TechParkPublicationEditorPage'
import { usePreferencesStore } from '@/store/preferences-store'

describe('talent and publishing showcase pages', () => {
  it('filters the talent board by role content and keeps detail links intact', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <JobListPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Talent board' })).toBeVisible()
    await user.type(screen.getByPlaceholderText('Search by role, company, or skill'), 'OpenCV')

    expect(screen.getByRole('heading', { name: 'Computer Vision Researcher' })).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'Product Designer' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Computer Vision Researcher' })).toHaveAttribute(
      'href',
      '/showcases/jobs/computer-vision-researcher',
    )
  })

  it('shows complete job content and the edit route', () => {
    render(
      <MemoryRouter initialEntries={['/showcases/jobs/senior-frontend-engineer']}>
        <Routes>
          <Route path="/showcases/jobs/:jobSlug" element={<JobDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Senior Frontend Engineer' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'What you will do' })).toBeVisible()
    expect(screen.getByText('Design systems')).toBeVisible()
    expect(screen.getByRole('link', { name: /Edit job$/ })).toHaveAttribute(
      'href',
      '/showcases/jobs/senior-frontend-engineer/edit',
    )
  })

  it('uses the same rich form for creating and editing jobs', () => {
    render(
      <MemoryRouter initialEntries={['/showcases/jobs/senior-frontend-engineer/edit']}>
        <Routes>
          <Route path="/showcases/jobs/:jobSlug/edit" element={<JobEditorPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Edit job' })).toBeVisible()
    expect(screen.getByDisplayValue('Senior Frontend Engineer')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Bold' })).toBeVisible()
    expect(screen.getByRole('button', { name: /Save changes$/ })).toBeVisible()
  })

  it('provides a bilingual news and announcement publishing screen', () => {
    usePreferencesStore.setState({ language: 'tr' })
    render(
      <MemoryRouter>
        <TechParkPublicationEditorPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Kampüs yayını oluştur' })).toBeVisible()
    expect(screen.getByText('Haber')).toBeVisible()
    expect(screen.getByText('Duyuru')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Kalın' })).toBeVisible()
    expect(screen.getByRole('button', { name: /Yayınla$/ })).toBeVisible()
  })
})
