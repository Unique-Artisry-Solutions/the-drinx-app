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
// Direct imports for problematic components
import AdminEstablishmentsPage from '@/pages/admin/AdminEstablishmentsPage';
import PhotoModerationPage from '@/pages/admin/PhotoModerationPage';

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

console.log('adminRoutes: Module loaded, registering routes');

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
      // Fixed: Use system-breakdown as the default instead of dashboard
      { 
        index: true, 
        element: (() => {
          console.log('adminRoutes: System breakdown index route matched');
          return <SystemFunctionalityBreakdown />;
        })()
      },
      // Keep dashboard route for direct access
      { 
        path: 'dashboard', 
        element: (() => {
          console.log('adminRoutes: Dashboard route matched');
          return <AdminDashboard />;
        })()
      },
      { 
        path: 'system-breakdown', 
        element: (() => {
          console.log('adminRoutes: System breakdown route matched');
          return <SystemFunctionalityBreakdown />;
        })()
      },
      { 
        path: 'users', 
        element: (() => {
          console.log('adminRoutes: Users route matched');
          return <AdminUsersPage />;
        })()
      },
      { 
        path: 'users/:id', 
        element: (() => {
          console.log('adminRoutes: User profile route matched');
          return <AdminUserProfile />;
        })()
      },
      { 
        path: 'establishments', 
        element: (() => {
          console.log('adminRoutes: Establishments route matched');
          return <AdminEstablishmentsPage />;
        })()
      },
      { 
        path: 'establishments/:id', 
        element: (() => {
          console.log('adminRoutes: Establishment profile route matched');
          return <AdminEstablishmentProfile />;
        })()
      },
      { 
        path: 'component-catalog', 
        element: (() => {
          console.log('adminRoutes: Component catalog route matched');
          return <ComponentCatalogPage />;
        })()
      },
      { 
        path: 'analytics', 
        element: (() => {
          console.log('adminRoutes: Analytics route matched');
          return <SystemAnalyticsPage />;
        })()
      },
      { 
        path: 'photo-moderation', 
        element: (() => {
          console.log('adminRoutes: Photo moderation route matched');
          return <PhotoModerationPage />;
        })()
      },
      { 
        path: 'content-moderation', 
        element: (() => {
          console.log('adminRoutes: Content moderation route matched');
          return <ContentModerationPage />;
        })()
      },
      { 
        path: 'theme-customization', 
        element: (() => {
          console.log('adminRoutes: Theme customization route matched');
          return <ThemeCustomizationPage />;
        })()
      },
      { 
        path: 'documentation', 
        element: (() => {
          console.log('adminRoutes: Documentation route matched');
          return <AdminDocumentationPage />;
        })()
      },
      { 
        path: 'system-configuration', 
        element: (() => {
          console.log('adminRoutes: System configuration route matched');
          return <SystemConfigurationPage />;
        })()
      },
      { 
        path: 'notifications', 
        element: (() => {
          console.log('adminRoutes: Notifications route matched');
          return <AdminNotificationsPage />;
        })()
      },
      { 
        path: 'notification-testing', 
        element: (() => {
          console.log('adminRoutes: Notification testing route matched');
          return <NotificationTestingPage />;
        })()
      },
      { 
        path: 'reward-system-monitor', 
        element: (() => {
          console.log('adminRoutes: Reward system monitor route matched');
          return <RewardSystemMonitorPage />;
        })()
      },
      { 
        path: 'rewards', 
        element: (() => {
          console.log('adminRoutes: Rewards route matched');
          return <RewardsAdminPage />;
        })()
      },
      { 
        path: 'testing', 
        element: (() => {
          console.log('adminRoutes: Testing interface route matched');
          return <TestingInterfacePage />;
        })()
      },
    ]
  },
  // Admin-specific 404 handler for any /admin/* routes not matched above
  { 
    path: '/admin/*', 
    element: (() => {
      console.log('adminRoutes: 404 route matched for admin path');
      return <AdminNotFound />;
    })()
  },
];

console.log('adminRoutes: Routes configured', adminRoutes.length, 'total routes');
console.log('adminRoutes: Child routes count:', adminRoutes[1]?.children?.length || 0);
