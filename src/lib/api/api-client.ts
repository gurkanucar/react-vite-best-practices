import { env } from '@/config/env'

type QueryValue = boolean | number | string | null | undefined

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  baseUrl?: string
  body?: unknown
  query?: Record<string, QueryValue>
  /** `blob` keeps binary responses intact; the default decides from the content type. */
  responseType?: 'auto' | 'blob'
}

export class ApiError extends Error {
  readonly status: number
  readonly details: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function createUrl(path: string, baseUrl: string, query?: Record<string, QueryValue>): string {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '')
  const normalizedPath = path.replace(/^\//, '')
  const url = new URL(`${normalizedBaseUrl}/${normalizedPath}`, window.location.origin)

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

async function parseResponse(
  response: Response,
  responseType: ApiRequestOptions['responseType'],
): Promise<unknown> {
  if (response.status === 204) return undefined
  if (responseType === 'blob') return response.blob()

  const contentType = response.headers.get('content-type')
  return contentType?.includes('application/json') ? response.json() : response.text()
}

export async function apiRequest<T>(
  path: string,
  {
    baseUrl = env.apiBaseUrl,
    body,
    headers,
    query,
    responseType = 'auto',
    ...init
  }: ApiRequestOptions = {},
): Promise<T> {
  const response = await fetch(createUrl(path, baseUrl, query), {
    ...init,
    headers: {
      Accept: responseType === 'blob' ? '*/*' : 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = await parseResponse(response, responseType)

  if (!response.ok) {
    throw new ApiError(`API request failed with status ${response.status}`, response.status, data)
  }

  return data as T
}
