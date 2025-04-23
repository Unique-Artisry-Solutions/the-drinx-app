import { RouteObject } from 'react-router-dom';
import { TypedProtectedRoute } from '../protectedRoutes';
import ProfilePage from '@/pages/profile/ProfilePage';
import EditProfilePage from '@/pages/profile/EditProfilePage';
import VisitsPage from '@/pages/profile/VisitsPage';
import AchievementsPage from '@/pages/profile/AchievementsPage';
import SettingsPage from '@/pages/SettingsPage';
import NotificationsPage from '@/pages/notifications/NotificationsPage';

export const profileRoutes: RouteObject[] = [
  {
    path: '/profile',
    element: <TypedProtectedRoute><ProfilePage /></TypedProtectedRoute>,
  },
  {
    path: '/profile/edit',
    element: <TypedProtectedRoute><EditProfilePage /></TypedProtectedRoute>,
  },
  {
    path: '/visits',
    element: <TypedProtectedRoute><VisitsPage /></TypedProtectedRoute>,
  },
  {
    path: '/achievements',
    element: <TypedProtectedRoute><AchievementsPage /></TypedProtectedRoute>,
  },
  {
    path: '/settings',
    element: <TypedProtectedRoute><SettingsPage /></TypedProtectedRoute>,
  },
  {
    path: '/notifications',
    element: <TypedProtectedRoute><NotificationsPage /></TypedProtectedRoute>,
  },
];
