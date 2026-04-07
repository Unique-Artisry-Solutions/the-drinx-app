
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminNotificationsPage from '@/pages/admin/notifications/AdminNotificationsPage';
import NotificationTestingPage from '@/pages/admin/notifications/NotificationTestingPage';
import ComponentCatalogPage from '@/pages/admin/ComponentCatalogPage';
import AdminDocumentationPage from '@/pages/admin/AdminDocumentationPage';
import SystemConfigurationPage from '@/pages/admin/SystemConfigurationPage';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import AdminNotFound from '@/components/admin/AdminNotFound';
import RouteProtectionWrapper from '@/hoc/RouteProtectionWrapper';
import AdminEstablishmentsPage from '@/pages/admin/AdminEstablishmentsPage';
import PhotoModerationPage from '@/pages/admin/PhotoModerationPage';

import AdminToolsPage from '@/pages/admin/AdminToolsPage';
import AdminRewardsPage from '@/pages/admin/AdminRewardsPage';
import AdminLogsPage from '@/pages/admin/AdminLogsPage';
import ContentModerationPage from '@/pages/admin/ContentModerationPage';
import AdminAllActionsPage from '@/pages/admin/AdminAllActionsPage';
import { AdminSuspenseFallback } from '@/components/loading/AdminSuspenseFallback';

// Lazy loaded components for performance
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const RewardSystemMonitorPage = lazy(() => import('@/pages/admin/RewardSystemMonitorPage'));
const RewardsAdminPage = lazy(() => import('@/pages/admin/RewardsAdminPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminUserProfile = lazy(() => import('@/pages/admin/AdminUserProfile'));

// Heavy analytics and system components - lazy loaded for better bundle splitting
const SystemAnalyticsPage = lazy(() => import('@/pages/admin/SystemAnalyticsPage'));
const SystemFunctionalityBreakdown = lazy(() => import('@/pages/admin/SystemFunctionalityBreakdown'));
const AdminSystemOverviewPage = lazy(() => import('@/pages/admin/AdminSystemOverviewPage'));



// Simplified admin routes - removed duplicate simplified routes
export const adminRoutes: RouteObject[] = [
  // Admin login - separate from protected routes
  { 
    path: '/admin/login', 
    element: <AdminLogin /> 
  },
  
  // Main admin routes with clear hierarchy
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
      // Dashboard & System
      { 
        index: true, 
        element: (
          <Suspense fallback={<AdminSuspenseFallback title="System Overview" description="Loading system dashboard..." />}>
            <AdminSystemOverviewPage />
          </Suspense>
        ) 
      },
      { 
        path: 'dashboard', 
        element: (
          <Suspense fallback={<AdminSuspenseFallback title="Admin Dashboard" description="Loading admin dashboard..." />}>
            <AdminDashboard />
          </Suspense>
        ) 
      },
      { path: 'all-actions', element: <AdminAllActionsPage /> },
      { 
        path: 'analytics', 
        element: (
          <Suspense fallback={<AdminSuspenseFallback title="System Analytics" description="Loading analytics dashboard..." type="analytics" />}>
            <SystemAnalyticsPage />
          </Suspense>
        ) 
      },
      { 
        path: 'system-breakdown', 
        element: (
          <Suspense fallback={<AdminSuspenseFallback title="System Breakdown" description="Loading system functionality breakdown..." type="editor" />}>
            <SystemFunctionalityBreakdown />
          </Suspense>
        ) 
      },
      { path: 'system-configuration', element: <SystemConfigurationPage /> },
      
      // User Management
      { 
        path: 'users', 
        element: (
          <Suspense fallback={<AdminSuspenseFallback title="User Management" description="Loading user management interface..." />}>
            <AdminUsersPage />
          </Suspense>
        ) 
      },
      { 
        path: 'users/:id', 
        element: (
          <Suspense fallback={<AdminSuspenseFallback title="User Profile" description="Loading user profile..." />}>
            <AdminUserProfile />
          </Suspense>
        ) 
      },
      
      // Content Management
      { path: 'establishments', element: <AdminEstablishmentsPage /> },
      { path: 'photo-moderation', element: <PhotoModerationPage /> },
      { path: 'content-moderation', element: <ContentModerationPage /> },
      
      // Test route to isolate issue
      { path: 'content-moderation-test', element: <div>CONTENT MODERATION TEST PAGE WORKS</div> },
      
      // Logs & Monitoring
      { path: 'logs', element: <AdminLogsPage /> },
      
      // System Tools
      { path: 'component-catalog', element: <AdminToolsPage /> },
      
      // Communication
      { path: 'notifications', element: <AdminNotificationsPage /> },
      { path: 'notification-testing', element: <NotificationTestingPage /> },
      
      // Rewards & Commerce
      { 
        path: 'reward-system-monitor', 
        element: (
          <Suspense fallback={<AdminSuspenseFallback title="Reward System Monitor" description="Loading reward system monitoring..." type="analytics" />}>
            <RewardSystemMonitorPage />
          </Suspense>
        ) 
      },
      { path: 'rewards', element: <AdminRewardsPage /> },
      
      // Documentation
      { path: 'documentation', element: <AdminDocumentationPage /> },
    ]
  },
  
  // Admin-specific 404 handler
  { path: '/admin/*', element: <AdminNotFound /> },
];
