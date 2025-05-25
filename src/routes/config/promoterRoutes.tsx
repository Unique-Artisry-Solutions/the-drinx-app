
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import RouteProtectionWrapper from '@/hoc/RouteProtectionWrapper';

// Import the correct promoter dashboard component
const PromoterDashboard = lazy(() => import('@/pages/promoter/PromoterDashboardPage'));
const PromoterProfile = lazy(() => import('@/pages/promoter/PromoterProfile'));
const PromoterEvents = lazy(() => import('@/pages/promoter/PromoterEvents'));

export const promoterRoutes: RouteObject[] = [
  {
    path: '/promoter',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['promoter']}
        redirectTo="/login"
      >
        <PromoterDashboard />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/promoter/dashboard',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['promoter']}
        redirectTo="/login"
      >
        <PromoterDashboard />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/promoter/profile',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['promoter']}
        redirectTo="/login"
      >
        <PromoterProfile />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/promoter/events',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['promoter']}
        redirectTo="/login"
      >
        <PromoterEvents />
      </RouteProtectionWrapper>
    )
  }
];
