
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import RouteProtectionWrapper from '@/hoc/RouteProtectionWrapper';

const PromoterDashboard = lazy(() => import('@/pages/promoter/PromoterDashboard'));
const PromoterProfile = lazy(() => import('@/pages/promoter/PromoterProfile'));
const PromoterEvents = lazy(() => import('@/pages/promoter/PromoterEvents'));

export const promoterRoutes: RouteObject[] = [
  {
    path: '/promoter',
    children: [
      {
        index: true,
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
        path: 'dashboard',
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
        path: 'profile',
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
        path: 'events',
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
    ]
  }
];
