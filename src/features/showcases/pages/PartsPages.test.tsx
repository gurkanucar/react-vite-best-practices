import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  filterCatalog,
  findPart,
  fitFor,
  partsCatalog,
  totalStock,
} from '@/features/showcases/data/partsCatalog'
import { usePartsStore } from '@/features/showcases/hooks/usePartsStore'
import { PartsCatalogPage } from '@/features/showcases/pages/PartsCatalogPage'
import { PartsCheckoutPage } from '@/features/showcases/pages/PartsCheckoutPage'
import { PartsHomePage } from '@/features/showcases/pages/PartsHomePage'
import { PartsOrderPage } from '@/features/showcases/pages/PartsOrderPage'
import { PartsOrdersPage } from '@/features/showcases/pages/PartsOrdersPage'
import { PartsProductPage } from '@/features/showcases/pages/PartsProductPage'
import { usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Routes>
          <Route path="/preview/parts" element={<PartsHomePage standalone />} />
          <Route path="/preview/parts/catalog" element={<PartsCatalogPage standalone />} />
          <Route path="/preview/parts/products/:partId" element={<PartsProductPage standalone />} />
          <Route path="/preview/parts/checkout" element={<PartsCheckoutPage standalone />} />
          <Route path="/preview/parts/orders" element={<PartsOrdersPage standalone />} />
          <Route path="/preview/parts/orders/:orderId" element={<PartsOrderPage standalone />} />
        </Routes>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

const clio = { generationId: 'renault-clio-4', year: 2016, engineId: 'clio4-15dci' }

/*
 * jsdom matches no media query, so these run the phone layout: filters sit in a drawer.
 * Controls are found by label and text; role queries over this many antd nodes are slow.
 */
describe('auto parts showcase', () => {
  beforeEach(() => {
    usePreferencesStore.getState().setLanguage('en')
    usePartsStore.getState().reset()
  })

  it('opens on the hero, the vehicle picker and every category', () => {
    renderAt('/preview/parts')

    expect(screen.getByText('The right part for your car, the first time.')).toBeInTheDocument()
    expect(screen.getByLabelText('Make')).toBeInTheDocument()
    expect(screen.getByText('Clutch & drivetrain')).toBeInTheDocument()
    expect(screen.getByText('Deals this week')).toBeInTheDocument()
  })

  it('shows only the parts for the selected car, and every part on request', () => {
    usePartsStore.getState().addVehicle(clio)
    const vehicle = usePartsStore
      .getState()
      .garage.find((entry) => entry.engineId === clio.engineId)
    const fitting = filterCatalog({
      query: '',
      brands: [],
      inStock: false,
      vehicle,
      sort: 'relevance',
    })
    renderAt('/preview/parts/catalog')

    expect(
      screen.getByText('Showing parts for your Clio and parts that fit any car.'),
    ).toBeInTheDocument()
    expect(screen.getByText(`${fitting.length} parts`)).toBeInTheDocument()
    expect(screen.getAllByText('Fits your Clio').length).toBeGreaterThan(0)
    expect(screen.queryByText('Does not fit your Clio')).toBeNull()

    fireEvent.click(screen.getByLabelText('Only parts for my car'))
    expect(screen.getByText(`${partsCatalog.length} parts`)).toBeInTheDocument()
  })

  it('reads the category and the search from the address', () => {
    const part = partsCatalog.find((entry) => entry.category === 'filters' && entry.oem.length > 0)!
    renderAt(`/preview/parts/catalog?category=filters&q=${encodeURIComponent(part.oem[0]!.number)}`)

    expect(screen.getByText(`Results for “${part.oem[0]!.number}”`)).toBeInTheDocument()
    expect(screen.getAllByText(part.name.en).length).toBeGreaterThan(0)
  })

  it('adds a part to the cart from its page, within its stock', async () => {
    const part = partsCatalog.find((entry) => totalStock(entry) >= 3)!
    renderAt(`/preview/parts/products/${part.id}`)

    expect(screen.getAllByText(part.name.en).length).toBeGreaterThan(0)
    expect(screen.getByText('Stock by warehouse')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('+'))
    fireEvent.click(screen.getByText('Add to cart', { selector: '.parts-product__actions span' }))

    await waitFor(() =>
      expect(usePartsStore.getState().cart).toEqual([{ partId: part.id, quantity: 2 }]),
    )
    // The cart drawer opens on the free-delivery progress.
    expect(
      await screen.findByText(/for free standard delivery|Standard delivery is free/),
    ).toBeInTheDocument()
  })

  it('checks the part against the selected car on its page', () => {
    usePartsStore.getState().addVehicle(clio)
    const vehicle = usePartsStore.getState().garage.at(-1)!
    const wrong = partsCatalog.find((entry) => fitFor(entry, vehicle) === 'doesNotFit')!
    const { container } = renderAt(`/preview/parts/products/${wrong.id}`)

    // Scoped to the part's own badge: the related cards below carry theirs too.
    const badge = within(container.querySelector<HTMLElement>('.parts-product__fit')!)
    expect(badge.getByText('Does not fit your Clio')).toBeInTheDocument()
  })

  it('shows a not-found page for a part that does not exist', () => {
    renderAt('/preview/parts/products/nope')
    expect(screen.getByText('Part not found')).toBeInTheDocument()
  })

  it('checks out step by step, validating each step, and saves the order', async () => {
    const part = partsCatalog.find((entry) => entry.price > 1600 && entry.stock.ank > 0)!
    usePartsStore.getState().addToCart(part.id)
    usePartsStore.getState().closeCart()
    const before = usePartsStore.getState().orders.length
    const { container } = renderAt('/preview/parts/checkout')
    const next = () => fireEvent.click(screen.getByText('Continue'))

    next()
    expect((await screen.findAllByText('Required')).length).toBeGreaterThan(3)

    fireEvent.click(screen.getByText('Fill in a sample address'))
    fireEvent.change(screen.getByLabelText('Mobile phone'), { target: { value: '0212 123' } })
    next()
    expect(
      await screen.findByText('Enter a mobile number like 0555 123 45 67.'),
    ).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Mobile phone'), {
      target: { value: '0555 010 20 30' },
    })
    next()

    // Delivery: over the threshold, standard delivery is free.
    expect(await screen.findByText('Next-day express')).toBeInTheDocument()
    expect(screen.getAllByText('Free').length).toBeGreaterThan(0)
    next()

    fireEvent.change(await screen.findByLabelText('Name on card'), {
      target: { value: 'Deniz Aydın' },
    })
    fireEvent.change(screen.getByLabelText('Card number'), {
      target: { value: '4242424242424241' },
    })
    fireEvent.change(screen.getByLabelText('Expiry (MM/YY)'), { target: { value: '1230' } })
    fireEvent.change(screen.getByLabelText('CVC'), { target: { value: '123' } })
    next()
    expect(await screen.findByText('Check the card number.')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Card number'), {
      target: { value: '4242424242424242' },
    })
    // Typed digits are grouped as on the card.
    expect(screen.getByLabelText('Card number')).toHaveValue('4242 4242 4242 4242')
    next()

    expect(await screen.findByText('Credit or debit card · •••• 4242')).toBeInTheDocument()
    fireEvent.click(screen.getByText(/^Place order/))
    expect(
      await screen.findByText('Please accept the terms to place the order.'),
    ).toBeInTheDocument()
    fireEvent.click(container.querySelector('.parts-checkout__form .ant-checkbox-input')!)
    fireEvent.click(screen.getByText(/^Place order/))

    expect(await screen.findByText('Thank you, your order is in')).toBeInTheDocument()
    const state = usePartsStore.getState()
    expect(state.orders).toHaveLength(before + 1)
    expect(state.cart).toEqual([])
    expect(state.orders[0]).toMatchObject({
      shipping: 'standard',
      payment: 'card',
      address: { city: 'İstanbul', phone: '0555 010 20 30' },
    })
  })

  it('shows an empty cart instead of a checkout', () => {
    renderAt('/preview/parts/checkout')
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  it('lists the order history with where each parcel is', () => {
    renderAt('/preview/parts/orders')

    const [latest] = usePartsStore.getState().orders
    expect(screen.getByText(latest!.id)).toBeInTheDocument()
    for (const status of ['Being prepared', 'In transit', 'Cancelled', 'Delivered']) {
      expect(screen.getAllByText(status).length).toBeGreaterThan(0)
    }
  })

  it('tracks an order and cancels it while it is still being prepared', async () => {
    const order = usePartsStore.getState().orders[0]!
    const { container } = renderAt(`/preview/parts/orders/${order.id}`)

    expect(screen.getByText(`Order ${order.id}`)).toBeInTheDocument()
    expect(screen.getByText(order.trackingNumber)).toBeInTheDocument()
    const timeline = within(container.querySelector<HTMLElement>('.parts-timeline')!)
    expect(timeline.getByText('Order received')).toBeInTheDocument()
    expect(timeline.getByText('Out for delivery')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Cancel order'))
    fireEvent.click(await screen.findByText('Yes'))

    await waitFor(() => expect(usePartsStore.getState().orders[0]!.cancelledAt).toBeDefined())
    expect(timeline.getByText('Cancelled')).toBeInTheDocument()
    expect(screen.queryByText('Cancel order')).toBeNull()
  })

  it('shows a not-found page for an order that does not exist', () => {
    renderAt('/preview/parts/orders/TL-000000-0000')
    expect(screen.getByText('Order not found')).toBeInTheDocument()
    expect(findPart('nope')).toBeUndefined()
  })
})
