import bay from '@/features/tours/assets/bay.svg'
import cliff from '@/features/tours/assets/cliff.svg'
import desert from '@/features/tours/assets/desert.svg'
import lake from '@/features/tours/assets/lake.svg'
import temple from '@/features/tours/assets/temple.svg'
import village from '@/features/tours/assets/village.svg'
import type { Tour } from '@/features/tours/types'

const allServices = [
  'audioGuide',
  'foodAndDrinks',
  'lunch',
  'privateTour',
  'specialActivities',
  'entranceFees',
  'gratuities',
  'pickUp',
  'professionalGuide',
  'transport',
]

/** Marks the listed ids as included and everything else as not. */
function services(included: string[]) {
  return allServices.map((id) => ({ id, included: included.includes(id) }))
}

const bookerNames = [
  'Lainey Davidson',
  'Cristopher Cardenas',
  'Melanie Noble',
  'Chase Day',
  'Shawn Manning',
  'Soren Durham',
]

function bookers(seed: number): Tour['bookers'] {
  const statuses = ['confirmed', 'pending', 'cancelled'] as const

  return bookerNames.map((name, index) => ({
    id: `bk-${seed}-${index}`,
    name,
    bookedAt: `2026-09-0${((seed + index) % 8) + 1}`,
    guests: ((seed + index) % 3) + 1,
    statusId: statuses[(seed + index) % statuses.length]!,
  }))
}

export const tours: Tour[] = [
  {
    id: 'majestic-mountain',
    nameId: 'mountain',
    countryId: 'unitedStates',
    price: 83.74,
    compareAtPrice: 104.68,
    rating: 4.2,
    reviewCount: 234,
    bookedCount: 12,
    postedAt: '2026-09-12 16:03',
    startsOn: '2026-09-11',
    endsOn: '2026-09-12',
    durationNights: 3,
    status: 'published',
    guides: ['Lucian Obrien', 'Deja Brady'],
    contactPhones: ['+1 416-555-0198', '+44 20 7946 0958'],
    images: [bay, cliff, village, temple, desert],
    highlightIds: ['sunrise', 'guide', 'smallGroup', 'transfers'],
    program: [{ bodyId: 'day1' }, { bodyId: 'day2' }, { bodyId: 'day3' }],
    services: services([
      'lunch',
      'privateTour',
      'specialActivities',
      'entranceFees',
      'gratuities',
      'pickUp',
      'professionalGuide',
      'transport',
    ]),
    bookers: bookers(1),
  },
  {
    id: 'island-hopping',
    nameId: 'island',
    countryId: 'canada',
    price: 97.14,
    compareAtPrice: 121.43,
    rating: 3.7,
    reviewCount: 234,
    bookedCount: 12,
    postedAt: '2026-09-11 15:03',
    startsOn: '2026-09-10',
    endsOn: '2026-09-11',
    durationNights: 3,
    status: 'published',
    guides: ['Lucian Obrien', 'Deja Brady'],
    contactPhones: ['+1 416-555-0198', '+44 20 7946 0958'],
    images: [village, cliff, bay, temple, desert],
    highlightIds: ['sunrise', 'guide', 'smallGroup', 'transfers'],
    program: [{ bodyId: 'day1' }, { bodyId: 'day2' }, { bodyId: 'day3' }],
    services: services([
      'lunch',
      'privateTour',
      'specialActivities',
      'entranceFees',
      'gratuities',
      'pickUp',
      'professionalGuide',
      'transport',
    ]),
    bookers: bookers(2),
  },
  {
    id: 'cultural-wonders',
    nameId: 'cultural',
    countryId: 'unitedKingdom',
    price: 68.71,
    compareAtPrice: 85.89,
    rating: 4.5,
    reviewCount: 188,
    bookedCount: 12,
    postedAt: '2026-09-10 14:03',
    startsOn: '2026-09-09',
    endsOn: '2026-09-10',
    durationNights: 2,
    status: 'published',
    guides: ['Ava Patel'],
    contactPhones: ['+44 20 7946 0958'],
    images: [cliff, bay, lake, village, desert],
    highlightIds: ['museums', 'guide', 'smallGroup'],
    program: [{ bodyId: 'day1' }, { bodyId: 'day2' }],
    services: services(['lunch', 'entranceFees', 'professionalGuide', 'transport']),
    bookers: bookers(3),
  },
  {
    id: 'safari-expedition',
    nameId: 'safari',
    countryId: 'australia',
    price: 85.21,
    compareAtPrice: 106.51,
    rating: 3.5,
    reviewCount: 96,
    bookedCount: 12,
    postedAt: '2026-09-09 13:03',
    startsOn: '2026-09-08',
    endsOn: '2026-09-09',
    durationNights: 4,
    status: 'published',
    guides: ['Noah Williams'],
    contactPhones: ['+61 2 5550 0132'],
    images: [bay, temple, desert, lake, cliff],
    highlightIds: ['wildlife', 'sunrise', 'transfers'],
    program: [{ bodyId: 'day1' }, { bodyId: 'day2' }, { bodyId: 'day3' }],
    services: services(['foodAndDrinks', 'lunch', 'pickUp', 'professionalGuide', 'transport']),
    bookers: bookers(4),
  },
  {
    id: 'canyon-explorer',
    nameId: 'canyon',
    countryId: 'india',
    price: 52.17,
    compareAtPrice: 65.21,
    rating: 4.8,
    reviewCount: 412,
    bookedCount: 12,
    postedAt: '2026-09-08 12:03',
    startsOn: '2026-09-07',
    endsOn: '2026-09-08',
    durationNights: 2,
    status: 'draft',
    guides: ['Maya Chen'],
    contactPhones: ['+91 22 5550 0144'],
    images: [temple, desert, lake, bay, village],
    highlightIds: ['sunrise', 'smallGroup', 'wildlife'],
    program: [{ bodyId: 'day1' }, { bodyId: 'day2' }],
    services: services(['audioGuide', 'lunch', 'entranceFees', 'professionalGuide']),
    bookers: bookers(5),
  },
  {
    id: 'historic-cities',
    nameId: 'historic',
    countryId: 'germany',
    price: 25.18,
    compareAtPrice: 31.48,
    rating: 3,
    reviewCount: 64,
    bookedCount: 12,
    postedAt: '2026-09-07 11:03',
    startsOn: '2026-09-06',
    endsOn: '2026-09-07',
    durationNights: 1,
    status: 'published',
    guides: ['Deja Brady'],
    contactPhones: ['+49 30 5550 0176'],
    images: [desert, cliff, village, lake, temple],
    highlightIds: ['museums', 'guide'],
    program: [{ bodyId: 'day1' }],
    services: services(['audioGuide', 'entranceFees', 'transport']),
    bookers: bookers(6),
  },
]

export function findTour(id: string | undefined): Tour | undefined {
  return tours.find((tour) => tour.id === id)
}

export const tourCountries = [...new Set(tours.map((tour) => tour.countryId))]
