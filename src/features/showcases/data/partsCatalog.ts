import type { Language } from '@/store/preferences-store'
import {
  findEngine,
  generationName,
  generations,
  type Fuel,
  type Generation,
  type Vehicle,
} from '@/features/showcases/data/partsVehicles'

type Text = Record<Language, string>

export const categoryIds = [
  'brakes',
  'filters',
  'suspension',
  'engine',
  'electrical',
  'lighting',
  'cooling',
  'exhaust',
  'transmission',
  'wipers',
  'batteries',
  'fluids',
] as const
export type CategoryId = (typeof categoryIds)[number]

export const categoryNames: Record<CategoryId, Text> = {
  brakes: { en: 'Brakes', tr: 'Fren sistemi' },
  filters: { en: 'Filters', tr: 'Filtreler' },
  suspension: { en: 'Suspension & steering', tr: 'Süspansiyon ve direksiyon' },
  engine: { en: 'Engine', tr: 'Motor parçaları' },
  electrical: { en: 'Electrical', tr: 'Elektrik' },
  lighting: { en: 'Lighting', tr: 'Aydınlatma' },
  cooling: { en: 'Cooling', tr: 'Soğutma' },
  exhaust: { en: 'Exhaust', tr: 'Egzoz' },
  transmission: { en: 'Clutch & drivetrain', tr: 'Debriyaj ve aktarma' },
  wipers: { en: 'Wipers', tr: 'Silecekler' },
  batteries: { en: 'Batteries', tr: 'Aküler' },
  fluids: { en: 'Oils & fluids', tr: 'Yağlar ve sıvılar' },
}

export type Position = 'front' | 'rear' | 'frontLeft' | 'frontRight' | 'rearLeft' | 'rearRight'

export const positionNames: Record<Position, Text> = {
  front: { en: 'front axle', tr: 'ön aks' },
  rear: { en: 'rear axle', tr: 'arka aks' },
  frontLeft: { en: 'front left', tr: 'ön sol' },
  frontRight: { en: 'front right', tr: 'ön sağ' },
  rearLeft: { en: 'rear left', tr: 'arka sol' },
  rearRight: { en: 'rear right', tr: 'arka sağ' },
}

/** The side filters a shopper thinks in; a part matches every word its position contains. */
export const positionFilters = ['front', 'rear', 'left', 'right'] as const
export type PositionFilter = (typeof positionFilters)[number]

export function matchesPosition(position: Position | undefined, filter: PositionFilter): boolean {
  return position !== undefined && position.toLowerCase().includes(filter)
}

export const warehouseIds = ['ist', 'ank', 'izm'] as const
export type WarehouseId = (typeof warehouseIds)[number]

export const warehouseNames: Record<WarehouseId, Text> = {
  ist: { en: 'Istanbul · Hadımköy', tr: 'İstanbul · Hadımköy' },
  ank: { en: 'Ankara · Ostim', tr: 'Ankara · Ostim' },
  izm: { en: 'İzmir · Kemalpaşa', tr: 'İzmir · Kemalpaşa' },
}

export type SpecKey =
  | 'width'
  | 'height'
  | 'thickness'
  | 'diameter'
  | 'minThickness'
  | 'wearSensor'
  | 'boltHoles'
  | 'ventilated'
  | 'thread'
  | 'outerDiameter'
  | 'length'
  | 'filterType'
  | 'activatedCarbon'
  | 'shockType'
  | 'material'
  | 'teeth'
  | 'ribs'
  | 'gap'
  | 'voltage'
  | 'amperage'
  | 'kw'
  | 'connector'
  | 'bulb'
  | 'wattage'
  | 'colourTemperature'
  | 'lampType'
  | 'coreSize'
  | 'openingTemperature'
  | 'emission'
  | 'clutchDiameter'
  | 'splines'
  | 'capacity'
  | 'cca'
  | 'technology'
  | 'terminal'
  | 'viscosity'
  | 'volume'
  | 'approval'
  | 'standard'
  | 'pieces'

export type SpecValue = string | boolean

export interface Application {
  generationId: string
  engineIds: string[]
}

export type Fitment = { kind: 'universal' } | { kind: 'vehicles'; applications: Application[] }

export interface Brand {
  id: string
  name: string
  country: Text
  tier: 'premium' | 'oe' | 'value'
  /** Part-number shape: `#` is a digit, `@` a letter, anything else is kept. */
  numberPattern: string
}

export const brands: Brand[] = [
  {
    id: 'ferrox',
    name: 'Ferrox',
    country: { en: 'Germany', tr: 'Almanya' },
    tier: 'premium',
    numberPattern: 'FX ##.###',
  },
  {
    id: 'brakeon',
    name: 'Brakeon',
    country: { en: 'Italy', tr: 'İtalya' },
    tier: 'oe',
    numberPattern: 'P ## ###',
  },
  {
    id: 'filtrix',
    name: 'Filtrix',
    country: { en: 'Germany', tr: 'Almanya' },
    tier: 'premium',
    numberPattern: 'FT-@@ ###',
  },
  {
    id: 'aeroclean',
    name: 'Aeroclean',
    country: { en: 'Türkiye', tr: 'Türkiye' },
    tier: 'value',
    numberPattern: 'AC####',
  },
  {
    id: 'nordline',
    name: 'Nordline',
    country: { en: 'Sweden', tr: 'İsveç' },
    tier: 'premium',
    numberPattern: 'NL ### ###',
  },
  {
    id: 'axion',
    name: 'Axion',
    country: { en: 'Türkiye', tr: 'Türkiye' },
    tier: 'value',
    numberPattern: 'AX-#####',
  },
  {
    id: 'voltaris',
    name: 'Voltaris',
    country: { en: 'France', tr: 'Fransa' },
    tier: 'oe',
    numberPattern: 'V ### ### ###',
  },
  {
    id: 'luminex',
    name: 'Luminex',
    country: { en: 'Netherlands', tr: 'Hollanda' },
    tier: 'premium',
    numberPattern: 'LX#####@',
  },
  {
    id: 'coolpath',
    name: 'Coolpath',
    country: { en: 'Spain', tr: 'İspanya' },
    tier: 'oe',
    numberPattern: 'CP ####',
  },
  {
    id: 'tork',
    name: 'Tork',
    country: { en: 'Türkiye', tr: 'Türkiye' },
    tier: 'oe',
    numberPattern: 'TK-###-##',
  },
  {
    id: 'kavra',
    name: 'Kavra',
    country: { en: 'Poland', tr: 'Polonya' },
    tier: 'value',
    numberPattern: 'KV ##.##.###',
  },
  {
    id: 'clearview',
    name: 'Clearview',
    country: { en: 'Belgium', tr: 'Belçika' },
    tier: 'oe',
    numberPattern: 'CV ###@',
  },
  {
    id: 'viscol',
    name: 'Viscol',
    country: { en: 'United Kingdom', tr: 'Birleşik Krallık' },
    tier: 'premium',
    numberPattern: 'VS-####',
  },
]

const brandById = new Map(brands.map((brand) => [brand.id, brand]))

export function findBrand(id: string): Brand | undefined {
  return brandById.get(id)
}

type FitBy = 'model' | 'engine' | 'universal'

interface PartType {
  id: string
  category: CategoryId
  name: Text
  fitBy: FitBy
  /** Engine-fitted parts only exist for these fuels. */
  fuels?: Fuel[]
  /** One part per position, e.g. a left and a right control arm. */
  positions?: Position[]
  brands: string[]
  price: [number, number]
  weight: [number, number]
  warranty: number
  /** How likely a generation or engine family gets this part in the catalogue. */
  coverage: number
  specs: (random: Random) => Array<[SpecKey, SpecValue]>
  /** Universal parts come in a few fixed sizes rather than one per car. */
  variants?: Array<{ suffix: Text; specs: Array<[SpecKey, SpecValue]>; price: number }>
}

type Random = () => number

/**
 * Fisher–Yates with a fixed number of draws. A random `sort` comparator is called a different
 * number of times by different engines, which would give the browser and the tests different
 * catalogues.
 */
function shuffle<T>(random: Random, items: readonly T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1))
    ;[result[index], result[other]] = [result[other]!, result[index]!]
  }
  return result
}

const between = (random: Random, min: number, max: number) =>
  Math.round(min + random() * (max - min))
const pick = <T>(random: Random, items: readonly T[]): T =>
  items[Math.floor(random() * items.length)]!

/** Every fitted part a car needs from time to time, and the stock items that fit any car. */
const partTypes: PartType[] = [
  {
    id: 'frontPads',
    category: 'brakes',
    name: { en: 'Front brake pad set', tr: 'Ön fren balata seti' },
    fitBy: 'model',
    positions: ['front'],
    brands: ['ferrox', 'brakeon', 'axion'],
    price: [1150, 2250],
    weight: [1.4, 2.2],
    warranty: 24,
    coverage: 1,
    specs: (random) => [
      ['width', `${between(random, 116, 156)}.${between(random, 0, 9)} mm`],
      ['height', `${between(random, 48, 64)}.${between(random, 0, 9)} mm`],
      ['thickness', `${between(random, 17, 20)} mm`],
      ['wearSensor', random() > 0.5],
    ],
  },
  {
    id: 'rearPads',
    category: 'brakes',
    name: { en: 'Rear brake pad set', tr: 'Arka fren balata seti' },
    fitBy: 'model',
    positions: ['rear'],
    brands: ['ferrox', 'brakeon', 'axion'],
    price: [950, 1850],
    weight: [0.9, 1.5],
    warranty: 24,
    coverage: 0.8,
    specs: (random) => [
      ['width', `${between(random, 88, 124)}.${between(random, 0, 9)} mm`],
      ['height', `${between(random, 40, 52)}.${between(random, 0, 9)} mm`],
      ['thickness', `${between(random, 15, 17)} mm`],
      ['wearSensor', false],
    ],
  },
  {
    id: 'frontDiscs',
    category: 'brakes',
    name: { en: 'Front brake discs (pair)', tr: 'Ön fren diski (çift)' },
    fitBy: 'model',
    positions: ['front'],
    brands: ['ferrox', 'brakeon'],
    price: [2600, 4600],
    weight: [9, 14],
    warranty: 24,
    coverage: 1,
    specs: (random) => {
      const diameter = pick(random, [258, 260, 276, 280, 288, 300, 312])
      return [
        ['diameter', `${diameter} mm`],
        ['thickness', `${pick(random, [22, 24, 25, 26])} mm`],
        ['minThickness', `${pick(random, [20, 21, 22, 23])} mm`],
        ['boltHoles', String(pick(random, [4, 5]))],
        ['ventilated', true],
      ]
    },
  },
  {
    id: 'rearDiscs',
    category: 'brakes',
    name: { en: 'Rear brake discs (pair)', tr: 'Arka fren diski (çift)' },
    fitBy: 'model',
    positions: ['rear'],
    brands: ['ferrox', 'brakeon'],
    price: [2100, 3800],
    weight: [7, 10],
    warranty: 24,
    coverage: 0.6,
    specs: (random) => [
      ['diameter', `${pick(random, [240, 253, 264, 272])} mm`],
      ['thickness', `${pick(random, [9, 10, 12])} mm`],
      ['minThickness', `${pick(random, [8, 9, 10])} mm`],
      ['boltHoles', String(pick(random, [4, 5]))],
      ['ventilated', false],
    ],
  },
  {
    id: 'caliper',
    category: 'brakes',
    name: { en: 'Brake caliper', tr: 'Fren kaliperi' },
    fitBy: 'model',
    positions: ['frontLeft', 'frontRight'],
    brands: ['brakeon'],
    price: [3400, 5800],
    weight: [3.2, 4.6],
    warranty: 12,
    coverage: 0.45,
    specs: (random) => [
      ['diameter', `${pick(random, [48, 54, 57, 60])} mm`],
      ['material', 'Cast iron'],
    ],
  },
  {
    id: 'oilFilter',
    category: 'filters',
    name: { en: 'Oil filter', tr: 'Yağ filtresi' },
    fitBy: 'engine',
    brands: ['filtrix', 'aeroclean'],
    price: [240, 460],
    weight: [0.2, 0.5],
    warranty: 12,
    coverage: 1,
    specs: (random) =>
      random() > 0.5
        ? [
            ['filterType', 'Cartridge'],
            ['outerDiameter', `${between(random, 64, 72)} mm`],
            ['height', `${between(random, 90, 140)} mm`],
          ]
        : [
            ['filterType', 'Spin-on'],
            ['thread', pick(random, ['M20x1.5', '3/4-16 UNF', 'M22x1.5'])],
            ['outerDiameter', `${between(random, 76, 93)} mm`],
            ['height', `${between(random, 65, 101)} mm`],
          ],
  },
  {
    id: 'airFilter',
    category: 'filters',
    name: { en: 'Air filter', tr: 'Hava filtresi' },
    fitBy: 'engine',
    brands: ['filtrix', 'aeroclean'],
    price: [340, 680],
    weight: [0.3, 0.7],
    warranty: 12,
    coverage: 1,
    specs: (random) => [
      ['length', `${between(random, 220, 330)} mm`],
      ['width', `${between(random, 150, 220)} mm`],
      ['height', `${between(random, 40, 70)} mm`],
    ],
  },
  {
    id: 'cabinFilter',
    category: 'filters',
    name: { en: 'Cabin air filter', tr: 'Polen filtresi' },
    fitBy: 'model',
    brands: ['filtrix', 'aeroclean'],
    price: [290, 620],
    weight: [0.2, 0.4],
    warranty: 12,
    coverage: 1,
    specs: (random) => [
      ['length', `${between(random, 200, 280)} mm`],
      ['width', `${between(random, 180, 240)} mm`],
      ['activatedCarbon', random() > 0.4],
    ],
  },
  {
    id: 'fuelFilter',
    category: 'filters',
    name: { en: 'Fuel filter', tr: 'Yakıt filtresi' },
    fitBy: 'engine',
    fuels: ['diesel'],
    brands: ['filtrix', 'aeroclean'],
    price: [620, 1150],
    weight: [0.4, 0.8],
    warranty: 12,
    coverage: 1,
    specs: (random) => [
      ['filterType', 'In-line'],
      ['height', `${between(random, 120, 180)} mm`],
    ],
  },
  {
    id: 'frontShock',
    category: 'suspension',
    name: { en: 'Front shock absorber', tr: 'Ön amortisör' },
    fitBy: 'model',
    positions: ['frontLeft', 'frontRight'],
    brands: ['nordline', 'axion'],
    price: [2300, 4200],
    weight: [3.5, 5],
    warranty: 24,
    coverage: 0.8,
    specs: (random) => [
      ['shockType', pick(random, ['Gas pressure', 'Twin-tube gas'])],
      ['length', `${between(random, 480, 560)} mm`],
    ],
  },
  {
    id: 'rearShock',
    category: 'suspension',
    name: { en: 'Rear shock absorber', tr: 'Arka amortisör' },
    fitBy: 'model',
    positions: ['rear'],
    brands: ['nordline', 'axion'],
    price: [1700, 3100],
    weight: [2, 3],
    warranty: 24,
    coverage: 0.8,
    specs: (random) => [
      ['shockType', 'Gas pressure'],
      ['length', `${between(random, 330, 420)} mm`],
    ],
  },
  {
    id: 'controlArm',
    category: 'suspension',
    name: { en: 'Control arm', tr: 'Salıncak' },
    fitBy: 'model',
    positions: ['frontLeft', 'frontRight'],
    brands: ['nordline', 'axion'],
    price: [1800, 3300],
    weight: [2.8, 4.2],
    warranty: 24,
    coverage: 0.75,
    specs: (random) => [['material', pick(random, ['Steel', 'Aluminium'])]],
  },
  {
    id: 'stabLink',
    category: 'suspension',
    name: { en: 'Stabiliser link', tr: 'Z rot' },
    fitBy: 'model',
    positions: ['front'],
    brands: ['nordline', 'axion'],
    price: [420, 820],
    weight: [0.3, 0.6],
    warranty: 12,
    coverage: 0.85,
    specs: (random) => [
      ['length', `${between(random, 240, 300)} mm`],
      ['thread', 'M10x1.5'],
    ],
  },
  {
    id: 'tieRodEnd',
    category: 'suspension',
    name: { en: 'Tie rod end', tr: 'Rot başı' },
    fitBy: 'model',
    positions: ['frontLeft', 'frontRight'],
    brands: ['nordline', 'axion'],
    price: [480, 940],
    weight: [0.4, 0.8],
    warranty: 12,
    coverage: 0.6,
    specs: () => [['thread', 'M14x1.5']],
  },
  {
    id: 'timingKit',
    category: 'engine',
    name: { en: 'Timing belt kit', tr: 'Triger seti' },
    fitBy: 'engine',
    brands: ['tork'],
    price: [4200, 8900],
    weight: [1.1, 2],
    warranty: 24,
    coverage: 0.8,
    specs: (random) => [
      ['teeth', String(between(random, 110, 160))],
      ['width', `${pick(random, [20, 22, 25, 27])} mm`],
      ['pieces', String(pick(random, [3, 4, 5]))],
    ],
  },
  {
    id: 'sparkPlug',
    category: 'engine',
    name: { en: 'Spark plug set (4)', tr: 'Buji takımı (4 adet)' },
    fitBy: 'engine',
    fuels: ['petrol', 'hybrid'],
    brands: ['voltaris', 'tork'],
    price: [980, 1850],
    weight: [0.2, 0.3],
    warranty: 12,
    coverage: 1,
    specs: (random) => [
      ['thread', pick(random, ['M12x1.25', 'M14x1.25'])],
      ['gap', `${pick(random, ['0.7', '0.8', '0.9', '1.0'])} mm`],
      ['material', pick(random, ['Iridium', 'Platinum', 'Nickel'])],
    ],
  },
  {
    id: 'glowPlug',
    category: 'engine',
    name: { en: 'Glow plug', tr: 'Kızdırma bujisi' },
    fitBy: 'engine',
    fuels: ['diesel'],
    brands: ['voltaris', 'tork'],
    price: [560, 980],
    weight: [0.05, 0.1],
    warranty: 12,
    coverage: 1,
    specs: () => [
      ['voltage', '4.4 V'],
      ['thread', 'M8x1'],
    ],
  },
  {
    id: 'engineMount',
    category: 'engine',
    name: { en: 'Engine mount', tr: 'Motor kulağı' },
    fitBy: 'model',
    brands: ['nordline', 'axion'],
    price: [1400, 2800],
    weight: [1, 2.2],
    warranty: 12,
    coverage: 0.7,
    specs: () => [['material', 'Rubber-metal']],
  },
  {
    id: 'serpentineBelt',
    category: 'engine',
    name: { en: 'V-ribbed belt', tr: 'Kanallı kayış' },
    fitBy: 'engine',
    brands: ['tork'],
    price: [380, 820],
    weight: [0.1, 0.3],
    warranty: 12,
    coverage: 0.9,
    specs: (random) => [
      ['ribs', String(pick(random, [5, 6]))],
      ['length', `${between(random, 1050, 1900)} mm`],
    ],
  },
  {
    id: 'alternator',
    category: 'electrical',
    name: { en: 'Alternator', tr: 'Alternatör' },
    fitBy: 'engine',
    brands: ['voltaris'],
    price: [7400, 14200],
    weight: [4.5, 7],
    warranty: 24,
    coverage: 0.6,
    specs: (random) => [
      ['voltage', '14 V'],
      ['amperage', `${pick(random, [90, 110, 120, 150, 180])} A`],
    ],
  },
  {
    id: 'starter',
    category: 'electrical',
    name: { en: 'Starter motor', tr: 'Marş motoru' },
    fitBy: 'engine',
    brands: ['voltaris'],
    price: [5900, 11200],
    weight: [3, 5],
    warranty: 24,
    coverage: 0.55,
    specs: (random) => [
      ['voltage', '12 V'],
      ['kw', `${pick(random, ['1.1', '1.4', '1.7', '2.0', '2.2'])} kW`],
      ['teeth', String(pick(random, [9, 10, 11, 12]))],
    ],
  },
  {
    id: 'ignitionCoil',
    category: 'electrical',
    name: { en: 'Ignition coil', tr: 'Ateşleme bobini' },
    fitBy: 'engine',
    fuels: ['petrol', 'hybrid'],
    brands: ['voltaris', 'tork'],
    price: [1350, 2650],
    weight: [0.3, 0.6],
    warranty: 12,
    coverage: 0.9,
    specs: (random) => [['connector', `${pick(random, [3, 4])}-pin`]],
  },
  {
    id: 'absSensor',
    category: 'electrical',
    name: { en: 'ABS wheel speed sensor', tr: 'ABS sensörü' },
    fitBy: 'model',
    positions: ['front', 'rear'],
    brands: ['voltaris'],
    price: [880, 1850],
    weight: [0.1, 0.3],
    warranty: 12,
    coverage: 0.55,
    specs: (random) => [
      ['length', `${between(random, 400, 900)} mm`],
      ['connector', '2-pin'],
    ],
  },
  {
    id: 'headlamp',
    category: 'lighting',
    name: { en: 'Headlamp', tr: 'Far' },
    fitBy: 'model',
    positions: ['frontLeft', 'frontRight'],
    brands: ['luminex'],
    price: [6400, 14200],
    weight: [2.8, 4.5],
    warranty: 24,
    coverage: 0.6,
    specs: (random) => [
      ['lampType', pick(random, ['Halogen', 'LED', 'Halogen with LED DRL'])],
      ['bulb', pick(random, ['H7 + H1', 'H4', 'LED module'])],
    ],
  },
  {
    id: 'tailLight',
    category: 'lighting',
    name: { en: 'Tail light', tr: 'Stop lambası' },
    fitBy: 'model',
    positions: ['rearLeft', 'rearRight'],
    brands: ['luminex'],
    price: [2400, 5600],
    weight: [1, 2],
    warranty: 24,
    coverage: 0.5,
    specs: (random) => [['lampType', pick(random, ['Bulb', 'LED'])]],
  },
  {
    id: 'radiator',
    category: 'cooling',
    name: { en: 'Radiator', tr: 'Motor su radyatörü' },
    fitBy: 'engine',
    brands: ['coolpath'],
    price: [3400, 6600],
    weight: [3.5, 6],
    warranty: 24,
    coverage: 0.7,
    specs: (random) => [
      ['coreSize', `${between(random, 580, 720)} x ${between(random, 380, 440)} mm`],
      ['material', 'Aluminium'],
    ],
  },
  {
    id: 'waterPump',
    category: 'cooling',
    name: { en: 'Water pump', tr: 'Devirdaim pompası' },
    fitBy: 'engine',
    brands: ['coolpath', 'tork'],
    price: [1750, 3600],
    weight: [1, 2.2],
    warranty: 24,
    coverage: 0.85,
    specs: (random) => [['teeth', String(between(random, 19, 25))]],
  },
  {
    id: 'thermostat',
    category: 'cooling',
    name: { en: 'Thermostat', tr: 'Termostat' },
    fitBy: 'engine',
    brands: ['coolpath'],
    price: [680, 1450],
    weight: [0.2, 0.5],
    warranty: 12,
    coverage: 0.8,
    specs: (random) => [['openingTemperature', `${pick(random, [83, 87, 89, 92, 105])} °C`]],
  },
  {
    id: 'dpf',
    category: 'exhaust',
    name: { en: 'Diesel particulate filter', tr: 'Dizel partikül filtresi (DPF)' },
    fitBy: 'engine',
    fuels: ['diesel'],
    brands: ['kavra'],
    price: [17800, 31500],
    weight: [8, 14],
    warranty: 24,
    coverage: 0.8,
    specs: () => [
      ['emission', 'Euro 6'],
      ['material', 'Silicon carbide'],
    ],
  },
  {
    id: 'catalyst',
    category: 'exhaust',
    name: { en: 'Catalytic converter', tr: 'Katalitik konvertör' },
    fitBy: 'engine',
    fuels: ['petrol', 'hybrid'],
    brands: ['kavra'],
    price: [11800, 21900],
    weight: [5, 9],
    warranty: 24,
    coverage: 0.6,
    specs: (random) => [['emission', pick(random, ['Euro 5', 'Euro 6'])]],
  },
  {
    id: 'rearMuffler',
    category: 'exhaust',
    name: { en: 'Rear silencer', tr: 'Arka egzoz susturucusu' },
    fitBy: 'model',
    brands: ['kavra'],
    price: [2150, 4300],
    weight: [5, 9],
    warranty: 12,
    coverage: 0.7,
    specs: () => [['material', 'Aluminised steel']],
  },
  {
    id: 'lambdaSensor',
    category: 'exhaust',
    name: { en: 'Lambda sensor', tr: 'Oksijen (lambda) sensörü' },
    fitBy: 'engine',
    fuels: ['petrol', 'hybrid'],
    brands: ['voltaris'],
    price: [1750, 3450],
    weight: [0.1, 0.3],
    warranty: 12,
    coverage: 0.8,
    specs: (random) => [
      ['connector', `${pick(random, [4, 5])}-pin`],
      ['length', `${between(random, 300, 700)} mm`],
    ],
  },
  {
    id: 'clutchKit',
    category: 'transmission',
    name: { en: 'Clutch kit', tr: 'Debriyaj seti' },
    fitBy: 'engine',
    brands: ['axion', 'tork'],
    price: [6400, 12400],
    weight: [5, 8],
    warranty: 24,
    coverage: 0.9,
    specs: (random) => [
      ['clutchDiameter', `${pick(random, [200, 215, 228, 240])} mm`],
      ['splines', String(pick(random, [20, 21, 22, 23, 26]))],
      ['pieces', '3'],
    ],
  },
  {
    id: 'flywheel',
    category: 'transmission',
    name: { en: 'Dual-mass flywheel', tr: 'Çift kütleli volan' },
    fitBy: 'engine',
    fuels: ['diesel'],
    brands: ['axion'],
    price: [13800, 23900],
    weight: [8, 12],
    warranty: 24,
    coverage: 0.9,
    specs: (random) => [['teeth', String(between(random, 129, 135))]],
  },
  {
    id: 'cvJoint',
    category: 'transmission',
    name: { en: 'CV joint kit', tr: 'Aks kafası seti' },
    fitBy: 'model',
    positions: ['frontLeft', 'frontRight'],
    brands: ['axion'],
    price: [1950, 3800],
    weight: [1.8, 3],
    warranty: 12,
    coverage: 0.5,
    specs: (random) => [
      ['splines', `${pick(random, [22, 23, 25, 26])} / ${pick(random, [22, 23, 25])}`],
      ['outerDiameter', `${pick(random, [52, 56, 58])} mm`],
    ],
  },
  {
    id: 'frontWipers',
    category: 'wipers',
    name: { en: 'Front wiper blade set', tr: 'Ön silecek süpürgesi seti' },
    fitBy: 'model',
    brands: ['clearview'],
    price: [460, 920],
    weight: [0.3, 0.5],
    warranty: 6,
    coverage: 1,
    specs: (random) => [
      ['length', `${pick(random, [600, 650, 700])} + ${pick(random, [350, 380, 400, 450])} mm`],
      ['material', 'Flat blade, rubber'],
    ],
  },
  {
    id: 'rearWiper',
    category: 'wipers',
    name: { en: 'Rear wiper blade', tr: 'Arka silecek süpürgesi' },
    fitBy: 'model',
    brands: ['clearview'],
    price: [190, 420],
    weight: [0.1, 0.2],
    warranty: 6,
    coverage: 0.6,
    specs: (random) => [['length', `${pick(random, [250, 280, 300, 350])} mm`]],
  },
  {
    id: 'battery',
    category: 'batteries',
    name: { en: 'Car battery', tr: 'Akü' },
    fitBy: 'universal',
    brands: ['voltaris', 'tork'],
    price: [0, 0],
    weight: [14, 24],
    warranty: 24,
    coverage: 1,
    specs: () => [['voltage', '12 V']],
    variants: [
      {
        suffix: { en: '60 Ah', tr: '60 Ah' },
        price: 3450,
        specs: [
          ['capacity', '60 Ah'],
          ['cca', '540 A'],
          ['technology', 'Lead-acid'],
          ['terminal', 'Right +'],
        ],
      },
      {
        suffix: { en: '72 Ah', tr: '72 Ah' },
        price: 4150,
        specs: [
          ['capacity', '72 Ah'],
          ['cca', '680 A'],
          ['technology', 'EFB start-stop'],
          ['terminal', 'Right +'],
        ],
      },
      {
        suffix: { en: '95 Ah AGM', tr: '95 Ah AGM' },
        price: 8350,
        specs: [
          ['capacity', '95 Ah'],
          ['cca', '850 A'],
          ['technology', 'AGM start-stop'],
          ['terminal', 'Right +'],
        ],
      },
    ],
  },
  {
    id: 'engineOil',
    category: 'fluids',
    name: { en: 'Engine oil', tr: 'Motor yağı' },
    fitBy: 'universal',
    brands: ['viscol', 'tork'],
    price: [0, 0],
    weight: [3.6, 4.6],
    warranty: 0,
    coverage: 1,
    specs: () => [],
    variants: [
      {
        suffix: { en: '5W-30 · 4 L', tr: '5W-30 · 4 L' },
        price: 1690,
        specs: [
          ['viscosity', '5W-30'],
          ['volume', '4 L'],
          ['approval', 'ACEA C3, VW 504.00/507.00'],
        ],
      },
      {
        suffix: { en: '5W-40 · 4 L', tr: '5W-40 · 4 L' },
        price: 1540,
        specs: [
          ['viscosity', '5W-40'],
          ['volume', '4 L'],
          ['approval', 'ACEA A3/B4, RN 0700/0710'],
        ],
      },
      {
        suffix: { en: '0W-20 · 4 L', tr: '0W-20 · 4 L' },
        price: 1890,
        specs: [
          ['viscosity', '0W-20'],
          ['volume', '4 L'],
          ['approval', 'API SP, ILSAC GF-6A'],
        ],
      },
      {
        suffix: { en: '10W-40 · 5 L', tr: '10W-40 · 5 L' },
        price: 1290,
        specs: [
          ['viscosity', '10W-40'],
          ['volume', '5 L'],
          ['approval', 'ACEA A3/B4'],
        ],
      },
    ],
  },
  {
    id: 'coolant',
    category: 'fluids',
    name: { en: 'Coolant concentrate', tr: 'Antifriz' },
    fitBy: 'universal',
    brands: ['viscol', 'coolpath'],
    price: [0, 0],
    weight: [1.6, 3.2],
    warranty: 0,
    coverage: 1,
    specs: () => [],
    variants: [
      {
        suffix: { en: 'G12++ · 1.5 L', tr: 'G12++ · 1,5 L' },
        price: 420,
        specs: [
          ['standard', 'G12++'],
          ['volume', '1.5 L'],
        ],
      },
      {
        suffix: { en: 'G12++ · 3 L', tr: 'G12++ · 3 L' },
        price: 760,
        specs: [
          ['standard', 'G12++'],
          ['volume', '3 L'],
        ],
      },
    ],
  },
  {
    id: 'brakeFluid',
    category: 'fluids',
    name: { en: 'Brake fluid', tr: 'Fren hidroliği' },
    fitBy: 'universal',
    brands: ['viscol', 'brakeon'],
    price: [0, 0],
    weight: [0.5, 1.1],
    warranty: 0,
    coverage: 1,
    specs: () => [],
    variants: [
      {
        suffix: { en: 'DOT 4 · 0.5 L', tr: 'DOT 4 · 0,5 L' },
        price: 260,
        specs: [
          ['standard', 'DOT 4'],
          ['volume', '0.5 L'],
        ],
      },
      {
        suffix: { en: 'DOT 4 · 1 L', tr: 'DOT 4 · 1 L' },
        price: 440,
        specs: [
          ['standard', 'DOT 4'],
          ['volume', '1 L'],
        ],
      },
    ],
  },
  {
    id: 'bulb',
    category: 'lighting',
    name: { en: 'Headlight bulbs (pair)', tr: 'Far ampulü (çift)' },
    fitBy: 'universal',
    brands: ['luminex', 'voltaris'],
    price: [0, 0],
    weight: [0.1, 0.2],
    warranty: 6,
    coverage: 1,
    specs: () => [['voltage', '12 V']],
    variants: [
      {
        suffix: { en: 'H7 +150%', tr: 'H7 +%150' },
        price: 560,
        specs: [
          ['bulb', 'H7'],
          ['wattage', '55 W'],
          ['colourTemperature', '3500 K'],
        ],
      },
      {
        suffix: { en: 'H4 +150%', tr: 'H4 +%150' },
        price: 540,
        specs: [
          ['bulb', 'H4'],
          ['wattage', '60/55 W'],
          ['colourTemperature', '3500 K'],
        ],
      },
      {
        suffix: { en: 'H7 LED kit', tr: 'H7 LED kit' },
        price: 2350,
        specs: [
          ['bulb', 'H7'],
          ['wattage', '25 W'],
          ['colourTemperature', '6000 K'],
        ],
      },
    ],
  },
]

const typeById = new Map(partTypes.map((type) => [type.id, type]))

export function partTypeName(typeId: string, language: Language): string {
  return typeById.get(typeId)?.name[language] ?? typeId
}

/** Parts a mechanic replaces together, so the product page can offer them as a set. */
export const complements: Record<string, string[]> = {
  frontPads: ['frontDiscs', 'brakeFluid'],
  frontDiscs: ['frontPads'],
  rearPads: ['rearDiscs'],
  rearDiscs: ['rearPads'],
  oilFilter: ['engineOil', 'airFilter'],
  airFilter: ['cabinFilter', 'oilFilter'],
  cabinFilter: ['airFilter'],
  fuelFilter: ['oilFilter', 'airFilter'],
  timingKit: ['waterPump', 'serpentineBelt'],
  waterPump: ['timingKit', 'thermostat', 'coolant'],
  thermostat: ['coolant'],
  radiator: ['coolant', 'thermostat'],
  sparkPlug: ['ignitionCoil'],
  ignitionCoil: ['sparkPlug'],
  clutchKit: ['flywheel'],
  flywheel: ['clutchKit'],
  frontShock: ['stabLink'],
  controlArm: ['tieRodEnd', 'stabLink'],
  tieRodEnd: ['controlArm'],
  frontWipers: ['rearWiper'],
  headlamp: ['bulb'],
  caliper: ['frontPads', 'brakeFluid'],
}

export interface Part {
  id: string
  typeId: string
  category: CategoryId
  brandId: string
  /** The maker's own part number. */
  sku: string
  /** Car makers' numbers this part replaces; every brand of the same part shares them. */
  oem: Array<{ make: string; number: string }>
  /** Parts with the same group are the same part from different brands. */
  group: string
  name: Text
  position?: Position
  price: number
  compareAt?: number
  stock: Record<WarehouseId, number>
  warranty: number
  weight: number
  rating: number
  reviews: number
  sold: number
  specs: Array<[SpecKey, SpecValue]>
  fitment: Fitment
}

/** mulberry32: small, fast and the same on every machine, so the catalogue never shifts. */
function seeded(seed: number): Random {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function fillPattern(random: Random, pattern: string): string {
  return pattern.replace(/[#@]/g, (char) =>
    char === '#'
      ? String(Math.floor(random() * 10))
      : String.fromCharCode(65 + between(random, 0, 25)),
  )
}

const oemPatterns: Record<string, string> = {
  Renault: '## ## ### ##R',
  Dacia: '## ## ### ##R',
  Fiat: '5#######',
  Volkswagen: '#Q# ### ### @',
  Ford: '@@##-#@###-@@',
  Toyota: '#####-#####',
  Hyundai: '#####-@#@##',
  Opel: '13 ### ###',
  Honda: '#####-@@#-@##',
}

/** Consumer price: never below cost, ending in ,90 like a shop shelf. */
function shelfPrice(value: number): number {
  return Math.max(Math.round(value / 10) * 10 - 0.1, 9.9)
}

const tierPrice = { premium: 1.22, oe: 1, value: 0.78 }
const tierRating = { premium: [4.4, 5], oe: [4.1, 4.9], value: [3.6, 4.6] }

/**
 * Keeps the catalogue at a few hundred parts. Everyday service parts (coverage 1) exist for
 * every car; the rest are thinned out, as a real shop stocks most of them, not all.
 */
const coverageScale = 0.7

function covered(random: Random, type: PartType): boolean {
  const roll = random()
  return type.coverage >= 1 || roll <= type.coverage * coverageScale
}

interface Group {
  key: string
  type: PartType
  applications: Application[]
  makes: string[]
  position?: Position
  scale: number
}

function fitmentGroups(random: Random): Group[] {
  const groups: Group[] = []
  const families = new Map<string, Application[]>()
  for (const generation of generations) {
    for (const item of generation.engines) {
      const list = families.get(item.family) ?? []
      const existing = list.find((entry) => entry.generationId === generation.id)
      if (existing) existing.engineIds.push(item.id)
      else list.push({ generationId: generation.id, engineIds: [item.id] })
      families.set(item.family, list)
    }
  }
  const fuelOf = (family: string) =>
    generations.flatMap((generation) => generation.engines).find((item) => item.family === family)!
      .fuel
  const makesOf = (applications: Application[]) => [
    ...new Set(
      applications.map((entry) => generations.find((g) => g.id === entry.generationId)!.make),
    ),
  ]
  // Bigger engines and bigger cars need bigger (dearer) parts.
  const engineScale = (family: string) => {
    const kw = generations
      .flatMap((generation) => generation.engines)
      .filter((item) => item.family === family)
      .map((item) => item.kw)
    return 0.85 + (Math.max(...kw) - 54) / 280
  }
  const modelScale = (generation: Generation) =>
    0.85 + (Math.max(...generation.engines.map((item) => item.kw)) - 54) / 320

  for (const type of partTypes) {
    if (type.fitBy === 'model') {
      for (const generation of generations) {
        if (!covered(random, type)) continue
        const applications = [
          { generationId: generation.id, engineIds: generation.engines.map((item) => item.id) },
        ]
        for (const position of type.positions ?? [undefined]) {
          groups.push({
            key: `${type.id}:${generation.id}:${position ?? ''}`,
            type,
            applications,
            makes: [generation.make],
            position,
            scale: modelScale(generation),
          })
        }
      }
    }
    if (type.fitBy === 'engine') {
      for (const [family, applications] of families) {
        if (type.fuels && !type.fuels.includes(fuelOf(family))) continue
        if (!covered(random, type)) continue
        groups.push({
          key: `${type.id}:${family}`,
          type,
          applications,
          makes: makesOf(applications),
          scale: engineScale(family),
        })
      }
    }
  }
  return groups
}

function stockFor(random: Random): Record<WarehouseId, number> {
  const roll = random()
  if (roll < 0.07) return { ist: 0, ank: 0, izm: 0 }
  if (roll < 0.2) return { ist: 0, ank: between(random, 0, 2), izm: between(random, 1, 2) }
  return {
    ist: between(random, 0, 48),
    ank: between(random, 0, 22),
    izm: between(random, 0, 18),
  }
}

function buildCatalog(): Part[] {
  const random = seeded(20260928)
  const parts: Part[] = []
  const usedIds = new Set<string>()

  const makePart = (
    type: PartType,
    brand: Brand,
    values: {
      group: string
      name: Text
      basePrice: number
      specs: Array<[SpecKey, SpecValue]>
      fitment: Fitment
      oem: Part['oem']
      position?: Position
    },
  ) => {
    const sku = fillPattern(random, brand.numberPattern)
    let id = `${brand.id}-${normalizeCode(sku).toLowerCase()}`
    while (usedIds.has(id)) id += 'x'
    usedIds.add(id)
    const price = shelfPrice(values.basePrice * tierPrice[brand.tier] * (0.94 + random() * 0.12))
    const [low, high] = tierRating[brand.tier] as [number, number]
    parts.push({
      id,
      typeId: type.id,
      category: type.category,
      brandId: brand.id,
      sku,
      oem: values.oem,
      group: values.group,
      name: values.name,
      position: values.position,
      price,
      compareAt: random() < 0.28 ? shelfPrice(price * (1.12 + random() * 0.28)) : undefined,
      stock: stockFor(random),
      warranty: brand.tier === 'premium' ? Math.max(type.warranty, 24) : type.warranty,
      weight:
        Math.round((type.weight[0] + random() * (type.weight[1] - type.weight[0])) * 100) / 100,
      rating: Math.round((low + random() * (high - low)) * 10) / 10,
      reviews: Math.floor(random() ** 2 * 420),
      sold: Math.floor(random() ** 1.6 * 2400),
      specs: values.specs,
      fitment: values.fitment,
    })
  }

  for (const group of fitmentGroups(random)) {
    const { type } = group
    const oem = group.makes.flatMap((make) =>
      Array.from({ length: random() > 0.7 ? 2 : 1 }, () => ({
        make,
        number: fillPattern(random, oemPatterns[make] ?? '#########'),
      })),
    )
    const basePrice = between(random, type.price[0], type.price[1]) * group.scale
    const specs = type.specs(random)
    // Most parts come from one brand; popular ones from two, at different price points.
    const count = random() < 0.2 ? Math.min(2, type.brands.length) : 1
    const brandIds = shuffle(random, type.brands).slice(0, count)
    const positionText = group.position ? positionNames[group.position] : undefined
    const sidedName: Text =
      positionText && !['front', 'rear'].includes(group.position ?? '')
        ? {
            en: `${type.name.en}, ${positionText.en}`,
            tr: `${type.name.tr}, ${positionText.tr}`,
          }
        : type.name
    const withAxle: Text =
      type.id === 'absSensor' && positionText
        ? { en: `${type.name.en}, ${positionText.en}`, tr: `${type.name.tr}, ${positionText.tr}` }
        : sidedName
    for (const brandId of brandIds) {
      makePart(type, findBrand(brandId)!, {
        group: group.key,
        name: withAxle,
        basePrice,
        specs,
        fitment: { kind: 'vehicles', applications: group.applications },
        oem,
        position: group.position,
      })
    }
  }

  for (const type of partTypes.filter((entry) => entry.fitBy === 'universal')) {
    for (const [index, variant] of (type.variants ?? []).entries()) {
      for (const brandId of type.brands) {
        makePart(type, findBrand(brandId)!, {
          group: `${type.id}:${index}`,
          name: {
            en: `${type.name.en} ${variant.suffix.en}`,
            tr: `${type.name.tr} ${variant.suffix.tr}`,
          },
          basePrice: variant.price,
          specs: [...type.specs(random), ...variant.specs],
          fitment: { kind: 'universal' },
          oem: [],
        })
      }
    }
  }

  return parts
}

export const partsCatalog: Part[] = buildCatalog()

const partById = new Map(partsCatalog.map((part) => [part.id, part]))

export function findPart(id: string): Part | undefined {
  return partById.get(id)
}

export function totalStock(part: Part): number {
  return part.stock.ist + part.stock.ank + part.stock.izm
}

export type StockLevel = 'inStock' | 'low' | 'out'

export function stockLevel(part: Part): StockLevel {
  const total = totalStock(part)
  if (total === 0) return 'out'
  return total <= 3 ? 'low' : 'inStock'
}

export function discountPercent(part: Part): number {
  return part.compareAt ? Math.round((1 - part.price / part.compareAt) * 100) : 0
}

export type FitResult = 'fits' | 'doesNotFit' | 'universal' | 'unknown'

export function fitFor(part: Part, vehicle: Vehicle | undefined): FitResult {
  if (part.fitment.kind === 'universal') return 'universal'
  if (!vehicle) return 'unknown'
  const fits = part.fitment.applications.some(
    (entry) =>
      entry.generationId === vehicle.generationId && entry.engineIds.includes(vehicle.engineId),
  )
  return fits ? 'fits' : 'doesNotFit'
}

/** One row per car and engine a part fits, as the compatibility table lists them. */
export interface CompatibilityRow {
  key: string
  make: string
  model: string
  code: string
  years: string
  engine: string
  kw: number
  fuel: Fuel
}

export function compatibilityRows(part: Part): CompatibilityRow[] {
  if (part.fitment.kind === 'universal') return []
  return part.fitment.applications.flatMap((entry) =>
    entry.engineIds.flatMap((engineId) => {
      const found = findEngine(engineId)
      if (!found) return []
      const { engine, generation } = found
      return [
        {
          key: `${generation.id}:${engine.id}`,
          make: generation.make,
          model: generation.model,
          code: generation.code,
          years: `${generation.yearFrom}–${generation.yearTo}`,
          engine: engine.label,
          kw: engine.kw,
          fuel: engine.fuel,
        },
      ]
    }),
  )
}

/** "Renault Clio IV (BH), Dacia Duster II (HM) +1" */
export function fitsSummary(part: Part, limit = 2): string {
  if (part.fitment.kind === 'universal') return ''
  const names = part.fitment.applications.map((entry) =>
    generationName(generations.find((generation) => generation.id === entry.generationId)!),
  )
  const shown = names.slice(0, limit).join(', ')
  return names.length > limit ? `${shown} +${names.length - limit}` : shown
}

/** Part numbers are typed with and without spaces, dots and dashes; compare them bare. */
export function normalizeCode(value: string): string {
  return value.toUpperCase().replace(/[\s.\-/]/g, '')
}

const foldMap: Record<string, string> = { ı: 'i', ş: 's', ğ: 'g', ü: 'u', ö: 'o', ç: 'c' }

/** Lower case with Turkish letters folded, so "balatasi" finds "balatası". */
export function foldText(value: string): string {
  return value
    .toLocaleLowerCase('tr')
    .replace(/[ışğüöç]/g, (char) => foldMap[char] ?? char)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/** Anything but letters, digits and "+" (as in G12++) separates words. */
const wordBreak = /[^\p{L}\p{N}+]+/u

const searchIndex = new Map(
  partsCatalog.map((part) => {
    const brand = findBrand(part.brandId)!
    const vehicles =
      part.fitment.kind === 'universal'
        ? ''
        : part.fitment.applications
            .map((entry) => {
              const generation = generations.find((item) => item.id === entry.generationId)!
              return `${generationName(generation)} ${entry.engineIds
                .map((id) => findEngine(id)?.engine.label ?? '')
                .join(' ')}`
            })
            .join(' ')
    const text = foldText(
      [
        part.name.en,
        part.name.tr,
        brand.name,
        categoryNames[part.category].en,
        categoryNames[part.category].tr,
        vehicles,
      ].join(' '),
    )
    const codes = [part.sku, ...part.oem.map((entry) => entry.number)].map(normalizeCode)
    const words = [...new Set(text.split(wordBreak).filter(Boolean))]
    return [part.id, { words, codes }] as const
  }),
)

export type SearchMatch = { part: Part; code?: string }

/**
 * Every word must start a word of the part's name, brand, category or cars, so "fren bal"
 * finds brake pads but "on" does not find a Honda. A query of three or more letters and
 * digits also matches the start or middle of any part number.
 */
export function searchParts(query: string, parts: Part[] = partsCatalog): SearchMatch[] {
  const words = foldText(query).split(wordBreak).filter(Boolean)
  const code = normalizeCode(query)
  if (words.length === 0) return parts.map((part) => ({ part }))
  const matches: SearchMatch[] = []
  for (const part of parts) {
    const entry = searchIndex.get(part.id)!
    if (code.length >= 3) {
      const index = entry.codes.findIndex((value) => value.includes(code))
      if (index >= 0) {
        matches.push({
          part,
          code: index === 0 ? part.sku : part.oem[index - 1]?.number,
        })
        continue
      }
    }
    if (words.every((word) => entry.words.some((candidate) => candidate.startsWith(word)))) {
      matches.push({ part })
    }
  }
  return matches
}

export const sortOptions = ['relevance', 'priceAsc', 'priceDesc', 'rating', 'popular'] as const
export type SortOption = (typeof sortOptions)[number]

export interface CatalogFilters {
  query: string
  category?: CategoryId
  brands: string[]
  minPrice?: number
  maxPrice?: number
  inStock: boolean
  position?: PositionFilter
  /** Only parts that fit this car (plus the ones that fit any car). */
  vehicle?: Vehicle
  sort: SortOption
}

export function filterCatalog(filters: CatalogFilters, parts: Part[] = partsCatalog): Part[] {
  const matched = searchParts(filters.query, parts).map((match) => match.part)
  const result = matched.filter(
    (part) =>
      (!filters.category || part.category === filters.category) &&
      (filters.brands.length === 0 || filters.brands.includes(part.brandId)) &&
      (filters.minPrice === undefined || part.price >= filters.minPrice) &&
      (filters.maxPrice === undefined || part.price <= filters.maxPrice) &&
      (!filters.inStock || totalStock(part) > 0) &&
      (!filters.position || matchesPosition(part.position, filters.position)) &&
      (!filters.vehicle || fitFor(part, filters.vehicle) !== 'doesNotFit'),
  )
  const byStockThen = (compare: (a: Part, b: Part) => number) => (a: Part, b: Part) =>
    Number(totalStock(b) > 0) - Number(totalStock(a) > 0) || compare(a, b)
  switch (filters.sort) {
    case 'priceAsc':
      return result.sort((a, b) => a.price - b.price)
    case 'priceDesc':
      return result.sort((a, b) => b.price - a.price)
    case 'rating':
      return result.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    case 'popular':
      return result.sort((a, b) => b.sold - a.sold)
    default:
      // Parts made for the car first, then universal stock; in stock ahead of sold out.
      return result.sort(
        byStockThen(
          (a, b) =>
            Number(b.fitment.kind === 'vehicles') - Number(a.fitment.kind === 'vehicles') ||
            b.sold - a.sold,
        ),
      )
  }
}

export function categoryCounts(vehicle?: Vehicle): Record<CategoryId, number> {
  const counts = Object.fromEntries(categoryIds.map((id) => [id, 0])) as Record<CategoryId, number>
  for (const part of partsCatalog) {
    if (vehicle && fitFor(part, vehicle) === 'doesNotFit') continue
    counts[part.category] += 1
  }
  return counts
}

const sharesACar = (a: Part, b: Part) =>
  a.fitment.kind === 'universal' ||
  b.fitment.kind === 'universal' ||
  a.fitment.applications.some((left) =>
    (b.fitment as { applications: Application[] }).applications.some(
      (right) =>
        right.generationId === left.generationId &&
        right.engineIds.some((id) => left.engineIds.includes(id)),
    ),
  )

/** The same part from the other brands that make it. */
export function alternativesFor(part: Part): Part[] {
  return partsCatalog.filter((other) => other.group === part.group && other.id !== part.id)
}

/**
 * What is usually replaced along with this part, one of each, for a car both fit. The one
 * for the shopper's own car comes first when they have picked one.
 */
export function boughtTogether(part: Part, vehicle?: Vehicle): Part[] {
  const wanted = complements[part.typeId] ?? []
  return wanted.flatMap((typeId) => {
    const candidates = partsCatalog
      .filter(
        (other) =>
          other.typeId === typeId &&
          totalStock(other) > 0 &&
          sharesACar(part, other) &&
          (!vehicle || fitFor(other, vehicle) !== 'doesNotFit') &&
          (!part.position || !other.position || other.position === part.position),
      )
      .sort((a, b) => b.sold - a.sold)
    return candidates.slice(0, 1)
  })
}

/** Other parts in the same category for a car this one fits. */
export function relatedParts(part: Part, limit = 4): Part[] {
  return partsCatalog
    .filter(
      (other) =>
        other.category === part.category &&
        other.group !== part.group &&
        other.fitment.kind === part.fitment.kind &&
        sharesACar(part, other),
    )
    .sort((a, b) => b.sold - a.sold)
    .slice(0, limit)
}

export function priceBounds(): [number, number] {
  const prices = partsCatalog.map((part) => part.price)
  return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
}
