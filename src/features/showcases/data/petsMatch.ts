import {
  AGE_GROUPS,
  CITY_IDS,
  COMPANIONS,
  SIZES,
  SPECIES,
  ageGroup,
  breeds,
  cities,
  type AgeGroup,
  type CityId,
  type Companion,
  type Energy,
  type Pet,
  type PetSize,
  type Sex,
  type Species,
} from '@/features/showcases/data/pets'

/* ------------------------------------------------------------------ search */

export type PetSort = 'longest' | 'newest' | 'youngest' | 'oldest' | 'name'
export const PET_SORTS: PetSort[] = ['longest', 'newest', 'youngest', 'oldest', 'name']

export interface PetFilters {
  query: string
  species: Species[]
  ages: AgeGroup[]
  sizes: PetSize[]
  city: CityId | null
  sex: Sex | null
  goodWith: Companion[]
  apartment: boolean
  specialNeeds: boolean
  availableOnly: boolean
}

export const emptyPetFilters: PetFilters = {
  query: '',
  species: [],
  ages: [],
  sizes: [],
  city: null,
  sex: null,
  goodWith: [],
  apartment: false,
  specialNeeds: false,
  availableOnly: false,
}

const fold = (text: string) => text.toLocaleLowerCase('tr').normalize('NFD').replace(/\p{M}/gu, '')

export function filterPets(list: Pet[], filters: PetFilters) {
  const query = fold(filters.query.trim())
  return list.filter((pet) => {
    if (query) {
      const breed = breeds[pet.breed].name
      const haystack = fold(
        [pet.name, breed.en, breed.tr, cities[pet.cityId].en, cities[pet.cityId].tr].join(' '),
      )
      if (!haystack.includes(query)) return false
    }
    if (filters.species.length && !filters.species.includes(pet.species)) return false
    if (filters.ages.length && !filters.ages.includes(ageGroup(pet.ageMonths))) return false
    if (filters.sizes.length && !filters.sizes.includes(pet.size)) return false
    if (filters.city && pet.cityId !== filters.city) return false
    if (filters.sex && pet.sex !== filters.sex) return false
    if (filters.goodWith.some((companion) => !pet.goodWith[companion])) return false
    if (filters.apartment && !pet.apartmentFriendly) return false
    if (filters.specialNeeds && !pet.specialNeed) return false
    if (filters.availableOnly && pet.status !== 'available') return false
    return true
  })
}

export function sortPets(list: Pet[], sort: PetSort) {
  const sorted = [...list]
  switch (sort) {
    case 'longest':
      return sorted.sort((a, b) => b.waitingDays - a.waitingDays)
    case 'newest':
      return sorted.sort((a, b) => a.waitingDays - b.waitingDays)
    case 'youngest':
      return sorted.sort((a, b) => a.ageMonths - b.ageMonths)
    case 'oldest':
      return sorted.sort((a, b) => b.ageMonths - a.ageMonths)
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'tr'))
  }
}

export function countActiveFilters(filters: PetFilters) {
  return (
    filters.species.length +
    filters.ages.length +
    filters.sizes.length +
    filters.goodWith.length +
    Number(Boolean(filters.city)) +
    Number(Boolean(filters.sex)) +
    Number(filters.apartment) +
    Number(filters.specialNeeds) +
    Number(filters.availableOnly)
  )
}

function pick<T extends string>(values: string[], allowed: readonly T[]): T[] {
  return values.filter((value): value is T => (allowed as readonly string[]).includes(value))
}

/** Reads filters from the address, dropping anything it does not know. */
export function filtersFromParams(params: URLSearchParams): PetFilters {
  const list = (key: string) => (params.get(key) ?? '').split(',').filter(Boolean)
  const city = params.get('city')
  const sex = params.get('sex')
  return {
    query: params.get('q') ?? '',
    species: pick(list('species'), SPECIES),
    ages: pick(list('age'), AGE_GROUPS),
    sizes: pick(list('size'), SIZES),
    city: city && (CITY_IDS as string[]).includes(city) ? (city as CityId) : null,
    sex: sex === 'female' || sex === 'male' ? sex : null,
    goodWith: pick(list('with'), COMPANIONS),
    apartment: params.get('apartment') === '1',
    specialNeeds: params.get('special') === '1',
    availableOnly: params.get('available') === '1',
  }
}

export function filtersToParams(filters: PetFilters, sort: PetSort = 'longest', page = 1) {
  const params = new URLSearchParams()
  if (filters.query.trim()) params.set('q', filters.query.trim())
  if (filters.species.length) params.set('species', filters.species.join(','))
  if (filters.ages.length) params.set('age', filters.ages.join(','))
  if (filters.sizes.length) params.set('size', filters.sizes.join(','))
  if (filters.city) params.set('city', filters.city)
  if (filters.sex) params.set('sex', filters.sex)
  if (filters.goodWith.length) params.set('with', filters.goodWith.join(','))
  if (filters.apartment) params.set('apartment', '1')
  if (filters.specialNeeds) params.set('special', '1')
  if (filters.availableOnly) params.set('available', '1')
  if (sort !== 'longest') params.set('sort', sort)
  if (page > 1) params.set('page', String(page))
  return params
}

export function sortFromParams(params: URLSearchParams): PetSort {
  const sort = params.get('sort')
  return (PET_SORTS as string[]).includes(sort ?? '') ? (sort as PetSort) : 'longest'
}

/* ------------------------------------------------------------------- match */

export type HomeType = 'apartment' | 'house' | 'garden'
export type Experience = 'none' | 'some' | 'experienced'

/** What the visitor tells us about their home, used to score a match. */
export interface Household {
  home: HomeType
  kids: boolean
  cats: boolean
  dogs: boolean
  hoursAlone: number
  activity: Energy
  experience: Experience
}

export const defaultHousehold: Household = {
  home: 'apartment',
  kids: false,
  cats: false,
  dogs: false,
  hoursAlone: 6,
  activity: 'medium',
  experience: 'some',
}

export type MatchNote =
  | 'kidsOk'
  | 'kidsNo'
  | 'catsOk'
  | 'catsNo'
  | 'dogsOk'
  | 'dogsNo'
  | 'spaceOk'
  | 'spaceNo'
  | 'energyOk'
  | 'energyGap'
  | 'aloneOk'
  | 'aloneLong'
  | 'needsExperience'
  | 'firstTimeFriendly'

export type MatchLevel = 'great' | 'good' | 'fair' | 'low'

export interface Match {
  score: number
  level: MatchLevel
  notes: { note: MatchNote; positive: boolean }[]
}

/** Hours an animal can comfortably be left alone on a normal day. */
export const aloneLimit: Record<Species, number> = { dog: 6, cat: 10, rabbit: 8, bird: 8 }

const energyRank: Record<Energy, number> = { low: 0, medium: 1, high: 2 }

/**
 * A 0–100 score of how well an animal suits a household. It is a conversation starter, not a
 * verdict: the shelter still meets every family. Hard clashes (a cat-shy dog in a home with
 * cats) weigh most; softer ones (energy, hours alone) less.
 */
export function matchPet(pet: Pet, household: Household): Match {
  const notes: Match['notes'] = []
  let score = 100
  const companion = (
    present: boolean,
    ok: boolean,
    yes: MatchNote,
    no: MatchNote,
    cost: number,
  ) => {
    if (!present) return
    if (ok) notes.push({ note: yes, positive: true })
    else {
      score -= cost
      notes.push({ note: no, positive: false })
    }
  }
  companion(household.kids, pet.goodWith.kids, 'kidsOk', 'kidsNo', 40)
  companion(household.cats, pet.goodWith.cats, 'catsOk', 'catsNo', pet.species === 'bird' ? 50 : 35)
  companion(household.dogs, pet.goodWith.dogs, 'dogsOk', 'dogsNo', 35)

  if (household.home === 'apartment' && !pet.apartmentFriendly) {
    score -= 25
    notes.push({ note: 'spaceNo', positive: false })
  } else notes.push({ note: 'spaceOk', positive: true })

  const gap = Math.abs(energyRank[pet.energy] - energyRank[household.activity])
  if (gap === 0) notes.push({ note: 'energyOk', positive: true })
  else {
    score -= gap * 15
    notes.push({ note: 'energyGap', positive: false })
  }

  if (household.hoursAlone > aloneLimit[pet.species]) {
    score -= 20
    notes.push({ note: 'aloneLong', positive: false })
  } else notes.push({ note: 'aloneOk', positive: true })

  const demanding = Boolean(pet.specialNeed) || (pet.species === 'dog' && pet.ageMonths < 12)
  if (demanding && household.experience === 'none') {
    score -= 15
    notes.push({ note: 'needsExperience', positive: false })
  } else if (!demanding && household.experience === 'none') {
    notes.push({ note: 'firstTimeFriendly', positive: true })
  }

  score = Math.max(0, Math.min(100, score))
  const level: MatchLevel =
    score >= 80 ? 'great' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'low'
  return { score, level, notes }
}

export function matchesAtLeast(pet: Pet, household: Household, minimum: number) {
  return matchPet(pet, household).score >= minimum
}

/* ------------------------------------------------------------- application */

export interface ApplicationValues {
  fullName: string
  email: string
  phone: string
  birthYear: number
  city: CityId
  home: HomeType
  ownership: 'own' | 'rent'
  landlordConsent: boolean
  kids: boolean
  cats: boolean
  dogs: boolean
  hoursAlone: number
  activity: Energy
  experience: Experience
  previousPets: string
  reason: string
  homeVisit: boolean
  followUp: boolean
  returnPolicy: boolean
}

export type ApplicationIssue =
  | 'underage'
  | 'phone'
  | 'email'
  | 'landlord'
  | 'reason'
  | 'agreements'
  | 'tooLongAlone'

export const MIN_REASON_LENGTH = 40

export function isAdult(birthYear: number, currentYear: number) {
  return currentYear - birthYear >= 18
}

/** Turkish mobile numbers: +90 or 0, then 5xx and seven digits; spaces and dashes are fine. */
export function isTurkishMobile(phone: string) {
  const digits = phone.replace(/[\s()-]/g, '')
  return /^(\+90|0)?5\d{9}$/.test(digits)
}

export function isEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

/**
 * Everything that would stop a volunteer from moving an application forward. The form shows
 * the same rules per field; this is the final check before it is saved.
 */
export function applicationIssues(
  values: ApplicationValues,
  pet: Pet,
  currentYear: number,
): ApplicationIssue[] {
  const issues: ApplicationIssue[] = []
  if (!isAdult(values.birthYear, currentYear)) issues.push('underage')
  if (!isTurkishMobile(values.phone)) issues.push('phone')
  if (!isEmail(values.email)) issues.push('email')
  if (values.ownership === 'rent' && !values.landlordConsent) issues.push('landlord')
  if (values.reason.trim().length < MIN_REASON_LENGTH) issues.push('reason')
  if (!values.homeVisit || !values.followUp || !values.returnPolicy) issues.push('agreements')
  if (values.hoursAlone > aloneLimit[pet.species] + 4) issues.push('tooLongAlone')
  return issues
}

export function householdFrom(values: ApplicationValues): Household {
  return {
    home: values.home,
    kids: values.kids,
    cats: values.cats,
    dogs: values.dogs,
    hoursAlone: values.hoursAlone,
    activity: values.activity,
    experience: values.experience,
  }
}

/* ------------------------------------------------------------ status mock */

export type ApplicationStage = 'submitted' | 'review' | 'call' | 'meet' | 'decision'
export const APPLICATION_STAGES: ApplicationStage[] = [
  'submitted',
  'review',
  'call',
  'meet',
  'decision',
]

/** How long the demo waits before each next step, so a visitor can watch it move. */
export const STAGE_STEP_MS = 90_000

export interface ApplicationProgress {
  stage: ApplicationStage
  index: number
  outcome: 'pending' | 'approved' | 'waitlist' | 'withdrawn'
  /** When each reached stage was reached. */
  reachedAt: number[]
}

/**
 * Where a mock application stands at `now`. Stages advance on a timer; at the decision a
 * strong match is approved and a weak one waitlisted, so both outcomes can be seen.
 */
export function applicationProgress(
  submittedAt: number,
  score: number,
  now: number,
  withdrawn = false,
): ApplicationProgress {
  const elapsed = Math.max(0, now - submittedAt)
  const index = Math.min(APPLICATION_STAGES.length - 1, Math.floor(elapsed / STAGE_STEP_MS))
  const reachedAt = Array.from(
    { length: index + 1 },
    (_, step) => submittedAt + step * STAGE_STEP_MS,
  )
  const decided = index === APPLICATION_STAGES.length - 1
  const outcome = withdrawn
    ? 'withdrawn'
    : decided
      ? score >= 60
        ? 'approved'
        : 'waitlist'
      : 'pending'
  return { stage: APPLICATION_STAGES[index]!, index, outcome, reachedAt }
}
