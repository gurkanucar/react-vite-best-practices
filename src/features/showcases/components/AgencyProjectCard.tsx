import type { CSSProperties, PointerEvent } from 'react'
import { Link } from 'react-router'
import { AgencyArtwork } from '@/features/showcases/components/AgencyArtwork'
import type { CaseStudy } from '@/features/showcases/data/agency'
import { useAgencyCopy } from '@/features/showcases/hooks/useAgencyCopy'

interface AgencyProjectCardProps {
  study: CaseStudy
  root: string
  /** Position in the grid, for the staggered entrance. */
  index?: number
  className?: string
}

/**
 * A project in a grid. On a pointer device the artwork eases in and a round "View" badge
 * follows the cursor; on touch the card is a plain link with its caption below.
 */
export function AgencyProjectCard({ study, root, index = 0, className }: AgencyProjectCardProps) {
  const { text, language } = useAgencyCopy()

  const follow = (event: PointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--agency-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--agency-y', `${event.clientY - rect.top}px`)
  }

  return (
    <Link
      to={`${root}/work/${study.id}`}
      className={`agency-project${className ? ` ${className}` : ''}`}
      style={{ '--agency-index': index } as CSSProperties}
      onPointerMove={follow}
    >
      <div className="agency-project__media">
        <AgencyArtwork art={study.cover} />
        <span className="agency-project__view" aria-hidden="true">
          {text.home.view}
        </span>
      </div>
      <div className="agency-project__caption">
        <div>
          <span className="agency-project__client">{study.client}</span>
          <span className="agency-project__title">{study.title[language]}</span>
        </div>
        <span className="agency-project__meta">
          {study.disciplines.map((discipline) => text.disciplines[discipline]).join(' · ')}
          <span aria-hidden="true"> — </span>
          {study.year}
        </span>
      </div>
    </Link>
  )
}
