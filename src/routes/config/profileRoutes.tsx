import { RouteObject } from 'react-router-dom';
import { TypedProtectedRoute } from '../protectedRoutes';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import NotificationsPage from '@/pages/notifications/NotificationsPage';

// Define routes for pages that don't exist yet with proper imports
// We'll keep these commented out until those pages are created
// import EditProfilePage from '@/pages/profile/EditProfilePage';
// import VisitsPage from '@/pages/profile/VisitsPage';
// import AchievementsPage from '@/pages/profile/AchievementsPage';

export const profileRoutes: RouteObject[] = [
  {
    path: '/profile',
    element: <TypedProtectedRoute userType="individual"><ProfilePage /></TypedProtectedRoute>,
  },
  // Commented out routes that are referenced but don't have implementations yet
  // {
  //   path: '/profile/edit',
  //   element: <TypedProtectedRoute userType="individual"><EditProfilePage /></TypedProtectedRoute>,
  // },
  // {
  //   path: '/visits',
  //   element: <TypedProtectedRoute userType="individual"><VisitsPage /></TypedProtectedRoute>,
  // },
  // {
  //   path: '/achievements',
  //   element: <TypedProtectedRoute userType="individual"><AchievementsPage /></TypedProtectedRoute>,
  // },
  {
    path: '/settings',
    element: <TypedProtectedRoute userType="individual"><SettingsPage /></TypedProtectedRoute>,
  },
  {
    path: '/notifications',
    element: <TypedProtectedRoute userType="individual"><NotificationsPage /></TypedProtectedRoute>,
  },
];
