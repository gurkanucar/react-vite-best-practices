import type { ProductShape } from '@/features/showcases/data/store'

export type ArtView = 'front' | 'detail' | 'room'

export const ART_VIEWS: ArtView[] = ['front', 'detail', 'room']

/*
 * Product pictures are drawn, not photographed: one SVG per shape, painted in the chosen
 * colour. The shop then has no image hosting to depend on, and picking "Sage" really shows a
 * sage cushion. Each drawing sits on a 400 × 400 board with its base on y = 330.
 */

function shade(hex: string, amount: number): string {
  const value = Number.parseInt(hex.slice(1), 16)
  const channel = (shift: number) => {
    const part = (value >> shift) & 255
    const next = amount < 0 ? part * (1 + amount) : part + (255 - part) * amount
    return Math.round(Math.min(255, Math.max(0, next)))
  }
  return `#${[16, 8, 0].map((shift) => channel(shift).toString(16).padStart(2, '0')).join('')}`
}

const line = 'stroke="rgba(28,37,46,0.18)" stroke-width="2"'

function drawing(shape: ProductShape, fill: string): string {
  const dark = shade(fill, -0.18)
  const light = shade(fill, 0.22)
  const deep = shade(fill, -0.35)

  switch (shape) {
    case 'vase':
      return `<path d="M170 90h60v18c0 14 38 40 38 104 0 70-30 118-68 118s-68-48-68-118c0-64 38-90 38-104z" fill="${fill}" ${line}/>
        <path d="M166 84h68v14h-68z" fill="${dark}"/>
        <path d="M150 210c10 60 24 96 42 112" stroke="${light}" stroke-width="8" fill="none" stroke-linecap="round" opacity=".7"/>
        <path d="M156 318h88" stroke="${deep}" stroke-width="6" opacity=".35"/>`
    case 'mug':
      return `<rect x="104" y="170" width="120" height="160" rx="18" fill="${fill}" ${line}/>
        <path d="M224 206c52 0 52 88 0 88" stroke="${dark}" stroke-width="20" fill="none"/>
        <ellipse cx="164" cy="172" rx="60" ry="10" fill="${deep}" opacity=".35"/>
        <rect x="236" y="200" width="100" height="130" rx="16" fill="${light}" ${line}/>
        <ellipse cx="286" cy="202" rx="50" ry="8" fill="${deep}" opacity=".3"/>`
    case 'bowl':
      return `<path d="M76 220h248c0 70-56 110-124 110S76 290 76 220z" fill="${fill}" ${line}/>
        <ellipse cx="200" cy="220" rx="124" ry="26" fill="${dark}" ${line}/>
        <ellipse cx="200" cy="222" rx="104" ry="17" fill="${deep}" opacity=".4"/>
        ${[120, 150, 180, 210, 240, 270].map((x) => `<path d="M${x} 250c4 28 12 50 22 64" stroke="${light}" stroke-width="5" fill="none" opacity=".75"/>`).join('')}`
    case 'plates':
      return [300, 276, 252, 228]
        .map(
          (y, index) =>
            `<ellipse cx="200" cy="${y}" rx="${140 - index * 2}" ry="30" fill="${index % 2 ? dark : fill}" ${line}/>`,
        )
        .join('')
        .concat(
          `<ellipse cx="200" cy="228" rx="92" ry="17" fill="${light}" opacity=".6"/>
          ${[160, 190, 222, 246].map((x, i) => `<circle cx="${x}" cy="${222 + (i % 2) * 8}" r="3" fill="${deep}" opacity=".5"/>`).join('')}`,
        )
    case 'lamp':
      return `<path d="M136 90h128l34 112H102z" fill="${light}" ${line}/>
        ${[122, 146, 170, 194, 218, 242, 266].map((x, i) => `<path d="M${x + 14 - i * 1} 92 ${x - 4 + i * 2} 200" stroke="${fill}" stroke-width="3" opacity=".7"/>`).join('')}
        <rect x="192" y="202" width="16" height="30" fill="${deep}"/>
        <path d="M170 232h60c16 0 24 30 24 50s-10 48-54 48-54-28-54-48 8-50 24-50z" fill="${fill}" ${line}/>`
    case 'pendant':
      return `<path d="M200 20v120" stroke="${deep}" stroke-width="4"/>
        <rect x="190" y="130" width="20" height="24" rx="4" fill="${deep}"/>
        <path d="M86 270c0-66 52-116 114-116s114 50 114 116z" fill="${fill}" ${line}/>
        <ellipse cx="200" cy="270" rx="114" ry="16" fill="${dark}"/>
        <ellipse cx="200" cy="274" rx="42" ry="8" fill="#fff6d8"/>
        <path d="M150 300 110 330M200 296v34M250 300l40 30" stroke="#f6d77a" stroke-width="4" opacity=".6"/>`
    case 'cushion':
      return `<path d="M92 128c40-14 176-14 216 0 14 50 14 150 0 200-40 14-176 14-216 0-14-50-14-150 0-200z" fill="${fill}" ${line}/>
        <path d="M120 150c30 30 130 30 160 0M120 306c30-30 130-30 160 0" stroke="${dark}" stroke-width="5" fill="none" opacity=".55"/>
        <path d="M132 230c20-10 116-10 136 0" stroke="${light}" stroke-width="6" fill="none" opacity=".6"/>`
    case 'throw':
      return [270, 220, 170]
        .map(
          (y, index) =>
            `<rect x="${86 + index * 6}" y="${y}" width="${228 - index * 12}" height="60" rx="14" fill="${index === 1 ? dark : fill}" ${line}/>`,
        )
        .join('')
        .concat(
          [110, 140, 170, 200, 230, 260, 290]
            .map(
              (x) =>
                `<path d="M${x} 180v40M${x} 280v40" stroke="${light}" stroke-width="3" opacity=".7"/>`,
            )
            .join(''),
        )
    case 'rug':
      return `<path d="M70 300 130 150h200l-60 150z" fill="${fill}" ${line}/>
        <path d="M100 286 146 166h164l-46 120z" fill="none" stroke="${light}" stroke-width="8"/>
        <path d="M168 250 194 200h52l-26 50z" fill="${deep}" opacity=".6"/>
        <path d="M200 226h20" stroke="${light}" stroke-width="8"/>
        ${[80, 110, 140, 170, 200, 230, 260].map((x) => `<path d="M${x} 302v18" stroke="${dark}" stroke-width="3"/>`).join('')}`
    case 'stool':
      return `<ellipse cx="200" cy="170" rx="100" ry="26" fill="${light}" ${line}/>
        <path d="M100 170v14c0 14 44 26 100 26s100-12 100-26v-14" fill="${fill}" ${line}/>
        <path d="M134 204 112 330M266 204l22 126M178 210l-6 120M222 210l6 120" stroke="${dark}" stroke-width="14" stroke-linecap="round"/>
        <path d="M122 280h156" stroke="${dark}" stroke-width="8"/>`
    case 'basket':
      return `<path d="M96 160h208l-24 170H120z" fill="${fill}" ${line}/>
        ${[190, 220, 250, 280, 310].map((y) => `<path d="M${100 + (y - 160) / 7} ${y}h${200 - ((y - 160) / 7) * 2}" stroke="${dark}" stroke-width="4" opacity=".7"/>`).join('')}
        ${[130, 160, 190, 220, 250, 280].map((x) => `<path d="M${x} 164 ${x + (200 - x) / 8} 326" stroke="${light}" stroke-width="3" opacity=".6"/>`).join('')}
        <rect x="90" y="150" width="220" height="18" rx="9" fill="${dark}"/>
        <path d="M130 150c0-26 40-26 40 0M230 150c0-26 40-26 40 0" stroke="${dark}" stroke-width="10" fill="none"/>`
    case 'candle':
      return `<path d="M200 118c14 18 14 36 0 44-14-8-14-26 0-44z" fill="#f2b441"/>
        <path d="M200 132c6 10 6 20 0 24-6-4-6-14 0-24z" fill="#fff1c4"/>
        <path d="M200 160v24" stroke="#3b3a38" stroke-width="3"/>
        <rect x="132" y="180" width="136" height="150" rx="20" fill="${fill}" ${line}/>
        <ellipse cx="200" cy="184" rx="68" ry="12" fill="#f4ecdc"/>
        <rect x="160" y="236" width="80" height="48" rx="6" fill="${light}" opacity=".85"/>
        <path d="M176 254h48M184 266h32" stroke="${deep}" stroke-width="3" opacity=".6"/>`
    case 'towel':
      return `<rect x="96" y="150" width="208" height="170" rx="10" fill="${light}" ${line}/>
        ${[172, 194, 216, 262, 284].map((y) => `<rect x="96" y="${y}" width="208" height="10" fill="${fill}"/>`).join('')}
        <rect x="96" y="232" width="208" height="20" fill="${dark}"/>
        ${[110, 130, 150, 170, 190, 210, 230, 250, 270, 290].map((x) => `<path d="M${x} 320v14" stroke="${fill}" stroke-width="3"/>`).join('')}`
    case 'chair':
      return `<path d="M118 138c0-26 164-26 164 0v96H118z" fill="${fill}" ${line}/>
        <rect x="98" y="220" width="204" height="58" rx="24" fill="${light}" ${line}/>
        <path d="M112 270 96 330M288 270l16 60" stroke="${shade('#b98d5c', -0.1)}" stroke-width="12" stroke-linecap="round"/>
        <path d="M104 190c-12 0-16 70 0 70M296 190c12 0 16 70 0 70" stroke="${shade('#b98d5c', -0.1)}" stroke-width="10" fill="none"/>
        ${[140, 170, 200, 230, 260].map((x) => `<circle cx="${x}" cy="160" r="3" fill="${dark}" opacity=".5"/>`).join('')}`
  }
}

const backdrops: Record<ArtView, string> = {
  front: '#f4f0e8',
  detail: '#ebe4d8',
  room: '#e7ddcf',
}

/** The picture of one product in one colour, as a data URL an `<img>` or antd `Image` can show. */
export function productArt(shape: ProductShape, hex: string, view: ArtView = 'front'): string {
  const art = drawing(shape, hex)
  const backdrop = backdrops[view]
  let body: string

  if (view === 'detail') {
    // Close up on the upper middle of the piece, where the texture is.
    body = `<rect width="400" height="400" fill="${backdrop}"/><g transform="translate(-200 -170) scale(2)">${art}</g>`
  } else if (view === 'room') {
    body = `<rect width="400" height="400" fill="${backdrop}"/>
      <rect y="300" width="400" height="100" fill="#d6c8b3"/>
      <rect x="276" y="60" width="84" height="110" rx="4" fill="#f3eee6" stroke="#cbbca6" stroke-width="4"/>
      <path d="M300 150c10-40 30-50 40-60" stroke="#8a9e84" stroke-width="5" fill="none"/>
      <ellipse cx="200" cy="338" rx="130" ry="12" fill="rgba(28,37,46,.12)"/>
      <g transform="translate(40 40) scale(0.8)">${art}</g>`
  } else {
    body = `<rect width="400" height="400" fill="${backdrop}"/>
      <ellipse cx="200" cy="334" rx="120" ry="10" fill="rgba(28,37,46,.1)"/>${art}`
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">${body}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, ' '))}`
}
