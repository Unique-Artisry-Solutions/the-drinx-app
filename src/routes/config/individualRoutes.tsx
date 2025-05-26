
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import RouteProtectionWrapper from '@/hoc/RouteProtectionWrapper';

const ExplorePage = lazy(() => import('@/pages/ExplorePage'));
const PersonalizedExplorePage = lazy(() => import('@/pages/PersonalizedExplorePage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));

export const individualRoutes: RouteObject[] = [
  {
    path: '/explore',
    element: (
      <RouteProtectionWrapper requireAuth={false}>
        <PersonalizedExplorePage />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/explore/basic',
    element: (
      <RouteProtectionWrapper requireAuth={false}>
        <ExplorePage />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/profile',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['individual', 'establishment', 'promoter', 'admin']}
      >
        <ProfilePage />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/notifications',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['individual', 'establishment', 'promoter', 'admin']}
      >
        <NotificationsPage />
      </RouteProtectionWrapper>
    )
  }
];
