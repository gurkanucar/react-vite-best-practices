import { createBrowserRouter, type RouteObject } from 'react-router'
import {
  AccountPage,
  AdminLayout,
  AnalyticsPage,
  AnnouncementsAdminPage,
  AssistantPage,
  BoardPage,
  CalendarPage,
  ChatPage,
  TodoPage,
  FormBuilderPage,
  FormFillPage,
  FormListPage,
  FormResponsesPage,
  PublicFormPage,
  HelpdeskListPage,
  HelpdeskNewTicketPage,
  HelpdeskTicketPage,
  ComponentsPage,
  CorporateContactPage,
  CorporateLandingPage,
  CorporateNewsDetailPage,
  CorporateNewsPage,
  CoursesPage,
  ExamPage,
  ExamResultsPage,
  FlashcardsPage,
  JobDetailPage,
  JobEditorPage,
  JobListPage,
  NewsAdminPage,
  DashboardPage,
  DentalClinicLandingPage,
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
  PublicationEditorPage,
  ProductDetailPage,
  ProductsListPage,
  RegisterPage,
  RestaurantMenuPage,
  AgencyCaseStudyPage,
  AgencyContactPage,
  AgencyHomePage,
  AgencyWorkPage,
  CinemaBookingPage,
  CinemaHomePage,
  CinemaMoviePage,
  CinemaTicketsPage,
  EstateComparePage,
  EstateHomePage,
  EstateListingPage,
  EstateListingsPage,
  EventHomePage,
  EventSchedulePage,
  EventSpeakerPage,
  EventSpeakersPage,
  EventTicketsPage,
  PartsCatalogPage,
  PartsCheckoutPage,
  PartsHomePage,
  PartsOrderPage,
  PartsOrdersPage,
  PartsProductPage,
  HotelBookingPage,
  HotelLandingPage,
  HotelRoomPage,
  HotelRoomsPage,
  SaasLandingPage,
  SaasPricingPage,
  StoreCheckoutPage,
  StoreHomePage,
  StoreProductPage,
  RouteErrorPage,
  SettingsPage,
  ShopInvoicePage,
  ShopOrderPage,
  ShopProductPage,
  SurveyPage,
  TechParkAboutPage,
  TechParkAnnouncementDetailPage,
  TechParkAnnouncementsPage,
  TechParkCompaniesPage,
  TechParkContactPage,
  TechParkCompanyPage,
  TechParkLandingPage,
  TechParkProgramsPage,
  TechParkTeamPage,
  TourDetailPage,
  TourListPage,
} from '@/router/LazyPages'
import { AnnouncementRedirect } from '@/router/AnnouncementRedirect'
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
    path: '/preview/technopark',
    element: (
      <RouteSuspense fullPage>
        <TechParkLandingPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/technopark/companies',
    element: (
      <RouteSuspense fullPage>
        <TechParkCompaniesPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/technopark/companies/:companySlug',
    element: (
      <RouteSuspense fullPage>
        <TechParkCompanyPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/technopark/programs',
    element: (
      <RouteSuspense fullPage>
        <TechParkProgramsPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/technopark/team',
    element: (
      <RouteSuspense fullPage>
        <TechParkTeamPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/technopark/about',
    element: (
      <RouteSuspense fullPage>
        <TechParkAboutPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/technopark/contact',
    element: (
      <RouteSuspense fullPage>
        <TechParkContactPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/technopark/announcements',
    element: (
      <RouteSuspense fullPage>
        <TechParkAnnouncementsPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/technopark/announcements/:slug',
    element: (
      <RouteSuspense fullPage>
        <TechParkAnnouncementDetailPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/dental-clinic',
    element: (
      <RouteSuspense fullPage>
        <DentalClinicLandingPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    // What respondents open from a shared link or QR code: the form, without the admin shell.
    path: '/f/:formId',
    element: (
      <RouteSuspense fullPage>
        <PublicFormPage />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/saas',
    element: (
      <RouteSuspense fullPage>
        <SaasLandingPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/saas/pricing',
    element: (
      <RouteSuspense fullPage>
        <SaasPricingPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/hotel',
    element: (
      <RouteSuspense fullPage>
        <HotelLandingPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/hotel/rooms',
    element: (
      <RouteSuspense fullPage>
        <HotelRoomsPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/hotel/rooms/:roomId',
    element: (
      <RouteSuspense fullPage>
        <HotelRoomPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/hotel/book',
    element: (
      <RouteSuspense fullPage>
        <HotelBookingPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/store',
    element: (
      <RouteSuspense fullPage>
        <StoreHomePage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/store/products/:productId',
    element: (
      <RouteSuspense fullPage>
        <StoreProductPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/store/checkout',
    element: (
      <RouteSuspense fullPage>
        <StoreCheckoutPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/parts',
    element: (
      <RouteSuspense fullPage>
        <PartsHomePage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/parts/catalog',
    element: (
      <RouteSuspense fullPage>
        <PartsCatalogPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/parts/products/:partId',
    element: (
      <RouteSuspense fullPage>
        <PartsProductPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/parts/checkout',
    element: (
      <RouteSuspense fullPage>
        <PartsCheckoutPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/parts/orders',
    element: (
      <RouteSuspense fullPage>
        <PartsOrdersPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/parts/orders/:orderId',
    element: (
      <RouteSuspense fullPage>
        <PartsOrderPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/cinema',
    element: (
      <RouteSuspense fullPage>
        <CinemaHomePage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/cinema/movies/:movieId',
    element: (
      <RouteSuspense fullPage>
        <CinemaMoviePage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/cinema/book/:showtimeId',
    element: (
      <RouteSuspense fullPage>
        <CinemaBookingPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/cinema/tickets',
    element: (
      <RouteSuspense fullPage>
        <CinemaTicketsPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/estate',
    element: (
      <RouteSuspense fullPage>
        <EstateHomePage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/estate/listings',
    element: (
      <RouteSuspense fullPage>
        <EstateListingsPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/estate/listings/:listingId',
    element: (
      <RouteSuspense fullPage>
        <EstateListingPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/estate/compare',
    element: (
      <RouteSuspense fullPage>
        <EstateComparePage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/event',
    element: (
      <RouteSuspense fullPage>
        <EventHomePage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/event/schedule',
    element: (
      <RouteSuspense fullPage>
        <EventSchedulePage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/event/speakers',
    element: (
      <RouteSuspense fullPage>
        <EventSpeakersPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/event/speakers/:speakerId',
    element: (
      <RouteSuspense fullPage>
        <EventSpeakerPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/event/tickets',
    element: (
      <RouteSuspense fullPage>
        <EventTicketsPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/agency',
    element: (
      <RouteSuspense fullPage>
        <AgencyHomePage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/agency/work',
    element: (
      <RouteSuspense fullPage>
        <AgencyWorkPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/agency/work/:caseId',
    element: (
      <RouteSuspense fullPage>
        <AgencyCaseStudyPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/agency/contact',
    element: (
      <RouteSuspense fullPage>
        <AgencyContactPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/restaurant',
    element: (
      <RouteSuspense fullPage>
        <RestaurantMenuPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/corporate',
    element: (
      <RouteSuspense fullPage>
        <CorporateLandingPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/corporate/contact',
    element: (
      <RouteSuspense fullPage>
        <CorporateContactPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/corporate/news',
    element: (
      <RouteSuspense fullPage>
        <CorporateNewsPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  {
    path: '/preview/corporate/news/:slug',
    element: (
      <RouteSuspense fullPage>
        <CorporateNewsDetailPage standalone />
      </RouteSuspense>
    ),
    errorElement: standaloneErrorElement,
  },
  { path: '/preview/corporate/announcements', element: <AnnouncementRedirect root="/preview" /> },
  {
    path: '/preview/corporate/announcements/:slug',
    element: <AnnouncementRedirect root="/preview" />,
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
        path: 'chat',
        element: (
          <RouteSuspense>
            <ChatPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'todos',
        element: (
          <RouteSuspense>
            <TodoPage />
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
        path: 'helpdesk',
        element: (
          <RouteSuspense>
            <HelpdeskListPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'helpdesk/new',
        element: (
          <RouteSuspense>
            <HelpdeskNewTicketPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'helpdesk/:ticketId',
        element: (
          <RouteSuspense>
            <HelpdeskTicketPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'forms',
        element: (
          <RouteSuspense>
            <FormListPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'forms/new',
        element: (
          <RouteSuspense>
            <FormBuilderPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'forms/:formId/edit',
        element: (
          <RouteSuspense>
            <FormBuilderPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'forms/:formId/fill',
        element: (
          <RouteSuspense>
            <FormFillPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'forms/:formId/responses',
        element: (
          <RouteSuspense>
            <FormResponsesPage />
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
        path: 'showcases/technopark',
        element: (
          <RouteSuspense>
            <TechParkLandingPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/technopark/companies',
        element: (
          <RouteSuspense>
            <TechParkCompaniesPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/technopark/companies/:companySlug',
        element: (
          <RouteSuspense>
            <TechParkCompanyPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/technopark/programs',
        element: (
          <RouteSuspense>
            <TechParkProgramsPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/technopark/team',
        element: (
          <RouteSuspense>
            <TechParkTeamPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/technopark/about',
        element: (
          <RouteSuspense>
            <TechParkAboutPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/technopark/contact',
        element: (
          <RouteSuspense>
            <TechParkContactPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/technopark/announcements',
        element: (
          <RouteSuspense>
            <TechParkAnnouncementsPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/technopark/announcements/:slug',
        element: (
          <RouteSuspense>
            <TechParkAnnouncementDetailPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'content/news',
        element: (
          <RouteSuspense>
            <NewsAdminPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'content/announcements',
        element: (
          <RouteSuspense>
            <AnnouncementsAdminPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'content/:publicationKind/new',
        element: (
          <RouteSuspense>
            <PublicationEditorPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'content/:publicationKind/:slug/edit',
        element: (
          <RouteSuspense>
            <PublicationEditorPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/jobs',
        element: (
          <RouteSuspense>
            <JobListPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/jobs/new',
        element: (
          <RouteSuspense>
            <JobEditorPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/jobs/:jobSlug/edit',
        element: (
          <RouteSuspense>
            <JobEditorPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/jobs/:jobSlug',
        element: (
          <RouteSuspense>
            <JobDetailPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/dental-clinic',
        element: (
          <RouteSuspense>
            <DentalClinicLandingPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/saas',
        element: (
          <RouteSuspense>
            <SaasLandingPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/saas/pricing',
        element: (
          <RouteSuspense>
            <SaasPricingPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/hotel',
        element: (
          <RouteSuspense>
            <HotelLandingPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/hotel/rooms',
        element: (
          <RouteSuspense>
            <HotelRoomsPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/hotel/rooms/:roomId',
        element: (
          <RouteSuspense>
            <HotelRoomPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/hotel/book',
        element: (
          <RouteSuspense>
            <HotelBookingPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/store',
        element: (
          <RouteSuspense>
            <StoreHomePage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/store/products/:productId',
        element: (
          <RouteSuspense>
            <StoreProductPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/store/checkout',
        element: (
          <RouteSuspense>
            <StoreCheckoutPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/parts',
        element: (
          <RouteSuspense>
            <PartsHomePage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/parts/catalog',
        element: (
          <RouteSuspense>
            <PartsCatalogPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/parts/products/:partId',
        element: (
          <RouteSuspense>
            <PartsProductPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/parts/checkout',
        element: (
          <RouteSuspense>
            <PartsCheckoutPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/parts/orders',
        element: (
          <RouteSuspense>
            <PartsOrdersPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/parts/orders/:orderId',
        element: (
          <RouteSuspense>
            <PartsOrderPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/cinema',
        element: (
          <RouteSuspense>
            <CinemaHomePage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/cinema/movies/:movieId',
        element: (
          <RouteSuspense>
            <CinemaMoviePage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/cinema/book/:showtimeId',
        element: (
          <RouteSuspense>
            <CinemaBookingPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/cinema/tickets',
        element: (
          <RouteSuspense>
            <CinemaTicketsPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/estate',
        element: (
          <RouteSuspense>
            <EstateHomePage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/estate/listings',
        element: (
          <RouteSuspense>
            <EstateListingsPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/estate/listings/:listingId',
        element: (
          <RouteSuspense>
            <EstateListingPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/estate/compare',
        element: (
          <RouteSuspense>
            <EstateComparePage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/event',
        element: (
          <RouteSuspense>
            <EventHomePage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/event/schedule',
        element: (
          <RouteSuspense>
            <EventSchedulePage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/event/speakers',
        element: (
          <RouteSuspense>
            <EventSpeakersPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/event/speakers/:speakerId',
        element: (
          <RouteSuspense>
            <EventSpeakerPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/event/tickets',
        element: (
          <RouteSuspense>
            <EventTicketsPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/agency',
        element: (
          <RouteSuspense>
            <AgencyHomePage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/agency/work',
        element: (
          <RouteSuspense>
            <AgencyWorkPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/agency/work/:caseId',
        element: (
          <RouteSuspense>
            <AgencyCaseStudyPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/agency/contact',
        element: (
          <RouteSuspense>
            <AgencyContactPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/restaurant',
        element: (
          <RouteSuspense>
            <RestaurantMenuPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/corporate',
        element: (
          <RouteSuspense>
            <CorporateLandingPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/corporate/contact',
        element: (
          <RouteSuspense>
            <CorporateContactPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/corporate/news',
        element: (
          <RouteSuspense>
            <CorporateNewsPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/corporate/news/:slug',
        element: (
          <RouteSuspense>
            <CorporateNewsDetailPage />
          </RouteSuspense>
        ),
        errorElement: adminErrorElement,
      },
      {
        path: 'showcases/corporate/announcements',
        element: <AnnouncementRedirect root="/showcases" />,
      },
      {
        path: 'showcases/corporate/announcements/:slug',
        element: <AnnouncementRedirect root="/showcases" />,
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
