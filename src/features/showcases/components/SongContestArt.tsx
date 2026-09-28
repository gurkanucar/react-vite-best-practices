import { useId, useState, type CSSProperties } from 'react'
import { usePreferencesStore } from '@/store/preferences-store'
import {
  noise,
  STAGE_PHOTO_WIDTHS,
  stagePhotoUrl,
  type Contestant,
} from '@/features/showcases/data/songContest'

type Glyph = 'eighth' | 'beamed' | 'quarter' | 'double'

/** A music note drawn in SVG, so it looks the same on every platform's fonts. */
export function NoteGlyph({ glyph = 'eighth', className }: { glyph?: Glyph; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      {glyph === 'eighth' && (
        <>
          <ellipse cx="8.5" cy="18" rx="4.2" ry="3.1" transform="rotate(-22 8.5 18)" />
          <path d="M11.8 17.2V3.2h1.9c.4 2.6 2.2 4 4.1 5.4 1.6 1.2 2.3 3.2 1.4 5.6-.3-2.2-1.6-3.4-5.5-4.3v7.3z" />
        </>
      )}
      {glyph === 'quarter' && (
        <>
          <ellipse cx="9.5" cy="18" rx="4.4" ry="3.2" transform="rotate(-22 9.5 18)" />
          <rect x="12.9" y="3" width="1.9" height="14.6" rx=".9" />
        </>
      )}
      {glyph === 'beamed' && (
        <>
          <ellipse cx="5.8" cy="19" rx="3.5" ry="2.6" transform="rotate(-22 5.8 19)" />
          <ellipse cx="17.3" cy="16.6" rx="3.5" ry="2.6" transform="rotate(-22 17.3 16.6)" />
          <path d="M8.3 18.4V6.1l12.4-3v12.8h-1.8V7.6l-8.8 2.1v8.7z" />
        </>
      )}
      {glyph === 'double' && (
        <>
          <ellipse cx="5.8" cy="19" rx="3.5" ry="2.6" transform="rotate(-22 5.8 19)" />
          <ellipse cx="17.3" cy="16.6" rx="3.5" ry="2.6" transform="rotate(-22 17.3 16.6)" />
          <path d="M8.3 18.4V6.1l12.4-3v12.8h-1.8V11l-8.8 2.1v5.3zm1.8-8.4 8.8-2.1V5.3L10.1 7.4z" />
        </>
      )}
    </svg>
  )
}

const GLYPHS: Glyph[] = ['eighth', 'beamed', 'quarter', 'double']
/** Warm stage colours: the notes glow like bulbs over a dark hall. */
const NOTE_COLORS = ['#ffd23f', '#ffb020', '#ff8a1f', '#ff4d3d', '#ff2e4f', '#ffe08a']

type Depth = 'near' | 'mid' | 'far'

/** Size, speed and glow by how close to the viewer a note is meant to be. */
const DEPTHS: Record<
  Depth,
  { size: [number, number]; duration: [number, number]; alpha: [number, number] }
> = {
  near: { size: [42, 66], duration: [9, 13], alpha: [0.42, 0.6] },
  mid: { size: [22, 34], duration: [12, 17], alpha: [0.6, 0.85] },
  far: { size: [11, 18], duration: [15, 22], alpha: [0.5, 0.85] },
}

const between = ([low, high]: [number, number], roll: number) => low + (high - low) * roll

/**
 * Glowing notes rising through a section. The `back` layer sits behind the content with
 * small sparks of light; the `front` layer drifts over everything at three depths, from big
 * soft close-ups to small sharp ones, and never takes a pointer. Placement comes from a seed
 * so the layout is stable between renders; only transform and opacity animate, and with
 * reduced motion a few notes simply stay put.
 */
export function FloatingNotes({
  count = 14,
  seed = 1,
  layer = 'back',
}: {
  count?: number
  seed?: number
  layer?: 'back' | 'front'
}) {
  return (
    <div className={`sc-notes sc-notes--${layer}`} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => {
        const roll = (salt: number) => noise(seed * 97 + salt, index)
        const depthRoll = roll(11)
        const depth: Depth =
          layer === 'back' ? 'far' : depthRoll < 0.18 ? 'near' : depthRoll < 0.55 ? 'mid' : 'far'
        const spec = DEPTHS[depth]
        const style = {
          '--x': `${Math.round(roll(1) * 96)}%`,
          '--y': `${Math.round(roll(2) * 90)}%`,
          '--size': `${Math.round(between(spec.size, roll(3)))}px`,
          '--delay': `${(-roll(4) * spec.duration[1]).toFixed(2)}s`,
          '--duration': `${between(spec.duration, roll(5)).toFixed(2)}s`,
          '--sway': `${Math.round(12 + roll(6) * 40) * (roll(12) > 0.5 ? 1 : -1)}px`,
          '--tilt': `${Math.round(-24 + roll(7) * 48)}deg`,
          '--note': NOTE_COLORS[Math.floor(roll(8) * NOTE_COLORS.length)],
          '--alpha': between(spec.alpha, roll(9)).toFixed(2),
        } as CSSProperties
        return (
          <span key={index} className={`sc-note is-${depth}`} style={style}>
            <NoteGlyph glyph={GLYPHS[Math.floor(roll(10) * GLYPHS.length)]} />
          </span>
        )
      })}
      {layer === 'back' &&
        Array.from({ length: Math.round(count * 1.6) }, (_, index) => {
          const roll = (salt: number) => noise(seed * 131 + salt, index + 500)
          const style = {
            '--x': `${(roll(1) * 99).toFixed(1)}%`,
            '--y': `${(roll(2) * 98).toFixed(1)}%`,
            '--size': `${Math.round(3 + roll(3) * 4)}px`,
            '--delay': `${(-roll(4) * 4).toFixed(2)}s`,
            '--duration': `${(2.4 + roll(5) * 3).toFixed(2)}s`,
            '--note': roll(6) > 0.5 ? '#ffd23f' : '#ff4d3d',
          } as CSSProperties
          return <span key={`spark-${index}`} className="sc-spark" style={style} />
        })}
    </div>
  )
}

/**
 * A handful of notes flying out from a point, for a vote that has just landed. Remount it
 * (change its key) to play it again.
 */
export function NoteBurst({ color, count = 10 }: { color: string; count?: number }) {
  return (
    <span className="sc-burst" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2 + noise(count, index) * 0.5
        const distance = 46 + noise(index, count + 3) * 40
        const style = {
          '--dx': `${Math.round(Math.cos(angle) * distance)}px`,
          '--dy': `${Math.round(Math.sin(angle) * distance - 24)}px`,
          '--note': index % 3 === 0 ? '#ffffff' : color,
          '--spin': `${Math.round(-40 + noise(index, 9) * 80)}deg`,
          '--delay': `${index * 18}ms`,
        } as CSSProperties
        return (
          <span key={index} className="sc-burst__note" style={style}>
            <NoteGlyph glyph={GLYPHS[index % GLYPHS.length]} />
          </span>
        )
      })}
    </span>
  )
}

/** Equalizer bars; they bounce while `playing` and rest low otherwise. */
export function Equalizer({
  bars = 12,
  playing = true,
  color,
  className,
}: {
  bars?: number
  playing?: boolean
  color?: string
  className?: string
}) {
  return (
    <span
      className={`sc-eq${playing ? ' is-playing' : ''}${className ? ` ${className}` : ''}`}
      style={color ? ({ '--eq': color } as CSSProperties) : undefined}
      aria-hidden="true"
    >
      {Array.from({ length: bars }, (_, index) => (
        <span
          key={index}
          style={
            {
              '--delay': `${(-noise(bars, index) * 1.2).toFixed(2)}s`,
              '--speed': `${(0.7 + noise(index, bars) * 0.7).toFixed(2)}s`,
              '--rest': `${Math.round(18 + noise(index + 3, bars) * 30)}%`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  )
}

/** Paper confetti and notes falling over the stage for the winner. */
export function Confetti({ pieces = 44 }: { pieces?: number }) {
  return (
    <div className="sc-confetti" aria-hidden="true">
      {Array.from({ length: pieces }, (_, index) => {
        const style = {
          '--x': `${Math.round(noise(index, 41) * 100)}%`,
          '--delay': `${(noise(index, 43) * 1.4).toFixed(2)}s`,
          '--duration': `${(2.4 + noise(index, 47) * 1.8).toFixed(2)}s`,
          '--hue': NOTE_COLORS[index % NOTE_COLORS.length],
          '--spin': `${Math.round(noise(index, 53) * 720)}deg`,
        } as CSSProperties
        return index % 5 === 0 ? (
          <span key={index} className="sc-confetti__note" style={style}>
            <NoteGlyph glyph={GLYPHS[index % GLYPHS.length]} />
          </span>
        ) : (
          <span key={index} className="sc-confetti__piece" style={style} />
        )
      })}
    </div>
  )
}

/** A drawn portrait of a singer mid-song, lit from above in their colour. Decorative: the name is always beside it or on its link. */
export function ContestantPortrait({
  contestant,
  className,
  fill = false,
}: {
  contestant: Contestant
  className?: string
  /** Cover a tall frame from the top, cropping the sides, instead of a square. */
  fill?: boolean
}) {
  const id = useId().replace(/:/g, '')
  const { skin, hair, style, accessory } = contestant.portrait
  const color = contestant.color

  return (
    <svg
      viewBox="0 0 120 120"
      preserveAspectRatio={fill ? 'xMidYMin slice' : undefined}
      className={`${fill ? 'sc-portrait-fill' : 'sc-portrait'}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="28%" r="80%">
          <stop offset="0" stopColor={color} stopOpacity=".95" />
          <stop offset=".55" stopColor={color} stopOpacity=".35" />
          <stop offset="1" stopColor="#0b0506" />
        </radialGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill={`url(#${id}-bg)`} />
      <path d="M44 0h32l26 120H18z" fill={`url(#${id}-beam)`} opacity=".45" />

      {/* Hair that falls behind the shoulders goes first. */}
      {style === 'long' && <path d="M36 50c0-22 12-32 24-32s24 10 24 32v44H36z" fill={hair} />}
      {style === 'waves' && (
        <path
          d="M38 52c0-20 10-30 22-30s22 10 22 30c0 8 3 12 0 20-4-4-6-8-6-14H44c0 6-2 10-6 14-3-8 0-12 0-20z"
          fill={hair}
        />
      )}

      <path d="M18 120c2-22 18-32 42-32s40 10 42 32z" fill={color} />
      <path d="M18 120c2-22 18-32 42-32s40 10 42 32z" fill="#000" opacity=".25" />
      <path
        d="M48 90c4 6 20 6 24 0"
        stroke="#fff"
        strokeOpacity=".35"
        strokeWidth="2"
        fill="none"
      />
      <rect x="52" y="70" width="16" height="18" rx="6" fill={skin} />
      <rect x="52" y="74" width="16" height="6" fill="#000" opacity=".12" />
      <ellipse cx="60" cy="52" rx="20" ry="23" fill={skin} />

      {style === 'long' && (
        <path d="M39 50c2-16 10-24 21-24s19 8 21 24c-8-8-18-12-27-10-6 1-11 5-15 10z" fill={hair} />
      )}
      {style === 'short' && (
        <path d="M39 48c0-16 9-24 21-24s21 8 21 24c-5-6-12-9-21-9s-16 3-21 9z" fill={hair} />
      )}
      {style === 'waves' && (
        <path
          d="M39 50c1-15 10-24 21-24s20 9 21 24c-4-5-8-6-11-3-3-5-8-5-11-1-3-4-8-4-11 0-3-2-6-1-9 4z"
          fill={hair}
        />
      )}
      {style === 'bun' && (
        <>
          <circle cx="60" cy="22" r="9" fill={hair} />
          <path d="M39 50c0-16 9-24 21-24s21 8 21 24c-6-7-13-11-21-11s-15 4-21 11z" fill={hair} />
        </>
      )}
      {style === 'curly' &&
        [
          [40, 44, 7],
          [44, 34, 8],
          [52, 28, 8],
          [62, 26, 8],
          [72, 30, 8],
          [79, 38, 7],
          [81, 48, 6],
          [39, 54, 5],
        ].map(([cx, cy, r]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={hair} />)}

      {accessory === 'hat' && (
        <>
          <path d="M37 42c0-14 10-22 23-22s23 8 23 22z" fill="#1d1830" />
          <rect x="35" y="39" width="50" height="7" rx="3.5" fill="#2b2445" />
        </>
      )}

      {/* Eyes closed, mouth open: the middle of a long note. */}
      <path
        d="M48 53q4 3 8 0M64 53q4 3 8 0"
        stroke="#2a1a14"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="60" cy="65" rx="4.2" ry="5" fill="#5c1f25" />
      <circle cx="47" cy="60" r="3.5" fill="#ff7f8f" opacity=".3" />
      <circle cx="73" cy="60" r="3.5" fill="#ff7f8f" opacity=".3" />

      {accessory === 'glasses' && (
        <g stroke="#1b1426" strokeWidth="2" fill="none">
          <rect x="44" y="47" width="13" height="10" rx="4" />
          <rect x="63" y="47" width="13" height="10" rx="4" />
          <path d="M57 51h6" />
        </g>
      )}
      {accessory === 'earring' && <circle cx="40" cy="60" r="2.4" fill="#ffd166" />}

      {/* A hand-held microphone. */}
      <path d="M80 104 69 79" stroke="#1b1426" strokeWidth="5" strokeLinecap="round" />
      <circle cx="68" cy="76" r="5.5" fill="#8b8aa0" />
      <circle cx="68" cy="76" r="5.5" fill="none" stroke="#d8d6e8" strokeWidth="1.2" />
    </svg>
  )
}

/**
 * The singer's stage photo, covering its frame with the face kept in view. `tone` gives the
 * stage treatment: black and white for a champion, a warm amber duotone for the others. If the
 * photo cannot load, the drawn portrait takes its place, so there is never a broken image.
 */
export function ContestantPhoto({
  contestant,
  tone = 'color',
  sizes = '(min-width: 1000px) 25vw, 50vw',
  className,
}: {
  contestant: Contestant
  tone?: 'color' | 'mono' | 'amber'
  sizes?: string
  className?: string
}) {
  const language = usePreferencesStore((state) => state.language)
  const [failed, setFailed] = useState(false)
  const { photo } = contestant

  if (failed)
    return (
      <ContestantPortrait
        contestant={contestant}
        fill
        className={`is-${tone} ${className ?? ''}`}
      />
    )

  return (
    <img
      className={`sc-photo is-${tone}${className ? ` ${className}` : ''}`}
      src={stagePhotoUrl(photo.id, 900)}
      srcSet={STAGE_PHOTO_WIDTHS.map((width) => `${stagePhotoUrl(photo.id, width)} ${width}w`).join(
        ', ',
      )}
      sizes={sizes}
      width={800}
      height={1100}
      alt={photo.alt[language]}
      loading="eager"
      decoding="async"
      style={{ objectPosition: photo.focus }}
      onError={() => setFailed(true)}
    />
  )
}
