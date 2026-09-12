import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '@/features/posts/services'
import { POST_MUTATION_KEYS, POST_QUERY_KEYS } from '@/features/posts/types'

export function useCreatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: POST_MUTATION_KEYS.create,
    mutationFn: createPost,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() })
    },
  })
}

export function usePostsMutations() {
  return {
    createPost: useCreatePostMutation(),
  }
}
