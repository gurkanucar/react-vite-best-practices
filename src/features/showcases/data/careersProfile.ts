import {
  careersJobs,
  companyOf,
  findJob,
  type City,
  type JobLocation,
  type WorkMode,
} from '@/features/showcases/data/careers'
import { escapeIcsText, foldIcsLine, icsTimestamp } from '@/features/showcases/data/confIcs'
import type { Language } from '@/store/preferences-store'

/* -------------------------------------------------------------- profile */

export const LANGUAGE_LEVELS = ['native', 'c2', 'c1', 'b2', 'b1', 'a2'] as const
export type LanguageLevel = (typeof LANGUAGE_LEVELS)[number]

export interface Experience {
  title: string
  company: string
  /** `YYYY-MM`. */
  start: string
  /** `YYYY-MM`, or `null` for the current job. */
  end: string | null
  description?: string
}

export interface Education {
  school: string
  degree: string
  start: string
  end: string | null
}

export interface CandidateProfile {
  name: string
  headline: string
  email: string
  phone: string
  city: City
  summary: string
  portfolio: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  languages: { name: string; level: LanguageLevel }[]
  preferences: {
    roles: string[]
    locations: JobLocation[]
    modes: WorkMode[]
    /** Monthly gross TRY; `null` when not given. */
    salary: number | null
    openToWork: boolean
  }
  /** File names only: the demo keeps no files. */
  cvFiles: string[]
}

export const seedProfile: CandidateProfile = {
  name: 'Deniz Yılmaz',
  headline: 'Frontend developer · React & TypeScript',
  email: 'deniz.yilmaz@example.com',
  phone: '+90 555 010 24 68',
  city: 'istanbul',
  summary:
    'Frontend developer with four years of product work, most of it on dashboards and design systems. I care about accessible interfaces and tests that catch real bugs.',
  portfolio: '',
  experience: [
    {
      title: 'Frontend Developer',
      company: 'Kuyruk Labs',
      start: '2023-03',
      end: null,
      description: 'Built the reporting dashboard and moved the design system to TypeScript.',
    },
    {
      title: 'Junior Frontend Developer',
      company: 'Pınar Digital',
      start: '2021-06',
      end: '2023-02',
      description: 'Shipped campaign pages and a component library for three brands.',
    },
  ],
  education: [
    {
      school: 'Ege University',
      degree: 'BSc Computer Engineering',
      start: '2016-09',
      end: '2021-06',
    },
  ],
  skills: ['React', 'TypeScript', 'CSS', 'Testing', 'Figma', 'Accessibility'],
  languages: [
    { name: 'Türkçe', level: 'native' },
    { name: 'English', level: 'c1' },
  ],
  preferences: {
    roles: ['Frontend Engineer', 'Frontend Geliştirici'],
    locations: ['istanbul', 'remote'],
    modes: ['remote', 'hybrid'],
    salary: null,
    openToWork: true,
  },
  cvFiles: ['Deniz_Yilmaz_CV_2026.pdf'],
}

export const COMPLETENESS_CHECKS = [
  'contact',
  'headline',
  'summary',
  'experience',
  'education',
  'skills',
  'languages',
  'preferences',
  'salary',
  'cv',
  'portfolio',
] as const
export type CompletenessCheck = (typeof COMPLETENESS_CHECKS)[number]

/** Each check is worth the same; the ones still missing are the suggestions, in this order. */
export function profileCompleteness(profile: CandidateProfile) {
  const done: Record<CompletenessCheck, boolean> = {
    contact: Boolean(profile.name.trim() && profile.email.trim() && profile.phone.trim()),
    headline: profile.headline.trim().length >= 10,
    summary: profile.summary.trim().length >= 80,
    experience: profile.experience.some((item) => item.title.trim() && item.company.trim()),
    education: profile.education.some((item) => item.school.trim()),
    skills: profile.skills.length >= 5,
    languages: profile.languages.some((item) => item.name.trim()),
    preferences: profile.preferences.roles.length > 0 && profile.preferences.locations.length > 0,
    salary: Boolean(profile.preferences.salary && profile.preferences.salary > 0),
    cv: profile.cvFiles.length > 0,
    portfolio: /^https?:\/\/\S+\.\S+/.test(profile.portfolio.trim()),
  }
  const missing = COMPLETENESS_CHECKS.filter((check) => !done[check])
  return {
    percent: Math.round(
      ((COMPLETENESS_CHECKS.length - missing.length) / COMPLETENESS_CHECKS.length) * 100,
    ),
    done,
    missing,
  }
}

/** Whole years of experience, counting the current job up to now. */
export function yearsOfExperience(profile: CandidateProfile, now: number) {
  const months = profile.experience.reduce((total, item) => {
    const start = Date.parse(`${item.start}-01T00:00:00`)
    const end = item.end ? Date.parse(`${item.end}-01T00:00:00`) : now
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return total
    return total + (end - start) / (30.44 * 24 * 3600 * 1000)
  }, 0)
  return Math.floor(months / 12)
}

/* --------------------------------------------------------- applications */

export type ApplicationOutcome = 'offer' | 'rejected' | 'rejectedEarly'
export type ApplicationStage =
  | 'applied'
  | 'viewed'
  | 'review'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected'
  | 'withdrawn'
  /** A step still to come whose result the candidate cannot know yet. */
  | 'decision'

/** Where the employer has put an applicant; the employer area moves people between these. */
export const EMPLOYER_STAGES = [
  'new',
  'screening',
  'interview',
  'offer',
  'hired',
  'rejected',
] as const
export type EmployerStage = (typeof EMPLOYER_STAGES)[number]

export interface Application {
  id: string
  jobId: string
  appliedAt: number
  /**
   * How long one step of the pipeline takes. A new application moves a step a minute so
   * the demo can be watched; the example ones move a step a day.
   */
  stepMs: number
  outcome: ApplicationOutcome
  withdrawnAt?: number
  /** Set when the employer moves this application by hand; it then stops moving on its own. */
  employerStage?: { stage: EmployerStage; at: number }
  cvName: string
  answers: {
    years: number
    authorized: boolean
    notice: string
    note?: string
    /** Answers to the posting's own screening questions. */
    extra?: { question: string; answer: string }[]
  }
  notes: string
}

/** Steps from applying, in `stepMs`, at which each stage is reached. */
const STAGE_STEPS = { applied: 0, viewed: 1, review: 2, interview: 4, final: 7, early: 3 }

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** The interview is two days after the invitation, at 14:00 local time. */
export function interviewTime(inviteAt: number) {
  const date = new Date(inviteAt + 2 * DAY)
  date.setHours(14, 0, 0, 0)
  return date.getTime()
}

export interface TimelineEntry {
  stage: ApplicationStage
  /** When it happened; `0` for a step still to come. */
  at: number
  reached: boolean
}

export interface ApplicationState {
  entries: TimelineEntry[]
  status: ApplicationStage
  /** Rejected or withdrawn: nothing more will happen. */
  archived: boolean
  interviewAt?: number
}

type Reached = { stage: ApplicationStage; at: number }

/** The stages an untouched application goes through, with when each one happens. */
function plannedStages({ appliedAt, stepMs, outcome }: Application): Reached[] {
  const at = (steps: number) => appliedAt + steps * stepMs
  const planned: Reached[] = [
    { stage: 'applied', at: at(STAGE_STEPS.applied) },
    { stage: 'viewed', at: at(STAGE_STEPS.viewed) },
    { stage: 'review', at: at(STAGE_STEPS.review) },
  ]
  if (outcome === 'rejectedEarly') {
    planned.push({ stage: 'rejected', at: at(STAGE_STEPS.early) })
  } else {
    const inviteAt = at(STAGE_STEPS.interview)
    planned.push({ stage: 'interview', at: inviteAt })
    // A decision after an interview waits for the interview itself.
    planned.push({
      stage: outcome,
      at: Math.max(at(STAGE_STEPS.final), interviewTime(inviteAt) + 3 * HOUR),
    })
  }
  return planned
}

const EMPLOYER_TO_CANDIDATE: Record<EmployerStage, ApplicationStage> = {
  new: 'viewed',
  screening: 'review',
  interview: 'interview',
  offer: 'offer',
  hired: 'hired',
  rejected: 'rejected',
}

const PATH: ApplicationStage[] = ['applied', 'viewed', 'review', 'interview', 'offer', 'hired']
const FINAL: ApplicationStage[] = ['offer', 'hired', 'rejected', 'withdrawn']

/**
 * The stages an application has reached after the employer moved it by hand: what had
 * already happened keeps its time, and the stage it was moved to is dated at the move.
 */
function movedStages(planned: Reached[], moved: { stage: EmployerStage; at: number }): Reached[] {
  const target = EMPLOYER_TO_CANDIDATE[moved.stage]
  const plannedAt = (stage: ApplicationStage) => planned.find((entry) => entry.stage === stage)?.at
  if (target === 'rejected') {
    return [
      ...planned.filter((entry) => entry.at <= moved.at && !FINAL.includes(entry.stage)),
      { stage: 'rejected', at: moved.at },
    ]
  }
  return PATH.slice(0, PATH.indexOf(target) + 1).map((stage) => ({
    stage,
    at: Math.min(plannedAt(stage) ?? moved.at, moved.at),
  }))
}

/**
 * Where an application is, worked out from the time since it was sent, so it moves along on
 * its own without anything stored. Once the employer moves it by hand, that move decides;
 * a withdrawal freezes everything at the moment it happened. Steps still to come never
 * give away how it ends: the last one is just "Decision".
 */
export function applicationState(application: Application, now: number): ApplicationState {
  const cutoff = Math.min(now, application.withdrawnAt ?? Number.POSITIVE_INFINITY)
  const planned = plannedStages(application)
  const moved = application.employerStage
  const reached: Reached[] =
    moved && moved.at <= cutoff
      ? movedStages(planned, moved)
      : planned.filter((entry) => entry.at <= cutoff)
  if (application.withdrawnAt !== undefined && application.withdrawnAt <= now) {
    reached.push({ stage: 'withdrawn', at: application.withdrawnAt })
  }

  const status = reached.at(-1)?.stage ?? 'applied'
  const upcoming: TimelineEntry[] = FINAL.includes(status)
    ? []
    : [
        ...(['applied', 'viewed', 'review', 'interview'] as const)
          .filter((stage) => !reached.some((entry) => entry.stage === stage))
          .map((stage) => ({ stage, at: 0, reached: false })),
        { stage: 'decision', at: 0, reached: false },
      ]
  const invited = reached.find((entry) => entry.stage === 'interview')

  return {
    entries: [...reached.map((entry) => ({ ...entry, reached: true })), ...upcoming],
    status,
    archived: status === 'rejected' || status === 'withdrawn',
    interviewAt: invited ? interviewTime(invited.at) : undefined,
  }
}

/** The employer's view of where the candidate's own application stands. */
export function employerStageOf(
  application: Application,
  now: number,
): EmployerStage | 'withdrawn' {
  const { status } = applicationState(application, now)
  switch (status) {
    case 'withdrawn':
      return 'withdrawn'
    case 'review':
      return 'screening'
    case 'interview':
    case 'offer':
    case 'hired':
    case 'rejected':
      return status
    default:
      return 'new'
  }
}

/** A withdrawal is possible until a decision has been made. */
export function canWithdraw(application: Application, now: number) {
  const { status } = applicationState(application, now)
  return !FINAL.includes(status)
}

export function newApplicationId(jobId: string, now: number) {
  return `app-${jobId.split('-')[0]}-${now.toString(36)}`
}

/**
 * Whether this application will end in an offer is decided when it is sent, from its id, so
 * it never changes on a reload.
 */
export function outcomeFor(id: string): ApplicationOutcome {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return (['offer', 'rejected', 'offer', 'rejectedEarly'] as const)[hash % 4]!
}

/** The example history: one application in every state, for the jobs this profile fits. */
export function seedApplications(now: number): Application[] {
  // Two of them are for the employer area's company, so its applicant lists include this candidate.
  const pick = (role: string, companyId: string) =>
    careersJobs.find((job) => job.role === role && job.companyId === companyId) ??
    careersJobs.find((job) => job.role === role)!
  const answers = { years: 4, authorized: true, notice: '1month' }
  const cvName = seedProfile.cvFiles[0]!
  const make = (
    id: string,
    jobId: string,
    daysAgo: number,
    outcome: ApplicationOutcome,
    extra: Partial<Application> = {},
  ): Application => ({
    id,
    jobId,
    appliedAt: now - daysAgo * DAY,
    stepMs: DAY,
    outcome,
    cvName,
    answers,
    notes: '',
    ...extra,
  })

  return [
    make('seed-applied', pick('frontend', 'pusula-education').id, 0.4, 'offer'),
    make('seed-review', pick('frontend', 'orbiton-cloud').id, 3, 'rejected', {
      notes: 'Asked about the design system migration in the intro call.',
    }),
    make('seed-interview', pick('frontend', 'vela-mobility').id, 5.2, 'offer'),
    make('seed-offer', pick('product-designer', 'kestane-games').id, 9, 'offer'),
    make('seed-rejected', pick('frontend', 'halcyon-travel').id, 8, 'rejectedEarly'),
    make('seed-withdrawn', pick('mobile', 'orbiton-cloud').id, 6, 'rejected', {
      withdrawnAt: now - 4 * DAY,
    }),
  ]
}

/* ------------------------------------------------------------- calendar */

/** A one-event calendar file for the interview, with an hour booked. */
export function interviewIcs(
  application: Application,
  interviewAt: number,
  language: Language,
  now: number,
) {
  const job = findJob(application.jobId)
  const company = job ? companyOf(job).name : ''
  const title = job ? job.title[language] : ''
  const summary =
    language === 'tr' ? `Mülakat: ${title} · ${company}` : `Interview: ${title} · ${company}`
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Workvia//Job platform showcase//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${application.id}@workvia.example`,
    `DTSTAMP:${icsTimestamp(now)}`,
    `DTSTART:${icsTimestamp(interviewAt)}`,
    `DTEND:${icsTimestamp(interviewAt + HOUR)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `LOCATION:${escapeIcsText(language === 'tr' ? 'Görüntülü görüşme' : 'Video call')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return `${lines.map(foldIcsLine).join('\r\n')}\r\n`
}

/* --------------------------------------------------------------- alerts */

export interface JobAlert {
  id: string
  /** The search, as the jobs page's search params. */
  query: string
  createdAt: number
  frequency: 'daily' | 'weekly'
}
