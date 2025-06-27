
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import RouteProtectionWrapper from '@/hoc/RouteProtectionWrapper';

// Lazy loaded components
const EstablishmentDashboardPage = lazy(() => import('@/pages/establishment/EstablishmentDashboardPage'));
const EstablishmentProfile = lazy(() => import('@/pages/establishment/EstablishmentProfile'));
const EstablishmentEvents = lazy(() => import('@/pages/establishment/EstablishmentEvents'));
const EstablishmentCommunicationPage = lazy(() => import('@/pages/establishment/CommunicationPage'));

export const establishmentRoutes: RouteObject[] = [
  {
    path: '/establishment',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['establishment']}
        redirectTo="/login"
      >
        <EstablishmentDashboardPage />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/establishment/dashboard',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['establishment']}
        redirectTo="/login"
      >
        <EstablishmentDashboardPage />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/establishment/profile',
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
    path: '/establishment/events',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['establishment']}
        redirectTo="/login"
      >
        <EstablishmentEvents />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/establishment/communication',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['establishment']}
        redirectTo="/login"
      >
        <EstablishmentCommunicationPage />
      </RouteProtectionWrapper>
    )
  }
];
