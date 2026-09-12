export const DOCUMENT_QUERY_KEYS = {
  all: ['documents'] as const,
  files: () => [...DOCUMENT_QUERY_KEYS.all, 'file'] as const,
  file: (path: string) => [...DOCUMENT_QUERY_KEYS.files(), path] as const,
}

export const SAMPLE_DOCUMENT_PATH = '/sample-report.pdf'

export const PDF_ZOOM = { min: 0.5, max: 2.5, step: 0.25 } as const
