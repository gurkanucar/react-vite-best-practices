import dayjs from 'dayjs'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { findPart } from '@/features/showcases/data/partsCatalog'
import {
  clampQuantity,
  createOrder,
  orderNumber,
  resolveLines,
  seedOrders,
  type Address,
  type CartLine,
  type Order,
  type PaymentMethodId,
  type ShippingMethodId,
} from '@/features/showcases/data/partsCommerce'
import {
  isValidVehicle,
  vehicleId,
  vehicleName,
  type Vehicle,
} from '@/features/showcases/data/partsVehicles'

export const partsStorageKey = 'rvbp-parts'

interface PartsData {
  garage: Vehicle[]
  activeVehicleId: string | null
  cart: CartLine[]
  orders: Order[]
  /** Numbers the next order; starts above the example history. */
  nextOrder: number
}

interface PartsState extends PartsData {
  /** Not persisted: a reload starts with the drawer and the garage closed. */
  cartOpen: boolean
  garageOpen: boolean
  openGarage: () => void
  closeGarage: () => void
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => string | null
  removeVehicle: (id: string) => void
  selectVehicle: (id: string | null) => void
  addToCart: (partId: string, quantity?: number) => void
  setQuantity: (partId: string, quantity: number) => void
  removeFromCart: (partId: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  placeOrder: (values: {
    address: Address
    shipping: ShippingMethodId
    payment: PaymentMethodId
  }) => Order | null
  cancelOrder: (id: string) => void
  requestReturn: (id: string) => void
  reset: () => void
}

export function createInitialPartsData(now = dayjs()): PartsData {
  const garage: Vehicle[] = [
    {
      id: vehicleId('renault-clio-4', 2016, 'clio4-15dci'),
      generationId: 'renault-clio-4',
      year: 2016,
      engineId: 'clio4-15dci',
    },
  ]
  return {
    garage,
    activeVehicleId: null,
    cart: [],
    orders: seedOrders(now),
    nextOrder: 1214,
  }
}

export const usePartsStore = create<PartsState>()(
  persist(
    (set, get) => ({
      ...createInitialPartsData(),
      cartOpen: false,
      garageOpen: false,
      openGarage: () => set({ garageOpen: true }),
      closeGarage: () => set({ garageOpen: false }),
      addVehicle: (vehicle) => {
        if (!isValidVehicle(vehicle)) return null
        const id = vehicleId(vehicle.generationId, vehicle.year, vehicle.engineId)
        set((state) => ({
          garage: state.garage.some((entry) => entry.id === id)
            ? state.garage
            : [...state.garage, { ...vehicle, id }],
          activeVehicleId: id,
        }))
        return id
      },
      removeVehicle: (id) =>
        set((state) => ({
          garage: state.garage.filter((entry) => entry.id !== id),
          activeVehicleId: state.activeVehicleId === id ? null : state.activeVehicleId,
        })),
      selectVehicle: (id) => set({ activeVehicleId: id }),
      addToCart: (partId, quantity = 1) => {
        const part = findPart(partId)
        if (!part) return
        set((state) => {
          const existing = state.cart.find((line) => line.partId === partId)
          const cart = existing
            ? state.cart.map((line) =>
                line.partId === partId
                  ? { ...line, quantity: clampQuantity(part, line.quantity + quantity) }
                  : line,
              )
            : [...state.cart, { partId, quantity: clampQuantity(part, quantity) }]
          return { cart, cartOpen: true }
        })
      },
      setQuantity: (partId, quantity) => {
        const part = findPart(partId)
        if (!part) return
        set((state) => ({
          cart: state.cart.map((line) =>
            line.partId === partId ? { ...line, quantity: clampQuantity(part, quantity) } : line,
          ),
        }))
      },
      removeFromCart: (partId) =>
        set((state) => ({ cart: state.cart.filter((line) => line.partId !== partId) })),
      clearCart: () => set({ cart: [] }),
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      placeOrder: ({ address, shipping, payment }) => {
        const state = get()
        const lines = resolveLines(state.cart)
        if (lines.length === 0) return null
        const now = dayjs()
        const active = state.garage.find((entry) => entry.id === state.activeVehicleId)
        const order = createOrder({
          id: orderNumber(now, state.nextOrder),
          now,
          lines,
          address,
          shipping,
          payment,
          vehicle: active ? vehicleName(active) : undefined,
        })
        set({
          orders: [order, ...state.orders],
          cart: [],
          cartOpen: false,
          nextOrder: state.nextOrder + 1,
        })
        return order
      },
      cancelOrder: (id) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, cancelledAt: dayjs().toISOString() } : order,
          ),
        })),
      requestReturn: (id) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, returnRequestedAt: dayjs().toISOString() } : order,
          ),
        })),
      reset: () => set({ ...createInitialPartsData(), cartOpen: false, garageOpen: false }),
    }),
    {
      name: partsStorageKey,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ garage, activeVehicleId, cart, orders, nextOrder }) => ({
        garage,
        activeVehicleId,
        cart,
        orders,
        nextOrder,
      }),
      // Nothing older than version 1 exists; anything unrecognised starts from the seed.
      migrate: (persisted, version) =>
        (version === 1 ? persisted : createInitialPartsData()) as PartsData,
    },
  ),
)

export function useActiveVehicle(): Vehicle | undefined {
  return usePartsStore((state) => state.garage.find((entry) => entry.id === state.activeVehicleId))
}
