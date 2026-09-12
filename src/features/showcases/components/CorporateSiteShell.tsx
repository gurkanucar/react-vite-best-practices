import type { ReactNode } from 'react'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'

interface CorporateSiteShellProps {
  children: ReactNode
  standalone: boolean
}

export function CorporateSiteShell({ children, standalone }: CorporateSiteShellProps) {
  const root = standalone ? '/preview/corporate' : '/showcases/corporate'
  const labels = {
    en: ['Company', 'News', 'Announcements', 'Contact'],
    tr: ['Şirket', 'Haberler', 'Duyurular', 'İletişim'],
  }
  const paths = [root, `${root}/news`, `${root}/announcements`, `${root}#contact`]

  return (
    <PublicSiteShell
      brand="Northstar Group"
      tagline={{ en: 'Industry, infrastructure, impact', tr: 'Sanayi, altyapı, etki' }}
      className="corporate-site"
      primary="#b64b32"
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
