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

export const CoursesPage = lazy(async () => ({
  default: (await import('@/features/learning/pages/CoursesPage')).CoursesPage,
}))

export const ExamPage = lazy(async () => ({
  default: (await import('@/features/learning/pages/ExamPage')).ExamPage,
}))

export const ExamResultsPage = lazy(async () => ({
  default: (await import('@/features/learning/pages/ExamResultsPage')).ExamResultsPage,
}))

export const FlashcardsPage = lazy(async () => ({
  default: (await import('@/features/learning/pages/FlashcardsPage')).FlashcardsPage,
}))

export const ComponentsPage = lazy(async () => ({
  default: (await import('@/pages/ComponentsPage')).ComponentsPage,
}))

export const CorporateAnnouncementDetailPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/CorporatePublicationPages'))
    .CorporateAnnouncementDetailPage,
}))

export const CorporateAnnouncementsPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/CorporatePublicationPages'))
    .CorporateAnnouncementsPage,
}))

export const CorporateLandingPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/CorporateLandingPage')).CorporateLandingPage,
}))

export const CorporateNewsDetailPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/CorporatePublicationPages'))
    .CorporateNewsDetailPage,
}))

export const CorporateNewsPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/CorporatePublicationPages')).CorporateNewsPage,
}))

export const DashboardPage = lazy(async () => ({
  default: (await import('@/pages/DashboardPage')).DashboardPage,
}))

export const DocumentsPage = lazy(async () => ({
  default: (await import('@/features/documents/pages/DocumentsPage')).DocumentsPage,
}))

export const DentalClinicLandingPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/DentalClinicLandingPage'))
    .DentalClinicLandingPage,
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

export const ShopInvoicePage = lazy(async () => ({
  default: (await import('@/features/shop/pages/ShopInvoicePage')).ShopInvoicePage,
}))

export const ShopOrderPage = lazy(async () => ({
  default: (await import('@/features/shop/pages/ShopOrderPage')).ShopOrderPage,
}))

export const ShopProductPage = lazy(async () => ({
  default: (await import('@/features/shop/pages/ShopProductPage')).ShopProductPage,
}))

export const SettingsPage = lazy(async () => ({
  default: (await import('@/pages/SettingsPage')).SettingsPage,
}))

export const TourDetailPage = lazy(async () => ({
  default: (await import('@/features/tours/pages/TourDetailPage')).TourDetailPage,
}))

export const TourListPage = lazy(async () => ({
  default: (await import('@/features/tours/pages/TourListPage')).TourListPage,
}))

export const SurveyPage = lazy(async () => ({
  default: (await import('@/pages/SurveyPage')).SurveyPage,
}))

export const TechParkCompaniesPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/TechParkCompaniesPage')).TechParkCompaniesPage,
}))

export const TechParkCompanyPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/TechParkCompanyPage')).TechParkCompanyPage,
}))

export const TechParkLandingPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/TechParkLandingPage')).TechParkLandingPage,
}))
