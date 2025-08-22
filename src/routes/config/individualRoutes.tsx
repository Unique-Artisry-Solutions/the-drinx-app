
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/routes/protectedRoutes';

// Direct imports for user pages
import Explore from '@/pages/Explore';
import ProfilePage from '@/pages/ProfilePage';
import NotificationsPage from '@/pages/notifications/NotificationsPage';
import PromoterDetailsPage from '@/pages/promoter/PromoterDetailsPage';
import IndividualAllActionsPage from '@/pages/individual/IndividualAllActionsPage';

export const individualRoutes: RouteObject[] = [
  {
    path: '/explore',
    element: (
      <ProtectedRoute requireAuth={true} fallbackPath="/">
        <Explore />
      </ProtectedRoute>
    )
  },
  {
    path: '/individual/all-actions',
    element: (
      <ProtectedRoute requireAuth={true} fallbackPath="/">
        <IndividualAllActionsPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute requireAuth={true} fallbackPath="/">
        <ProfilePage />
      </ProtectedRoute>
    )
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute requireAuth={true} fallbackPath="/">
        <NotificationsPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/promoter/:promoterId',
    element: (
      <ProtectedRoute requireAuth={true} fallbackPath="/">
        <PromoterDetailsPage />
      </ProtectedRoute>
    )
  }
];
