
import { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';

// Critical pages - direct import to avoid module loading issues during impersonation
import PromoterDashboardPage from '@/pages/promoter/PromoterDashboardPage';

// Lazy loaded components for non-critical pages
const PromoterProfile = lazy(() => import('@/pages/promoter/PromoterProfile'));
const PromoterProfileEdit = lazy(() => import('@/pages/promoter/PromoterProfileEdit'));
const PromoterSettingsPage = lazy(() => import('@/pages/promoter/PromoterSettingsPage'));
const PromoterAffiliate = lazy(() => import('@/pages/promoter/PromoterAffiliate'));
const PromoterPricing = lazy(() => import('@/pages/promoter/PromoterPricing'));
const PromoterUrgency = lazy(() => import('@/pages/promoter/PromoterUrgency'));
const PromoterRealTimeAnalytics = lazy(() => import('@/pages/promoter/PromoterRealTimeAnalytics'));
const PromoterEvents = lazy(() => import('@/pages/promoter/PromoterEvents'));
const PromoterAnalytics = lazy(() => import('@/pages/promoter/PromoterAnalytics'));
const CreateSwigCircuitPage = lazy(() => import('@/pages/promoter/CreateSwigCircuitPage'));
const CreateEventPage = lazy(() => import('@/pages/promoter/events/CreateEventPage'));
const MarketingAnalytics = lazy(() => import('@/pages/promoter/MarketingAnalytics'));
const PromoterNotificationsPage = lazy(() => import('@/pages/promoter/notifications/PromoterNotificationsPage'));
const NotificationTestingPage = lazy(() => import('@/pages/promoter/notifications/NotificationTestingPage'));
const PromoterFollowersPage = lazy(() => import('@/pages/promoter/PromoterFollowersPage'));
const PromoterSubscribersPage = lazy(() => import('@/pages/promoter/PromoterSubscribersPage'));
const PromoterAllActionsPage = lazy(() => import('@/pages/promoter/PromoterAllActionsPage'));

export const promoterRoutes: RouteObject[] = [
  { path: '/promoter', element: <PromoterDashboardPage /> }, // Dashboard is now the root
  { path: '/promoter/dashboard', element: <Navigate to="/promoter" replace /> }, // Redirect for backward compatibility
  { path: '/promoter/all-actions', element: <PromoterAllActionsPage /> },
  { path: '/promoter/profile', element: <PromoterProfile /> },
  { path: '/promoter/profile/edit', element: <PromoterProfileEdit /> },
  { path: '/promoter/settings', element: <PromoterSettingsPage /> },
  { path: '/promoter/notifications', element: <PromoterNotificationsPage /> },
  { path: '/promoter/notifications/testing', element: <NotificationTestingPage /> },
  { path: '/promoter/events', element: <PromoterEvents /> },
  { path: '/promoter/events/create', element: <CreateEventPage /> },
  { path: '/promoter/analytics', element: <PromoterAnalytics /> },
  { path: '/promoter/followers', element: <PromoterFollowersPage /> },
  { path: '/promoter/subscribers', element: <PromoterSubscribersPage /> },
  { path: '/promoter/create-swig-circuit', element: <CreateSwigCircuitPage /> },
  { path: '/promoter/marketing-analytics', element: <MarketingAnalytics /> },
  { path: '/promoter/affiliate', element: <PromoterAffiliate /> },
  { path: '/promoter/pricing', element: <PromoterPricing /> },
  { path: '/promoter/urgency', element: <PromoterUrgency /> },
  { path: '/promoter/real-time-analytics', element: <PromoterRealTimeAnalytics /> },
];
