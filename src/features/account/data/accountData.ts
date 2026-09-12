import type {
  CountryCode,
  GeneralProfileValues,
  Invoice,
  NotificationGroup,
  PaymentCard,
} from '@/features/account/types'

export const countries: CountryCode[] = ['CA', 'DE', 'GB', 'TR', 'US']

/** Dial codes for the phone field's country prefix. */
export const dialCodes: Record<CountryCode, string> = {
  CA: '+1',
  DE: '+49',
  GB: '+44',
  TR: '+90',
  US: '+1',
}

export const generalDefaults: GeneralProfileValues = {
  name: 'Jaydon Frankie',
  email: 'jaydon.frankie@example.com',
  countryCode: 'CA',
  phone: '(416) 555-0198',
  address: '90210 Broadway Blvd',
  country: 'CA',
  region: 'Ontario',
  city: 'Toronto',
  zip: 'M5H 2N2',
  about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
  publicProfile: true,
}

export const paymentCards: PaymentCard[] = [
  { id: 'card-1', brandId: 'visa', last4: '4242', expiry: '04/29', primary: true },
  { id: 'card-2', brandId: 'mastercard', last4: '5309', expiry: '11/27', primary: false },
]

export const invoices: Invoice[] = [
  { id: 'INV-2026-009', issuedAt: '2026-09-01', amount: 89, statusId: 'paid' },
  { id: 'INV-2026-008', issuedAt: '2026-08-01', amount: 89, statusId: 'paid' },
  { id: 'INV-2026-007', issuedAt: '2026-07-01', amount: 89, statusId: 'paid' },
  { id: 'INV-2026-006', issuedAt: '2026-06-01', amount: 49, statusId: 'overdue' },
  { id: 'INV-2026-005', issuedAt: '2026-05-01', amount: 49, statusId: 'paid' },
]

export const notificationGroups: NotificationGroup[] = [
  {
    id: 'activity',
    options: [
      { id: 'comments', enabled: true },
      { id: 'answers', enabled: false },
      { id: 'mentions', enabled: true },
    ],
  },
  {
    id: 'application',
    options: [
      { id: 'news', enabled: true },
      { id: 'productUpdates', enabled: false },
      { id: 'blogDigest', enabled: false },
    ],
  },
]

export const socialDefaults = {
  facebook: 'https://www.facebook.com/example',
  instagram: 'https://www.instagram.com/example',
  linkedin: 'https://www.linkedin.com/in/example',
  twitter: 'https://www.twitter.com/example',
}
