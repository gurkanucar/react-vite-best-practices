import type { Language } from '@/store/preferences-store'

export interface LocalizedText {
  en: string
  tr: string
}

export interface PublicationImage {
  src: string
  alt: LocalizedText
  caption?: LocalizedText
}

export interface PublicationAttachment {
  name: LocalizedText
  href: string
  format: string
  size: string
}

export interface Publication {
  slug: string
  title: LocalizedText
  summary: LocalizedText
  body: LocalizedText[]
  category: LocalizedText
  date: string
  readingTime?: LocalizedText
  coverImage?: PublicationImage
  tags?: LocalizedText[]
  attachments?: PublicationAttachment[]
  gallery?: PublicationImage[]
}

export function localize(value: LocalizedText, language: Language): string {
  return value[language]
}

export type CompanySector =
  | 'ai'
  | 'agritech'
  | 'climate'
  | 'cybersecurity'
  | 'energy'
  | 'fintech'
  | 'health'
  | 'industrial'
  | 'materials'
  | 'mobility'
  | 'robotics'
  | 'space'

export type CompanyStage = 'seed' | 'seriesA' | 'seriesB' | 'growth' | 'scaleUp'

export interface ResidentCompany {
  slug: string
  /** A brand name is a proper noun, so it is the one field that is not translated. */
  name: string
  sector: CompanySector
  stage: CompanyStage
  founded: number
  /** The year the team moved onto the campus, which is never before it existed. */
  joined: number
  headcount: number
  /** Which of the six campus buildings the team sits in. */
  building: string
  hiring: boolean
  openRoles: number
}

/**
 * A teaser, not an article: the landing page shows the headline and the date, and a real
 * site would link each one to a detail route of its own.
 */
export interface CampusUpdate {
  id: string
  kind: 'news' | 'announcement'
  title: LocalizedText
  summary: LocalizedText
  category: LocalizedText
  date: string
  /**
   * Optional on purpose. Most newsrooms have a picture for the launch and nothing for the
   * maintenance notice, so the card has to look finished either way.
   */
  image?: PublicationImage
}
