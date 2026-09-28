export type Fuel = 'petrol' | 'diesel' | 'hybrid'

export interface Engine {
  id: string
  /** The engine family: a part made for one fits every car that shares it. */
  family: string
  label: string
  fuel: Fuel
  kw: number
}

export interface Generation {
  id: string
  make: string
  model: string
  /** Chassis or generation code, as a parts counter would say it. */
  code: string
  yearFrom: number
  yearTo: number
  engines: Engine[]
}

const engine = (id: string, family: string, label: string, fuel: Fuel, kw: number): Engine => ({
  id,
  family,
  label,
  fuel,
  kw,
})

/** Cars common on Turkish roads, one entry per generation. */
export const generations: Generation[] = [
  {
    id: 'renault-clio-4',
    make: 'Renault',
    model: 'Clio',
    code: 'IV (BH)',
    yearFrom: 2012,
    yearTo: 2019,
    engines: [
      engine('clio4-09tce', 'H4Bt', '0.9 TCe 90', 'petrol', 66),
      engine('clio4-12', 'D4F', '1.2 16V 75', 'petrol', 54),
      engine('clio4-15dci', 'K9K', '1.5 dCi 90', 'diesel', 66),
    ],
  },
  {
    id: 'renault-clio-5',
    make: 'Renault',
    model: 'Clio',
    code: 'V (BF)',
    yearFrom: 2019,
    yearTo: 2025,
    engines: [
      engine('clio5-10tce', 'H4Dt', '1.0 TCe 100', 'petrol', 74),
      engine('clio5-15dci', 'K9K', '1.5 Blue dCi 100', 'diesel', 74),
    ],
  },
  {
    id: 'dacia-duster-2',
    make: 'Dacia',
    model: 'Duster',
    code: 'II (HM)',
    yearFrom: 2018,
    yearTo: 2025,
    engines: [
      engine('duster2-13tce', 'H5Ht', '1.3 TCe 130', 'petrol', 96),
      engine('duster2-15dci', 'K9K', '1.5 Blue dCi 115', 'diesel', 85),
    ],
  },
  {
    id: 'fiat-egea',
    make: 'Fiat',
    model: 'Egea',
    code: '356',
    yearFrom: 2015,
    yearTo: 2025,
    engines: [
      engine('egea-14fire', 'FIRE', '1.4 Fire 95', 'petrol', 70),
      engine('egea-13mjt', 'MJT13', '1.3 Multijet 95', 'diesel', 70),
      engine('egea-16mjt', 'MJT16', '1.6 Multijet 120', 'diesel', 88),
    ],
  },
  {
    id: 'vw-golf-7',
    make: 'Volkswagen',
    model: 'Golf',
    code: 'VII (5G)',
    yearFrom: 2012,
    yearTo: 2020,
    engines: [
      engine('golf7-12tsi', 'EA211-12', '1.2 TSI 110', 'petrol', 81),
      engine('golf7-14tsi', 'EA211-14', '1.4 TSI 125', 'petrol', 92),
      engine('golf7-16tdi', 'EA288-16', '1.6 TDI 110', 'diesel', 81),
    ],
  },
  {
    id: 'vw-passat-b8',
    make: 'Volkswagen',
    model: 'Passat',
    code: 'B8 (3G)',
    yearFrom: 2014,
    yearTo: 2023,
    engines: [
      engine('passat8-14tsi', 'EA211-14', '1.4 TSI 150', 'petrol', 110),
      engine('passat8-16tdi', 'EA288-16', '1.6 TDI 120', 'diesel', 88),
      engine('passat8-20tdi', 'EA288-20', '2.0 TDI 150', 'diesel', 110),
    ],
  },
  {
    id: 'ford-focus-3',
    make: 'Ford',
    model: 'Focus',
    code: 'III (DYB)',
    yearFrom: 2011,
    yearTo: 2018,
    engines: [
      engine('focus3-16tivct', 'SIGMA', '1.6 Ti-VCT 125', 'petrol', 92),
      engine('focus3-15tdci', 'DV6', '1.5 TDCi 120', 'diesel', 88),
    ],
  },
  {
    id: 'ford-focus-4',
    make: 'Ford',
    model: 'Focus',
    code: 'IV (HN)',
    yearFrom: 2018,
    yearTo: 2025,
    engines: [
      engine('focus4-10eco', 'FOX', '1.0 EcoBoost 125', 'petrol', 92),
      engine('focus4-15eco', 'PANTHER', '1.5 EcoBlue 120', 'diesel', 88),
    ],
  },
  {
    id: 'toyota-corolla-e180',
    make: 'Toyota',
    model: 'Corolla',
    code: 'E180',
    yearFrom: 2013,
    yearTo: 2019,
    engines: [
      engine('cor180-133', '1NR', '1.33 Dual VVT-i 99', 'petrol', 73),
      engine('cor180-14d4d', '1ND', '1.4 D-4D 90', 'diesel', 66),
      engine('cor180-16', '1ZR', '1.6 Valvematic 132', 'petrol', 97),
    ],
  },
  {
    id: 'toyota-corolla-e210',
    make: 'Toyota',
    model: 'Corolla',
    code: 'E210',
    yearFrom: 2019,
    yearTo: 2025,
    engines: [
      engine('cor210-15', 'M15A', '1.5 VVT-i 125', 'petrol', 92),
      engine('cor210-18h', '2ZR-FXE', '1.8 Hybrid 122', 'hybrid', 90),
    ],
  },
  {
    id: 'hyundai-i20-gb',
    make: 'Hyundai',
    model: 'i20',
    code: 'GB',
    yearFrom: 2014,
    yearTo: 2020,
    engines: [
      engine('i20gb-12', 'KAPPA12', '1.2 MPI 84', 'petrol', 62),
      engine('i20gb-14crdi', 'U2-14', '1.4 CRDi 90', 'diesel', 66),
    ],
  },
  {
    id: 'hyundai-i20-bc3',
    make: 'Hyundai',
    model: 'i20',
    code: 'BC3',
    yearFrom: 2020,
    yearTo: 2025,
    engines: [
      engine('i20bc3-10tgdi', 'KAPPA10T', '1.0 T-GDi 100', 'petrol', 74),
      engine('i20bc3-14', 'KAPPA14', '1.4 MPI 100', 'petrol', 74),
    ],
  },
  {
    id: 'opel-astra-k',
    make: 'Opel',
    model: 'Astra',
    code: 'K',
    yearFrom: 2015,
    yearTo: 2021,
    engines: [
      engine('astrak-14t', 'B14XFT', '1.4 Turbo 150', 'petrol', 110),
      engine('astrak-16cdti', 'B16DTH', '1.6 CDTI 136', 'diesel', 100),
    ],
  },
  {
    id: 'honda-civic-fc',
    make: 'Honda',
    model: 'Civic',
    code: 'X (FC)',
    yearFrom: 2016,
    yearTo: 2021,
    engines: [
      engine('civicfc-16', 'R16', '1.6 i-VTEC 125', 'petrol', 92),
      engine('civicfc-15t', 'L15B7', '1.5 VTEC Turbo 182', 'petrol', 134),
    ],
  },
]

export const makes = [...new Set(generations.map((generation) => generation.make))].sort()

const generationById = new Map(generations.map((generation) => [generation.id, generation]))
const engineById = new Map(
  generations.flatMap((generation) =>
    generation.engines.map((item) => [item.id, { engine: item, generation }] as const),
  ),
)

export function findGeneration(id: string): Generation | undefined {
  return generationById.get(id)
}

export function findEngine(id: string): { engine: Engine; generation: Generation } | undefined {
  return engineById.get(id)
}

/** A car in someone's garage: a generation, the year it was built and its engine. */
export interface Vehicle {
  id: string
  generationId: string
  year: number
  engineId: string
}

export function vehicleId(generationId: string, year: number, engineId: string): string {
  return `${generationId}:${year}:${engineId}`
}

export function isValidVehicle(vehicle: Omit<Vehicle, 'id'>): boolean {
  const generation = findGeneration(vehicle.generationId)
  return (
    generation !== undefined &&
    vehicle.year >= generation.yearFrom &&
    vehicle.year <= generation.yearTo &&
    generation.engines.some((item) => item.id === vehicle.engineId)
  )
}

/** "Renault Clio IV (BH)" */
export function generationName(generation: Generation): string {
  return `${generation.make} ${generation.model} ${generation.code}`
}

/** "Renault Clio 1.5 dCi 90 · 2016" */
export function vehicleName(vehicle: Vehicle): string {
  const found = findEngine(vehicle.engineId)
  if (!found) return ''
  return `${found.generation.make} ${found.generation.model} ${found.engine.label} · ${vehicle.year}`
}

export function yearsOf(generation: Generation): number[] {
  return Array.from(
    { length: generation.yearTo - generation.yearFrom + 1 },
    (_, index) => generation.yearTo - index,
  )
}

/** "Clio" for a badge: the model is how people name their own car. */
export function shortCarName(vehicle: Vehicle): string {
  return findEngine(vehicle.engineId)?.generation.model ?? ''
}
