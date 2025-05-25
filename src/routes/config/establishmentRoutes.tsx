
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import RouteProtectionWrapper from '@/hoc/RouteProtectionWrapper';

const EstablishmentDashboard = lazy(() => import('@/pages/establishment/EstablishmentDashboard'));
const EstablishmentProfile = lazy(() => import('@/pages/establishment/EstablishmentProfile'));
const EstablishmentEvents = lazy(() => import('@/pages/establishment/EstablishmentEvents'));

export const establishmentRoutes: RouteObject[] = [
  {
    path: '/establishment',
    children: [
      {
        index: true,
        element: (
          <RouteProtectionWrapper 
            requireAuth={true} 
            allowedUserTypes={['establishment']}
            redirectTo="/login"
          >
            <EstablishmentDashboard />
          </RouteProtectionWrapper>
        )
      },
      {
        path: 'dashboard',
        element: (
          <RouteProtectionWrapper 
            requireAuth={true} 
            allowedUserTypes={['establishment']}
            redirectTo="/login"
          >
            <EstablishmentDashboard />
          </RouteProtectionWrapper>
        )
      },
      {
        path: 'profile',
        element: (
          <RouteProtectionWrapper 
            requireAuth={true} 
            allowedUserTypes={['establishment']}
            redirectTo="/login"
          >
            <EstablishmentProfile />
          </RouteProtectionWrapper>
        )
      },
      {
        path: 'events',
        element: (
          <RouteProtectionWrapper 
            requireAuth={true} 
            allowedUserTypes={['establishment']}
            redirectTo="/login"
          >
            <EstablishmentEvents />
          </RouteProtectionWrapper>
        )
      }
    ]
  }
];
