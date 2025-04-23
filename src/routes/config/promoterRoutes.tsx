import { RouteObject } from 'react-router-dom';
import { TypedProtectedRoute } from '../protectedRoutes';
import PromoterDashboardPage from '@/pages/promoter/PromoterDashboardPage';
import PromoterCommunicationPage from '@/pages/promoter/PromoterCommunicationPage';
import PromoterAnalyticsPage from '@/pages/promoter/PromoterAnalyticsPage';
import CreateSwigCircuitPage from '@/pages/profile/CreateSwigCircuitPage';
import PromoterNotificationsPage from '@/pages/promoter/notifications/PromoterNotificationsPage';

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
];
