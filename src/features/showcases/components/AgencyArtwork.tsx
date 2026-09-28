import type { Artwork } from '@/features/showcases/data/agency'

interface AgencyArtworkProps {
  art: Artwork
  className?: string
  /** Read out when set; left out, the artwork is decoration beside a caption that says the same. */
  label?: string
}

const range = (count: number) => Array.from({ length: count }, (_, index) => index)

/**
 * The project imagery, drawn rather than photographed: one of eight compositions in the
 * project's colours. It covers its box at any aspect ratio, so the same artwork serves a tall
 * card, a wide banner and the comparison slider.
 */
export function AgencyArtwork({ art, className, label }: AgencyArtworkProps) {
  const { bg, ink, accent, soft } = art.palette

  const shapes = () => {
    switch (art.variant) {
      case 'orbit':
        return (
          <>
            {[70, 118, 166, 214].map((radius) => (
              <circle
                key={radius}
                cx="200"
                cy="200"
                r={radius}
                fill="none"
                stroke={soft}
                strokeWidth="2"
              />
            ))}
            <circle cx="200" cy="200" r="46" fill={accent} />
            <g className="agency-art__spin">
              <circle cx="318" cy="200" r="14" fill={ink} />
              <circle cx="200" cy="34" r="9" fill={accent} />
              <circle cx="92" cy="268" r="20" fill={ink} opacity="0.85" />
            </g>
          </>
        )
      case 'grid':
        return range(36).map((index) => {
          const x = 20 + (index % 6) * 62
          const y = 20 + Math.floor(index / 6) * 62
          if (index % 7 === 3)
            return <circle key={index} cx={x + 26} cy={y + 26} r="26" fill={accent} />
          if (index % 5 === 1) {
            return (
              <rect
                key={index}
                x={x}
                y={y}
                width="52"
                height="52"
                fill={ink}
                transform={`rotate(45 ${x + 26} ${y + 26})`}
                className="agency-art__tile"
              />
            )
          }
          return <rect key={index} x={x} y={y} width="52" height="52" fill={soft} />
        })
      case 'wave':
        return range(9).map((line) => {
          const y = 60 + line * 36
          const amplitude = 18 + (line % 3) * 8
          return (
            <path
              key={line}
              d={`M -20 ${y} C 60 ${y - amplitude}, 140 ${y + amplitude}, 200 ${y} S 340 ${y - amplitude}, 420 ${y}`}
              fill="none"
              stroke={line % 3 === 1 ? accent : ink}
              strokeWidth={line % 3 === 1 ? 10 : 4}
              strokeLinecap="round"
              opacity={line % 3 === 2 ? 0.45 : 1}
              className="agency-art__wave"
            />
          )
        })
      case 'type':
        return (
          <>
            <circle cx="296" cy="112" r="40" fill={accent} />
            <text
              x="200"
              y="318"
              textAnchor="middle"
              fontSize="330"
              fontFamily="ui-serif, 'Iowan Old Style', Georgia, serif"
              fontStyle="italic"
              fill={ink}
            >
              {art.glyph ?? 'O'}
            </text>
            {range(4).map((line) => (
              <rect
                key={line}
                x="36"
                y={330 + line * 12}
                width={line === 3 ? 70 : 130}
                height="4"
                fill={ink}
                opacity="0.5"
              />
            ))}
          </>
        )
      case 'stack':
        return range(3).map((layer) => {
          const x = 70 + layer * 34
          const y = 70 + layer * 44
          return (
            <g key={layer} className="agency-art__card">
              <rect x={x} y={y} width="200" height="210" rx="18" fill={layer === 2 ? ink : soft} />
              <rect
                x={x + 20}
                y={y + 22}
                width="70"
                height="12"
                rx="6"
                fill={layer === 2 ? accent : ink}
              />
              {range(3).map((row) => (
                <rect
                  key={row}
                  x={x + 20}
                  y={y + 58 + row * 22}
                  width={150 - row * 30}
                  height="8"
                  rx="4"
                  fill={layer === 2 ? bg : ink}
                  opacity="0.55"
                />
              ))}
              {layer === 2 && <circle cx={x + 164} cy={y + 170} r="18" fill={accent} />}
            </g>
          )
        })
      case 'sun':
        return (
          <>
            <circle cx="200" cy="236" r="118" fill={accent} className="agency-art__sun" />
            {range(7).map((band) => (
              <rect
                key={band}
                x="0"
                y={236 + band * 26}
                width="400"
                height={10 + band * 2}
                fill={band % 2 === 0 ? ink : soft}
              />
            ))}
          </>
        )
      case 'bars':
        return range(15).map((bar) => {
          const height = 70 + Math.round(Math.abs(Math.sin(bar * 1.3)) * 230)
          return (
            <rect
              key={bar}
              x={18 + bar * 25.5}
              y={360 - height}
              width="15"
              height={height}
              rx="7.5"
              fill={bar % 4 === 1 ? accent : ink}
              className="agency-art__bar"
              style={{ animationDelay: `${bar * -90}ms` }}
            />
          )
        })
      case 'petal':
        return (
          <g className="agency-art__spin agency-art__spin--slow">
            {range(8).map((petal) => (
              <ellipse
                key={petal}
                cx="200"
                cy="128"
                rx="42"
                ry="84"
                fill={petal % 2 === 0 ? accent : soft}
                opacity="0.9"
                transform={`rotate(${petal * 45} 200 200)`}
              />
            ))}
            <circle cx="200" cy="200" r="30" fill={ink} />
          </g>
        )
    }
  }

  return (
    <svg
      className={`agency-art agency-art--${art.variant}${className ? ` ${className}` : ''}`}
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <rect width="400" height="400" fill={bg} />
      {shapes()}
    </svg>
  )
}
