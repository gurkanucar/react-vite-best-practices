import { createBrowserRouter, type RouteObject } from 'react-router'
import {
  AccountPage,
  AdminLayout,
  AnalyticsPage,
  AssistantPage,
  BoardPage,
  CalendarPage,
  ComponentsPage,
  CoursesPage,
  ExamPage,
  ExamResultsPage,
  FlashcardsPage,
  DashboardPage,
  DocumentsPage,
  FilesPage,
  LandingPage,
  LoginPage,
  NotFoundPage,
  OtpPage,
  PostDetailPage,
  PostEditPage,
  PostsListPage,
  ProfilePage,
  ProductDetailPage,
  ProductsListPage,
  RegisterPage,
  RouteErrorPage,
  SettingsPage,
  ShopInvoicePage,
  ShopOrderPage,
  ShopProductPage,
  SurveyPage,
  TourDetailPage,
  TourListPage,
} from '@/router/LazyPages'
import { RouteSuspense } from '@/router/RouteSuspense'
import { FEATURE_FLAGS } from '@/config/featureFlags'

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
        path: 'analytics',
        element: (
          <RouteSuspense>
            <AnalyticsPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'board',
        element: (
          <RouteSuspense>
            <BoardPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'calendar',
        element: (
          <RouteSuspense>
            <CalendarPage />
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
      ...(FEATURE_FLAGS.assistant
        ? [
            {
              path: 'assistant',
              element: (
                <RouteSuspense>
                  <AssistantPage />
                </RouteSuspense>
              ),
              errorElement: adminErrorElement,
            },
          ]
        : []),
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
        path: 'files',
        element: (
          <RouteSuspense>
            <FilesPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'account',
        element: (
          <RouteSuspense>
            <AccountPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'profile',
        element: (
          <RouteSuspense>
            <ProfilePage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'shop/product',
        element: (
          <RouteSuspense>
            <ShopProductPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'shop/order',
        element: (
          <RouteSuspense>
            <ShopOrderPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'shop/invoice',
        element: (
          <RouteSuspense>
            <ShopInvoicePage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'tours',
        element: (
          <RouteSuspense>
            <TourListPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'tours/:tourId',
        element: (
          <RouteSuspense>
            <TourDetailPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'learning/courses',
        element: (
          <RouteSuspense>
            <CoursesPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'learning/exam',
        element: (
          <RouteSuspense>
            <ExamPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'learning/flashcards',
        element: (
          <RouteSuspense>
            <FlashcardsPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'learning/results',
        element: (
          <RouteSuspense>
            <ExamResultsPage />
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
