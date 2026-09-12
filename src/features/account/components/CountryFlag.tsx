import CA from 'country-flag-icons/react/3x2/CA'
import DE from 'country-flag-icons/react/3x2/DE'
import GB from 'country-flag-icons/react/3x2/GB'
import TR from 'country-flag-icons/react/3x2/TR'
import US from 'country-flag-icons/react/3x2/US'
import type { CountryCode } from '@/features/account/types'

const flags = { CA, DE, GB, TR, US } as const satisfies Record<CountryCode, typeof GB>

/** Imported one by one rather than by index, so only the five in use are bundled. */
export function CountryFlag({ code }: { code: CountryCode }) {
  const Flag = flags[code]

  return <Flag aria-hidden="true" className="account-flag" />
}
