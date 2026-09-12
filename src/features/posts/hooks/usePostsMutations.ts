import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '@/features/posts/api/postsApi'
import { postQueryKeys } from '@/features/posts/hooks/usePostsQueries'

export const postMutationKeys = {
  create: [...postQueryKeys.all, 'create'] as const,
}

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

export function usePostsMutations() {
  return {
    createPost: useCreatePostMutation(),
  }
}
