import { ConfigProvider, Typography } from 'antd'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'
import { ShowcasePreviewFrame } from '@/features/showcases/components/ShowcasePreviewFrame'
import { songContestBrand, songContestRoot } from '@/features/showcases/data/songContest'
import { songContestCopy } from '@/features/showcases/data/songContestCopy'
import { useSongContestCopy } from '@/features/showcases/hooks/useSongContest'
import '../showcases.css'
import '../song-contest.css'

/** The shared dark palette leans navy; the stage is a deep violet. */
const stageTokens = {
  colorBgBase: '#0c0718',
  colorBgContainer: '#1a1230',
  colorBgElevated: '#221839',
  colorBorder: '#3a2d5c',
  colorBorderSecondary: '#2a2046',
  colorText: '#f4efff',
  colorTextHeading: '#ffffff',
  colorTextSecondary: '#b3a9d3',
  colorTextTertiary: '#8b80ad',
  colorTextLightSolid: '#140b24',
}

function SongContestFooter() {
  const { text } = useSongContestCopy()
  return (
    <div className="sc-footer">
      <Typography.Text strong>{songContestBrand}</Typography.Text>
      <Typography.Paragraph type="secondary">{text.footer.about}</Typography.Paragraph>
      <Typography.Text type="secondary">
        © 2026 {songContestBrand}. {text.footer.rights}
      </Typography.Text>
    </div>
  )
}

/**
 * The contest's frame: a dark stage whatever the app's theme. Inside the admin it sits in the
 * preview frame, whose "open in a new tab" keeps the page and the chosen result.
 */
export function SongContestSiteShell({
  children,
  standalone,
  screen = false,
}: {
  children: ReactNode
  standalone: boolean
  /** A page built to fit one screen: the footer is left out so nothing pushes it past. */
  screen?: boolean
}) {
  const root = songContestRoot(standalone)
  const { pathname, search } = useLocation()
  const previewPath = `${pathname.replace(songContestRoot(false), songContestRoot(true))}${search}`
  const nav = (key: keyof typeof songContestCopy.en.nav, path: string) => ({
    href: `${root}${path}`,
    label: { en: songContestCopy.en.nav[key], tr: songContestCopy.tr.nav[key] },
  })

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={previewPath}
      title={{ en: songContestCopy.en.frame.title, tr: songContestCopy.tr.frame.title }}
      description={{
        en: songContestCopy.en.frame.description,
        tr: songContestCopy.tr.frame.description,
      }}
    >
      <PublicSiteShell
        brand={songContestBrand}
        tagline={{ en: songContestCopy.en.tagline, tr: songContestCopy.tr.tagline }}
        className={`song-site${screen ? ' song-site--screen' : ''}`}
        primary="#ff4f8b"
        homeHref={root}
        alwaysDark
        links={[nav('home', ''), nav('live', '/live'), nav('results', '/results')]}
        footer={<SongContestFooter />}
      >
        <ConfigProvider theme={{ token: stageTokens }}>
          <div className="sc-page">{children}</div>
        </ConfigProvider>
      </PublicSiteShell>
    </ShowcasePreviewFrame>
  )
}

/** A friendly dead end for an unknown singer. */
export function SongContestNotFound({ root }: { root: string }) {
  const { text } = useSongContestCopy()
  return (
    <section className="sc-wrap sc-notfound">
      <Typography.Title level={2}>{text.common.notFound}</Typography.Title>
      <Link to={root}>{text.common.back}</Link>
    </section>
  )
}
