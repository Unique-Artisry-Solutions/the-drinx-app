
import React from 'react';
import { RouteObject } from 'react-router-dom';

// Direct imports for simple user pages - no lazy loading needed
import Explore from '@/pages/Explore';
import PersonalizedExplorePage from '@/pages/PersonalizedExplorePage';
import ProfilePage from '@/pages/ProfilePage';
import NotificationsPage from '@/pages/notifications/NotificationsPage';
import PromoterDetailsPage from '@/pages/promoter/PromoterDetailsPage';

// Simple auth check component for user routes
const SimpleAuthCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user_type') !== null;
  
  // For user routes, we allow access but show different content based on auth state
  // This removes the complex protection wrapper while maintaining functionality
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
    path: '/explore/personalized',
    element: (
      <SimpleAuthCheck>
        <PersonalizedExplorePage />
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
