
import React from 'react';
import { RouteObject } from 'react-router-dom';
import UserProfilePage from '@/pages/profile/UserProfilePage';
import VisitedPage from '@/pages/profile/VisitedPage';
import FavoritesPage from '@/pages/profile/FavoritesPage';
import BarCrawlsPage from '@/pages/profile/BarCrawlsPage';
import BarCrawlManagementPage from '@/pages/profile/BarCrawlManagementPage';
import CrawlersListPage from '@/pages/profile/CrawlersListPage';
import UserRecipesPage from '@/pages/profile/UserRecipesPage';
import CreateSwigCircuitPage from '@/pages/profile/CreateSwigCircuitPage';
import CheckInScannerPage from '@/pages/profile/CheckInScannerPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import NotificationsPage from '@/pages/notifications/NotificationsPage';
import RewardsPage from '@/pages/profile/RewardsPage';
import MyTicketsPage from '@/pages/profile/MyTicketsPage';

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
