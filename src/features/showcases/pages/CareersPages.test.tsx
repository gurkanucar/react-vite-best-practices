import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { careersJobs } from '@/features/showcases/data/careers'
import { applicationState } from '@/features/showcases/data/careersProfile'
import { emptyFilters, searchJobs } from '@/features/showcases/data/careersSearch'
import { useCareersStore } from '@/features/showcases/hooks/useCareersStore'
import { TalentApplicationsPage } from '@/features/showcases/pages/TalentApplicationsPage'
import { TalentCompanyPage } from '@/features/showcases/pages/TalentCompanyPage'
import { TalentEmployerPage } from '@/features/showcases/pages/TalentEmployerPage'
import { TalentHomePage } from '@/features/showcases/pages/TalentHomePage'
import { TalentJobPage } from '@/features/showcases/pages/TalentJobPage'
import { TalentJobsPage } from '@/features/showcases/pages/TalentJobsPage'
import { TalentPostJobPage } from '@/features/showcases/pages/TalentPostJobPage'
import { TalentProfilePage } from '@/features/showcases/pages/TalentProfilePage'
import { usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

const root = '/preview/talent'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Routes>
          <Route path={root} element={<TalentHomePage standalone />} />
          <Route path={`${root}/jobs`} element={<TalentJobsPage standalone />} />
          <Route path={`${root}/jobs/:jobId`} element={<TalentJobPage standalone />} />
          <Route path={`${root}/companies/:companyId`} element={<TalentCompanyPage standalone />} />
          <Route path={`${root}/applications`} element={<TalentApplicationsPage standalone />} />
          <Route path={`${root}/profile`} element={<TalentProfilePage standalone />} />
          <Route path={`${root}/employer`} element={<TalentEmployerPage standalone />} />
          <Route path={`${root}/employer/new`} element={<TalentPostJobPage standalone />} />
        </Routes>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

/** Picks an option in an antd Select the way a pointer would. */
async function choose(select: HTMLElement, option: string) {
  fireEvent.mouseDown(select.querySelector('.ant-select-selector') ?? select)
  const items = await screen.findAllByText(option, {
    selector: '.ant-select-item-option-content, .ant-select-item-option-content *',
  })
  fireEvent.click(items.at(-1)!)
}

/*
 * jsdom matches no media query, so these run the phone layout: no split view, filters in a
 * drawer. Controls are found by label and text; role queries over antd trees are slow here.
 */
describe('job platform', () => {
  beforeEach(() => {
    usePreferencesStore.getState().setLanguage('en')
    useCareersStore.getState().reset()
  })

  it('searches from the home page and lands on the results', async () => {
    renderAt(root)

    expect(screen.getByText('Your next job is one search away.')).toBeInTheDocument()
    expect(screen.getByText('Recommended for you')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Job title, skill or company'), {
      target: { value: 'Data Analyst' },
    })
    fireEvent.click(screen.getByText('Search jobs'))

    const expected = searchJobs({ ...emptyFilters, q: 'Data Analyst' }).length
    expect(await screen.findByText(`${expected} jobs for “Data Analyst”`)).toBeInTheDocument()
  })

  it('reads the filters from the address and says when nothing matches', () => {
    const view = renderAt(`${root}/jobs?category=design&mode=remote`)
    const count = searchJobs({ ...emptyFilters, category: 'design', modes: ['remote'] }).length
    expect(screen.getByText(`${count} jobs`)).toBeInTheDocument()
    expect(screen.getByText('Remote · Design')).toBeInTheDocument()
    view.unmount()

    renderAt(`${root}/jobs?q=zzzz`)
    expect(screen.getByText('No jobs match this search')).toBeInTheDocument()
  })

  it('saves a job from the results', () => {
    const { container } = renderAt(`${root}/jobs`)

    fireEvent.click(container.querySelector('.careers-job-card .careers-save')!)
    expect(useCareersStore.getState().savedJobs).toHaveLength(1)
    expect(screen.getByText('Saved (1)')).toBeInTheDocument()
  })

  it('applies with easy apply, prefilled from the profile', async () => {
    const applied = new Set(useCareersStore.getState().applications.map((item) => item.jobId))
    const job = careersJobs.find((item) => item.easyApply && !applied.has(item.id))!
    const { container } = renderAt(`${root}/jobs/${job.id}`)

    fireEvent.click(
      within(container.querySelector<HTMLElement>('.careers-detail__actions')!).getByText(
        'Easy apply',
      ),
    )
    expect(await screen.findByDisplayValue('deniz.yilmaz@example.com')).toBeInTheDocument()
    for (let step = 0; step < 3; step += 1) {
      fireEvent.click(screen.getByText('Next'))
      await screen.findByText(step === 2 ? 'Check your application' : 'Back')
    }
    fireEvent.click(screen.getByText('Submit application'))

    expect(await screen.findByText('Application sent')).toBeInTheDocument()
    const [latest] = useCareersStore.getState().applications
    expect(latest).toMatchObject({
      jobId: job.id,
      cvName: 'Deniz_Yilmaz_CV_2026.pdf',
      stepMs: 60_000,
    })
  })

  it('refuses to move on while a contact field is empty', async () => {
    const applied = new Set(useCareersStore.getState().applications.map((item) => item.jobId))
    const job = careersJobs.find((item) => item.easyApply && !applied.has(item.id))!
    const { container } = renderAt(`${root}/jobs/${job.id}`)

    fireEvent.click(
      within(container.querySelector<HTMLElement>('.careers-detail__actions')!).getByText(
        'Easy apply',
      ),
    )
    fireEvent.change(await screen.findByDisplayValue('+90 555 010 24 68'), {
      target: { value: '' },
    })
    fireEvent.click(screen.getByText('Next'))
    expect(await screen.findByText('This field is required')).toBeInTheDocument()
  })

  it('lists applications by state and withdraws one', async () => {
    renderAt(`${root}/applications`)

    expect(screen.getByText('Active (4)')).toBeInTheDocument()
    expect(screen.getByText('Archived (2)')).toBeInTheDocument()
    expect(screen.getByText(/^Interview on /)).toBeInTheDocument()

    fireEvent.click(screen.getAllByText('Withdraw')[0]!)
    fireEvent.click((await screen.findAllByText('Withdraw')).at(-1)!)
    await waitFor(() => expect(screen.getByText('Archived (3)')).toBeInTheDocument())
  })

  it('updates the profile strength as the profile is filled in', async () => {
    const { container } = renderAt(`${root}/profile`)
    const strength = () => container.querySelector('.careers-strength .ant-progress')!.textContent

    expect(strength()).toContain('82%')
    fireEvent.change(screen.getByLabelText('Portfolio or LinkedIn'), {
      target: { value: 'https://deniz.example' },
    })
    await waitFor(() => expect(strength()).toContain('91%'))
    expect(useCareersStore.getState().profile.portfolio).toBe('https://deniz.example')
  })

  it('shows a company with its reviews and open jobs', () => {
    renderAt(`${root}/companies/orbiton-cloud`)

    expect(screen.getByText('Orbiton Cloud', { selector: 'h1' })).toBeInTheDocument()
    expect(screen.getByText('Employee reviews')).toBeInTheDocument()
    expect(screen.getByText(/^Open jobs \(\d+\)$/)).toBeInTheDocument()
  })

  it('keeps a draft out of search and off the apply button', () => {
    const { container } = renderAt(`${root}/jobs/draft-sre-orbiton-cloud`)

    expect(
      screen.getByText(
        'This is a draft only you can see. Candidates cannot find or apply to it yet.',
      ),
    ).toBeInTheDocument()
    const actions = container.querySelector<HTMLElement>('.careers-detail__actions')!
    expect(within(actions).queryByText('Easy apply')).toBeNull()
    expect(within(actions).queryByText('Apply on company site')).toBeNull()
  })

  it('posts a job that candidates can find straight away', async () => {
    const view = renderAt(`${root}/employer/new`)

    fireEvent.change(screen.getByLabelText('Job title'), {
      target: { value: 'Staff Platform Engineer' },
    })
    fireEvent.change(screen.getByLabelText('Responsibilities'), {
      target: { value: 'Own the build platform\nKeep CI fast' },
    })
    fireEvent.change(screen.getByLabelText('Requirements'), {
      target: { value: '8+ years with CI' },
    })
    // Commas split typed text into tags, as they would for a pasted list.
    fireEvent.change(screen.getByLabelText('Skills'), {
      target: { value: 'Go,Kubernetes,Terraform,' },
    })
    fireEvent.click(screen.getByText('Publish listing'))

    await waitFor(() =>
      expect(useCareersStore.getState().customJobs[0]?.title.en).toBe('Staff Platform Engineer'),
    )
    const posted = useCareersStore.getState().customJobs[0]!
    expect(posted.skills).toEqual(['Go', 'Kubernetes', 'Terraform'])
    expect(useCareersStore.getState().postings[posted.id]?.status).toBe('published')
    view.unmount()

    renderAt(`${root}/jobs?q=Staff%20Platform`)
    expect(screen.getByText('1 job for “Staff Platform”')).toBeInTheDocument()
  })

  it('will not publish a job without the essentials', async () => {
    renderAt(`${root}/employer/new`)

    fireEvent.click(screen.getByText('Publish listing'))
    expect(await screen.findByText('Give the job a title')).toBeInTheDocument()
    expect(screen.getByText('Add at least three skills')).toBeInTheDocument()
    expect(useCareersStore.getState().customJobs).toHaveLength(1)
  })

  it('moves the demo candidate, and their own application follows', async () => {
    const application = useCareersStore
      .getState()
      .applications.find((item) => item.id === 'seed-review')!
    const { container } = renderAt(`${root}/employer?applicants=${application.jobId}`)

    expect(await screen.findByText('You (demo candidate)')).toBeInTheDocument()
    await choose(
      container.ownerDocument.querySelector<HTMLElement>('.careers-applicant.is-me .ant-select')!,
      'Interview',
    )

    await waitFor(() => {
      const moved = useCareersStore
        .getState()
        .applications.find((item) => item.id === 'seed-review')!
      expect(moved.employerStage?.stage).toBe('interview')
      expect(applicationState(moved, Date.now()).status).toBe('interview')
    })
  })
})
