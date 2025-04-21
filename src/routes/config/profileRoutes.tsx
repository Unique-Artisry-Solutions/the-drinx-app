
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../protectedRoutes';
import Profile from '@/pages/ProfilePage';
import FavoritesPage from '@/pages/profile/FavoritesPage';
import VisitedPage from '@/pages/profile/VisitedPage';
import BarCrawlsPage from '@/pages/profile/BarCrawlsPage';
import MyCreationsPage from '@/pages/profile/MyCreationsPage';
import UserRecipesPage from '@/pages/profile/UserRecipesPage';
import RewardsPage from '@/pages/profile/RewardsPage';
import UserProfilePage from '@/pages/profile/UserProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import { BarCrawlManagementPage } from '@/imports';

export const profileRoutes: RouteObject[] = [
  {
    path: '/profile',
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
  {
    path: '/profile/favorites',
    element: <ProtectedRoute><FavoritesPage /></ProtectedRoute>,
  },
  {
    path: '/profile/visited',
    element: <ProtectedRoute><VisitedPage /></ProtectedRoute>,
  },
  {
    path: '/profile/bar-crawls',
    element: <ProtectedRoute><BarCrawlsPage /></ProtectedRoute>,
  },
  {
    path: '/profile/my-creations',
    element: <ProtectedRoute><MyCreationsPage /></ProtectedRoute>,
  },
  {
    path: '/profile/my-creations/:id',
    element: <ProtectedRoute><BarCrawlManagementPage /></ProtectedRoute>,
  },
  {
    path: '/profile/recipes',
    element: <ProtectedRoute><UserRecipesPage /></ProtectedRoute>,
  },
  {
    path: '/profile/rewards',
    element: <ProtectedRoute><RewardsPage /></ProtectedRoute>,
  },
  {
    path: '/profile/settings',
    element: <ProtectedRoute><UserProfilePage /></ProtectedRoute>,
  },
  {
    path: '/settings',
    element: <ProtectedRoute><SettingsPage /></ProtectedRoute>,
  },
];
