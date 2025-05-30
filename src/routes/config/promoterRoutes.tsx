
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy loaded components
const PromoterDashboard = lazy(() => import('@/pages/promoter/PromoterDashboard'));
const PromoterProfile = lazy(() => import('@/pages/promoter/PromoterProfile'));
const PromoterProfileEdit = lazy(() => import('@/pages/promoter/PromoterProfileEdit'));
const PromoterSettingsPage = lazy(() => import('@/pages/promoter/PromoterSettingsPage'));
const PromoterAffiliate = lazy(() => import('@/pages/promoter/PromoterAffiliate'));
const PromoterPricing = lazy(() => import('@/pages/promoter/PromoterPricing'));
const PromoterUrgency = lazy(() => import('@/pages/promoter/PromoterUrgency'));
const PromoterRealTimeAnalytics = lazy(() => import('@/pages/promoter/PromoterRealTimeAnalytics'));
const PromoterEvents = lazy(() => import('@/pages/promoter/PromoterEvents'));
const PromoterAnalytics = lazy(() => import('@/pages/promoter/PromoterAnalytics'));
const CreateSwigCircuit = lazy(() => import('@/pages/promoter/CreateSwigCircuit'));
const MarketingAnalytics = lazy(() => import('@/pages/promoter/MarketingAnalytics'));
const PromoterNotificationsPage = lazy(() => import('@/pages/promoter/notifications/PromoterNotificationsPage'));
const NotificationTestingPage = lazy(() => import('@/pages/promoter/notifications/NotificationTestingPage'));

// Create a placeholder component for the create event page
const CreateEvent = lazy(() => Promise.resolve({ 
  default: () => (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      <p>Event creation form coming soon...</p>
    </div>
  )
}));

export const promoterRoutes: RouteObject[] = [
  { path: '/promoter/dashboard', element: <PromoterDashboard /> },
  { path: '/promoter/profile', element: <PromoterProfile /> },
  { path: '/promoter/profile/edit', element: <PromoterProfileEdit /> },
  { path: '/promoter/settings', element: <PromoterSettingsPage /> },
  { path: '/promoter/notifications', element: <PromoterNotificationsPage /> },
  { path: '/promoter/notifications/testing', element: <NotificationTestingPage /> },
  { path: '/promoter/events', element: <PromoterEvents /> },
  { path: '/promoter/events/create', element: <CreateEvent /> },
  { path: '/promoter/analytics', element: <PromoterAnalytics /> },
  { path: '/promoter/create-swig-circuit', element: <CreateSwigCircuit /> },
  { path: '/promoter/marketing-analytics', element: <MarketingAnalytics /> },
  { path: '/promoter/affiliate', element: <PromoterAffiliate /> },
  { path: '/promoter/pricing', element: <PromoterPricing /> },
  { path: '/promoter/urgency', element: <PromoterUrgency /> },
  { path: '/promoter/real-time-analytics', element: <PromoterRealTimeAnalytics /> },
];
