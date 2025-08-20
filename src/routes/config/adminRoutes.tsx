
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
import TestingDashboard from '@/pages/admin/TestingDashboard';
import AdminSystemOverviewPage from '@/pages/admin/AdminSystemOverviewPage';
import AdminToolsPage from '@/pages/admin/AdminToolsPage';
import AdminRewardsPage from '@/pages/admin/AdminRewardsPage';
import SystemAnalyticsPage from '@/pages/admin/SystemAnalyticsPage';
import AdminLogsPage from '@/pages/admin/AdminLogsPage';
import ContentModerationPage from '@/pages/admin/ContentModerationPage';

// Lazy loaded components
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const RewardSystemMonitorPage = lazy(() => import('@/pages/admin/RewardSystemMonitorPage'));
const RewardsAdminPage = lazy(() => import('@/pages/admin/RewardsAdminPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/SimplifiedAdminUsersPage'));



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
      { index: true, element: <AdminSystemOverviewPage /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'analytics', element: <SystemAnalyticsPage /> },
      { path: 'system-breakdown', element: <AdminSystemOverviewPage /> },
      { path: 'system-configuration', element: <SystemConfigurationPage /> },
      
      // User Management
      { path: 'users', element: <AdminUsersPage /> },
      
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
      { path: 'testing-dashboard', element: <TestingDashboard /> },
      
      // Communication
      { path: 'notifications', element: <AdminNotificationsPage /> },
      { path: 'notification-testing', element: <NotificationTestingPage /> },
      
      // Rewards & Commerce
      { path: 'reward-system-monitor', element: <RewardSystemMonitorPage /> },
      { path: 'rewards', element: <AdminRewardsPage /> },
      
      // Documentation
      { path: 'documentation', element: <AdminDocumentationPage /> },
    ]
  },
  
  // Admin-specific 404 handler
  { path: '/admin/*', element: <AdminNotFound /> },
];
