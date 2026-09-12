import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProductsPage } from '@/features/products/pages/ProductsPage'
import { createQueryClient } from '@/lib/query/query-client'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ProductsPage', () => {
  it('loads paginated data from the second API origin', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn<typeof fetch>().mockImplementation((input) => {
      const url = String(input)
      const secondPage = url.includes('skip=10')
      const product = {
        category: 'beauty',
        description: 'Demo product',
        id: secondPage ? 11 : 1,
        price: 9.99,
        rating: 4.5,
        stock: 5,
        thumbnail: 'https://example.com/product.png',
        title: secondPage ? 'Second page product' : 'First page product',
      }

      return Promise.resolve(
        new Response(
          JSON.stringify({
            limit: 10,
            products: [product],
            skip: secondPage ? 10 : 0,
            total: 20,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
          },
        ),
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    render(
      <QueryClientProvider client={createQueryClient()}>
        <AppThemeProvider>
          <ProductsPage />
        </AppThemeProvider>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('First page product')).toBeInTheDocument()
    expect(screen.getByText('["products","list",{"limit":10,"skip":0}]')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenLastCalledWith(
      expect.stringContaining('https://dummyjson.com/products?limit=10'),
      expect.any(Object),
    )

    await user.click(screen.getByTitle('2'))

    expect(await screen.findByText('Second page product')).toBeInTheDocument()
    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith(
        expect.stringContaining('skip=10'),
        expect.any(Object),
      )
    })
    expect(screen.getByText('["products","list",{"limit":10,"skip":10}]')).toBeInTheDocument()
  })
})
