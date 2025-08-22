
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import RouteProtectionWrapper from '@/hoc/RouteProtectionWrapper';

// Lazy loaded components
const EstablishmentDashboardPage = lazy(() => import('@/pages/establishment/EstablishmentDashboardPage'));
const EstablishmentProfile = lazy(() => import('@/pages/establishment/EstablishmentProfile'));
const EstablishmentEvents = lazy(() => import('@/pages/establishment/EstablishmentEvents'));
const EstablishmentCommunicationPage = lazy(() => import('@/pages/establishment/CommunicationPage'));
const EstablishmentAllActionsPage = lazy(() => import('@/pages/establishment/EstablishmentAllActionsPage'));
const EstablishmentReviewsPage = lazy(() => import('@/pages/establishment/EstablishmentReviewsPage'));
const EstablishmentMocktailSuggestionsPage = lazy(() => import('@/pages/establishment/EstablishmentMocktailSuggestionsPage'));
const EstablishmentBarCrawlRequestsPage = lazy(() => import('@/pages/establishment/EstablishmentBarCrawlRequestsPage'));
const MessageThreadPage = lazy(() => import('@/pages/establishment/MessageThreadPage'));

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
  },
  {
    path: '/establishment/all-actions',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['establishment']}
        redirectTo="/login"
      >
        <EstablishmentAllActionsPage />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/establishment/reviews',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['establishment']}
        redirectTo="/login"
      >
        <EstablishmentReviewsPage />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/establishment/mocktail-suggestions',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['establishment']}
        redirectTo="/login"
      >
        <EstablishmentMocktailSuggestionsPage />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/establishment/bar-crawl-requests',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['establishment']}
        redirectTo="/login"
      >
        <EstablishmentBarCrawlRequestsPage />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/establishment/messages/:threadId',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['establishment']}
        redirectTo="/login"
      >
        <MessageThreadPage />
      </RouteProtectionWrapper>
    )
  }
];
