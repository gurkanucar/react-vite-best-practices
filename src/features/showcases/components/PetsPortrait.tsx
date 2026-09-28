import type { BreedId, CoatId, Species } from '@/features/showcases/data/pets'
import { coats } from '@/features/showcases/data/pets'

const backgrounds = ['#fde8d7', '#e2f1e6', '#e5ecfb', '#f6e7f2', '#fff1c9']

/** Mixes a hex colour toward black (negative) or white (positive) by `amount` (0–1). */
function shade(hex: string, amount: number) {
  const value = Number.parseInt(hex.slice(1), 16)
  const target = amount < 0 ? 0 : 255
  const mix = (channel: number) =>
    Math.round(channel + (target - channel) * Math.abs(amount))
      .toString(16)
      .padStart(2, '0')
  return `#${mix(value >> 16)}${mix((value >> 8) & 255)}${mix(value & 255)}`
}

interface PortraitProps {
  species: Species
  coat: CoatId
  breed?: BreedId
  /** Which of the gallery's scenes to draw; each changes the backdrop and the pose a little. */
  variant?: number
  className?: string
}

function Eyes({ y, gap, dark }: { y: number; gap: number; dark: boolean }) {
  return (
    <g>
      {[-gap, gap].map((dx) => (
        <g key={dx}>
          <circle cx={100 + dx} cy={y} r={8} fill={dark ? '#f7f3e8' : '#ffffff'} />
          <circle cx={100 + dx} cy={y + 1} r={5} fill="#262626" />
          <circle cx={102 + dx} cy={y - 1.5} r={1.6} fill="#ffffff" />
        </g>
      ))}
    </g>
  )
}

function Cat({ coat }: { coat: CoatId }) {
  const fill = coats[coat].hex
  const dark = coat === 'black' || coat === 'tuxedo'
  const edge = shade(fill, -0.25)
  return (
    <g>
      <ellipse cx={100} cy={172} rx={56} ry={42} fill={fill} />
      {coat === 'tuxedo' && <ellipse cx={100} cy={172} rx={26} ry={34} fill="#f4efe6" />}
      <polygon points="60,84 66,34 98,62" fill={fill} />
      <polygon points="140,84 134,34 102,62" fill={fill} />
      <polygon points="68,74 71,48 88,64" fill="#f2a7b0" opacity={0.8} />
      <polygon points="132,74 129,48 112,64" fill="#f2a7b0" opacity={0.8} />
      <circle cx={100} cy={100} r={46} fill={fill} />
      {coat === 'tricolor' && (
        <>
          <path d="M60 86 A46 46 0 0 1 96 55 L100 92 Z" fill="#3a3a42" />
          <path d="M140 110 A46 46 0 0 1 112 144 L104 110 Z" fill="#f4efe6" />
        </>
      )}
      {(coat === 'orange' || coat === 'grey') && (
        <g stroke={edge} strokeWidth={4} strokeLinecap="round">
          <line x1={100} y1={60} x2={100} y2={74} />
          <line x1={88} y1={62} x2={91} y2={75} />
          <line x1={112} y1={62} x2={109} y2={75} />
        </g>
      )}
      {coat === 'tuxedo' && <ellipse cx={100} cy={120} rx={24} ry={20} fill="#f4efe6" />}
      <Eyes y={96} gap={17} dark={dark} />
      <polygon points="94,112 106,112 100,119" fill="#e2808d" />
      <path
        d="M100 119 q-6 8 -12 3 M100 119 q6 8 12 3"
        stroke={dark ? '#bdb8ae' : '#5b4a42'}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      <g stroke={dark ? '#cfcac0' : '#6b5a52'} strokeWidth={1.5} opacity={0.6}>
        <line x1={78} y1={116} x2={50} y2={110} />
        <line x1={78} y1={121} x2={52} y2={124} />
        <line x1={122} y1={116} x2={150} y2={110} />
        <line x1={122} y1={121} x2={148} y2={124} />
      </g>
    </g>
  )
}

function Dog({ coat, tongue }: { coat: CoatId; tongue: boolean }) {
  const fill = coats[coat].hex
  const dark = coat === 'black' || coat === 'tuxedo' || coat === 'brown'
  const ear = coat === 'tricolor' ? '#6b4a33' : shade(fill, -0.22)
  const muzzle = coat === 'white' || coat === 'cream' ? shade(fill, 0.35) : shade(fill, 0.45)
  return (
    <g>
      <ellipse cx={100} cy={176} rx={60} ry={42} fill={fill} />
      <ellipse cx={100} cy={176} rx={24} ry={30} fill={muzzle} />
      <ellipse cx={100} cy={100} rx={44} ry={42} fill={fill} />
      <ellipse cx={58} cy={96} rx={15} ry={32} fill={ear} transform="rotate(18 58 96)" />
      <ellipse cx={142} cy={96} rx={15} ry={32} fill={ear} transform="rotate(-18 142 96)" />
      {coat === 'tricolor' && <path d="M100 58 L92 92 L108 92 Z" fill="#f4efe6" />}
      <Eyes y={94} gap={16} dark={dark} />
      <ellipse cx={100} cy={122} rx={25} ry={19} fill={muzzle} />
      <ellipse cx={100} cy={112} rx={9} ry={6.5} fill="#262626" />
      <path
        d="M100 118 v6 q-6 6 -12 2 M100 124 q6 6 12 2"
        stroke="#4a3a32"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      {tongue && <path d="M94 129 q6 14 12 0 Z" fill="#e2808d" />}
    </g>
  )
}

function Rabbit({ coat, lop }: { coat: CoatId; lop: boolean }) {
  const fill = coats[coat].hex
  const dark = coat === 'black' || coat === 'brown'
  const inner = dark ? shade(fill, 0.3) : '#f2b8c0'
  return (
    <g>
      <ellipse cx={100} cy={178} rx={54} ry={38} fill={fill} />
      {lop ? (
        <>
          <ellipse
            cx={60}
            cy={112}
            rx={13}
            ry={34}
            fill={shade(fill, -0.12)}
            transform="rotate(14 60 112)"
          />
          <ellipse
            cx={140}
            cy={112}
            rx={13}
            ry={34}
            fill={shade(fill, -0.12)}
            transform="rotate(-14 140 112)"
          />
        </>
      ) : (
        <>
          <ellipse cx={82} cy={52} rx={12} ry={36} fill={fill} transform="rotate(-8 82 52)" />
          <ellipse cx={118} cy={52} rx={12} ry={36} fill={fill} transform="rotate(8 118 52)" />
          <ellipse cx={82} cy={54} rx={6} ry={26} fill={inner} transform="rotate(-8 82 54)" />
          <ellipse cx={118} cy={54} rx={6} ry={26} fill={inner} transform="rotate(8 118 54)" />
        </>
      )}
      <circle cx={100} cy={112} r={40} fill={fill} />
      {coat === 'grey' && <circle cx={100} cy={78} r={16} fill={shade(fill, 0.2)} />}
      <Eyes y={106} gap={15} dark={dark} />
      <ellipse cx={100} cy={122} rx={5} ry={3.5} fill="#e2808d" />
      <rect x={96} y={130} width={8} height={7} rx={1.5} fill="#ffffff" />
      <path d="M100 125 v5" stroke="#5b4a42" strokeWidth={1.5} />
    </g>
  )
}

function Bird({ coat, crest }: { coat: CoatId; crest: boolean }) {
  const fill = coats[coat].hex
  const belly = shade(fill, 0.4)
  return (
    <g>
      <rect x={30} y={178} width={140} height={8} rx={4} fill="#9b6b43" />
      {crest && (
        <path
          d="M96 56 q-6 -26 10 -34 q-4 16 4 30 Z"
          fill={coat === 'grey' ? '#f1cf3b' : shade(fill, -0.15)}
        />
      )}
      <ellipse cx={100} cy={118} rx={46} ry={58} fill={fill} />
      <ellipse cx={104} cy={136} rx={28} ry={36} fill={belly} />
      <ellipse
        cx={70}
        cy={132}
        rx={16}
        ry={34}
        fill={shade(fill, -0.2)}
        transform="rotate(12 70 132)"
      />
      <circle cx={88} cy={92} r={7} fill="#ffffff" />
      <circle cx={88} cy={92} r={4.5} fill="#262626" />
      <circle cx={89.5} cy={90.5} r={1.4} fill="#ffffff" />
      <circle cx={118} cy={92} r={7} fill="#ffffff" />
      <circle cx={118} cy={92} r={4.5} fill="#262626" />
      <circle cx={119.5} cy={90.5} r={1.4} fill="#ffffff" />
      {crest && <circle cx={126} cy={106} r={8} fill="#f08a5d" opacity={0.85} />}
      <path d="M96 100 L110 100 L103 114 Z" fill="#f0a23b" />
      <g stroke="#9b6b43" strokeWidth={4} strokeLinecap="round">
        <line x1={88} y1={172} x2={86} y2={182} />
        <line x1={112} y1={172} x2={114} y2={182} />
      </g>
    </g>
  )
}

/** A few props around the animal so each gallery picture reads as its own scene. */
function Scene({ variant }: { variant: number }) {
  switch (variant % 4) {
    case 1:
      return (
        <g opacity={0.5}>
          <circle cx={30} cy={40} r={10} fill="#ffffff" />
          <circle cx={170} cy={30} r={6} fill="#ffffff" />
          <circle cx={160} cy={70} r={4} fill="#ffffff" />
        </g>
      )
    case 2:
      return (
        <g>
          <circle cx={166} cy={172} r={14} fill="#e5584f" />
          <path d="M152 172 q14 -8 28 0" stroke="#ffffff" strokeWidth={2} fill="none" />
        </g>
      )
    case 3:
      return (
        <g fill="#ffffff" opacity={0.55}>
          {[
            [34, 150],
            [48, 128],
            [164, 44],
            [150, 24],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
              <circle r={6} />
              <circle cx={-7} cy={-8} r={2.6} />
              <circle cx={0} cy={-11} r={2.6} />
              <circle cx={7} cy={-8} r={2.6} />
            </g>
          ))}
        </g>
      )
    default:
      return null
  }
}

/**
 * An illustrated portrait drawn from the animal's species and coat, so every listing has a
 * picture that always loads and never shifts the layout.
 */
export function PetsPortrait({ species, coat, breed, variant = 0, className }: PortraitProps) {
  const background = backgrounds[(variant + coat.length) % backgrounds.length]!
  // Pale coats need a darker halo to stand out from the pastel backdrop.
  const light = coat === 'white' || coat === 'cream'
  const tilt = [0, -6, 5, -3][variant % 4]
  const zoom = [1, 1.08, 0.94, 1.14][variant % 4]
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <rect width={200} height={200} fill={background} />
      <circle
        cx={100}
        cy={110}
        r={78}
        fill={light ? shade(background, -0.06) : '#ffffff'}
        opacity={light ? 1 : 0.45}
      />
      <Scene variant={variant} />
      <g transform={`translate(100 200) scale(${zoom}) rotate(${tilt}) translate(-100 -200)`}>
        {species === 'cat' && <Cat coat={coat} />}
        {species === 'dog' && <Dog coat={coat} tongue={variant % 2 === 1} />}
        {species === 'rabbit' && <Rabbit coat={coat} lop={breed === 'lop'} />}
        {species === 'bird' && <Bird coat={coat} crest={breed === 'cockatiel'} />}
      </g>
    </svg>
  )
}
