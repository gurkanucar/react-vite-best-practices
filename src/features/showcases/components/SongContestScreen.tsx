import { StarFilled, TrophyFilled } from '@ant-design/icons'
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router'
import { ContestantPhoto } from '@/features/showcases/components/SongContestArt'
import {
  songContestOrganiser,
  teamName,
  upper,
  type Contestant,
} from '@/features/showcases/data/songContest'
import { useSongContestCopy } from '@/features/showcases/hooks/useSongContest'

/** The show's round mark: a vinyl-like disc with a note cut into it. */
function LogoMark() {
  return (
    <svg viewBox="0 0 40 40" className="sc-logo" aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="19" fill="#e5304a" />
      <circle cx="20" cy="20" r="14" fill="none" stroke="#0b0506" strokeOpacity=".35" />
      <circle cx="20" cy="20" r="10" fill="none" stroke="#0b0506" strokeOpacity=".35" />
      <path
        d="M17 27.5a3.2 3.2 0 1 1-1.6-2.8V11.5l9-2v12.6a3.2 3.2 0 1 1-1.6-2.8v-7.4l-5.8 1.3z"
        fill="#fff"
      />
    </svg>
  )
}

/**
 * The strip across the top of a screen: the show's mark and name, the organiser's credit in
 * the middle, and whatever the page needs on the right.
 */
export function ScreenBar({ right }: { right: ReactNode }) {
  const { text } = useSongContestCopy()
  return (
    <div className="sc-bar">
      <div className="sc-bar__brand">
        <LogoMark />
        <span className="sc-bar__divider" aria-hidden="true" />
        <span className="sc-wordmark">
          <span className="sc-wordmark__a">{text.wordmark[0]}</span>
          <span className="sc-wordmark__b">{text.wordmark[1]}</span>
          <span className="sc-wordmark__c">2026</span>
        </span>
      </div>
      <span className="sc-bar__credit">
        <span className="sc-bar__credit-dot" aria-hidden="true" />
        {text.credit(songContestOrganiser)}
      </span>
      <div className="sc-bar__right">{right}</div>
    </div>
  )
}

/** A gold or red outlined link in the bar, such as "Final results". */
export function BarLink({
  to,
  icon,
  tone,
  children,
}: {
  to: string
  icon: ReactNode
  tone: 'gold' | 'red'
  children: ReactNode
}) {
  return (
    <Link to={to} className={`sc-bar-link sc-bar-link--${tone}`}>
      {icon}
      <span>{children}</span>
    </Link>
  )
}

export interface StripItem {
  label: string
  value: ReactNode
  tone?: 'gold' | 'red'
  icon?: ReactNode
}

/** The wide band of headline numbers under the bar, separated by thin rules. */
export function StatsStrip({ items }: { items: StripItem[] }) {
  return (
    <dl className="sc-strip">
      {items.map((item) => (
        <div key={item.label} className={`sc-strip__item${item.tone ? ` is-${item.tone}` : ''}`}>
          <dt>{item.label}</dt>
          <dd>
            {item.icon}
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/** A round medal with the place in it: gold, silver, bronze, then a dark red ring. */
export function Medal({ rank }: { rank: number }) {
  const tone = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'plain'
  return (
    <span className={`sc-medal sc-medal--${tone}`} aria-hidden="true">
      {rank}
    </span>
  )
}

export function ChampionPill() {
  const { text } = useSongContestCopy()
  return (
    <span className="sc-pill sc-pill--champion">
      <StarFilled aria-hidden="true" />
      {text.results.champion}
      <StarFilled aria-hidden="true" />
    </span>
  )
}

export function TiePill() {
  const { text } = useSongContestCopy()
  return <span className="sc-pill sc-pill--tie">{text.results.tie}</span>
}

/**
 * A tall stage card for one singer: the drawn portrait fills the top, the team and name sit
 * over its lower edge, and `footer` holds whatever the page counts (votes, a vote button).
 */
export function StageCard({
  contestant,
  tone = 'color',
  champion = false,
  corner,
  badge,
  footer,
  to,
  className,
  photoSizes,
}: {
  contestant: Contestant
  /** `mono` for the winner's black and white, `amber` for the warm duotone of the others. */
  tone?: 'color' | 'mono' | 'amber'
  champion?: boolean
  /** Top left, over the portrait: usually a medal. */
  corner?: ReactNode
  /** Top right, over the portrait: champion or tie pills. */
  badge?: ReactNode
  footer: ReactNode
  /** Makes the portrait and name a link to the singer's page. */
  to?: string
  className?: string
  /** How wide the card is on screen, so the browser picks a fitting photo size. */
  photoSizes?: string
}) {
  const { language } = useSongContestCopy()
  const art = (
    <>
      <ContestantPhoto contestant={contestant} tone={tone} sizes={photoSizes} />
      <span className="sc-stage-card__shade" aria-hidden="true" />
    </>
  )
  return (
    <article
      className={`sc-stage-card${champion ? ' is-champion' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--accent': contestant.color } as CSSProperties}
    >
      <div className="sc-stage-card__art">
        {to ? (
          <Link to={to} className="sc-stage-card__link" aria-label={contestant.name}>
            {art}
          </Link>
        ) : (
          art
        )}
        {corner && <span className="sc-stage-card__corner">{corner}</span>}
        {badge && <span className="sc-stage-card__badge">{badge}</span>}
        <div className="sc-stage-card__caption">
          <span className={`sc-pill ${champion ? 'sc-pill--gold' : 'sc-pill--red'}`}>
            {upper(teamName(contestant.coach, language), 'tr')}
          </span>
          {/* Upper case comes from CSS. The names are Turkish, so `lang` stays tr in English too
              and i becomes İ. */}
          <h3 className="sc-stage-card__name" lang="tr">
            {contestant.name}
          </h3>
        </div>
      </div>
      <div className="sc-stage-card__footer">{footer}</div>
    </article>
  )
}

/** The trophy used beside the champion's name in the strip. */
export const StripTrophy = () => <TrophyFilled aria-hidden="true" className="sc-strip__trophy" />

/** The credit the stock photos ask for, small in the corner of a screen. */
export function PhotoCredit() {
  const { text } = useSongContestCopy()
  return (
    <a className="sc-photo-credit" href="https://unsplash.com" target="_blank" rel="noreferrer">
      {text.photos}
    </a>
  )
}
