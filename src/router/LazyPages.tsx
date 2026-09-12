import { lazy } from 'react'

export const AdminLayout = lazy(() => import('@/App'))

export const AccountPage = lazy(async () => ({
  default: (await import('@/features/account/pages/AccountPage')).AccountPage,
}))

export const AnalyticsPage = lazy(async () => ({
  default: (await import('@/features/analytics/pages/AnalyticsPage')).AnalyticsPage,
}))

export const AssistantPage = lazy(async () => ({
  default: (await import('@/features/assistant/pages/AssistantPage')).AssistantPage,
}))

export const BoardPage = lazy(async () => ({
  default: (await import('@/features/board/pages/BoardPage')).BoardPage,
}))

export const CalendarPage = lazy(async () => ({
  default: (await import('@/features/calendar/pages/CalendarPage')).CalendarPage,
}))

export const ComponentsPage = lazy(async () => ({
  default: (await import('@/pages/ComponentsPage')).ComponentsPage,
}))

export const DashboardPage = lazy(async () => ({
  default: (await import('@/pages/DashboardPage')).DashboardPage,
}))

export const DocumentsPage = lazy(async () => ({
  default: (await import('@/features/documents/pages/DocumentsPage')).DocumentsPage,
}))

export const FilesPage = lazy(async () => ({
  default: (await import('@/features/files/pages/FilesPage')).FilesPage,
}))

export const LandingPage = lazy(async () => ({
  default: (await import('@/pages/LandingPage')).LandingPage,
}))

export const LoginPage = lazy(async () => ({
  default: (await import('@/pages/LoginPage')).LoginPage,
}))

export const NotFoundPage = lazy(async () => ({
  default: (await import('@/pages/NotFoundPage')).NotFoundPage,
}))

export const OtpPage = lazy(async () => ({
  default: (await import('@/pages/OtpPage')).OtpPage,
}))

export const PostDetailPage = lazy(async () => ({
  default: (await import('@/features/posts/pages/PostDetailPage')).PostDetailPage,
}))

export const PostEditPage = lazy(async () => ({
  default: (await import('@/features/posts/pages/PostEditPage')).PostEditPage,
}))

export const ProfilePage = lazy(async () => ({
  default: (await import('@/features/profile/pages/ProfilePage')).ProfilePage,
}))

export const PostsListPage = lazy(async () => ({
  default: (await import('@/features/posts/pages/PostsListPage')).PostsListPage,
}))

export const ProductDetailPage = lazy(async () => ({
  default: (await import('@/features/products/pages/ProductDetailPage')).ProductDetailPage,
}))

export const ProductsListPage = lazy(async () => ({
  default: (await import('@/features/products/pages/ProductsListPage')).ProductsListPage,
}))

export const RegisterPage = lazy(async () => ({
  default: (await import('@/pages/RegisterPage')).RegisterPage,
}))

export const RouteErrorPage = lazy(async () => ({
  default: (await import('@/pages/RouteErrorPage')).RouteErrorPage,
}))

export const SettingsPage = lazy(async () => ({
  default: (await import('@/pages/SettingsPage')).SettingsPage,
}))

export const SurveyPage = lazy(async () => ({
  default: (await import('@/pages/SurveyPage')).SurveyPage,
}))
