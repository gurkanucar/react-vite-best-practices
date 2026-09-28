import { useId, type CSSProperties, type ReactNode } from 'react'
import type { CoverPattern, FigureArt } from '@/features/showcases/data/magazine'

/** A small stable number from a string, so each cover's pattern sits a little differently. */
function seed(value: string) {
  let hash = 0
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) % 997
  return hash
}

function coverShapes(pattern: CoverPattern, shift: number): ReactNode {
  switch (pattern) {
    case 'rings':
      return [150, 115, 80, 45].map((r, index) => (
        <circle
          key={r}
          cx={420 + (shift % 60)}
          cy={170}
          r={r}
          className={index % 2 ? 'mc-light' : 'mc-deep'}
        />
      ))
    case 'stripes':
      return Array.from({ length: 9 }, (_, index) => (
        <rect
          key={index}
          x={-80 + index * 80 + (shift % 40)}
          y={-60}
          width={34}
          height={460}
          transform="rotate(24 300 170)"
          className={index % 3 === 0 ? 'mc-deep' : 'mc-light'}
        />
      ))
    case 'grid':
      return Array.from({ length: 24 }, (_, index) => {
        const col = index % 6
        const row = Math.floor(index / 6)
        const lit = (index + shift) % 5 === 0
        return (
          <rect
            key={index}
            x={250 + col * 58}
            y={40 + row * 70}
            width={46}
            height={58}
            rx={8}
            className={lit ? 'mc-deep' : 'mc-light'}
          />
        )
      })
    case 'waves':
      return [0, 1, 2, 3, 4].map((line) => (
        <path
          key={line}
          d={`M-20 ${120 + line * 42} C 120 ${70 + line * 42}, 240 ${170 + line * 42}, 380 ${
            120 + line * 42
          } S 600 ${70 + line * 42}, 680 ${120 + line * 42}`}
          className={line % 2 ? 'mc-stroke-light' : 'mc-stroke-deep'}
          strokeWidth={16}
          fill="none"
        />
      ))
    case 'sun':
      return (
        <>
          <circle cx={440} cy={250} r={120} className="mc-deep" />
          {[0, 1, 2, 3].map((band) => (
            <rect
              key={band}
              x={300}
              y={262 + band * 22}
              width={290}
              height={10}
              className="mc-paper"
            />
          ))}
          <circle cx={120 + (shift % 50)} cy={80} r={14} className="mc-light" />
        </>
      )
    case 'blocks':
      return [
        [260, 60, 120, 120],
        [390, 60, 170, 70],
        [390, 140, 80, 150],
        [480, 140, 80, 150],
        [260, 190, 120, 100],
      ].map(([x, y, width, height], index) => (
        <rect
          key={index}
          x={x}
          y={y}
          width={width}
          height={height}
          rx={10}
          className={(index + shift) % 2 ? 'mc-deep' : 'mc-light'}
        />
      ))
    case 'dots':
      return Array.from({ length: 42 }, (_, index) => {
        const col = index % 7
        const row = Math.floor(index / 7)
        const r = 6 + ((index * 7 + shift) % 5) * 4
        return (
          <circle
            key={index}
            cx={250 + col * 52}
            cy={40 + row * 52}
            r={r}
            className={(index + shift) % 4 ? 'mc-light' : 'mc-deep'}
          />
        )
      })
  }
}

/** The article's cover: an abstract pattern in its topic's colour, drawn so it always loads. */
export function MagazineCover({
  slug,
  pattern,
  color,
  className,
}: {
  slug: string
  pattern: CoverPattern
  color: string
  className?: string
}) {
  return (
    <svg
      className={`mag-cover${className ? ` ${className}` : ''}`}
      viewBox="0 0 640 340"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      style={{ '--mc': color } as CSSProperties}
    >
      <rect width="640" height="340" className="mc-base" />
      {coverShapes(pattern, seed(slug))}
    </svg>
  )
}

// ------------------------------------------------------------------ figures

const bar = (x: number, y: number, width: number, className = 'mf-soft', height = 12) => (
  <rect x={x} y={y} width={width} height={height} rx={height / 2} className={className} />
)

function figureShapes(art: FigureArt, arrow: string): ReactNode {
  switch (art) {
    case 'skeleton':
      return (
        <>
          <rect x={40} y={50} width={250} height={220} rx={18} className="mf-card" />
          <rect x={60} y={70} width={210} height={90} rx={10} className="mf-soft" />
          {bar(60, 180, 170)}
          {bar(60, 204, 120)}
          <rect x={350} y={50} width={250} height={220} rx={18} className="mf-card" />
          <rect x={370} y={70} width={210} height={90} rx={10} className="mf-accent-soft" />
          <circle cx={410} cy={115} r={22} className="mf-accent" />
          {bar(370, 180, 170, 'mf-ink')}
          {bar(370, 204, 120, 'mf-muted')}
          <path d="M300 160 h36" className="mf-line" markerEnd={arrow} />
        </>
      )
    case 'sync':
      return (
        <>
          <rect x={40} y={70} width={150} height={190} rx={20} className="mf-card" />
          {bar(62, 100, 106, 'mf-ink')}
          {bar(62, 124, 80)}
          {bar(62, 148, 96)}
          <rect x={450} y={90} width={150} height={150} rx={20} className="mf-card" />
          {[0, 1, 2].map((row) => (
            <rect
              key={row}
              x={470}
              y={110 + row * 40}
              width={110}
              height={26}
              rx={6}
              className="mf-soft"
            />
          ))}
          {[0, 1, 2].map((item) => (
            <rect
              key={item}
              x={236 + item * 58}
              y={150}
              width={44}
              height={34}
              rx={8}
              className={item === 0 ? 'mf-accent' : 'mf-accent-soft'}
            />
          ))}
          <path d="M196 167 h30 M420 167 h24" className="mf-line" markerEnd={arrow} />
        </>
      )
    case 'keys': {
      const verbs = ['d', 'c', 'y']
      const objects = ['w', '$', 'p']
      return (
        <>
          {objects.map((object, col) => (
            <text key={object} x={278 + col * 100} y={52} className="mf-label" textAnchor="middle">
              {object}
            </text>
          ))}
          {verbs.map((verb, row) => (
            <g key={verb}>
              <text x={170} y={108 + row * 80} className="mf-label" textAnchor="middle">
                {verb}
              </text>
              {objects.map((object, col) => (
                <g key={object}>
                  <rect
                    x={236 + col * 100}
                    y={72 + row * 80}
                    width={84}
                    height={60}
                    rx={12}
                    className={row === col ? 'mf-accent' : 'mf-card'}
                  />
                  <text
                    x={278 + col * 100}
                    y={110 + row * 80}
                    className={row === col ? 'mf-label mf-label--on' : 'mf-label'}
                    textAnchor="middle"
                  >
                    {verb}
                    {object}
                  </text>
                </g>
              ))}
            </g>
          ))}
        </>
      )
    }
    case 'grid':
      return (
        <>
          {Array.from({ length: 12 }, (_, col) => (
            <rect
              key={col}
              x={40 + col * 48}
              y={30}
              width={40}
              height={260}
              className="mf-accent-soft"
            />
          ))}
          <rect x={40} y={50} width={568} height={50} rx={8} className="mf-ink-soft" />
          <rect x={40} y={116} width={280} height={70} rx={8} className="mf-accent" />
          <rect x={328} y={116} width={280} height={70} rx={8} className="mf-ink-soft" />
          {[0, 1, 2].map((col) => (
            <rect
              key={col}
              x={40 + col * 192}
              y={202}
              width={184}
              height={70}
              rx={8}
              className="mf-ink-soft"
            />
          ))}
        </>
      )
    case 'contrast':
      return (
        <>
          <rect x={30} y={30} width={280} height={260} rx={18} fill="#000" />
          <text x={60} y={110} fill="#fff" className="mf-big">
            Aa
          </text>
          <rect x={60} y={150} width={200} height={12} rx={6} fill="#fff" />
          <rect x={60} y={174} width={150} height={12} rx={6} fill="#fff" />
          <rect x={60} y={220} width={110} height={36} rx={10} fill="#1e5cff" />
          <rect x={330} y={30} width={280} height={260} rx={18} fill="#17181c" />
          <rect x={350} y={130} width={240} height={140} rx={14} fill="#23252b" />
          <text x={360} y={110} fill="#e8e6e1" className="mf-big">
            Aa
          </text>
          <rect x={370} y={150} width={190} height={12} rx={6} fill="#e8e6e1" />
          <rect x={370} y={174} width={140} height={12} rx={6} fill="#a3a09a" />
          <rect x={370} y={220} width={110} height={36} rx={10} fill="#8aa6ff" />
        </>
      )
    case 'form':
      return (
        <>
          {bar(120, 50, 120, 'mf-ink', 14)}
          <rect x={120} y={76} width={400} height={50} rx={10} className="mf-card mf-card--line" />
          {bar(140, 95, 160)}
          {bar(120, 138, 240, 'mf-muted', 10)}
          {bar(120, 178, 100, 'mf-ink', 14)}
          <rect
            x={120}
            y={204}
            width={400}
            height={50}
            rx={10}
            className="mf-card mf-card--error"
          />
          {bar(140, 223, 90)}
          <circle cx={128} cy={272} r={7} className="mf-error" />
          {bar(142, 267, 220, 'mf-error', 10)}
        </>
      )
    case 'bees':
      return (
        <>
          <rect x={80} y={60} width={170} height={200} rx={16} className="mf-card mf-card--pick" />
          <rect x={390} y={60} width={170} height={200} rx={16} className="mf-card" />
          <circle cx={475} cy={160} r={26} className="mf-ink" />
          <g transform="translate(300 150)">
            <ellipse cx={0} cy={0} rx={30} ry={20} className="mf-accent" />
            <rect x={-8} y={-20} width={8} height={40} className="mf-ink" />
            <rect x={8} y={-19} width={8} height={38} className="mf-ink" />
            <ellipse cx={-4} cy={-26} rx={16} ry={10} className="mf-wing" />
          </g>
          <path d="M268 150 h-8" className="mf-line" markerEnd={arrow} />
          <text x={165} y={290} className="mf-label" textAnchor="middle">
            0
          </text>
          <text x={475} y={290} className="mf-label" textAnchor="middle">
            1
          </text>
        </>
      )
    case 'twilight':
      return (
        <>
          {['#f7c873', '#8aa0d6', '#4c5ea8', '#232a5c', '#10132b'].map((color, index) => (
            <rect key={color} x={0} y={index * 40} width={640} height={40} fill={color} />
          ))}
          <rect x={0} y={200} width={640} height={120} className="mf-ground" />
          <path d="M0 200 H640" className="mf-line" />
          {[0, 6, 12, 18].map((degrees, index) => (
            <g key={degrees}>
              <circle cx={120 + index * 140} cy={200 + index * 30} r={16} fill="#ffb347" />
              <text
                x={120 + index * 140}
                y={186 + index * 30 - 22}
                className="mf-label mf-label--sky"
                textAnchor="middle"
              >
                −{degrees}°
              </text>
            </g>
          ))}
        </>
      )
    case 'stone':
      return (
        <>
          <rect x={0} y={220} width={640} height={100} className="mf-water" />
          <path
            d="M40 120 Q 110 60 170 220 Q 250 120 320 220 Q 390 150 450 220 Q 505 180 550 220 Q 585 200 610 220"
            className="mf-line mf-line--dash"
          />
          <g transform="translate(170 214) rotate(-20)">
            <ellipse cx={0} cy={0} rx={34} ry={9} className="mf-ink" />
          </g>
          <path d="M170 220 L 250 220" className="mf-line" />
          <path d="M170 220 L 245 193" className="mf-line" />
          <text x={262} y={206} className="mf-label">
            20°
          </text>
        </>
      )
    case 'tape':
      return (
        <>
          <rect x={120} y={50} width={400} height={230} rx={22} className="mf-ink" />
          <rect x={150} y={80} width={340} height={110} rx={12} className="mf-paper" />
          <rect x={150} y={80} width={340} height={26} className="mf-accent" />
          {[240, 400].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy={150} r={30} className="mf-ink" />
              <circle cx={cx} cy={150} r={12} className="mf-paper" />
            </g>
          ))}
          <path d="M210 280 L 230 230 H 410 L 430 280" className="mf-soft" />
        </>
      )
    case 'shelves':
      return (
        <>
          {[0, 1, 2].map((row) => (
            <g key={row}>
              <rect x={60} y={90 + row * 72} width={380} height={10} className="mf-ink" />
              {Array.from({ length: 12 }, (_, index) => (
                <rect
                  key={index}
                  x={70 + index * 30}
                  y={90 + row * 72 - (40 + ((index * 5 + row * 3) % 4) * 6)}
                  width={24}
                  height={40 + ((index * 5 + row * 3) % 4) * 6}
                  rx={3}
                  className={(index + row) % 4 === 0 ? 'mf-accent' : 'mf-soft'}
                />
              ))}
            </g>
          ))}
          <path d="M530 40 V 150" className="mf-line" />
          <path d="M490 150 h80 l-20 -40 h-40 z" className="mf-accent" />
          <circle cx={530} cy={176} r={40} className="mf-glow" />
        </>
      )
    case 'rails': {
      const stops = ['Ankara', 'Kayseri', 'Sivas', 'Erzincan', 'Erzurum', 'Kars']
      return (
        <>
          <path d="M60 170 H 580" className="mf-line mf-line--thick" />
          {stops.map((stop, index) => {
            const x = 60 + index * 104
            const up = index % 2 === 0
            return (
              <g key={stop}>
                <circle
                  cx={x}
                  cy={170}
                  r={index === 0 || index === stops.length - 1 ? 14 : 9}
                  className={
                    index === 0 || index === stops.length - 1 ? 'mf-accent' : 'mf-paper mf-ring'
                  }
                />
                <text
                  x={x}
                  y={up ? 136 : 214}
                  className="mf-label mf-label--small"
                  textAnchor="middle"
                >
                  {stop}
                </text>
              </g>
            )
          })}
          <text x={320} y={280} className="mf-label mf-label--small" textAnchor="middle">
            ≈ 1.300 km
          </text>
        </>
      )
    }
    case 'arches':
      return (
        <>
          <rect x={40} y={80} width={560} height={210} className="mf-accent-soft" />
          {[0, 1, 2, 3].map((index) => (
            <path
              key={index}
              d={`M${80 + index * 130} 290 V 170 a 45 45 0 0 1 90 0 V 290 z`}
              className="mf-paper"
            />
          ))}
          <path d="M40 80 H 600" className="mf-line mf-line--thick" />
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <rect
              key={index}
              x={50 + index * 80}
              y={48}
              width={60}
              height={24}
              rx={4}
              className="mf-soft"
            />
          ))}
        </>
      )
    case 'starter':
      return (
        <>
          {[0, 1].map((jar) => {
            const x = 150 + jar * 220
            const level = jar === 0 ? 110 : 200
            return (
              <g key={jar}>
                <rect
                  x={x}
                  y={60}
                  width={120}
                  height={220}
                  rx={20}
                  className="mf-card mf-card--line"
                />
                <rect
                  x={x + 8}
                  y={280 - level}
                  width={104}
                  height={level - 8}
                  rx={14}
                  className={jar ? 'mf-accent' : 'mf-soft'}
                />
                {jar === 1 &&
                  [0, 1, 2, 3, 4].map((bubble) => (
                    <circle
                      key={bubble}
                      cx={x + 26 + bubble * 18}
                      cy={120 + (bubble % 3) * 34}
                      r={5}
                      className="mf-paper"
                    />
                  ))}
                <rect x={x - 6} y={48} width={132} height={18} rx={6} className="mf-ink" />
              </g>
            )
          })}
          <path d="M290 170 h60" className="mf-line" markerEnd={arrow} />
        </>
      )
    case 'cezve':
      return (
        <>
          <path d="M140 110 H 280 L 262 270 H 158 Z" className="mf-accent" />
          <path d="M280 130 H 400" className="mf-line mf-line--thick" />
          <ellipse cx={210} cy={110} rx={70} ry={12} className="mf-foam" />
          <path d="M440 190 H 560 L 548 270 H 452 Z" className="mf-card mf-card--line" />
          <ellipse cx={500} cy={190} rx={60} ry={10} className="mf-foam" />
          <path d="M560 205 q 30 10 0 40" className="mf-line" />
          <rect x={420} y={270} width={160} height={10} rx={5} className="mf-soft" />
          <path
            d="M210 80 q -14 -20 0 -40 M240 84 q -14 -20 0 -40"
            className="mf-line mf-line--steam"
          />
        </>
      )
  }
}

/** One of the drawn figures inside an article, in its topic's colour. */
export function MagazineFigure({
  art,
  color,
  className,
}: {
  art: FigureArt
  color: string
  className?: string
}) {
  // Every figure on the page draws its own arrowhead, so each needs its own id.
  const markerId = `mf-arrow-${useId().replace(/[^\w-]/g, '')}`
  return (
    <svg
      className={`mag-figure-art${className ? ` ${className}` : ''}`}
      viewBox="0 0 640 320"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      style={{ '--mf-accent': color } as CSSProperties}
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" className="mf-arrowhead" />
        </marker>
      </defs>
      <rect width="640" height="320" className="mf-bg" />
      {figureShapes(art, `url(#${markerId})`)}
    </svg>
  )
}
