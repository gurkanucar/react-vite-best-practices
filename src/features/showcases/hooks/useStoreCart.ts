import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { findStoreProduct } from '@/features/showcases/data/store'
import {
  checkCoupon,
  findVariant,
  lineKey,
  type CartLine,
  type CouponCheck,
  type CouponCode,
} from '@/features/showcases/data/storeCart'

export const storeCartStorageKey = 'rvbp-store-cart'

interface StoreCartState {
  lines: CartLine[]
  coupon: CouponCode | null
  /** Whether the drawer is open; not persisted, a reload starts with it closed. */
  drawerOpen: boolean
  add: (line: CartLine) => void
  setQuantity: (key: string, quantity: number) => void
  remove: (key: string) => void
  applyCoupon: (input: string, subtotal: number) => CouponCheck
  removeCoupon: () => void
  clear: () => void
  openDrawer: () => void
  closeDrawer: () => void
}

/** Never more than the variant has in stock, never less than one. */
function clampToStock(line: CartLine, quantity: number): number {
  const product = findStoreProduct(line.productId)
  const stock = product ? (findVariant(product, line.colour, line.size)?.stock ?? 0) : 0
  return Math.max(1, Math.min(quantity, stock || 1))
}

export const useStoreCart = create<StoreCartState>()(
  persist(
    (set) => ({
      lines: [],
      coupon: null,
      drawerOpen: false,
      add: (line) =>
        set((state) => {
          const key = lineKey(line)
          const existing = state.lines.find((entry) => lineKey(entry) === key)
          if (!existing) {
            return {
              lines: [...state.lines, { ...line, quantity: clampToStock(line, line.quantity) }],
            }
          }
          return {
            lines: state.lines.map((entry) =>
              lineKey(entry) === key
                ? { ...entry, quantity: clampToStock(entry, entry.quantity + line.quantity) }
                : entry,
            ),
          }
        }),
      setQuantity: (key, quantity) =>
        set((state) => ({
          lines: state.lines.map((entry) =>
            lineKey(entry) === key ? { ...entry, quantity: clampToStock(entry, quantity) } : entry,
          ),
        })),
      remove: (key) =>
        set((state) => {
          const lines = state.lines.filter((entry) => lineKey(entry) !== key)
          return { lines, coupon: lines.length ? state.coupon : null }
        }),
      applyCoupon: (input, subtotal) => {
        const result = checkCoupon(input, subtotal)
        if (result.ok) set({ coupon: result.code })
        return result
      },
      removeCoupon: () => set({ coupon: null }),
      clear: () => set({ lines: [], coupon: null }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: storeCartStorageKey,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ lines, coupon }) => ({ lines, coupon }),
    },
  ),
)
