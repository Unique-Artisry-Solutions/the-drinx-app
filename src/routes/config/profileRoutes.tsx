
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy loaded components
const UserProfilePage = lazy(() => import('@/pages/profile/UserProfilePage'));
const VisitedPage = lazy(() => import('@/pages/profile/VisitedPage'));
const FavoritesPage = lazy(() => import('@/pages/profile/FavoritesPage'));
const BarCrawlsPage = lazy(() => import('@/pages/profile/BarCrawlsPage'));
const BarCrawlManagementPage = lazy(() => import('@/pages/profile/BarCrawlManagementPage'));
const CrawlersListPage = lazy(() => import('@/pages/profile/CrawlersListPage'));
const UserRecipesPage = lazy(() => import('@/pages/profile/UserRecipesPage'));
const CreateSwigCircuitPage = lazy(() => import('@/pages/profile/CreateSwigCircuitPage'));
const CheckInScannerPage = lazy(() => import('@/pages/profile/CheckInScannerPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'));
const RewardsPage = lazy(() => import('@/pages/profile/RewardsPage'));
const MyTicketsPage = lazy(() => import('@/pages/profile/MyTicketsPage'));

export const profileRoutes: RouteObject[] = [
  { path: '/profile', element: <UserProfilePage /> },
  { path: '/profile/visited', element: <VisitedPage /> },
  { path: '/profile/favorites', element: <FavoritesPage /> },
  { path: '/profile/bar-crawls', element: <BarCrawlsPage /> },
  { path: '/profile/bar-crawl/:id', element: <BarCrawlManagementPage /> },
  { path: '/profile/crawlers/:id', element: <CrawlersListPage /> },
  { path: '/profile/recipes', element: <UserRecipesPage /> },
  { path: '/profile/create-swig-circuit', element: <CreateSwigCircuitPage /> },
  { path: '/profile/scanner', element: <CheckInScannerPage /> },
  { path: '/profile/settings', element: <SettingsPage /> },
  { path: '/profile/notifications', element: <NotificationsPage /> },
  { path: '/profile/rewards', element: <RewardsPage /> },
  { path: '/profile/my-tickets', element: <MyTicketsPage /> },
];
