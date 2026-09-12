import { queryOptions, useQuery } from '@tanstack/react-query'
import { getFolderTree, listFolder } from '@/features/files/services/filesService'
import { FILE_QUERY_KEYS } from '@/features/files/types'

export function folderQueryOptions(path: string) {
  return queryOptions({
    queryKey: FILE_QUERY_KEYS.folder(path),
    queryFn: () => listFolder(path),
  })
}

export function folderTreeQueryOptions() {
  return queryOptions({
    queryKey: FILE_QUERY_KEYS.tree(),
    queryFn: () => getFolderTree(),
  })
}

export function useFolderQuery(path: string) {
  return useQuery(folderQueryOptions(path))
}

export function useFolderTreeQuery() {
  return useQuery(folderTreeQueryOptions())
}
