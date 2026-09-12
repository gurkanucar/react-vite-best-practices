import blush from '@/features/shop/assets/shoe-blush.svg'
import green from '@/features/shop/assets/shoe-green.svg'
import ink from '@/features/shop/assets/shoe-ink.svg'
import sand from '@/features/shop/assets/shoe-sand.svg'
import slate from '@/features/shop/assets/shoe-slate.svg'
import type { Invoice, Order, Product } from '@/features/shop/types'

export const product: Product = {
  id: 'SKU-4821',
  nameId: 'loafers',
  sku: 'RVB-4821-GRN',
  price: 97.14,
  compareAtPrice: 129,
  rating: 4,
  reviewCount: 9_120,
  status: 'published',
  stock: 'inStock',
  available: 72,
  colours: [
    { id: 'green', swatch: '#12b981', image: green },
    { id: 'slate', swatch: '#3c4a5c', image: slate },
    { id: 'blush', swatch: '#f2a6b3', image: blush },
    { id: 'sand', swatch: '#d9c3a0', image: sand },
    { id: 'ink', swatch: '#2b3a4f', image: ink },
  ],
  sizes: [7, 8, 9, 10, 11, 12],
  images: [green, slate, blush, sand, ink],
  specs: [
    { id: 'category', value: 'Footwear' },
    { id: 'manufacturer', value: 'Northbound' },
    { id: 'warranty', value: '12' },
    { id: 'serial', value: '358607726380311' },
    { id: 'shipsFrom', value: 'Portugal' },
  ],
  reviews: [
    {
      id: 'r-1',
      author: 'Lainey Davidson',
      rating: 5,
      postedAt: '2026-09-08',
      bodyId: 'comfort',
      helpful: 34,
    },
    {
      id: 'r-2',
      author: 'Cristopher Cardenas',
      rating: 4,
      postedAt: '2026-09-02',
      bodyId: 'sizing',
      helpful: 12,
    },
    {
      id: 'r-3',
      author: 'Melanie Noble',
      rating: 3,
      postedAt: '2026-08-27',
      bodyId: 'colour',
      helpful: 5,
    },
  ],
}

export const order: Order = {
  id: 'ORD-2026-1184',
  placedAt: '2026-09-09 14:22',
  status: 'shipped',
  customer: {
    name: 'Lainey Davidson',
    email: 'lainey.davidson@example.com',
    phone: '+1 (415) 555-0134',
  },
  shipTo: [
    'Lainey Davidson',
    '1400 Market Street, Apt 12',
    'San Francisco, CA 94103',
    'United States',
  ],
  shippingMethodId: 'express',
  trackingNumber: 'NB-4471-2290-118',
  lines: [
    {
      id: 'l-1',
      nameId: 'loafers',
      sku: 'RVB-4821-GRN',
      image: green,
      quantity: 1,
      unitPrice: 97.14,
    },
    {
      id: 'l-2',
      nameId: 'runners',
      sku: 'RVB-3310-SLT',
      image: slate,
      quantity: 2,
      unitPrice: 68.0,
    },
    {
      id: 'l-3',
      nameId: 'sandals',
      sku: 'RVB-2008-SND',
      image: sand,
      quantity: 1,
      unitPrice: 42.5,
    },
  ],
  shipping: 12,
  discount: 20,
  taxRate: 0.08,
  timeline: [
    { id: 'placed', at: '2026-09-09 14:22', done: true },
    { id: 'paid', at: '2026-09-09 14:23', done: true },
    { id: 'packed', at: '2026-09-10 09:05', done: true },
    { id: 'shipped', at: '2026-09-10 17:40', done: true },
    { id: 'delivered', at: '2026-09-13', done: false },
  ],
}

export const invoice: Invoice = {
  id: 'INV-2026-0044',
  status: 'pending',
  issuedAt: '2026-09-10',
  dueAt: '2026-09-24',
  from: {
    name: 'Northbound Supply Co.',
    address: ['19 Harbour Road', 'Porto 4050-123', 'Portugal'],
    phone: '+351 220 555 018',
  },
  to: {
    name: 'Lainey Davidson',
    address: ['1400 Market Street, Apt 12', 'San Francisco, CA 94103', 'United States'],
    phone: '+1 (415) 555-0134',
  },
  lines: [
    { id: 'i-1', titleId: 'wholesale', descriptionId: 'wholesale', quantity: 24, unitPrice: 64 },
    { id: 'i-2', titleId: 'fulfilment', descriptionId: 'fulfilment', quantity: 1, unitPrice: 180 },
    {
      id: 'i-3',
      titleId: 'photography',
      descriptionId: 'photography',
      quantity: 3,
      unitPrice: 120,
    },
  ],
  shipping: 40,
  discount: 100,
  taxRate: 0.23,
}
