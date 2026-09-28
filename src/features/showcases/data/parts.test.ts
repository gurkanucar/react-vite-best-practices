import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import {
  boughtTogether,
  filterCatalog,
  fitFor,
  foldText,
  normalizeCode,
  partsCatalog,
  searchParts,
  totalStock,
  type Part,
} from '@/features/showcases/data/partsCatalog'
import {
  canCancel,
  canReturn,
  COD_FEE,
  createOrder,
  deliveryWindow,
  dispatchCutoff,
  expiryValid,
  luhnValid,
  orderStatus,
  orderTotals,
  phoneValid,
  seedOrders,
  shippingAvailable,
  trackingEvents,
  type Address,
  type ResolvedLine,
} from '@/features/showcases/data/partsCommerce'
import { generations, vehicleId, type Vehicle } from '@/features/showcases/data/partsVehicles'

const car = (generationId: string, year: number, engineId: string): Vehicle => ({
  id: vehicleId(generationId, year, engineId),
  generationId,
  year,
  engineId,
})
const clioDiesel = car('renault-clio-4', 2016, 'clio4-15dci')
const clioPetrol = car('renault-clio-4', 2016, 'clio4-09tce')
const dusterDiesel = car('dacia-duster-2', 2020, 'duster2-15dci')

const line = (part: Part, quantity = 1): ResolvedLine => ({
  part,
  quantity,
  total: Math.round(part.price * quantity * 100) / 100,
})
const first = (predicate: (part: Part) => boolean) => partsCatalog.find(predicate)!

const address: Address = {
  fullName: 'Ada Test',
  phone: '0555 111 22 33',
  email: 'ada@example.com',
  city: 'Ankara',
  district: 'Çankaya',
  line: 'Test Sk. 1',
  postcode: '06000',
}

describe('parts catalogue', () => {
  it('is several hundred parts, generated the same way every time', () => {
    expect(partsCatalog.length).toBeGreaterThanOrEqual(300)
    expect(partsCatalog.length).toBeLessThanOrEqual(600)
    expect(new Set(partsCatalog.map((part) => part.id)).size).toBe(partsCatalog.length)
    expect(partsCatalog.every((part) => part.price > 0)).toBe(true)
  })

  it('stocks the everyday service parts for every car', () => {
    for (const generation of generations) {
      const vehicle = car(generation.id, generation.yearFrom, generation.engines[0]!.id)
      for (const typeId of ['frontPads', 'oilFilter', 'airFilter', 'cabinFilter']) {
        expect(
          partsCatalog.some((part) => part.typeId === typeId && fitFor(part, vehicle) === 'fits'),
          `${typeId} for ${generation.id}`,
        ).toBe(true)
      }
    }
  })

  it('fits engine parts to every car sharing the engine family, and no other', () => {
    const filter = first(
      (part) =>
        part.typeId === 'oilFilter' &&
        part.fitment.kind === 'vehicles' &&
        part.fitment.applications.some((entry) => entry.engineIds.includes('clio4-15dci')),
    )
    expect(fitFor(filter, clioDiesel)).toBe('fits')
    // The Duster's 1.5 dCi is the same K9K engine.
    expect(fitFor(filter, dusterDiesel)).toBe('fits')
    expect(fitFor(filter, clioPetrol)).toBe('doesNotFit')
    expect(fitFor(filter, undefined)).toBe('unknown')
    expect(
      fitFor(
        first((part) => part.typeId === 'engineOil'),
        clioDiesel,
      ),
    ).toBe('universal')
  })

  it('finds a part by any OEM number, typed with or without spaces and dashes', () => {
    const part = first((entry) => entry.oem.length > 0)
    const number = part.oem[0]!.number
    const bare = normalizeCode(number)
    const [match] = searchParts(bare.toLowerCase()).filter((entry) => entry.part.id === part.id)
    expect(match?.code).toBe(number)
    expect(searchParts(part.sku.replace(/\s/g, '-')).map((entry) => entry.part.id)).toContain(
      part.id,
    )
  })

  it('searches names in either language, with or without Turkish letters', () => {
    expect(foldText('Ön fren balatası')).toBe('on fren balatasi')
    const typesFor = (query: string) =>
      new Set(searchParts(query).map((entry) => entry.part.typeId))
    expect(typesFor('on fren balata')).toEqual(new Set(['frontPads']))
    expect(typesFor('ÖN FREN BALATA')).toEqual(new Set(['frontPads']))
    expect(typesFor('front brake pad')).toEqual(new Set(['frontPads']))
    // Engine names split the same way as the query: "1.5 dci" is two words.
    expect(searchParts('clio 1.5 dci glow').length).toBeGreaterThan(0)
  })

  it('filters by car, keeping parts that fit any car, and by position and stock', () => {
    const forClio = filterCatalog({
      query: '',
      brands: [],
      inStock: false,
      vehicle: clioDiesel,
      sort: 'relevance',
    })
    expect(forClio.every((part) => fitFor(part, clioDiesel) !== 'doesNotFit')).toBe(true)
    expect(forClio.some((part) => part.fitment.kind === 'universal')).toBe(true)

    const rearInStock = filterCatalog({
      query: '',
      brands: [],
      inStock: true,
      position: 'rear',
      sort: 'priceAsc',
    })
    expect(rearInStock.every((part) => part.position?.startsWith('rear'))).toBe(true)
    expect(rearInStock.every((part) => totalStock(part) > 0)).toBe(true)
    expect(rearInStock.map((part) => part.price)).toEqual(
      [...rearInStock.map((part) => part.price)].sort((a, b) => a - b),
    )
  })

  it('suggests the discs that go with a set of pads, for the same car', () => {
    const pads = first((part) => part.typeId === 'frontPads' && fitFor(part, clioDiesel) === 'fits')
    const [discs] = boughtTogether(pads, clioDiesel)
    expect(discs?.typeId).toBe('frontDiscs')
    expect(fitFor(discs!, clioDiesel)).toBe('fits')
  })
})

describe('parts checkout', () => {
  const cheap = first((part) => part.price < 500 && totalStock(part) > 0)
  const dear = first((part) => part.price > 2000 && totalStock(part) > 0)

  it('adds delivery below the free threshold, and a transfer discount or door fee', () => {
    const small = orderTotals([line(cheap)], 'standard', 'card')
    expect(small.shipping).toBe(69.9)
    expect(small.total).toBeCloseTo(cheap.price + 69.9, 2)
    // Prices include VAT; the invoice shows the share of it.
    expect(small.vat).toBeCloseTo(small.total - small.total / 1.2, 2)

    const big = orderTotals([line(dear)], 'standard', 'transfer')
    expect(big.shipping).toBe(0)
    expect(big.discount).toBeCloseTo(dear.price * 0.03, 2)

    expect(orderTotals([line(dear)], 'express', 'cod').codFee).toBe(COD_FEE)
  })

  it('ships today before the cut-off, and skips Sunday otherwise', () => {
    const wednesday = dayjs('2026-09-30T14:30:00')
    expect(dispatchCutoff(wednesday)).toMatchObject({ shipsToday: true, minutesLeft: 90 })

    const saturdayAfternoon = dayjs('2026-10-03T14:00:00')
    const monday = dispatchCutoff(saturdayAfternoon)
    expect(monday.shipsToday).toBe(false)
    expect(monday.dispatchDay.format('YYYY-MM-DD')).toBe('2026-10-05')

    // Dispatched Saturday, a next-day parcel arrives Monday, not Sunday.
    const [from] = deliveryWindow('express', dayjs('2026-10-03T09:00:00'))
    expect(from.format('dddd')).toBe('Monday')
  })

  it('only offers same-day delivery in Istanbul with the parts on the Istanbul shelf', () => {
    const inIstanbul = first((part) => part.stock.ist > 2)
    const morning = dayjs('2026-09-30T10:00:00')
    expect(shippingAvailable('sameDay', [line(inIstanbul)], 'İstanbul', morning)).toBe(true)
    expect(shippingAvailable('sameDay', [line(inIstanbul)], 'Ankara', morning)).toBe(false)
    expect(
      shippingAvailable('sameDay', [line(inIstanbul)], 'İstanbul', dayjs('2026-09-30T17:00:00')),
    ).toBe(false)
  })

  it('checks card numbers, expiry dates and phone numbers', () => {
    expect(luhnValid('4242 4242 4242 4242')).toBe(true)
    expect(luhnValid('4242 4242 4242 4241')).toBe(false)
    const now = dayjs('2026-09-28T12:00:00')
    expect(expiryValid('09/26', now)).toBe(true)
    expect(expiryValid('08/26', now)).toBe(false)
    expect(expiryValid('13/30', now)).toBe(false)
    expect(phoneValid('0555 123 45 67')).toBe(true)
    expect(phoneValid('555 123 45 67')).toBe(true)
    expect(phoneValid('0212 123 45 67')).toBe(false)
  })
})

describe('parts orders and tracking', () => {
  const placed = dayjs('2026-09-28T10:00:00')
  const order = createOrder({
    id: 'TL-TEST-1',
    now: placed,
    lines: [line(first((part) => totalStock(part) > 0))],
    address,
    shipping: 'standard',
    payment: 'card',
  })

  it('plays a demo delivery back in minutes, step by step', () => {
    expect(orderStatus(order, placed)).toBe('received')
    expect(orderStatus(order, placed.add(1, 'minute'))).toBe('preparing')
    expect(orderStatus(order, placed.add(7, 'minute'))).toBe('inTransit')
    expect(orderStatus(order, placed.add(20, 'minute'))).toBe('delivered')
    const events = trackingEvents(order, placed.add(7, 'minute'))
    expect(events.map((event) => event.done)).toEqual([true, true, true, true, false, false])
    // The transfer centre is chosen by the delivery city.
    expect(events[3]!.location.en).toBe('Ankara transfer centre')
  })

  it('can be cancelled until it reaches the carrier, and returned for 14 days', () => {
    expect(canCancel(order, placed.add(1, 'minute'))).toBe(true)
    expect(canCancel(order, placed.add(3, 'minute'))).toBe(false)
    expect(canReturn(order, placed.add(10, 'minute'))).toBe(false)
    expect(canReturn(order, placed.add(1, 'day'))).toBe(true)
    expect(canReturn(order, placed.add(20, 'day'))).toBe(false)

    const cancelled = { ...order, cancelledAt: placed.add(1, 'minute').toISOString() }
    expect(orderStatus(cancelled, placed.add(1, 'day'))).toBe('cancelled')
    expect(trackingEvents(cancelled, placed.add(1, 'day')).map((event) => event.stage)).toEqual([
      'received',
      'preparing',
      'cancelled',
    ])
  })

  it('seeds a history with an order in every state', () => {
    const now = dayjs()
    const statuses = seedOrders(now).map((entry) => orderStatus(entry, now))
    expect(statuses).toEqual(['preparing', 'inTransit', 'cancelled', 'delivered'])
  })
})
