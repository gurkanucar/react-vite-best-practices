import { Suspense, type ReactNode } from 'react'
import { RouteLoading } from '@/components/RouteLoading/RouteLoading'

interface RouteSuspenseProps {
  children: ReactNode
  fullPage?: boolean
}

export function RouteSuspense({ children, fullPage = false }: RouteSuspenseProps) {
  return <Suspense fallback={<RouteLoading fullPage={fullPage} />}>{children}</Suspense>
}
