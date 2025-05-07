
import { RouteObject } from 'react-router-dom';
import { TypedProtectedRoute } from '../protectedRoutes';
import PromoterDashboardPage from '@/pages/promoter/PromoterDashboardPage';
import PromoterCommunicationPage from '@/pages/promoter/PromoterCommunicationPage';
import PromoterAnalyticsPage from '@/pages/promoter/PromoterAnalyticsPage';
import CreateSwigCircuitPage from '@/pages/profile/CreateSwigCircuitPage';
import PromoterNotificationsPage from '@/pages/promoter/notifications/PromoterNotificationsPage';
import EventManagementPage from '@/pages/promoter/events/EventManagementPage';
import CreateEventPage from '@/pages/promoter/events/CreateEventPage';
import EventDetailsPage from '@/pages/promoter/events/EventDetailsPage';
import PromotionalToolsPage from '@/pages/promoter/marketing/PromotionalToolsPage';
import EventScannerPage from '@/pages/events/EventScannerPage';

const wrapPromoterRoute = (element: JSX.Element) => (
  <TypedProtectedRoute userType="promoter">{element}</TypedProtectedRoute>
);

export const promoterRoutes: RouteObject[] = [
  {
    path: '/promoter',
    element: wrapPromoterRoute(<PromoterDashboardPage />),
  },
  {
    path: '/promoter/dashboard',
    element: wrapPromoterRoute(<PromoterDashboardPage />),
  },
  {
    path: '/promoter/communication',
    element: wrapPromoterRoute(<PromoterCommunicationPage />),
  },
  {
    path: '/promoter/analytics',
    element: wrapPromoterRoute(<PromoterAnalyticsPage />),
  },
  {
    path: '/create-swig-circuit',
    element: wrapPromoterRoute(<CreateSwigCircuitPage />),
  },
  {
    path: '/create-bar-crawl',
    element: wrapPromoterRoute(<CreateSwigCircuitPage />),
  },
  {
    path: '/promoter/notifications',
    element: wrapPromoterRoute(<PromoterNotificationsPage />),
  },
  {
    path: '/promoter/events',
    element: wrapPromoterRoute(<EventManagementPage />),
  },
  {
    path: '/promoter/events/create',
    element: wrapPromoterRoute(<CreateEventPage />),
  },
  {
    path: '/promoter/events/:eventId',
    element: wrapPromoterRoute(<EventDetailsPage />),
  },
  {
    path: '/promoter/marketing',
    element: wrapPromoterRoute(<PromotionalToolsPage />),
  },
  {
    path: '/events/scanner/:eventId/:token',
    element: wrapPromoterRoute(<EventScannerPage />),
  }
];
