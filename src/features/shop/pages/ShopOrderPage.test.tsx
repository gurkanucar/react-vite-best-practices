import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { order } from '@/features/shop/data'
import { ShopOrderPage } from '@/features/shop/pages/ShopOrderPage'
import { totalsFor } from '@/features/shop/types'
import { getMessages } from '@/i18n/messages'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/shop/order']}>
      <AppThemeProvider>
        <ShopOrderPage />
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

const messages = getMessages('en')

describe('ShopOrderPage', () => {
  it('lists every line of the order', () => {
    renderPage()

    for (const line of order.lines) {
      expect(
        screen.getByText(
          messages.shop.products[line.nameId as keyof typeof messages.shop.products],
        ),
      ).toBeInTheDocument()
    }
  })

  it('shows the same total the money helper arrives at', () => {
    renderPage()

    const { total } = totalsFor(order.lines, order)
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(total)

    expect(screen.getByText(formatted)).toBeInTheDocument()
  })

  it('marks the order delivered, then offers nothing more to do', () => {
    renderPage()

    const button = screen.getByRole('button', { name: messages.shop.markDelivered })

    fireEvent.click(button)

    // "Delivered" is also the name of the last timeline step, so the status is read off
    // the tag rather than by text alone.
    const tag = document.querySelector('.ant-tag') as HTMLElement

    expect(tag).toHaveTextContent(messages.shop.orderStatuses.delivered)
    expect(button).toBeDisabled()
  })

  it('marks the steps the order has already passed', () => {
    const { container } = renderPage()

    // Four of the five events are done, so the fifth is the one still ahead.
    expect(container.querySelectorAll('.ant-steps-item-finish')).toHaveLength(3)
    expect(container.querySelectorAll('.ant-steps-item-wait')).toHaveLength(1)
  })
})
