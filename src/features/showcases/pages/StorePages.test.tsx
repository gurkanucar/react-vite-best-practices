import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { useStoreCart } from '@/features/showcases/hooks/useStoreCart'
import { StoreCheckoutPage } from '@/features/showcases/pages/StoreCheckoutPage'
import { StoreHomePage } from '@/features/showcases/pages/StoreHomePage'
import { StoreProductPage } from '@/features/showcases/pages/StoreProductPage'
import { usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Routes>
          <Route path="/preview/store" element={<StoreHomePage standalone />} />
          <Route
            path="/preview/store/products/:productId"
            element={<StoreProductPage standalone />}
          />
          <Route path="/preview/store/checkout" element={<StoreCheckoutPage standalone />} />
        </Routes>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

const drawer = () => document.querySelector<HTMLElement>('.store-drawer')!

/*
 * jsdom matches no media query, so these run the phone layout: the filters live in a drawer.
 * Controls are found by label and text; role queries are slow over antd trees in jsdom.
 */
describe('online store', () => {
  beforeEach(() => {
    usePreferencesStore.getState().setLanguage('en')
    useStoreCart.setState({ lines: [], coupon: null, drawerOpen: false })
  })

  it('narrows the catalog from the address bar and says when nothing matches', () => {
    const view = renderAt('/preview/store?category=lighting')

    expect(screen.getByText('2 products')).toBeInTheDocument()
    expect(screen.getByText('Halo table lamp')).toBeInTheDocument()
    expect(screen.queryByText('Oak stool')).not.toBeInTheDocument()
    view.unmount()

    renderAt('/preview/store?q=spaceship')
    expect(screen.getByText('Nothing matches those filters')).toBeInTheDocument()
  })

  it('searches and filters from the filter drawer, with removable chips', async () => {
    renderAt('/preview/store')

    fireEvent.change(screen.getByLabelText('Search products'), { target: { value: 'rug' } })
    expect(screen.getByText('1 product')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Search products'), { target: { value: '' } })

    fireEvent.click(screen.getByText('Filters'))
    const panel = await screen.findByText('Show 14 products')
    fireEvent.click(screen.getByText('On sale'))
    expect(await screen.findByText('Show 6 products')).toBeInTheDocument()
    fireEvent.click(panel.closest('button')!)

    // The filter shows as a chip that removes it again.
    const chip = document.querySelector<HTMLElement>('.store-catalog__chips .ant-tag')!
    expect(chip).toHaveTextContent('On sale')
    fireEvent.click(chip.querySelector('.ant-tag-close-icon')!)
    await waitFor(() => expect(screen.getByText('14 products')).toBeInTheDocument())
  })

  it('adds the chosen colour and size to the cart and opens the drawer', async () => {
    renderAt('/preview/store/products/linen-cushion')

    expect(screen.getByText('Washed linen cushion', { selector: 'h1' })).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Sage'))
    fireEvent.click(screen.getByText('50 × 50'))
    // A larger size costs more.
    expect(screen.getAllByText('₺620').length).toBeGreaterThan(0)
    fireEvent.click(screen.getByLabelText('Increase quantity'))
    fireEvent.click(screen.getByText('Add to cart'))

    expect(useStoreCart.getState().lines).toEqual([
      { productId: 'linen-cushion', colour: 'sage', size: '50 × 50', quantity: 2 },
    ])
    expect(await screen.findByText('Your cart (2)')).toBeInTheDocument()
    // The line, the subtotal and the total: delivery is not chosen yet.
    expect(within(drawer()).getAllByText('₺1,240')).toHaveLength(3)
    expect(within(drawer()).getByText('Add ₺260 more for free delivery')).toBeInTheDocument()
  })

  it('says when a variant is sold out and will not add it', () => {
    renderAt('/preview/store/products/linen-cushion')

    fireEvent.click(screen.getByLabelText('Clay'))
    fireEvent.click(screen.getByText('50 × 50'))
    expect(screen.getByText('This option is sold out')).toBeInTheDocument()
    expect(screen.getByText('Sold out', { selector: 'span' }).closest('button')).toBeDisabled()
  })

  it('applies a discount code in the cart and refuses an unknown one', async () => {
    useStoreCart.setState({
      lines: [{ productId: 'morning-mugs', colour: 'sand', quantity: 2 }],
      drawerOpen: true,
    })
    renderAt('/preview/store')
    const cart = within(drawer())

    fireEvent.change(cart.getByLabelText('Discount code'), { target: { value: 'HALFOFF' } })
    fireEvent.click(cart.getByText('Apply'))
    expect(cart.getByText('That code is not valid.')).toBeInTheDocument()

    fireEvent.change(cart.getByLabelText('Discount code'), { target: { value: 'save250' } })
    fireEvent.click(cart.getByText('Apply'))
    expect(cart.getByText('This code needs an order of at least ₺2,000.')).toBeInTheDocument()

    fireEvent.change(cart.getByLabelText('Discount code'), { target: { value: 'welcome10' } })
    fireEvent.click(cart.getByText('Apply'))
    expect(await cart.findByText('Code WELCOME10 applied')).toBeInTheDocument()
    expect(cart.getByText('−₺84')).toBeInTheDocument()
    expect(cart.getByText('₺756')).toBeInTheDocument()
  })

  it('checks out in four steps, then confirms the order and empties the cart', async () => {
    useStoreCart.setState({
      lines: [{ productId: 'anatolia-rug', colour: 'clay', size: '120 × 180', quantity: 1 }],
    })
    renderAt('/preview/store/checkout')

    // Nothing moves on until the details are filled in.
    fireEvent.click(screen.getByText('Continue'))
    expect(await screen.findByText('Enter your email.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } })
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Ada Lovelace' } })
    fireEvent.change(screen.getByLabelText('Address'), { target: { value: 'Kemankeş Cd. 12' } })
    fireEvent.change(screen.getByLabelText('City'), { target: { value: 'İstanbul' } })
    fireEvent.change(screen.getByLabelText('Postal code'), { target: { value: '34425' } })
    fireEvent.click(screen.getByText('Continue'))

    // Over the threshold, standard delivery is free and express is not.
    fireEvent.click(await screen.findByText('Express'))
    await waitFor(() => expect(screen.getByText('₺3,629')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Continue'))

    fireEvent.change(await screen.findByLabelText('Name on card'), {
      target: { value: 'Ada Lovelace' },
    })
    fireEvent.change(screen.getByLabelText('Card number'), {
      target: { value: '4242424242424241' },
    })
    fireEvent.change(screen.getByLabelText('Expiry (MM/YY)'), { target: { value: '1230' } })
    fireEvent.change(screen.getByLabelText('CVC'), { target: { value: '123' } })
    fireEvent.click(screen.getByText('Continue'))
    expect(await screen.findByText('Enter a valid 16-digit card number.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Card number'), {
      target: { value: '4242424242424242' },
    })
    expect(screen.getByLabelText('Card number')).toHaveValue('4242 4242 4242 4242')
    expect(screen.getByLabelText('Expiry (MM/YY)')).toHaveValue('12/30')
    fireEvent.click(screen.getByText('Continue'))

    expect(await screen.findByText('Card ending 4242')).toBeInTheDocument()
    expect(screen.getByText('Express · ₺179')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Place order · ₺3,629'))

    expect(await screen.findByText('Thank you, your order is in')).toBeInTheDocument()
    expect(screen.getByText(/A receipt is on its way to ada@example.com/)).toBeInTheDocument()
    expect(useStoreCart.getState().lines).toEqual([])
  })

  it('points an empty checkout back to the shop, and shows a missing product as such', () => {
    const view = renderAt('/preview/store/checkout')
    expect(screen.getByText('There is nothing to check out')).toBeInTheDocument()
    view.unmount()

    renderAt('/preview/store/products/nope')
    expect(screen.getByText('Product not found')).toBeInTheDocument()
  })

  it('speaks Turkish, with lira in Turkish format', () => {
    usePreferencesStore.getState().setLanguage('tr')
    renderAt('/preview/store/products/anatolia-rug')

    expect(screen.getByText('Anadolu düz dokuma kilim', { selector: 'h1' })).toBeInTheDocument()
    expect(screen.getByText('₺3.450')).toBeInTheDocument()
    expect(screen.getByText('Sepete ekle')).toBeInTheDocument()
  })
})
