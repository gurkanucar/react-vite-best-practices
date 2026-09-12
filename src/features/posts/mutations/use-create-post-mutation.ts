import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '@/features/posts/api/posts-api'
import { postMutationKeys, postQueryKeys } from '@/features/posts/queries/post-query-keys'

export function useCreatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: postMutationKeys.create,
    mutationFn: createPost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postQueryKeys.lists() })
    },
  })
}
