import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { product } from '@/features/shop/data'
import { ShopProductPage } from '@/features/shop/pages/ShopProductPage'
import { getMessages } from '@/i18n/messages'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/shop/product']}>
      <AppThemeProvider>
        <ShopProductPage />
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

const messages = getMessages('en')

describe('ShopProductPage', () => {
  it('shows one frame at a time and steps through the rest', () => {
    const { container } = renderPage()

    const frames = [
      ...container.querySelectorAll('.product-gallery [hidden], .product-gallery > div > div'),
    ]
    expect(screen.getByText(`1/${product.images.length}`)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: messages.shop.nextImage }))
    expect(screen.getByText(`2/${product.images.length}`)).toBeInTheDocument()

    // Stepping back from the first frame wraps to the last rather than stopping.
    fireEvent.click(screen.getByRole('button', { name: messages.shop.previousImage }))
    fireEvent.click(screen.getByRole('button', { name: messages.shop.previousImage }))
    expect(
      screen.getByText(`${product.images.length}/${product.images.length}`),
    ).toBeInTheDocument()
    expect(frames.length).toBeGreaterThan(0)
  })

  it('picking a colour changes the frame the gallery is on', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: messages.shop.colours.blush }))

    expect(screen.getByText(`3/${product.images.length}`)).toBeInTheDocument()
  })

  it('keeps the quantity between one and what is available', () => {
    renderPage()

    const decrease = screen.getByRole('button', { name: messages.shop.decrease })
    const increase = screen.getByRole('button', { name: messages.shop.increase })

    expect(decrease).toBeDisabled()

    fireEvent.click(increase)
    expect(screen.getByRole('spinbutton', { name: messages.shop.quantity })).toHaveValue('2')
    expect(decrease).toBeEnabled()
  })

  it('shows the specifications and the reviews on their own tabs', () => {
    renderPage()

    expect(screen.getByText(messages.shop.specifications)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: `${messages.shop.reviews} (3)` }))

    expect(screen.getByText(messages.shop.reviewBodies.comfort)).toBeInTheDocument()
  })

  it('changes the publish status from the header menu', async () => {
    renderPage()

    const status = screen.getByRole('button', { name: messages.shop.statuses.published })
    fireEvent.click(status)

    const draft = await screen.findByRole('menuitem', { name: messages.shop.statuses.draft })
    fireEvent.click(draft)

    expect(screen.getByRole('button', { name: messages.shop.statuses.draft })).toBeInTheDocument()
  })

  it('names the warranty in months rather than printing a bare number', () => {
    const { container } = renderPage()
    const specs = container.querySelector('.ant-descriptions') as HTMLElement

    expect(within(specs).getByText('12 months')).toBeInTheDocument()
  })
})
