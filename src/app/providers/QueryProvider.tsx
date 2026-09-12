import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { queryClient as applicationQueryClient } from '@/lib/query/query-client'

interface QueryProviderProps extends PropsWithChildren {
  client?: QueryClient
}

export function QueryProvider({ children, client = applicationQueryClient }: QueryProviderProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
