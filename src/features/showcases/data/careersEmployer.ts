import {
  careersJobs,
  type BenefitKey,
  type CareersCategory,
  type City,
  type EmploymentType,
  type ExperienceLevel,
  type Job,
  type WorkMode,
} from '@/features/showcases/data/careers'
import { skillMatch } from '@/features/showcases/data/careersSearch'
import type { EmployerStage } from '@/features/showcases/data/careersProfile'

/** The employer area is run as this company: its listings are the ones you manage. */
export const EMPLOYER_COMPANY_ID = 'orbiton-cloud'
export const employerRecruiter = {
  name: 'Selin Arslan',
  title: { en: 'Talent partner', tr: 'Yetenek iş ortağı' },
}

export const POSTING_STATUSES = ['published', 'draft', 'closed'] as const
export type PostingStatus = (typeof POSTING_STATUSES)[number]

export interface PostingInfo {
  status: PostingStatus
  /** `YYYY-MM-DD`. */
  closesOn: string
}

/** Everything the employer has changed; generated listings need no entry until touched. */
export interface EmployerData {
  customJobs: Job[]
  postings: Record<string, PostingInfo>
  deletedJobs: string[]
  /** Stages of the generated applicants, by `jobId:applicantId`, once moved by hand. */
  applicantStages: Record<string, EmployerStage>
}

const DAY_MS = 24 * 3600 * 1000

function dateKey(ms: number) {
  const date = new Date(ms)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** A listing runs for 30 days from when it was posted. */
export function defaultClosingDate(job: Job, now: number) {
  return dateKey(now - job.postedMinutesAgo * 60_000 + 30 * DAY_MS)
}

export function postingOf(
  job: Job,
  data: Pick<EmployerData, 'postings'>,
  now: number,
): PostingInfo {
  return (
    data.postings[job.id] ?? {
      status: job.custom ? 'draft' : 'published',
      closesOn: defaultClosingDate(job, now),
    }
  )
}

/**
 * Every listing that still exists: the employer's own first, then the generated ones. An
 * edited generated listing is stored as the employer's own under the same id, and hides
 * the original.
 */
export function allJobs(data: Pick<EmployerData, 'customJobs' | 'deletedJobs'>): Job[] {
  const hidden = new Set([...data.deletedJobs, ...data.customJobs.map((job) => job.id)])
  return [...data.customJobs, ...careersJobs.filter((job) => !hidden.has(job.id))].filter(
    (job) => !data.deletedJobs.includes(job.id),
  )
}

/** What candidates can find: published listings only. */
export function publicJobs(data: EmployerData): Job[] {
  return allJobs(data).filter(
    (job) =>
      (data.postings[job.id]?.status ?? (job.custom ? 'draft' : 'published')) === 'published',
  )
}

export function isEmployerJob(job: Job) {
  return job.companyId === EMPLOYER_COMPANY_ID
}

/** The example state: one listing closed early and one draft still being written. */
export function seedEmployerData(now: number): EmployerData {
  const own = careersJobs.filter(isEmployerJob)
  const closed = own[own.length - 1]
  const draft: Job = {
    id: 'draft-sre-orbiton-cloud',
    companyId: EMPLOYER_COMPANY_ID,
    role: 'devops',
    title: { en: 'Senior Site Reliability Engineer', tr: 'Senior Site Reliability Engineer' },
    category: 'software',
    level: 'senior',
    type: 'fullTime',
    mode: 'hybrid',
    city: 'istanbul',
    salary: { min: 150_000, max: 190_000 },
    postedMinutesAgo: 60,
    applicants: 0,
    skills: ['Kubernetes', 'Terraform', 'Observability', 'Linux', 'Go'],
    easyApply: true,
    responsibilities: [
      {
        en: 'Keep our regions up and our on-call calm.',
        tr: 'Bölgelerimizi ayakta, nöbetlerimizi sakin tutmak.',
      },
    ],
    requirements: [
      {
        en: '5+ years running production Kubernetes.',
        tr: 'Canlıda en az 5 yıl Kubernetes deneyimi.',
      },
    ],
    niceToHave: [],
    recruiter: employerRecruiter,
    custom: true,
  }
  return {
    customJobs: [draft],
    postings: {
      [draft.id]: { status: 'draft', closesOn: dateKey(now + 30 * DAY_MS) },
      ...(closed ? { [closed.id]: { status: 'closed', closesOn: dateKey(now - DAY_MS) } } : {}),
    },
    deletedJobs: [],
    applicantStages: {},
  }
}

/* ------------------------------------------------------------ postings */

export interface PostingDraft {
  title: string
  category: CareersCategory
  level: ExperienceLevel
  type: EmploymentType
  mode: WorkMode
  city: City
  salaryMin?: number
  salaryMax?: number
  showSalary: boolean
  about: string
  responsibilities: string
  requirements: string
  skills: string[]
  benefits: BenefitKey[]
  questions: string[]
  closesOn: string
  status: PostingStatus
}

const lines = (text: string) =>
  text
    .split('\n')
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)

/** Written in one language, a posting shows the same words in both. */
const both = (text: string) => ({ en: text, tr: text })

/** Turns the form into a listing. Editing keeps the id, the age and the applicant count. */
export function postingToJob(draft: PostingDraft, previous: Job | undefined, id: string): Job {
  const showSalary = draft.showSalary && draft.salaryMin !== undefined && draft.salaryMin > 0
  const min = draft.salaryMin ?? 0
  return {
    id,
    companyId: EMPLOYER_COMPANY_ID,
    role: previous?.role ?? 'custom',
    title: both(draft.title.trim()),
    category: draft.category,
    level: draft.level,
    type: draft.type,
    mode: draft.mode,
    city: draft.city,
    salary: showSalary ? { min, max: Math.max(min, draft.salaryMax ?? min) } : null,
    postedMinutesAgo: previous?.postedMinutesAgo ?? 1,
    applicants: previous?.applicants ?? 0,
    skills: draft.skills,
    easyApply: true,
    responsibilities: lines(draft.responsibilities).map(both),
    requirements: lines(draft.requirements).map(both),
    niceToHave: previous?.niceToHave ?? [],
    recruiter: previous?.recruiter ?? employerRecruiter,
    about: draft.about.trim() ? both(draft.about.trim()) : undefined,
    benefits: draft.benefits,
    questions: draft.questions.map((question) => question.trim()).filter(Boolean),
    // An edited generated listing keeps its generated applicants.
    custom: previous ? previous.custom : true,
  }
}

export function jobToPosting(job: Job, info: PostingInfo, language: 'en' | 'tr'): PostingDraft {
  return {
    title: job.title[language],
    category: job.category,
    level: job.level,
    type: job.type,
    mode: job.mode,
    city: job.city,
    salaryMin: job.salary?.min,
    salaryMax: job.salary?.max,
    showSalary: job.salary !== null,
    about: job.about?.[language] ?? '',
    responsibilities: job.responsibilities.map((item) => item[language]).join('\n'),
    requirements: job.requirements.map((item) => item[language]).join('\n'),
    skills: job.skills,
    benefits: job.benefits ?? [],
    questions: job.questions ?? [],
    closesOn: info.closesOn,
    status: info.status,
  }
}

export function newPostingId(title: string, now: number) {
  const slug = title
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
  return `${slug || 'job'}-${now.toString(36)}`
}

/** How often a listing has been opened: generated listings start with a believable number. */
export function postingViews(job: Job) {
  if (job.custom) return 0
  let hash = 0
  for (const char of job.id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return job.applicants * 6 + (hash % 180)
}

/* ---------------------------------------------------------- applicants */

export interface Applicant {
  /** `me` is the candidate using the site; everyone else is generated. */
  id: string
  name: string
  headline: string
  city: City
  skills: string[]
  appliedMinutesAgo: number
  years: number
}

const NAMES = [
  'Ece Yalçın',
  'Onur Taş',
  'Melis Kurt',
  'Barış Er',
  'İpek Güneş',
  'Tolga Sezer',
  'Nazlı Aksoy',
  'Cem Uçar',
  'Duygu Polat',
  'Serkan Işık',
  'Gizem Ateş',
  'Umut Bozkurt',
]

function hashOf(text: string) {
  let hash = 2166136261
  for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0
  return hash
}

/**
 * The people who applied to a generated listing: up to eight, the same ones on every visit.
 * A listing written in the employer area has none until someone applies.
 */
export function generatedApplicants(job: Job): Applicant[] {
  if (job.custom) return []
  const count = Math.min(job.applicants, 8)
  const seed = hashOf(job.id)
  return Array.from({ length: count }, (_, index) => {
    const pick = (seed >>> (index % 16)) + index * 7
    // Everyone knows some of the skills; nobody is a perfect copy of the listing.
    const skills = job.skills.filter((_skill, skillIndex) => (pick + skillIndex * 3) % 5 < 3)
    return {
      id: `a${index + 1}`,
      name: NAMES[(seed + index * 5) % NAMES.length]!,
      headline: job.title.en,
      city: (['istanbul', 'ankara', 'izmir'] as const)[pick % 3]!,
      skills,
      // Somewhere between the listing going up and now.
      appliedMinutesAgo: Math.max(
        5,
        Math.round(job.postedMinutesAgo * (((pick * 37) % 95) / 100 + 0.03)),
      ),
      years: 1 + (pick % 9),
    }
  })
}

/** Where a generated applicant starts: most are new, a few are already further along. */
export function defaultApplicantStage(jobId: string, applicantId: string): EmployerStage {
  const roll = hashOf(`${jobId}:${applicantId}`) % 10
  if (roll < 5) return 'new'
  if (roll < 7) return 'screening'
  if (roll < 8) return 'interview'
  if (roll < 9) return 'rejected'
  return 'offer'
}

export function applicantMatch(job: Job, applicant: Applicant) {
  return skillMatch(job, applicant.skills).percent
}
