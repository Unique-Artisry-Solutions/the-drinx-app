
import { RouteObject } from 'react-router-dom';
import { ProtectedRouteWithChildren } from '../protectedRoutes';
import EstablishmentDashboardPage from '@/pages/establishment/EstablishmentDashboardPage';
import EstablishmentProfilePage from '@/pages/establishment/EstablishmentProfilePage';
import MocktailMenuPage from '@/pages/establishment/MocktailMenuPage';
import PromotionsPage from '@/pages/establishment/PromotionsPage';
import EstablishmentAnalyticsPage from '@/pages/establishment/EstablishmentAnalyticsPage';
import SwigCircuitRequestsPage from '@/pages/establishment/SwigCircuitRequestsPage';
import EstablishmentCommunicationPage from '@/pages/establishment/CommunicationPage';
import EstablishmentReviewsPage from '@/pages/establishment/EstablishmentReviewsPage';
import MocktailDetailsPage from '@/pages/establishment/MocktailDetailsPage';
import MocktailSuggestionsPage from '@/pages/establishment/MocktailSuggestionsPage';
import AllActionsPage from '@/pages/establishment/AllActionsPage';
import EstablishmentNotificationsPage from '@/pages/establishment/notifications/EstablishmentNotificationsPage';

const wrapEstablishmentRoute = (element: JSX.Element) => (
  <ProtectedRouteWithChildren userType="establishment">
    {element}
  </ProtectedRouteWithChildren>
);

export const establishmentRoutes: RouteObject[] = [
  {
    path: '/establishment',
    element: wrapEstablishmentRoute(<EstablishmentDashboardPage />),
  },
  {
    path: '/establishment/dashboard',
    element: wrapEstablishmentRoute(<EstablishmentDashboardPage />),
  },
  {
    path: '/establishment/all-actions',
    element: wrapEstablishmentRoute(<AllActionsPage />),
  },
  {
    path: '/establishment/profile',
    element: wrapEstablishmentRoute(<EstablishmentProfilePage />),
  },
  {
    path: '/establishment/mocktail-menu',
    element: wrapEstablishmentRoute(<MocktailMenuPage />),
  },
  {
    path: '/establishment/promotions',
    element: wrapEstablishmentRoute(<PromotionsPage />),
  },
  {
    path: '/establishment/analytics',
    element: wrapEstablishmentRoute(<EstablishmentAnalyticsPage />),
  },
  {
    path: '/establishment/analytics/:id',
    element: wrapEstablishmentRoute(<EstablishmentAnalyticsPage />),
  },
  {
    path: '/establishment/bar-crawl-requests',
    element: wrapEstablishmentRoute(<SwigCircuitRequestsPage />),
  },
  {
    path: '/establishment/communication',
    element: wrapEstablishmentRoute(<EstablishmentCommunicationPage />),
  },
  {
    path: '/establishment/reviews',
    element: wrapEstablishmentRoute(<EstablishmentReviewsPage />),
  },
  {
    path: '/establishment/mocktail/:id',
    element: wrapEstablishmentRoute(<MocktailDetailsPage />),
  },
  {
    path: '/establishment/mocktail-suggestions',
    element: wrapEstablishmentRoute(<MocktailSuggestionsPage />),
  },
  {
    path: '/establishment/notifications',
    element: wrapEstablishmentRoute(<EstablishmentNotificationsPage />),
  },
];
