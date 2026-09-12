export type AccountTab = 'general' | 'billing' | 'notifications' | 'social' | 'security'

export const ACCOUNT_TABS: AccountTab[] = [
  'general',
  'billing',
  'notifications',
  'social',
  'security',
]

/** ISO 3166-1 alpha-2, which is also the flag component's name. */
export type CountryCode = 'CA' | 'DE' | 'GB' | 'TR' | 'US'

export interface GeneralProfileValues {
  name: string
  email: string
  countryCode: CountryCode
  phone: string
  address: string
  country: CountryCode
  region: string
  city: string
  zip: string
  about: string
  publicProfile: boolean
}

export interface PaymentCard {
  id: string
  /** A translation key under `account.cardBrands`. */
  brandId: string
  last4: string
  expiry: string
  primary: boolean
}

export interface Invoice {
  id: string
  issuedAt: string
  amount: number
  /** A translation key under `account.invoiceStatuses`. */
  statusId: 'paid' | 'pending' | 'overdue'
}

export interface NotificationGroup {
  /** A translation key under `account.notificationGroups`. */
  id: string
  options: NotificationOption[]
}

export interface NotificationOption {
  /** A translation key under `account.notificationOptions`. */
  id: string
  enabled: boolean
}

export const AVATAR_MAX_BYTES = 3 * 1024 * 1024
export const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/gif']

/** `3145728` → `3 MB`, for the upload hint. */
export function megabytes(bytes: number): number {
  return Math.round(bytes / (1024 * 1024))
}
