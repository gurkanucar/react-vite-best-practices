import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation, useNavigate } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProductsListPage } from '@/features/products/pages/ProductsListPage'
import { createQueryClient } from '@/lib/query/query-client'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

afterEach(() => {
  vi.unstubAllGlobals()
})

function jsonResponse(data: unknown) {
  return Promise.resolve(
    new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    }),
  )
}

function stubProductsApi() {
  const fetchMock = vi.fn<typeof fetch>().mockImplementation((input) => {
    const url = String(input)

    if (url.includes('/products/categories')) {
      return jsonResponse([
        { name: 'Beauty', slug: 'beauty', url: 'https://dummyjson.com/products/category/beauty' },
        {
          name: 'Laptops',
          slug: 'laptops',
          url: 'https://dummyjson.com/products/category/laptops',
        },
      ])
    }

    const secondPage = url.includes('skip=10')
    const searched = url.includes('/products/search')
    const filteredByCategory = url.includes('/products/category/laptops')
    const sortedByPrice = url.includes('sortBy=price')

    const title = searched
      ? 'Search result product'
      : filteredByCategory
        ? 'Laptop product'
        : sortedByPrice
          ? 'Cheapest product'
          : secondPage
            ? 'Second page product'
            : 'First page product'

    return jsonResponse({
      limit: 10,
      products: [
        {
          category: filteredByCategory ? 'laptops' : 'beauty',
          description: 'Demo product',
          id: secondPage ? 11 : 1,
          price: 9.99,
          rating: 4.5,
          stock: 5,
          thumbnail: 'https://example.com/product.png',
          title,
        },
      ],
      skip: secondPage ? 10 : 0,
      total: 20,
    })
  })

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function renderPage() {
  return render(
    <QueryClientProvider client={createQueryClient()}>
      <AppThemeProvider>
        <MemoryRouter initialEntries={['/products']}>
          <ProductsListPage />
          <LocationProbe />
        </MemoryRouter>
      </AppThemeProvider>
    </QueryClientProvider>,
  )
}

describe('ProductsListPage', () => {
  it('syncs real API pagination and search filters with the URL', async () => {
    const user = userEvent.setup()
    const fetchMock = stubProductsApi()

    renderPage()

    expect(await screen.findByText('First page product')).toBeInTheDocument()
    expect(screen.getByText('["products","list",{"limit":10,"skip":0}]')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
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
    expect(screen.getByTestId('location-search')).toHaveTextContent('?page=2')

    const searchInput = screen.getByLabelText('Search products')
    await user.type(searchInput, 'phone{Enter}')

    expect(await screen.findByText('Search result product')).toBeInTheDocument()
    expect(screen.getByTestId('location-search')).toHaveTextContent('?q=phone')
    expect(fetchMock).toHaveBeenLastCalledWith(
      expect.stringContaining('https://dummyjson.com/products/search?'),
      expect.any(Object),
    )
    expect(fetchMock).toHaveBeenLastCalledWith(
      expect.stringContaining('q=phone'),
      expect.any(Object),
    )

    await user.click(screen.getByRole('button', { name: 'Go back' }))

    expect(screen.getByTestId('location-search')).toHaveTextContent('?page=2')
    expect(await screen.findByText('Second page product')).toBeInTheDocument()
  })

  it('sends sorting to the server and keeps it in the URL', async () => {
    const user = userEvent.setup()
    const fetchMock = stubProductsApi()

    renderPage()

    expect(await screen.findByText('First page product')).toBeInTheDocument()

    await user.click(screen.getByRole('columnheader', { name: /Price/ }))

    expect(await screen.findByText('Cheapest product')).toBeInTheDocument()
    expect(screen.getByTestId('location-search')).toHaveTextContent('sort=price')
    expect(screen.getByTestId('location-search')).toHaveTextContent('order=asc')
    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith(
        expect.stringContaining('sortBy=price'),
        expect.any(Object),
      )
    })
  })

  it('builds category filter options from the API and switches endpoints', async () => {
    const user = userEvent.setup()
    const fetchMock = stubProductsApi()

    renderPage()

    expect(await screen.findByText('First page product')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /filter/i }))
    // The options are not derived from the loaded rows; they come from their own request.
    expect(await screen.findByText('Laptops')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      'https://dummyjson.com/products/categories',
      expect.any(Object),
    )

    await user.click(screen.getByText('Laptops'))
    await user.click(screen.getByRole('button', { name: 'OK' }))

    expect(await screen.findByText('Laptop product')).toBeInTheDocument()
    expect(screen.getByTestId('location-search')).toHaveTextContent('category=laptops')
    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith(
        expect.stringContaining('/products/category/laptops'),
        expect.any(Object),
      )
    })
  })
})

function LocationProbe() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <>
      <output data-testid="location-search">{location.search}</output>
      <button type="button" onClick={() => void navigate(-1)}>
        Go back
      </button>
    </>
  )
}
