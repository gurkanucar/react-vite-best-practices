import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getBoard, moveCard } from '@/features/board/services/boardService'
import { applyMove, BOARD_QUERY_KEYS, type Board, type MoveCardInput } from '@/features/board/types'

export function boardQueryOptions() {
  return queryOptions({
    queryKey: BOARD_QUERY_KEYS.board(),
    queryFn: () => getBoard(),
  })
}

export function useBoardQuery() {
  return useQuery(boardQueryOptions())
}

/**
 * A dragged card has to land where it was dropped immediately — waiting half a second for
 * the server would make the board feel broken. So the cache is written first and the
 * request is what might disagree:
 *
 * - `onMutate` cancels any in-flight refetch, snapshots the board, and applies the move.
 *   Without the cancel, a response already on its way would overwrite the optimistic
 *   board with the state from before the drag.
 * - `onError` restores the snapshot, which is the whole reason one is taken.
 * - `onSettled` refetches either way, so the server stays the authority.
 */
export function useMoveCardMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: MoveCardInput) => moveCard(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: BOARD_QUERY_KEYS.board() })

      const previous = queryClient.getQueryData<Board>(BOARD_QUERY_KEYS.board())

      if (previous) {
        queryClient.setQueryData<Board>(BOARD_QUERY_KEYS.board(), {
          ...previous,
          cards: applyMove(previous.cards, input),
        })
      }

      return { previous }
    },
    onError: (_error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(BOARD_QUERY_KEYS.board(), context.previous)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: BOARD_QUERY_KEYS.board() }),
  })
}
