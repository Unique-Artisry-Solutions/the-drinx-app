import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminNotificationsPage from '@/pages/admin/notifications/AdminNotificationsPage';
import NotificationTestingPage from '@/pages/admin/notifications/NotificationTestingPage';
import SystemFunctionalityBreakdown from '@/pages/admin/SystemFunctionalityBreakdown';
import ComponentCatalogPage from '@/pages/admin/ComponentCatalogPage';
import AdminDocumentationPage from '@/pages/admin/AdminDocumentationPage';
import SystemConfigurationPage from '@/pages/admin/SystemConfigurationPage';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import AdminNotFound from '@/components/admin/AdminNotFound';
import RouteProtectionWrapper from '@/hoc/RouteProtectionWrapper';
import AdminEstablishmentsPage from '@/pages/admin/AdminEstablishmentsPage';
import PhotoModerationPage from '@/pages/admin/PhotoModerationPage';

// Lazy loaded components
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const RewardSystemMonitorPage = lazy(() => import('@/pages/admin/RewardSystemMonitorPage'));
const RewardsAdminPage = lazy(() => import('@/pages/admin/RewardsAdminPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminUserProfile = lazy(() => import('@/pages/admin/AdminUserProfile'));
const AdminEstablishmentProfile = lazy(() => import('@/pages/admin/AdminEstablishmentProfile'));
const SystemAnalyticsPage = lazy(() => import('@/pages/admin/SystemAnalyticsPage'));
const ContentModerationPage = lazy(() => import('@/pages/admin/ContentModerationPage'));
const ThemeCustomizationPage = lazy(() => import('@/pages/admin/ThemeCustomizationPage'));
const TestingInterfacePage = lazy(() => import('@/pages/admin/TestingInterfacePage'));

// Import simplified routes
import { simplifiedAdminRoutes } from './simplifiedAdminRoutes';

// Add simplified routes to the export
export const adminRoutes: RouteObject[] = [
  // Admin login - separate from protected routes
  { 
    path: '/admin/login', 
    element: <AdminLogin /> 
  },
  
  // All admin routes use the AdminLayout wrapper with standardized protection
  {
    path: '/admin',
    element: (
      <RouteProtectionWrapper 
        requireAuth={true} 
        allowedUserTypes={['admin']}
        redirectTo="/admin/login"
      >
        <AdminLayout />
      </RouteProtectionWrapper>
    ),
    children: [
      { 
        index: true, 
        element: <SystemFunctionalityBreakdown />
      },
      { 
        path: 'dashboard', 
        element: <AdminDashboard />
      },
      { 
        path: 'system-breakdown', 
        element: <SystemFunctionalityBreakdown />
      },
      { 
        path: 'users', 
        element: <AdminUsersPage />
      },
      { 
        path: 'users/:id', 
        element: <AdminUserProfile />
      },
      { 
        path: 'establishments', 
        element: <AdminEstablishmentsPage />
      },
      { 
        path: 'establishments/:id', 
        element: <AdminEstablishmentProfile />
      },
      { 
        path: 'component-catalog', 
        element: <ComponentCatalogPage />
      },
      { 
        path: 'analytics', 
        element: <SystemAnalyticsPage />
      },
      { 
        path: 'photo-moderation', 
        element: <PhotoModerationPage />
      },
      { 
        path: 'content-moderation', 
        element: <ContentModerationPage />
      },
      { 
        path: 'theme-customization', 
        element: <ThemeCustomizationPage />
      },
      { 
        path: 'documentation', 
        element: <AdminDocumentationPage />
      },
      { 
        path: 'system-configuration', 
        element: <SystemConfigurationPage />
      },
      { 
        path: 'notifications', 
        element: <AdminNotificationsPage />
      },
      { 
        path: 'notification-testing', 
        element: <NotificationTestingPage />
      },
      { 
        path: 'reward-system-monitor', 
        element: <RewardSystemMonitorPage />
      },
      { 
        path: 'rewards', 
        element: <RewardsAdminPage />
      },
      { 
        path: 'testing', 
        element: <TestingInterfacePage />
      },
    ]
  },
  // Admin-specific 404 handler for any /admin/* routes not matched above
  { 
    path: '/admin/*', 
    element: <AdminNotFound />
  },
  
  // Add simplified admin routes
  ...simplifiedAdminRoutes,
];
