
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import RouteProtectionWrapper from '@/hoc/RouteProtectionWrapper';

// Simplified lazy loading without extra options
const createLazyRoute = (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
  return lazy(importFn);
};

// Pre-load commonly used components
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const Explore = lazy(() => import('@/pages/Explore'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Admin components
const SystemFunctionalityBreakdown = lazy(() => import('@/pages/admin/SystemFunctionalityBreakdown'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const SystemAnalyticsPage = lazy(() => import('@/pages/admin/SystemAnalyticsPage'));

// Establishment components
const EstablishmentDashboardPage = lazy(() => import('@/pages/establishment/EstablishmentDashboardPage'));
const EstablishmentProfile = lazy(() => import('@/pages/establishment/EstablishmentProfile'));

// Promoter components
const PromoterDashboardPage = lazy(() => import('@/pages/promoter/PromoterDashboardPage'));
const PromoterProfile = lazy(() => import('@/pages/promoter/PromoterProfile'));

// Profile components
const UserProfilePage = lazy(() => import('@/pages/profile/UserProfilePage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));

// Simple protection wrapper
const Protected = ({ children, userTypes }: { children: React.ReactNode; userTypes?: string[] }) => (
  <RouteProtectionWrapper requireAuth={true} allowedUserTypes={userTypes as any}>
    {children}
  </RouteProtectionWrapper>
);

// Flattened route configuration
export const simplifiedRoutes: RouteObject[] = [
  // Public routes - no protection needed
  { path: '/', element: <LandingPage /> },
  { path: '/landing', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/explore', element: <Explore /> },
  { path: '/404', element: <NotFound /> },
  
  // Individual user routes - minimal protection
  { 
    path: '/profile', 
    element: <Protected><UserProfilePage /></Protected>
  },
  { 
    path: '/notifications', 
    element: <Protected><NotificationsPage /></Protected>
  },
  
  // Admin routes - role-based protection
  { 
    path: '/admin', 
    element: <Protected userTypes={['admin']}><SystemFunctionalityBreakdown /></Protected>
  },
  { 
    path: '/admin/system-breakdown', 
    element: <Protected userTypes={['admin']}><SystemFunctionalityBreakdown /></Protected>
  },
  { 
    path: '/admin/users', 
    element: <Protected userTypes={['admin']}><AdminUsersPage /></Protected>
  },
  { 
    path: '/admin/analytics', 
    element: <Protected userTypes={['admin']}><SystemAnalyticsPage /></Protected>
  },
  
  // Establishment routes
  { 
    path: '/establishment/dashboard', 
    element: <Protected userTypes={['establishment']}><EstablishmentDashboardPage /></Protected>
  },
  { 
    path: '/establishment/profile', 
    element: <Protected userTypes={['establishment']}><EstablishmentProfile /></Protected>
  },
  
  // Promoter routes
  { 
    path: '/promoter/dashboard', 
    element: <Protected userTypes={['promoter']}><PromoterDashboardPage /></Protected>
  },
  { 
    path: '/promoter/profile', 
    element: <Protected userTypes={['promoter']}><PromoterProfile /></Protected>
  },
  
  // Catch-all
  { path: '*', element: <NotFound /> }
];
