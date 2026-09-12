import { queryOptions, useQuery } from '@tanstack/react-query'
import { getDocument } from '@/features/documents/api'
import { DOCUMENT_QUERY_KEYS } from '@/features/documents/types'

export function documentQueryOptions(path: string) {
  return queryOptions({
    queryFn: ({ signal }) => getDocument(path, signal),
    queryKey: DOCUMENT_QUERY_KEYS.file(path),
    staleTime: 5 * 60 * 1000,
  })
}

export function useDocumentQuery(path: string) {
  return useQuery(documentQueryOptions(path))
}

/**
 * An object URL is a handle the browser keeps alive until it is revoked, so it is
 * created when the reader asks for the file and released immediately afterwards.
 * Holding one for the lifetime of the page would pin the whole blob in memory.
 */
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  link.click()

  URL.revokeObjectURL(url)
}
