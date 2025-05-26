
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import RouteProtectionWrapper from '@/hoc/RouteProtectionWrapper';

// Lazy loaded components
const PromoterDashboard = lazy(() => import('@/pages/promoter/PromoterDashboardPage'));
const PromoterProfile = lazy(() => import('@/pages/promoter/PromoterProfile'));
const PromoterEvents = lazy(() => import('@/pages/promoter/PromoterEvents'));
const PromoterAnalyticsPage = lazy(() => import('@/pages/promoter/PromoterAnalyticsPage'));
const PromoterMarketingAnalytics = lazy(() => import('@/pages/promoter/PromoterMarketingAnalytics'));

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
  },
  {
    path: '/promoter/analytics',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['promoter']}
        redirectTo="/login"
      >
        <PromoterAnalyticsPage />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/promoter/marketing-analytics',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['promoter']}
        redirectTo="/login"
      >
        <PromoterMarketingAnalytics />
      </RouteProtectionWrapper>
    )
  }
];
