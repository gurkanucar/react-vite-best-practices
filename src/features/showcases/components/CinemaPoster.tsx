import type { ReactNode } from 'react'
import type { Movie, PosterMotif } from '@/features/showcases/data/cinema'
import { useCinemaText } from '@/features/showcases/data/cinemaCopy'

interface CinemaPosterProps {
  movie: Movie
  /** Leave the title off where it is printed right beside the poster. */
  showTitle?: boolean
  className?: string
}

/** Stars scattered from a fixed list, so the sky never changes between renders. */
const starPoints = [
  [24, 30],
  [62, 18],
  [150, 26],
  [178, 58],
  [40, 72],
  [120, 50],
  [92, 90],
  [168, 104],
]

function motif(kind: PosterMotif, accent: string, ink: string): ReactNode {
  switch (kind) {
    case 'waves':
      return (
        <>
          <circle cx="100" cy="150" r="46" fill={accent} opacity="0.9" />
          {[170, 196, 222].map((y, index) => (
            <path
              key={y}
              d={`M-10 ${y} q 30 -18 55 0 t 55 0 t 55 0 t 55 0 t 55 0 V 320 H -10 Z`}
              fill={ink}
              opacity={0.18 + index * 0.16}
            />
          ))}
        </>
      )
    case 'moon':
      return (
        <>
          <circle cx="110" cy="112" r="58" fill={accent} />
          <circle cx="136" cy="92" r="52" fill="currentColor" />
          {starPoints.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill={ink} opacity="0.8" />
          ))}
          <path d="M70 230 l20 -14 l20 14 l-20 -6 Z" fill={ink} opacity="0.85" />
        </>
      )
    case 'ferry':
      return (
        <>
          <circle cx="150" cy="70" r="22" fill={accent} opacity="0.9" />
          <path d="M40 186 h120 l-14 22 h-92 Z" fill={ink} />
          <rect x="62" y="162" width="76" height="24" rx="3" fill={ink} opacity="0.9" />
          <rect x="112" y="140" width="10" height="22" fill={accent} />
          <path
            d="M-10 214 q 30 -10 60 0 t 60 0 t 60 0 t 60 0 V 320 H -10 Z"
            fill={ink}
            opacity="0.25"
          />
        </>
      )
    case 'signal':
      return (
        <>
          {[26, 52, 78, 104].map((r, index) => (
            <circle
              key={r}
              cx="100"
              cy="150"
              r={r}
              fill="none"
              stroke={accent}
              strokeWidth="3"
              opacity={1 - index * 0.2}
            />
          ))}
          <circle cx="100" cy="150" r="8" fill={ink} />
        </>
      )
    case 'hills':
      return (
        <>
          <circle cx="140" cy="100" r="30" fill={accent} opacity="0.95" />
          <path
            d="M-10 200 L50 130 L100 180 L150 120 L210 190 V320 H-10 Z"
            fill={ink}
            opacity="0.25"
          />
          <path d="M-10 230 L60 170 L120 220 L210 160 V320 H-10 Z" fill={ink} opacity="0.45" />
        </>
      )
    case 'door':
      return (
        <>
          <rect x="66" y="70" width="68" height="150" rx="2" fill="#000" opacity="0.55" />
          <rect x="97" y="70" width="6" height="150" fill={accent} />
          <circle cx="124" cy="150" r="3" fill={ink} />
          <path d="M100 220 L40 300 H160 Z" fill={accent} opacity="0.25" />
        </>
      )
    case 'pot':
      return (
        <>
          {[70, 100, 130].map((x) => (
            <path
              key={x}
              d={`M${x} 120 q -12 -16 0 -32 t 0 -32`}
              fill="none"
              stroke={ink}
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.7"
            />
          ))}
          <path d="M44 140 h112 l-10 70 q -46 22 -92 0 Z" fill={accent} />
          <rect x="38" y="132" width="124" height="12" rx="6" fill={ink} opacity="0.9" />
        </>
      )
    case 'sun':
      return (
        <>
          {Array.from({ length: 12 }, (_, index) => (
            <rect
              key={index}
              x="98"
              y="40"
              width="4"
              height="30"
              fill={accent}
              opacity="0.8"
              transform={`rotate(${index * 30} 100 120)`}
            />
          ))}
          <circle cx="100" cy="120" r="34" fill={accent} />
          <path
            d="M-10 200 q 30 -24 60 0 t 60 0 t 60 0 t 60 0 V 320 H -10 Z"
            fill={ink}
            opacity="0.3"
          />
        </>
      )
    case 'garden':
      return (
        <>
          <path
            d="M40 220 V150 a60 60 0 0 1 120 0 V220 Z"
            fill={ink}
            opacity="0.12"
            stroke={accent}
            strokeWidth="3"
          />
          {[70, 100, 130].map((x, index) => (
            <g key={x}>
              <line x1={x} y1="220" x2={x} y2={170 - index * 8} stroke={accent} strokeWidth="3" />
              <circle cx={x} cy={164 - index * 8} r="9" fill={accent} opacity="0.85" />
            </g>
          ))}
        </>
      )
    case 'orbit':
      return (
        <>
          <ellipse
            cx="100"
            cy="140"
            rx="86"
            ry="28"
            fill="none"
            stroke={accent}
            strokeWidth="3"
            transform="rotate(-18 100 140)"
          />
          <circle cx="100" cy="140" r="40" fill={accent} opacity="0.9" />
          <circle cx="168" cy="112" r="7" fill={ink} />
          {starPoints.slice(0, 5).map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" fill={ink} opacity="0.8" />
          ))}
        </>
      )
    case 'stars':
      return (
        <>
          {starPoints.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y + 20} r="2.2" fill={ink} opacity="0.9" />
          ))}
          <circle cx="150" cy="70" r="20" fill={accent} />
          <path d="M-10 230 q 60 -50 120 -10 t 110 -20 V320 H-10 Z" fill={accent} opacity="0.35" />
          <path d="M60 214 l8 -12 l8 12 Z M90 210 l6 -9 l6 9 Z" fill={ink} opacity="0.8" />
        </>
      )
  }
}

/**
 * A poster drawn from the film's colours and a motif: no image files, and it reads at any size.
 * It is decoration: the film's title is always printed beside it or in a heading nearby.
 */
export function CinemaPoster({ movie, showTitle = true, className = '' }: CinemaPosterProps) {
  const { language } = useCinemaText()
  const [base, mid, accent] = movie.poster.colors

  return (
    <div
      className={`cinema-poster ${className}`}
      style={{
        background: `linear-gradient(170deg, ${base} 10%, ${mid} 120%)`,
        color: base,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice">
        {motif(movie.poster.motif, accent, movie.poster.ink)}
      </svg>
      {showTitle && (
        <span className="cinema-poster__title" style={{ color: movie.poster.ink }}>
          {movie.title[language]}
        </span>
      )}
    </div>
  )
}
