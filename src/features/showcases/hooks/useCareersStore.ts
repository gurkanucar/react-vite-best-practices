import { useMemo } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { Job } from '@/features/showcases/data/careers'
import {
  allJobs,
  newPostingId,
  publicJobs,
  seedEmployerData,
  type EmployerData,
  type PostingInfo,
  type PostingStatus,
} from '@/features/showcases/data/careersEmployer'
import {
  newApplicationId,
  outcomeFor,
  seedApplications,
  seedProfile,
  type Application,
  type CandidateProfile,
  type EmployerStage,
  type JobAlert,
} from '@/features/showcases/data/careersProfile'

export const careersStorageKey = 'rvbp-talent'

interface CareersData extends EmployerData {
  profile: CandidateProfile
  savedJobs: string[]
  viewedJobs: string[]
  followedCompanies: string[]
  applications: Application[]
  alerts: JobAlert[]
}

interface CareersState extends CareersData {
  toggleSaved: (jobId: string) => void
  markViewed: (jobId: string) => void
  toggleFollow: (companyId: string) => void
  apply: (values: Pick<Application, 'jobId' | 'cvName' | 'answers'>) => Application
  withdraw: (applicationId: string) => void
  setNotes: (applicationId: string, notes: string) => void
  updateProfile: (profile: CandidateProfile) => void
  addAlert: (query: string, frequency?: JobAlert['frequency']) => JobAlert | null
  removeAlert: (alertId: string) => void
  setAlertFrequency: (alertId: string, frequency: JobAlert['frequency']) => void
  savePosting: (job: Job, info: PostingInfo) => void
  /** Saves a copy as a new draft and returns its id. */
  duplicatePosting: (job: Job, title: string, closesOn: string) => string
  setPostingStatus: (jobId: string, status: PostingStatus, closesOn: string) => void
  deletePosting: (jobId: string) => void
  /** Moves an applicant; `me` is the candidate using the site, whose application follows. */
  setApplicantStage: (jobId: string, applicantId: string, stage: EmployerStage) => void
  reset: () => void
}

export function createInitialCareersData(now = Date.now()): CareersData {
  const applications = seedApplications(now)
  return {
    profile: seedProfile,
    savedJobs: [],
    viewedJobs: applications.map((application) => application.jobId),
    followedCompanies: [],
    applications,
    alerts: [],
    ...seedEmployerData(now),
  }
}

const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((item) => item !== id) : [id, ...list]

export const useCareersStore = create<CareersState>()(
  persist(
    (set, get) => ({
      ...createInitialCareersData(),
      toggleSaved: (jobId) => set((state) => ({ savedJobs: toggle(state.savedJobs, jobId) })),
      markViewed: (jobId) =>
        set((state) =>
          state.viewedJobs.includes(jobId)
            ? state
            : { viewedJobs: [jobId, ...state.viewedJobs].slice(0, 200) },
        ),
      toggleFollow: (companyId) =>
        set((state) => ({ followedCompanies: toggle(state.followedCompanies, companyId) })),
      apply: ({ jobId, cvName, answers }) => {
        const now = Date.now()
        const id = newApplicationId(jobId, now)
        const application: Application = {
          id,
          jobId,
          appliedAt: now,
          stepMs: 60_000,
          outcome: outcomeFor(id),
          cvName,
          answers,
          notes: '',
        }
        set((state) => ({
          applications: [application, ...state.applications.filter((item) => item.jobId !== jobId)],
          profile: state.profile.cvFiles.includes(cvName)
            ? state.profile
            : { ...state.profile, cvFiles: [...state.profile.cvFiles, cvName] },
          // A listing written in the employer area counts its applicants for real.
          customJobs: state.customJobs.map((job) =>
            job.id === jobId ? { ...job, applicants: job.applicants + 1 } : job,
          ),
        }))
        return application
      },
      withdraw: (applicationId) =>
        set((state) => ({
          applications: state.applications.map((application) =>
            application.id === applicationId && application.withdrawnAt === undefined
              ? { ...application, withdrawnAt: Date.now() }
              : application,
          ),
        })),
      setNotes: (applicationId, notes) =>
        set((state) => ({
          applications: state.applications.map((application) =>
            application.id === applicationId ? { ...application, notes } : application,
          ),
        })),
      updateProfile: (profile) => set({ profile }),
      addAlert: (query, frequency = 'daily') => {
        if (get().alerts.some((alert) => alert.query === query)) return null
        const alert: JobAlert = {
          id: `alert-${Date.now().toString(36)}`,
          query,
          createdAt: Date.now(),
          frequency,
        }
        set((state) => ({ alerts: [alert, ...state.alerts] }))
        return alert
      },
      removeAlert: (alertId) =>
        set((state) => ({ alerts: state.alerts.filter((alert) => alert.id !== alertId) })),
      setAlertFrequency: (alertId, frequency) =>
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === alertId ? { ...alert, frequency } : alert,
          ),
        })),
      savePosting: (job, info) =>
        set((state) => ({
          customJobs: state.customJobs.some((item) => item.id === job.id)
            ? state.customJobs.map((item) => (item.id === job.id ? job : item))
            : [job, ...state.customJobs],
          postings: { ...state.postings, [job.id]: info },
        })),
      duplicatePosting: (job, title, closesOn) => {
        const id = newPostingId(title, Date.now())
        get().savePosting(
          {
            ...job,
            id,
            title: { en: title, tr: title },
            applicants: 0,
            postedMinutesAgo: 1,
            custom: true,
          },
          { status: 'draft', closesOn },
        )
        return id
      },
      setPostingStatus: (jobId, status, closesOn) =>
        set((state) => ({ postings: { ...state.postings, [jobId]: { status, closesOn } } })),
      deletePosting: (jobId) =>
        set((state) => ({
          customJobs: state.customJobs.filter((job) => job.id !== jobId),
          deletedJobs: state.deletedJobs.includes(jobId)
            ? state.deletedJobs
            : [...state.deletedJobs, jobId],
          savedJobs: state.savedJobs.filter((id) => id !== jobId),
        })),
      setApplicantStage: (jobId, applicantId, stage) =>
        set((state) =>
          applicantId === 'me'
            ? {
                applications: state.applications.map((application) =>
                  application.jobId === jobId && application.withdrawnAt === undefined
                    ? { ...application, employerStage: { stage, at: Date.now() } }
                    : application,
                ),
              }
            : { applicantStages: { ...state.applicantStages, [`${jobId}:${applicantId}`]: stage } },
        ),
      reset: () => set(createInitialCareersData()),
    }),
    {
      name: careersStorageKey,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({
        profile,
        savedJobs,
        viewedJobs,
        followedCompanies,
        applications,
        alerts,
        customJobs,
        postings,
        deletedJobs,
        applicantStages,
      }) => ({
        profile,
        savedJobs,
        viewedJobs,
        followedCompanies,
        applications,
        alerts,
        customJobs,
        postings,
        deletedJobs,
        applicantStages,
      }),
      // Nothing older than version 1 exists; anything unrecognised starts from the seed.
      migrate: (persisted, version) =>
        (version === 1 ? persisted : createInitialCareersData()) as CareersData,
    },
  ),
)

/** Whether the candidate has an application for this job that they have not withdrawn. */
export function useApplicationFor(jobId: string | undefined) {
  return useCareersStore((state) =>
    jobId
      ? state.applications.find(
          (application) => application.jobId === jobId && application.withdrawnAt === undefined,
        )
      : undefined,
  )
}

/**
 * The listings as the site sees them: every one that exists (for the employer and for a
 * direct link), the published ones (for search), and a lookup by id.
 */
export function useCareersJobs() {
  const data = useCareersStore(
    useShallow((state) => ({
      customJobs: state.customJobs,
      postings: state.postings,
      deletedJobs: state.deletedJobs,
      applicantStages: state.applicantStages,
    })),
  )
  return useMemo(() => {
    const all = allJobs(data)
    const byId = new Map(all.map((job) => [job.id, job]))
    return {
      all,
      published: publicJobs(data),
      find: (id: string | null | undefined) => (id ? byId.get(id) : undefined),
      isPublished: (job: Job) =>
        (data.postings[job.id]?.status ?? (job.custom ? 'draft' : 'published')) === 'published',
    }
  }, [data])
}
