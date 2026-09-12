import { createBrowserRouter, type RouteObject } from 'react-router'
import {
  AdminLayout,
  ComponentsPage,
  DashboardPage,
  DocumentsPage,
  LandingPage,
  LoginPage,
  NotFoundPage,
  OtpPage,
  PostDetailPage,
  PostEditPage,
  PostsListPage,
  ProductDetailPage,
  ProductsListPage,
  RegisterPage,
  RouteErrorPage,
  SettingsPage,
  SurveyPage,
} from '@/router/LazyPages'
import { RouteSuspense } from '@/router/RouteSuspense'

const standaloneErrorElement = (
  <RouteSuspense fullPage>
    <RouteErrorPage />
  </RouteSuspense>
)
const adminErrorElement = (
  <RouteSuspense>
    <RouteErrorPage />
  </RouteSuspense>
)

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <RouteSuspense fullPage>
        <LandingPage />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/login',
    element: (
      <RouteSuspense fullPage>
        <LoginPage />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/register',
    element: (
      <RouteSuspense fullPage>
        <RegisterPage />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/otp',
    element: (
      <RouteSuspense fullPage>
        <OtpPage />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    element: (
      <RouteSuspense fullPage>
        <AdminLayout />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
    children: [
      {
        path: 'dashboard',
        element: (
          <RouteSuspense>
            <DashboardPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'components',
        element: (
          <RouteSuspense>
            <ComponentsPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'survey',
        element: (
          <RouteSuspense>
            <SurveyPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'posts',
        element: (
          <RouteSuspense>
            <PostsListPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'posts/:postId',
        element: (
          <RouteSuspense>
            <PostDetailPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'posts/:postId/edit',
        element: (
          <RouteSuspense>
            <PostEditPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'products',
        element: (
          <RouteSuspense>
            <ProductsListPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'products/:productId',
        element: (
          <RouteSuspense>
            <ProductDetailPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'documents',
        element: (
          <RouteSuspense>
            <DocumentsPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'settings',
        element: (
          <RouteSuspense>
            <SettingsPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
    ],
  },
  {
    path: '*',
    element: (
      <RouteSuspense fullPage>
        <NotFoundPage />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
]

export const router = createBrowserRouter(routes)
