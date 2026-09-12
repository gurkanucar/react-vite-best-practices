import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { useBoardQuery, useMoveCardMutation } from '@/features/board/hooks'
import { setFailNextMove } from '@/features/board/services/boardService'
import { BOARD_QUERY_KEYS, type Board, type BoardColumnId } from '@/features/board/types'
import { createQueryClient } from '@/lib/query/query-client'

/**
 * `onSettled` returns the invalidation, so the mutation stays pending until the refetch
 * that follows it has finished too — two service calls at 550ms each, past the one second
 * `waitFor` allows by default.
 */
const SETTLE = { timeout: 4000 }

function renderBoard() {
  const queryClient = createQueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return {
    queryClient,
    ...renderHook(() => ({ board: useBoardQuery(), move: useMoveCardMutation() }), { wrapper }),
  }
}

/**
 * Polling for the optimistic value is a race: under load the first poll can land after
 * the request has already settled, and the test would then pass or fail on timing rather
 * than on behaviour. Recording every value the cache takes removes the race — the order
 * of those values is the behaviour being asserted.
 */
function recordColumnOf(queryClient: QueryClient, cardId: string) {
  const seen: (BoardColumnId | undefined)[] = []
  const read = () =>
    queryClient
      .getQueryData<Board>(BOARD_QUERY_KEYS.board())
      ?.cards.find((card) => card.id === cardId)?.columnId

  const push = () => {
    const value = read()
    if (seen.at(-1) !== value) seen.push(value)
  }

  push()
  const unsubscribe = queryClient.getQueryCache().subscribe(push)

  return { seen, stop: unsubscribe }
}

describe('useMoveCardMutation', () => {
  it('writes the move to the cache before the server answers, and keeps it', async () => {
    setFailNextMove(false)
    const { result, queryClient } = renderBoard()

    await waitFor(() => expect(result.current.board.data).toBeDefined(), SETTLE)

    const track = recordColumnOf(queryClient, 'RVB-118')
    expect(track.seen).toEqual(['backlog'])

    result.current.move.mutate({ cardId: 'RVB-118', toColumnId: 'done', toIndex: 0 })
    await waitFor(() => expect(result.current.move.isSuccess).toBe(true), SETTLE)
    track.stop()

    // One transition only: the optimistic write, which the server then confirmed.
    expect(track.seen).toEqual(['backlog', 'done'])
  })

  it('puts the card back when the server rejects the move', async () => {
    const { result, queryClient } = renderBoard()

    await waitFor(() => expect(result.current.board.data).toBeDefined(), SETTLE)

    const track = recordColumnOf(queryClient, 'RVB-121')
    const origin = track.seen[0]

    setFailNextMove(true)
    result.current.move.mutate({ cardId: 'RVB-121', toColumnId: 'done', toIndex: 0 })
    await waitFor(() => expect(result.current.move.isError).toBe(true), SETTLE)
    setFailNextMove(false)

    await waitFor(() => expect(result.current.move.isPending).toBe(false), SETTLE)
    track.stop()

    // It went to `done` and came back: the snapshot taken in `onMutate` is what returns it.
    expect(track.seen).toEqual([origin, 'done', origin])
  })
})
