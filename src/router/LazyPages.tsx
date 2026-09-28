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

export const FormBuilderPage = lazy(async () => ({
  default: (await import('@/features/forms/pages/FormBuilderPage')).FormBuilderPage,
}))

export const FormFillPage = lazy(async () => ({
  default: (await import('@/features/forms/pages/FormFillPage')).FormFillPage,
}))

export const FormListPage = lazy(async () => ({
  default: (await import('@/features/forms/pages/FormListPage')).FormListPage,
}))

export const PublicFormPage = lazy(async () => ({
  default: (await import('@/features/forms/pages/PublicFormPage')).PublicFormPage,
}))

export const FormResponsesPage = lazy(async () => ({
  default: (await import('@/features/forms/pages/FormResponsesPage')).FormResponsesPage,
}))

export const HelpdeskListPage = lazy(async () => ({
  default: (await import('@/features/helpdesk/pages/HelpdeskListPage')).HelpdeskListPage,
}))

export const HelpdeskTicketPage = lazy(async () => ({
  default: (await import('@/features/helpdesk/pages/HelpdeskTicketPage')).HelpdeskTicketPage,
}))

export const HelpdeskNewTicketPage = lazy(async () => ({
  default: (await import('@/features/helpdesk/pages/HelpdeskNewTicketPage')).HelpdeskNewTicketPage,
}))

export const BoardPage = lazy(async () => ({
  default: (await import('@/features/board/pages/BoardPage')).BoardPage,
}))

export const ChatPage = lazy(async () => ({
  default: (await import('@/features/chat/pages/ChatPage')).ChatPage,
}))
export const TodoPage = lazy(async () => ({
  default: (await import('@/features/todos/pages/TodoPage')).TodoPage,
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

export const CorporateContactPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/CorporateContactPage')).CorporateContactPage,
}))

export const CorporateLandingPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/CorporateLandingPage')).CorporateLandingPage,
}))

export const CorporateNewsDetailPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/PublicationPages')).CorporateNewsDetailPage,
}))

export const CorporateNewsPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/PublicationPages')).CorporateNewsPage,
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

export const RestaurantMenuPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/RestaurantMenuPage')).RestaurantMenuPage,
}))

export const SaasLandingPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/SaasLandingPage')).SaasLandingPage,
}))

export const SaasPricingPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/SaasPricingPage')).SaasPricingPage,
}))

export const HotelLandingPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/HotelLandingPage')).HotelLandingPage,
}))

export const HotelRoomsPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/HotelRoomsPage')).HotelRoomsPage,
}))

export const HotelRoomPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/HotelRoomPage')).HotelRoomPage,
}))

export const HotelBookingPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/HotelBookingPage')).HotelBookingPage,
}))

export const StoreHomePage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/StoreHomePage')).StoreHomePage,
}))

export const StoreProductPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/StoreProductPage')).StoreProductPage,
}))

export const StoreCheckoutPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/StoreCheckoutPage')).StoreCheckoutPage,
}))

export const PartsHomePage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/PartsHomePage')).PartsHomePage,
}))

export const PartsCatalogPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/PartsCatalogPage')).PartsCatalogPage,
}))

export const PartsProductPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/PartsProductPage')).PartsProductPage,
}))

export const PartsCheckoutPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/PartsCheckoutPage')).PartsCheckoutPage,
}))

export const PartsOrdersPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/PartsOrdersPage')).PartsOrdersPage,
}))

export const PartsOrderPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/PartsOrderPage')).PartsOrderPage,
}))

export const CinemaHomePage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/CinemaHomePage')).CinemaHomePage,
}))

export const CinemaMoviePage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/CinemaMoviePage')).CinemaMoviePage,
}))

export const CinemaBookingPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/CinemaBookingPage')).CinemaBookingPage,
}))

export const CinemaTicketsPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/CinemaTicketsPage')).CinemaTicketsPage,
}))

export const EstateHomePage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/EstateHomePage')).EstateHomePage,
}))

export const EstateListingsPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/EstateListingsPage')).EstateListingsPage,
}))

export const EstateListingPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/EstateListingPage')).EstateListingPage,
}))

export const EstateComparePage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/EstateComparePage')).EstateComparePage,
}))

export const EventHomePage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/EventHomePage')).EventHomePage,
}))

export const EventSchedulePage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/EventSchedulePage')).EventSchedulePage,
}))

export const EventSpeakersPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/EventSpeakersPage')).EventSpeakersPage,
}))

export const EventSpeakerPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/EventSpeakerPage')).EventSpeakerPage,
}))

export const EventTicketsPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/EventTicketsPage')).EventTicketsPage,
}))

export const AgencyHomePage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/AgencyHomePage')).AgencyHomePage,
}))

export const AgencyWorkPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/AgencyWorkPage')).AgencyWorkPage,
}))

export const AgencyCaseStudyPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/AgencyCaseStudyPage')).AgencyCaseStudyPage,
}))

export const AgencyContactPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/AgencyContactPage')).AgencyContactPage,
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

export const TechParkProgramsPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/TechParkProgramsPage')).TechParkProgramsPage,
}))

export const TechParkTeamPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/TechParkTeamPage')).TechParkTeamPage,
}))

export const TechParkAboutPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/TechParkAboutPage')).TechParkAboutPage,
}))

export const TechParkContactPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/TechParkContactPage')).TechParkContactPage,
}))

export const TechParkAnnouncementDetailPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/PublicationPages'))
    .TechParkAnnouncementDetailPage,
}))

export const TechParkAnnouncementsPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/PublicationPages')).TechParkAnnouncementsPage,
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

export const JobListPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/JobListPage')).JobListPage,
}))

export const JobDetailPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/JobDetailPage')).JobDetailPage,
}))

export const JobEditorPage = lazy(async () => ({
  default: (await import('@/features/showcases/pages/JobEditorPage')).JobEditorPage,
}))

export const PublicationEditorPage = lazy(async () => ({
  default: (await import('@/features/content/pages/PublicationEditorPage')).PublicationEditorPage,
}))

export const NewsAdminPage = lazy(async () => ({
  default: (await import('@/features/content/pages/PublicationAdminPage')).NewsAdminPage,
}))

export const AnnouncementsAdminPage = lazy(async () => ({
  default: (await import('@/features/content/pages/PublicationAdminPage')).AnnouncementsAdminPage,
}))
