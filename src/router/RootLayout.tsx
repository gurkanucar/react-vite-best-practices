import { Outlet, ScrollRestoration } from 'react-router'

/**
 * Wraps every route so navigation behaves like a normal website: a new page opens at the
 * top, while Back and Forward return to where the reader left that page.
 */
export function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
}
