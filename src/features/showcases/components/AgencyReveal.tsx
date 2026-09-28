import type { CSSProperties, ReactNode } from 'react'
import { useAgencyReveal } from '@/features/showcases/hooks/useAgencyReveal'

interface AgencyRevealProps {
  children: ReactNode
  className?: string
  /** Stagger for items revealed together, in milliseconds. */
  delay?: number
}

/** Fades and lifts its content in the first time it scrolls into view. */
export function AgencyReveal({ children, className, delay = 0 }: AgencyRevealProps) {
  const ref = useAgencyReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`agency-reveal${className ? ` ${className}` : ''}`}
      style={delay ? ({ '--agency-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  )
}
