import { useParams } from 'react-router'

/**
 * Route params are strings and carry whatever the address bar contains, so detail and
 * edit pages read their ID through this guard instead of casting and hoping.
 */
export function useNumericRouteParam(name: string): number | null {
  const params = useParams()
  const parsed = Number(params[name])

  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}
