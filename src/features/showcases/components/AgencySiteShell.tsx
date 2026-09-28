import { useEffect, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'
import { ShowcasePreviewFrame } from '@/features/showcases/components/ShowcasePreviewFrame'
import { agencyEmail, agencyRoot, studios } from '@/features/showcases/data/agency'
import { agencyCopy } from '@/features/showcases/data/agencyCopy'
import { useAgencyCopy } from '@/features/showcases/hooks/useAgencyCopy'
import '../showcases.css'
import '../agency.css'

type PreviewKey = keyof typeof agencyCopy.en.preview

interface AgencySiteShellProps {
  children: ReactNode
  standalone: boolean
  /** Which page this is, for the admin preview's heading. */
  page: PreviewKey
}

/**
 * Every Oda Studio page: the site header and the dark footer with the big wordmark, inside the
 * admin's preview frame unless it is the standalone site.
 */
export function AgencySiteShell({ children, standalone, page }: AgencySiteShellProps) {
  const { text, language } = useAgencyCopy()
  const { pathname, search, hash } = useLocation()
  const root = agencyRoot(standalone)

  // A new page starts at its top, or at the section its link names; a filter change keeps the
  // path, so it does not jump. In the admin preview the layout scrolls rather than the window,
  // so this brings an element into view instead of scrolling the window. A section is found
  // again once the page has settled, because the layout around it can still move it.
  useEffect(() => {
    const scroll = () => {
      const section = hash ? document.getElementById(hash.slice(1)) : null
      ;(section ?? document.querySelector('.agency-site'))?.scrollIntoView?.({ block: 'start' })
    }
    scroll()
    if (!hash) return
    const timer = window.setTimeout(scroll, 600)
    return () => window.clearTimeout(timer)
  }, [pathname, hash])

  const links = (['work', 'studio', 'services', 'contact'] as const).map((key) => ({
    href: {
      work: `${root}/work`,
      studio: `${root}#agency-studio`,
      services: `${root}#agency-services`,
      contact: `${root}/contact`,
    }[key],
    label: { en: agencyCopy.en.nav[key], tr: agencyCopy.tr.nav[key] },
  }))

  const footer = (
    <div className="agency-footer">
      <div className="agency-wrap">
        <div className="agency-footer__grid">
          <div>
            <p className="agency-footer__label">{text.footer.studios}</p>
            {studios.map((studio) => (
              <address key={studio.city.en} className="agency-footer__studio">
                <strong>{studio.city[language]}</strong>
                <span>{studio.address}</span>
                <a href={`tel:${studio.phone.replaceAll(' ', '')}`}>{studio.phone}</a>
              </address>
            ))}
          </div>
          <div>
            <p className="agency-footer__label">{text.footer.contact}</p>
            <a className="agency-footer__email" href={`mailto:${agencyEmail}`}>
              {agencyEmail}
            </a>
            <Link className="agency-footer__cta" to={`${root}/contact`}>
              {text.home.ctaButton} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div>
            <p className="agency-footer__label">{text.footer.follow}</p>
            <ul className="agency-footer__socials">
              {text.footer.socials.map((social) => (
                <li key={social}>{social}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="agency-footer__wordmark" aria-hidden="true">
          Oda<em>studio</em>
        </p>
        <div className="agency-footer__bottom">
          <span>
            © 2026 {text.brand}. {text.footer.rights}
          </span>
          <span>{text.footer.note}</span>
        </div>
      </div>
    </div>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={`${pathname.replace('/showcases/agency', '/preview/agency')}${search}`}
      title={{ en: agencyCopy.en.preview[page].title, tr: agencyCopy.tr.preview[page].title }}
      description={{
        en: agencyCopy.en.preview[page].description,
        tr: agencyCopy.tr.preview[page].description,
      }}
    >
      <PublicSiteShell
        brand={text.brand}
        tagline={{ en: agencyCopy.en.tagline, tr: agencyCopy.tr.tagline }}
        className="agency-site"
        primary="#121212"
        homeHref={root}
        links={links}
        footer={footer}
      >
        {children}
      </PublicSiteShell>
    </ShowcasePreviewFrame>
  )
}
