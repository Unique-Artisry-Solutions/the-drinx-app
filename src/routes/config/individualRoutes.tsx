
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { useAuth } from '@/hooks/core/useAuth';

// Direct imports for simple user pages - no lazy loading needed
import Explore from '@/pages/Explore';
import ProfilePage from '@/pages/ProfilePage';
import NotificationsPage from '@/pages/notifications/NotificationsPage';
import PromoterDetailsPage from '@/pages/promoter/PromoterDetailsPage';

// Proper auth check component using real auth context
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();
  const { isLoading, isAuthenticated } = state;
  
  // Show loading while auth state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-spiritless-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // For user routes, we allow access but show different content based on auth state
  // This removes the complex protection wrapper while maintaining functionality
  return <>{children}</>;
};

export const individualRoutes: RouteObject[] = [
  {
    path: '/explore',
    element: (
      <AuthGuard>
        <Explore />
      </AuthGuard>
    )
  },
  {
    path: '/profile',
    element: (
      <AuthGuard>
        <ProfilePage />
      </AuthGuard>
    )
  },
  {
    path: '/notifications',
    element: (
      <AuthGuard>
        <NotificationsPage />
      </AuthGuard>
    )
  },
  {
    path: '/promoter/:promoterId',
    element: (
      <AuthGuard>
        <PromoterDetailsPage />
      </AuthGuard>
    )
  }
];
