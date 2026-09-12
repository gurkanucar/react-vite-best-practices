import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost, deletePost, updatePost } from '@/features/posts/services'
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

export function useUpdatePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: POST_MUTATION_KEYS.update,
    mutationFn: updatePost,
    onSuccess: async (updatedPost) => {
      // The detail cache holds the authoritative response, so seed it instead of refetching.
      queryClient.setQueryData(POST_QUERY_KEYS.detail(updatedPost.id), updatedPost)
      await queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() })
    },
  })
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: POST_MUTATION_KEYS.remove,
    mutationFn: deletePost,
    onSuccess: async (_result, postId) => {
      queryClient.removeQueries({ queryKey: POST_QUERY_KEYS.detail(postId) })
      await queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() })
    },
  })
}

export function usePostsMutations() {
  return {
    createPost: useCreatePostMutation(),
    updatePost: useUpdatePostMutation(),
    deletePost: useDeletePostMutation(),
  }
}
