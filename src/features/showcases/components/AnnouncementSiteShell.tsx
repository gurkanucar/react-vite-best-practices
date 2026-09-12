import type { ReactNode } from 'react'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'

interface AnnouncementSiteShellProps {
  children: ReactNode
  standalone: boolean
}

export function AnnouncementSiteShell({ children, standalone }: AnnouncementSiteShellProps) {
  const routeRoot = standalone ? '/preview' : '/showcases'
  const techParkRoot = `${routeRoot}/technopark`
  const announcementsRoot = `${routeRoot}/corporate/announcements`
  const labels = {
    en: ['Campus', 'Announcements', 'Programs', 'Contact'],
    tr: ['Kampüs', 'Duyurular', 'Programlar', 'İletişim'],
  }
  const paths = [
    techParkRoot,
    announcementsRoot,
    `${techParkRoot}#section-1`,
    `${techParkRoot}#section-3`,
  ]

  return (
    <PublicSiteShell
      brand="Aurora Tech Park"
      tagline={{ en: 'Build what is next', tr: 'Sıradakini birlikte geliştir' }}
      className="techpark-site announcement-site"
      primary="#3157d5"
      links={paths.map((href, index) => ({
        href,
        label: {
          en: labels.en[index] ?? labels.en[0],
          tr: labels.tr[index] ?? labels.tr[0],
        },
      }))}
    >
      {children}
    </PublicSiteShell>
  )
}
