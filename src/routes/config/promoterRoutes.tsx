
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import RouteProtectionWrapper from '@/hoc/RouteProtectionWrapper';

// Lazy loaded components
const PromoterDashboard = lazy(() => import('@/pages/promoter/PromoterDashboard'));
const PromoterProfile = lazy(() => import('@/pages/promoter/PromoterProfile'));
const PromoterEvents = lazy(() => import('@/pages/promoter/PromoterEvents'));
const CreateSwigCircuitPage = lazy(() => import('@/pages/promoter/CreateSwigCircuitPage'));
const PromoterAnalytics = lazy(() => import('@/pages/promoter/PromoterAnalytics'));
const PromoterMarketingAnalytics = lazy(() => import('@/pages/promoter/PromoterMarketingAnalytics'));
const PromoterPricing = lazy(() => import('@/pages/promoter/PromoterPricing'));
const PromoterUrgency = lazy(() => import('@/pages/promoter/PromoterUrgency'));
const PromoterRealTimeAnalytics = lazy(() => import('@/pages/promoter/PromoterRealTimeAnalytics'));
const PromoterAffiliate = lazy(() => import('@/pages/promoter/PromoterAffiliate'));
const PromoterSettings = lazy(() => import('@/pages/promoter/PromoterSettings'));

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
    path: '/promoter/create-swig-circuit',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['promoter']}
        redirectTo="/login"
      >
        <CreateSwigCircuitPage />
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
        <PromoterAnalytics />
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
  },
  {
    path: '/promoter/pricing',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['promoter']}
        redirectTo="/login"
      >
        <PromoterPricing />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/promoter/urgency',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['promoter']}
        redirectTo="/login"
      >
        <PromoterUrgency />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/promoter/real-time-analytics',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['promoter']}
        redirectTo="/login"
      >
        <PromoterRealTimeAnalytics />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/promoter/affiliate',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['promoter']}
        redirectTo="/login"
      >
        <PromoterAffiliate />
      </RouteProtectionWrapper>
    )
  },
  {
    path: '/promoter/settings',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['promoter']}
        redirectTo="/login"
      >
        <PromoterSettings />
      </RouteProtectionWrapper>
    )
  }
];
