import type { ReactNode } from 'react'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'
import { TechParkFooter } from '@/features/showcases/components/TechParkFooter'
import { techParkCopy, techParkLinks } from '@/features/showcases/data'

interface TechParkSiteShellProps {
  children: ReactNode
  /** `/showcases/technopark` inside the admin, `/preview/technopark` on its own. */
  rootPath: string
  className?: string
}

/** One header for every Aurora page, so the campus, its companies and its announcements read as one site. */
export function TechParkSiteShell({ children, rootPath, className }: TechParkSiteShellProps) {
  return (
    <PublicSiteShell
      brand="Aurora Tech Park"
      tagline={{ en: techParkCopy.en.tagline, tr: techParkCopy.tr.tagline }}
      className={className ? `techpark-site ${className}` : 'techpark-site'}
      primary="#3157d5"
      links={techParkLinks(rootPath)}
      homeHref={rootPath}
      colorModeToggle
      footer={<TechParkFooter rootPath={rootPath} />}
    >
      {children}
    </PublicSiteShell>
  )
}
