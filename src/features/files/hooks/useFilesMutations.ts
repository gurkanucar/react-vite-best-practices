import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createFolder,
  deleteNodes,
  renameNode,
  uploadFile,
} from '@/features/files/services/filesService'
import { FILE_QUERY_KEYS } from '@/features/files/types'

/**
 * Every one of these can change both the listing and the folder tree — a rename moves
 * descendants, a delete removes a whole subtree — so they invalidate the feature's root
 * key rather than trying to predict which listings went stale.
 */
function useFilesInvalidation() {
  const queryClient = useQueryClient()

  return () => queryClient.invalidateQueries({ queryKey: FILE_QUERY_KEYS.all })
}

export function useCreateFolderMutation() {
  const invalidate = useFilesInvalidation()

  return useMutation({
    mutationFn: ({ parentPath, name }: { parentPath: string; name: string }) =>
      createFolder(parentPath, name),
    onSuccess: invalidate,
  })
}

export function useUploadFileMutation() {
  const invalidate = useFilesInvalidation()

  return useMutation({
    mutationFn: ({ parentPath, name, size }: { parentPath: string; name: string; size: number }) =>
      uploadFile(parentPath, name, size),
    onSuccess: invalidate,
  })
}

export function useRenameNodeMutation() {
  const invalidate = useFilesInvalidation()

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => renameNode(id, name),
    onSuccess: invalidate,
  })
}

export function useDeleteNodesMutation() {
  const invalidate = useFilesInvalidation()

  return useMutation({
    mutationFn: (ids: string[]) => deleteNodes(ids),
    onSuccess: invalidate,
  })
}
