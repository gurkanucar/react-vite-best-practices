import { describe, expect, it } from 'vitest'
import { careersCompanies, careersJobs, type Job } from '@/features/showcases/data/careers'
import {
  EMPLOYER_COMPANY_ID,
  allJobs,
  postingToJob,
  publicJobs,
  seedEmployerData,
  type PostingDraft,
} from '@/features/showcases/data/careersEmployer'
import {
  applicationState,
  employerStageOf,
  interviewIcs,
  interviewTime,
  profileCompleteness,
  seedProfile,
  type Application,
} from '@/features/showcases/data/careersProfile'
import {
  emptyFilters,
  filtersToParams,
  fold,
  keywordScore,
  matchesFilters,
  parseFilters,
  searchJobs,
  skillMatch,
} from '@/features/showcases/data/careersSearch'

const NOW = Date.parse('2026-09-28T10:00:00Z')
const MINUTE = 60_000
const DAY = 24 * 60 * MINUTE

const job = (patch: Partial<Job>): Job => ({ ...careersJobs[0]!, ...patch })

describe('job catalogue', () => {
  it('is the same 120 jobs every time, each with a real company and a sane salary', () => {
    expect(careersJobs).toHaveLength(120)
    expect(new Set(careersJobs.map((item) => item.id)).size).toBe(120)
    const companies = new Set(careersCompanies.map((company) => company.id))
    for (const item of careersJobs) {
      expect(companies.has(item.companyId)).toBe(true)
      expect(item.skills.length).toBeGreaterThanOrEqual(4)
    }
    expect(careersJobs.every((item) => !item.salary || item.salary.max >= item.salary.min)).toBe(
      true,
    )
    expect(careersJobs.some((item) => item.salary === null)).toBe(true)
    expect(careersJobs.some((item) => item.postedMinutesAgo < 24 * 60)).toBe(true)
  })
})

describe('search', () => {
  it('folds Turkish letters and needs every word to match somewhere', () => {
    expect(fold('Geliştirici İşİ')).toBe('gelistirici isi')
    const frontend = careersJobs.find((item) => item.role === 'frontend')!
    expect(keywordScore(frontend, 'gelistirici')).toBeGreaterThan(0)
    expect(keywordScore(frontend, `frontend ${frontend.skills[0]}`)).toBeGreaterThan(0)
    expect(keywordScore(frontend, 'frontend accountant')).toBe(0)
    // A title word counts for more than a skill.
    expect(keywordScore(frontend, 'frontend')).toBeGreaterThan(
      keywordScore(frontend, frontend.skills[0]!),
    )
  })

  it('reads filters from the address, dropping anything that is not an option', () => {
    const filters = parseFilters(
      new URLSearchParams(
        'q=react&location=izmir&mode=remote,space&level=senior&posted=9&sort=salary&easy=1',
      ),
    )
    expect(filters).toMatchObject({
      q: 'react',
      location: 'izmir',
      modes: ['remote'],
      levels: ['senior'],
      posted: undefined,
      sort: 'salary',
      easy: true,
    })
    expect(parseFilters(filtersToParams(filters))).toEqual(filters)
    expect(filtersToParams(emptyFilters).toString()).toBe('')
  })

  it('keeps remote jobs in a city search and needs a published salary for a salary filter', () => {
    const remote = job({ mode: 'remote', city: 'ankara' })
    expect(matchesFilters(remote, { ...emptyFilters, location: 'izmir' })).toBe(true)
    expect(
      matchesFilters(job({ mode: 'onsite', city: 'ankara' }), {
        ...emptyFilters,
        location: 'izmir',
      }),
    ).toBe(false)
    expect(matchesFilters(job({ salary: null }), { ...emptyFilters, salary: 10_000 })).toBe(false)
    expect(
      matchesFilters(job({ salary: { min: 50_000, max: 80_000 } }), {
        ...emptyFilters,
        salary: 70_000,
      }),
    ).toBe(true)
  })

  it('sorts by age or by pay, with unlisted pay last', () => {
    const newest = searchJobs({ ...emptyFilters, sort: 'newest' })
    expect(newest[0]!.postedMinutesAgo).toBeLessThanOrEqual(newest[1]!.postedMinutesAgo)
    const paid = searchJobs({ ...emptyFilters, sort: 'salary' })
    expect(paid[0]!.salary).not.toBeNull()
    expect(paid.at(-1)!.salary).toBeNull()
  })

  it('counts the skills a profile shares with a job, ignoring case', () => {
    const match = skillMatch(job({ skills: ['React', 'TypeScript', 'GraphQL', 'CSS'] }), [
      'react',
      'CSS',
      'Go',
    ])
    expect(match).toEqual({
      matched: ['React', 'CSS'],
      missing: ['TypeScript', 'GraphQL'],
      percent: 50,
    })
  })
})

describe('profile', () => {
  it('scores the example profile and names what is missing', () => {
    const { percent, missing } = profileCompleteness(seedProfile)
    expect(missing).toEqual(['salary', 'portfolio'])
    expect(percent).toBe(82)
    const complete = profileCompleteness({
      ...seedProfile,
      portfolio: 'https://deniz.example',
      preferences: { ...seedProfile.preferences, salary: 95_000 },
    })
    expect(complete.percent).toBe(100)
  })
})

describe('applications', () => {
  const fresh: Application = {
    id: 'app-test',
    jobId: careersJobs[0]!.id,
    appliedAt: NOW,
    stepMs: MINUTE,
    outcome: 'offer',
    cvName: 'cv.pdf',
    answers: { years: 3, authorized: true, notice: '1month' },
    notes: '',
  }

  it('moves a new application a step a minute, and never gives away the ending', () => {
    expect(applicationState(fresh, NOW).status).toBe('applied')
    expect(applicationState(fresh, NOW + MINUTE).status).toBe('viewed')
    const review = applicationState(fresh, NOW + 2 * MINUTE)
    expect(review.status).toBe('review')
    expect(review.entries.filter((entry) => !entry.reached).map((entry) => entry.stage)).toEqual([
      'interview',
      'decision',
    ])
    const interview = applicationState(fresh, NOW + 5 * MINUTE)
    expect(interview.status).toBe('interview')
    expect(interview.interviewAt).toBe(interviewTime(NOW + 4 * MINUTE))
    // The offer waits for the interview itself.
    expect(applicationState(fresh, NOW + 10 * MINUTE).status).toBe('interview')
    expect(applicationState(fresh, interview.interviewAt! + 4 * 3600_000).status).toBe('offer')
  })

  it('stops at a withdrawal and archives it', () => {
    const withdrawn = { ...fresh, withdrawnAt: NOW + 90_000 }
    const state = applicationState(withdrawn, NOW + DAY)
    expect(state.status).toBe('withdrawn')
    expect(state.archived).toBe(true)
    expect(state.entries.map((entry) => entry.stage)).toEqual(['applied', 'viewed', 'withdrawn'])
  })

  it('follows the employer once they move it by hand', () => {
    const moved = { ...fresh, employerStage: { stage: 'interview' as const, at: NOW + 30_000 } }
    const state = applicationState(moved, NOW + 60_000)
    expect(state.status).toBe('interview')
    expect(state.entries.filter((entry) => entry.reached).map((entry) => entry.stage)).toEqual([
      'applied',
      'viewed',
      'review',
      'interview',
    ])
    expect(employerStageOf(moved, NOW + 60_000)).toBe('interview')

    const rejected = { ...fresh, employerStage: { stage: 'rejected' as const, at: NOW + 90_000 } }
    expect(applicationState(rejected, NOW + DAY).entries.map((entry) => entry.stage)).toEqual([
      'applied',
      'viewed',
      'rejected',
    ])
    expect(employerStageOf({ ...fresh, withdrawnAt: NOW }, NOW + 1)).toBe('withdrawn')
  })

  it('writes the interview as a calendar event with escaped text', () => {
    const ics = interviewIcs(fresh, Date.parse('2026-10-01T11:00:00Z'), 'en', NOW)
    expect(ics).toContain('DTSTART:20261001T110000Z')
    expect(ics).toContain('DTEND:20261001T120000Z')
    expect(ics).toMatch(/SUMMARY:Interview: .+ · /)
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
  })
})

describe('employer postings', () => {
  const draft: PostingDraft = {
    title: 'Platform Engineer',
    category: 'software',
    level: 'senior',
    type: 'fullTime',
    mode: 'remote',
    city: 'istanbul',
    salaryMin: 120_000,
    salaryMax: 100_000,
    showSalary: true,
    about: '',
    responsibilities: '- Own the build\n\n• Keep CI fast',
    requirements: 'Kubernetes',
    skills: ['Go', 'Kubernetes', 'Terraform'],
    benefits: ['health'],
    questions: ['  Why us? ', ''],
    closesOn: '2026-10-28',
    status: 'published',
  }

  it('turns the form into a listing, one line per item', () => {
    const posted = postingToJob(draft, undefined, 'platform-1')
    expect(posted.companyId).toBe(EMPLOYER_COMPANY_ID)
    expect(posted.responsibilities.map((item) => item.en)).toEqual([
      'Own the build',
      'Keep CI fast',
    ])
    expect(posted.salary).toEqual({ min: 120_000, max: 120_000 })
    expect(posted.questions).toEqual(['Why us?'])
    expect(postingToJob({ ...draft, showSalary: false }, undefined, 'x').salary).toBeNull()
  })

  it('shows candidates only published listings, and lets an edit replace a generated one', () => {
    const seed = seedEmployerData(NOW)
    const visible = publicJobs(seed)
    expect(visible.some((item) => item.id === 'draft-sre-orbiton-cloud')).toBe(false)
    const closedId = Object.entries(seed.postings).find(([, info]) => info.status === 'closed')![0]
    expect(visible.some((item) => item.id === closedId)).toBe(false)

    const posted = postingToJob(draft, undefined, 'platform-1')
    const withPosting = {
      ...seed,
      customJobs: [posted, ...seed.customJobs],
      postings: {
        ...seed.postings,
        [posted.id]: { status: 'published' as const, closesOn: '2026-10-28' },
      },
    }
    expect(publicJobs(withPosting).some((item) => item.id === 'platform-1')).toBe(true)

    const original = careersJobs.find((item) => item.companyId === EMPLOYER_COMPANY_ID)!
    const edited = postingToJob({ ...draft, title: 'Renamed' }, original, original.id)
    const all = allJobs({ customJobs: [edited], deletedJobs: [] })
    expect(all.filter((item) => item.id === original.id)).toEqual([edited])
    expect(edited.custom).toBeUndefined()
  })
})
