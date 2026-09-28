import { describe, expect, it } from 'vitest'
import {
  ageGroup,
  featuredPets,
  findPet,
  formatAge,
  pets,
  shelters,
  similarPets,
} from '@/features/showcases/data/pets'
import {
  STAGE_STEP_MS,
  applicationIssues,
  applicationProgress,
  defaultHousehold,
  emptyPetFilters,
  filterPets,
  filtersFromParams,
  filtersToParams,
  isAdult,
  isEmail,
  isTurkishMobile,
  matchPet,
  sortPets,
  type ApplicationValues,
  type Household,
} from '@/features/showcases/data/petsMatch'

const byId = (id: string) => {
  const pet = findPet(id)
  if (!pet) throw new Error(`missing ${id}`)
  return pet
}

describe('adoption catalogue', () => {
  it('has 60+ animals of every species with unique ids and a shelter in their city', () => {
    expect(pets.length).toBeGreaterThanOrEqual(60)
    expect(new Set(pets.map((pet) => pet.id)).size).toBe(pets.length)
    for (const species of ['cat', 'dog', 'rabbit', 'bird'] as const) {
      expect(pets.some((pet) => pet.species === species)).toBe(true)
    }
    for (const pet of pets) {
      const shelter = shelters.find((item) => item.id === pet.shelterId)
      expect(shelter?.cityId).toBe(pet.cityId)
      expect(pet.story.tr).toContain(pet.name)
      expect(pet.story.en).toContain(pet.name)
    }
  })

  it('turns Turkish names into ascii slugs', () => {
    expect(byId('sutlac').name).toBe('Sütlaç')
    expect(byId('tavsan-pitir').name).toBe('Tavşan Pıtır')
  })

  it('groups and formats ages', () => {
    expect(ageGroup(4)).toBe('baby')
    expect(ageGroup(12)).toBe('young')
    expect(ageGroup(40)).toBe('adult')
    expect(ageGroup(96)).toBe('senior')
    expect(formatAge(3, 'en')).toBe('3 months')
    expect(formatAge(18, 'en')).toBe('1 yr 6 mo')
    expect(formatAge(48, 'en')).toBe('4 years')
    expect(formatAge(3, 'tr')).toBe('3 aylık')
    expect(formatAge(18, 'tr')).toBe('1 yaş 6 ay')
    expect(formatAge(48, 'tr')).toBe('4 yaşında')
  })

  it('features a mix of species that are still available', () => {
    const featured = featuredPets(8)
    expect(featured).toHaveLength(8)
    expect(new Set(featured.map((pet) => pet.species)).size).toBe(4)
    expect(featured.every((pet) => pet.status === 'available')).toBe(true)
  })

  it('suggests similar animals of the same species, never the animal itself', () => {
    const pet = byId('pamuk')
    const similar = similarPets(pet)
    expect(similar).toHaveLength(4)
    expect(similar.every((other) => other.species === 'cat' && other.id !== pet.id)).toBe(true)
    expect(similar[0]!.cityId).toBe(pet.cityId)
  })
})

describe('search', () => {
  it('matches names and cities without caring about Turkish letters', () => {
    const found = filterPets(pets, { ...emptyPetFilters, query: 'sutlac' })
    expect(found.map((pet) => pet.name)).toEqual(['Sütlaç'])
    const edirne = filterPets(pets, { ...emptyPetFilters, query: 'edirne' })
    expect(edirne.length).toBeGreaterThan(3)
    expect(edirne.every((pet) => pet.cityId === 'edirne')).toBe(true)
  })

  it('combines filters', () => {
    const found = filterPets(pets, {
      ...emptyPetFilters,
      species: ['dog'],
      goodWith: ['kids', 'cats'],
      apartment: true,
    })
    expect(found.length).toBeGreaterThan(0)
    for (const pet of found) {
      expect(pet.species).toBe('dog')
      expect(pet.goodWith.kids && pet.goodWith.cats).toBe(true)
      expect(pet.apartmentFriendly).toBe(true)
    }
  })

  it('sorts by waiting time, age and name', () => {
    const longest = sortPets(pets, 'longest')
    expect(longest[0]!.waitingDays).toBe(Math.max(...pets.map((pet) => pet.waitingDays)))
    const youngest = sortPets(pets, 'youngest')
    expect(youngest[0]!.ageMonths).toBe(Math.min(...pets.map((pet) => pet.ageMonths)))
    const names = sortPets(pets, 'name').map((pet) => pet.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'tr')))
  })

  it('round-trips filters through the address and drops unknown values', () => {
    const filters = {
      ...emptyPetFilters,
      query: 'kedi',
      species: ['cat' as const],
      city: 'izmir' as const,
      goodWith: ['kids' as const],
      specialNeeds: true,
    }
    const params = filtersToParams(filters, 'youngest', 2)
    expect(params.get('sort')).toBe('youngest')
    expect(params.get('page')).toBe('2')
    expect(filtersFromParams(params)).toEqual(filters)
    expect(filtersFromParams(new URLSearchParams('species=cat,dragon&city=paris'))).toMatchObject({
      species: ['cat'],
      city: null,
    })
  })
})

describe('match', () => {
  const calm: Household = { ...defaultHousehold, activity: 'low', hoursAlone: 4 }

  it('scores a good fit highly', () => {
    const match = matchPet(byId('pamuk'), { ...calm, kids: true })
    expect(match.score).toBe(100)
    expect(match.level).toBe('great')
    expect(match.notes).toContainEqual({ note: 'kidsOk', positive: true })
  })

  it('weighs a clash with other animals heavily', () => {
    // Bulut only gets on with dogs and needs space.
    const match = matchPet(byId('bulut'), { ...calm, cats: true, kids: true })
    expect(match.score).toBeLessThan(40)
    expect(match.level).toBe('low')
    expect(match.notes).toContainEqual({ note: 'catsNo', positive: false })
    expect(match.notes).toContainEqual({ note: 'spaceNo', positive: false })
  })

  it('notices long days alone and missing experience', () => {
    const match = matchPet(byId('sans'), {
      ...defaultHousehold,
      activity: 'low',
      hoursAlone: 10,
      experience: 'none',
    })
    expect(match.notes).toContainEqual({ note: 'aloneLong', positive: false })
    expect(match.notes).toContainEqual({ note: 'needsExperience', positive: false })
    expect(match.score).toBe(65)
  })

  it('never goes below zero', () => {
    const match = matchPet(byId('uludag'), {
      home: 'apartment',
      kids: true,
      cats: true,
      dogs: false,
      hoursAlone: 12,
      activity: 'low',
      experience: 'none',
    })
    expect(match.score).toBe(0)
  })
})

describe('application', () => {
  const valid: ApplicationValues = {
    fullName: 'Elif Demir',
    email: 'elif@example.com',
    phone: '0532 123 45 67',
    birthYear: 1990,
    city: 'istanbul',
    home: 'apartment',
    ownership: 'rent',
    landlordConsent: true,
    kids: false,
    cats: false,
    dogs: false,
    hoursAlone: 6,
    activity: 'low',
    experience: 'some',
    previousPets: '',
    reason: 'I work from home and would love a calm companion for quiet evenings.',
    homeVisit: true,
    followUp: true,
    returnPolicy: true,
  }

  it('validates phone numbers, emails and age', () => {
    expect(isTurkishMobile('0532 123 45 67')).toBe(true)
    expect(isTurkishMobile('+90 (532) 123-45-67')).toBe(true)
    expect(isTurkishMobile('0212 123 45 67')).toBe(false)
    expect(isEmail('a@b.co')).toBe(true)
    expect(isEmail('a@b')).toBe(false)
    expect(isAdult(2008, 2026)).toBe(true)
    expect(isAdult(2009, 2026)).toBe(false)
  })

  it('accepts a complete application', () => {
    expect(applicationIssues(valid, byId('pamuk'), 2026)).toEqual([])
  })

  it('lists everything that blocks an application', () => {
    const issues = applicationIssues(
      {
        ...valid,
        birthYear: 2012,
        phone: '123',
        landlordConsent: false,
        reason: 'Cute',
        followUp: false,
        hoursAlone: 12,
      },
      byId('kartal'),
      2026,
    )
    expect(issues).toEqual([
      'underage',
      'phone',
      'landlord',
      'reason',
      'agreements',
      'tooLongAlone',
    ])
  })

  it('moves through the stages on a timer and decides by score', () => {
    const start = 1_000_000
    expect(applicationProgress(start, 90, start).stage).toBe('submitted')
    expect(applicationProgress(start, 90, start + STAGE_STEP_MS).stage).toBe('review')
    const done = applicationProgress(start, 90, start + STAGE_STEP_MS * 10)
    expect(done.stage).toBe('decision')
    expect(done.outcome).toBe('approved')
    expect(done.reachedAt).toHaveLength(5)
    expect(applicationProgress(start, 30, start + STAGE_STEP_MS * 10).outcome).toBe('waitlist')
    expect(applicationProgress(start, 90, start + STAGE_STEP_MS, true).outcome).toBe('withdrawn')
  })
})
