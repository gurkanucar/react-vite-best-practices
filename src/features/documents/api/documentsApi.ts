import { apiRequest } from '@/lib/api/api-client'

/**
 * Documents are fetched through the same client as every other request, so an
 * authenticated endpoint would work unchanged — the browser's own PDF plugin cannot
 * send headers, which is the reason to render the file ourselves.
 */
export function getDocument(path: string, signal?: AbortSignal): Promise<Blob> {
  return apiRequest<Blob>(path, {
    baseUrl: window.location.origin,
    responseType: 'blob',
    signal,
  })
}
