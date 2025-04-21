
import { RouteObject } from 'react-router-dom';
import { TypedProtectedRoute } from '../protectedRoutes';
import PromoterDashboardPage from '@/pages/promoter/PromoterDashboardPage';
import PromoterCommunicationPage from '@/pages/promoter/PromoterCommunicationPage';
import CreateSwigCircuitPage from '@/pages/profile/CreateSwigCircuitPage';

// Helper function to wrap components with promoter protection
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
    path: '/create-swig-circuit',
    element: wrapPromoterRoute(<CreateSwigCircuitPage />),
  },
  {
    path: '/create-bar-crawl',
    element: wrapPromoterRoute(<CreateSwigCircuitPage />),
  },
];
