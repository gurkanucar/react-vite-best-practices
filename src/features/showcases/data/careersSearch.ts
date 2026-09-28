import {
  CAREERS_CATEGORIES,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  JOB_LOCATIONS,
  WORK_MODES,
  CITY_NAMES,
  careersJobs,
  companyOf,
  findCompany,
  jobLocation,
  roleTitle,
  type CareersCategory,
  type EmploymentType,
  type ExperienceLevel,
  type Job,
  type JobLocation,
  type WorkMode,
} from '@/features/showcases/data/careers'
import type { CareersCopy } from '@/features/showcases/data/careersCopy'
import type { Language } from '@/store/preferences-store'

/* ----------------------------------------------------------------- text */

/** Lower case with Turkish letters folded, so "gelistirici" finds "Geliştirici". */
export function fold(text: string) {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

function words(text: string) {
  return fold(text)
    .split(/[^a-z0-9+#.]+/)
    .filter(Boolean)
}

/* -------------------------------------------------------------- filters */

export const POSTED_WITHIN = ['1', '7', '30'] as const
export type PostedWithin = (typeof POSTED_WITHIN)[number]

export const SORT_MODES = ['relevance', 'newest', 'salary'] as const
export type SortMode = (typeof SORT_MODES)[number]

export interface JobFilters {
  q: string
  location?: JobLocation
  modes: WorkMode[]
  types: EmploymentType[]
  levels: ExperienceLevel[]
  /** Only jobs whose published range reaches at least this much a month. */
  salary?: number
  posted?: PostedWithin
  company?: string
  category?: CareersCategory
  easy: boolean
  sort: SortMode
}

export const emptyFilters: JobFilters = {
  q: '',
  modes: [],
  types: [],
  levels: [],
  easy: false,
  sort: 'relevance',
}

function oneOf<T extends string>(value: string | null, options: readonly T[]): T | undefined {
  return options.includes(value as T) ? (value as T) : undefined
}

function listOf<T extends string>(value: string | null, options: readonly T[]): T[] {
  if (!value) return []
  return [...new Set(value.split(','))].filter((item): item is T => options.includes(item as T))
}

/** Reads the filters from the address; anything that is not a valid option is dropped. */
export function parseFilters(params: URLSearchParams): JobFilters {
  const salary = Number(params.get('salary'))
  const company = params.get('company')
  return {
    q: (params.get('q') ?? '').slice(0, 80),
    location: oneOf(params.get('location'), JOB_LOCATIONS),
    modes: listOf(params.get('mode'), WORK_MODES),
    types: listOf(params.get('type'), EMPLOYMENT_TYPES),
    levels: listOf(params.get('level'), EXPERIENCE_LEVELS),
    salary: Number.isFinite(salary) && salary > 0 ? salary : undefined,
    posted: oneOf(params.get('posted'), POSTED_WITHIN),
    company: findCompany(company) ? company! : undefined,
    category: oneOf(params.get('category'), CAREERS_CATEGORIES),
    easy: params.get('easy') === '1',
    sort: oneOf(params.get('sort'), SORT_MODES) ?? 'relevance',
  }
}

/** The filters as search params, leaving defaults out so links stay short. */
export function filtersToParams(filters: JobFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.q.trim()) params.set('q', filters.q.trim())
  if (filters.location) params.set('location', filters.location)
  if (filters.modes.length) params.set('mode', filters.modes.join(','))
  if (filters.types.length) params.set('type', filters.types.join(','))
  if (filters.levels.length) params.set('level', filters.levels.join(','))
  if (filters.salary) params.set('salary', String(filters.salary))
  if (filters.posted) params.set('posted', filters.posted)
  if (filters.company) params.set('company', filters.company)
  if (filters.category) params.set('category', filters.category)
  if (filters.easy) params.set('easy', '1')
  if (filters.sort !== 'relevance') params.set('sort', filters.sort)
  return params
}

/** How many filters are set besides the keyword and the sort, for the "Filters (3)" badge. */
export function activeFilterCount(filters: JobFilters) {
  return (
    Number(Boolean(filters.location)) +
    filters.modes.length +
    filters.types.length +
    filters.levels.length +
    Number(Boolean(filters.salary)) +
    Number(Boolean(filters.posted)) +
    Number(Boolean(filters.company)) +
    Number(Boolean(filters.category)) +
    Number(filters.easy)
  )
}

/**
 * How well a job answers the keyword: every word must appear somewhere, and a word in the
 * title counts for more than one in the skills, which counts for more than the company.
 * Zero means "not a match".
 */
export function keywordScore(job: Job, query: string): number {
  const terms = words(query)
  if (terms.length === 0) return 1
  const title = `${fold(job.title.en)} ${fold(job.title.tr)}`
  const skills = fold(job.skills.join(' '))
  const company = fold(
    `${companyOf(job).name} ${companyOf(job).industry.en} ${companyOf(job).industry.tr}`,
  )
  let score = 0
  for (const term of terms) {
    const hit =
      (title.includes(term) ? 3 : 0) +
      (skills.includes(term) ? 2 : 0) +
      (company.includes(term) ? 1 : 0)
    if (hit === 0) return 0
    score += hit
  }
  return score
}

export function matchesFilters(job: Job, filters: JobFilters): boolean {
  if (filters.location) {
    // Remote work is open from any city, so a city search keeps its remote jobs.
    const location = jobLocation(job)
    if (location !== filters.location && location !== 'remote') return false
  }
  if (filters.modes.length && !filters.modes.includes(job.mode)) return false
  if (filters.types.length && !filters.types.includes(job.type)) return false
  if (filters.levels.length && !filters.levels.includes(job.level)) return false
  if (filters.salary && (!job.salary || job.salary.max < filters.salary)) return false
  if (filters.posted && job.postedMinutesAgo > Number(filters.posted) * 24 * 60) return false
  if (filters.company && job.companyId !== filters.company) return false
  if (filters.category && job.category !== filters.category) return false
  if (filters.easy && !job.easyApply) return false
  return true
}

/**
 * The matching jobs in the chosen order. "Relevance" ranks by the keyword, then by how
 * many of the candidate's skills the job asks for, then by age; without a keyword the
 * skills lead.
 */
export function searchJobs(
  filters: JobFilters,
  profileSkills: string[] = [],
  jobs: Job[] = careersJobs,
): Job[] {
  const scored = jobs
    .map((job) => ({ job, score: keywordScore(job, filters.q) }))
    .filter(({ job, score }) => score > 0 && matchesFilters(job, filters))

  const byNewest = (a: Job, b: Job) =>
    a.postedMinutesAgo - b.postedMinutesAgo || a.id.localeCompare(b.id)

  return scored
    .sort((a, b) => {
      if (filters.sort === 'newest') return byNewest(a.job, b.job)
      if (filters.sort === 'salary') {
        const salaryA = a.job.salary?.max ?? -1
        const salaryB = b.job.salary?.max ?? -1
        return salaryB - salaryA || byNewest(a.job, b.job)
      }
      const matchA = skillMatch(a.job, profileSkills).matched.length
      const matchB = skillMatch(b.job, profileSkills).matched.length
      return b.score - a.score || matchB - matchA || byNewest(a.job, b.job)
    })
    .map(({ job }) => job)
}

/* --------------------------------------------------------------- skills */

export interface SkillMatch {
  matched: string[]
  missing: string[]
  /** 0 to 100. */
  percent: number
}

export function skillMatch(job: Job, profileSkills: string[]): SkillMatch {
  const mine = new Set(profileSkills.map(fold))
  const matched = job.skills.filter((skill) => mine.has(fold(skill)))
  const missing = job.skills.filter((skill) => !mine.has(fold(skill)))
  return {
    matched,
    missing,
    percent: job.skills.length ? Math.round((matched.length / job.skills.length) * 100) : 0,
  }
}

/** Jobs that share the most skills with this one, in the same category first. */
export function similarJobs(job: Job, count = 4, jobs: Job[] = careersJobs): Job[] {
  return jobs
    .filter((other) => other.id !== job.id)
    .map((other) => ({
      other,
      score:
        other.skills.filter((skill) => job.skills.includes(skill)).length * 2 +
        (other.role === job.role ? 3 : 0) +
        (other.category === job.category ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.other.postedMinutesAgo - b.other.postedMinutesAgo)
    .slice(0, count)
    .map(({ other }) => other)
}

/** Keyword suggestions: role titles, skills and companies that start with or contain the text. */
export function suggestions(
  text: string,
  sources: { titles: string[]; skills: string[]; companies: string[] },
  limit = 5,
) {
  const needle = fold(text.trim())
  const find = (items: string[]) => {
    if (!needle) return []
    const starts = items.filter((item) => fold(item).startsWith(needle))
    const contains = items.filter((item) => !starts.includes(item) && fold(item).includes(needle))
    return [...starts, ...contains].slice(0, limit)
  }
  return {
    titles: find(sources.titles),
    skills: find(sources.skills),
    companies: find(sources.companies),
  }
}

/* ------------------------------------------------------------- salaries */

export function formatSalary(value: number, language: Language) {
  return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace('TRY', '₺')
}

/** "₺85K–₺110K": a range short enough for a card. */
export function formatSalaryRange(salary: { min: number; max: number }, language: Language) {
  const short = (value: number) =>
    `₺${new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
      maximumFractionDigits: 0,
    }).format(Math.round(value / 1000))}${language === 'tr' ? 'B' : 'K'}`
  return `${short(salary.min)}–${short(salary.max)}`
}

export interface SalaryInsight {
  role: string
  title: Job['title']
  /** Median of the published ranges' lower and upper ends, per level. */
  low: number
  high: number
  jobs: number
}

/** The published pay for a role at mid level, from the listings themselves. */
export function salaryInsight(role: string, jobs: Job[] = careersJobs): SalaryInsight | undefined {
  const published = jobs.filter(
    (job) => job.role === role && job.salary && (job.level === 'mid' || job.level === 'senior'),
  )
  if (published.length === 0) return undefined
  const median = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b)
    const middle = Math.floor(sorted.length / 2)
    return sorted.length % 2 ? sorted[middle]! : (sorted[middle - 1]! + sorted[middle]!) / 2
  }
  return {
    role,
    title: roleTitle(role) ?? published[0]!.title,
    low: median(published.map((job) => job.salary!.min)),
    high: median(published.map((job) => job.salary!.max)),
    jobs: published.length,
  }
}

/* ----------------------------------------------------------- posted at */

export function postedLabel(minutesAgo: number, language: Language) {
  const tr = language === 'tr'
  if (minutesAgo < 60) return tr ? `${minutesAgo} dk önce` : `${minutesAgo} min ago`
  const hours = Math.floor(minutesAgo / 60)
  if (hours < 24) return tr ? `${hours} sa önce` : `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return tr ? 'Dün' : 'Yesterday'
  if (days < 7) return tr ? `${days} gün önce` : `${days} days ago`
  const weeks = Math.floor(days / 7)
  if (days < 30)
    return tr ? `${weeks} hafta önce` : weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  return tr ? '30+ gün önce' : '30+ days ago'
}

/** "React · Istanbul · Remote": a saved search in words. */
export function describeSearch(filters: JobFilters, text: CareersCopy, language: Language) {
  const parts = [
    filters.q,
    filters.location && CITY_NAMES[language][filters.location],
    ...filters.modes.map((mode) => text.modes[mode]),
    ...filters.levels.map((level) => text.levels[level]),
    ...filters.types.map((type) => text.types[type]),
    filters.category && text.categories[filters.category],
    filters.company && findCompany(filters.company)?.name,
    filters.posted && text.posted[filters.posted],
    filters.easy && text.common.easyApply,
  ].filter(Boolean)
  return parts.length ? parts.join(' · ') : text.jobs.allJobs
}
