
import { RouteObject } from 'react-router-dom';
import { TypedProtectedRoute } from '../protectedRoutes';
import PromoterDashboardPage from '@/pages/promoter/PromoterDashboardPage';
import PromoterCommunicationPage from '@/pages/promoter/PromoterCommunicationPage';
import CreateSwigCircuitPage from '@/pages/profile/CreateSwigCircuitPage';

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
    element: <PromoterDashboardPage />,
  },
  {
    path: '/promoter/communication',
    element: <PromoterCommunicationPage />,
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
