import { useSearchParams } from 'react-router'
import {
  DEFAULT_POST_FILTERS,
  isPostSortField,
  type PostFilterParams,
  type SortDirection,
} from '@/features/posts/types'

export interface PostFilterValues {
  authors: number[]
  categories: string[]
  maxViews?: number
  minViews?: number
  order?: SortDirection
  publishedFrom?: string
  publishedTo?: string
  search: string
  sortBy?: PostFilterParams['sortBy']
}

export type PostFilterPatch = Record<string, string | undefined>

/**
 * Every filter lives in the address bar, so a filtered table can be linked, reloaded,
 * and walked back through with the browser's own history. Nothing is mirrored into
 * component state, which keeps the URL the only source of truth.
 */
export function usePostFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const readList = (name: string) => searchParams.get(name)?.split(',').filter(Boolean) ?? []
  const readNumber = (name: string) => {
    const value = Number(searchParams.get(name))
    return searchParams.get(name) && Number.isFinite(value) ? value : undefined
  }

  const sortParam = searchParams.get('sort')
  const sortBy = isPostSortField(sortParam) ? sortParam : undefined
  const values: PostFilterValues = {
    authors: readList('authors').map(Number).filter(Number.isInteger),
    categories: readList('categories'),
    maxViews: readNumber('maxViews'),
    minViews: readNumber('minViews'),
    order: sortBy ? (searchParams.get('order') === 'desc' ? 'desc' : 'asc') : undefined,
    publishedFrom: searchParams.get('from') ?? undefined,
    publishedTo: searchParams.get('to') ?? undefined,
    search: searchParams.get('q')?.trim() ?? '',
    sortBy,
  }

  const filters: PostFilterParams = {
    authors: values.authors.length > 0 ? values.authors : undefined,
    categories: values.categories.length > 0 ? values.categories : undefined,
    limit: DEFAULT_POST_FILTERS.limit,
    maxViews: values.maxViews,
    minViews: values.minViews,
    order: values.order,
    publishedFrom: values.publishedFrom,
    publishedTo: values.publishedTo,
    search: values.search || undefined,
    sortBy: values.sortBy,
  }

  const updateFilters = (patch: PostFilterPatch) => {
    const nextParams = new URLSearchParams(searchParams)

    for (const [name, value] of Object.entries(patch)) {
      if (value) {
        nextParams.set(name, value)
      } else {
        nextParams.delete(name)
      }
    }

    setSearchParams(nextParams)
  }

  const clearFilters = () => setSearchParams(new URLSearchParams())

  return {
    clearFilters,
    filters,
    hasActiveFilters: [...searchParams.keys()].length > 0,
    updateFilters,
    values,
  }
}
