
import React from 'react';
import { RouteObject } from 'react-router-dom';

// Direct imports for simple user pages - no lazy loading needed
import Explore from '@/pages/Explore';
import ProfilePage from '@/pages/ProfilePage';
import NotificationsPage from '@/pages/notifications/NotificationsPage';
import PromoterDetailsPage from '@/pages/promoter/PromoterDetailsPage';

// Simple auth check component for user routes
const SimpleAuthCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // For user routes, we allow access but show different content based on auth state
  // The components themselves handle the auth state and show appropriate content
  return <>{children}</>;
};

export const individualRoutes: RouteObject[] = [
  {
    path: '/explore',
    element: (
      <SimpleAuthCheck>
        <Explore />
      </SimpleAuthCheck>
    )
  },
  {
    path: '/profile',
    element: <ProfilePage />
  },
  {
    path: '/notifications',
    element: <NotificationsPage />
  },
  {
    path: '/promoter/:promoterId',
    element: <PromoterDetailsPage />
  }
];
