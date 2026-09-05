import { createBrowserRouter, type RouteObject } from 'react-router'
import App from '@/App'
import { ComponentsPage } from '@/pages/ComponentsPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LandingPage } from '@/pages/LandingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RouteErrorPage } from '@/pages/RouteErrorPage'
import { SettingsPage } from '@/pages/SettingsPage'

export const routes: RouteObject[] = [
  { path: '/', element: <LandingPage />, errorElement: <RouteErrorPage /> },
  {
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'components', element: <ComponentsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
