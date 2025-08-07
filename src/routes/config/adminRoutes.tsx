
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
      { path: 'system-breakdown', element: <AdminSystemOverviewPage /> },
      { path: 'analytics', element: <SystemAnalyticsPage /> },
      { path: 'system-configuration', element: <SystemConfigurationPage /> },
      
      // User Management
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'users/:id', element: <AdminUserProfile /> },
      
      // Content Management
      { path: 'establishments', element: <AdminEstablishmentsPage /> },
      { path: 'establishments/:id', element: <AdminEstablishmentProfile /> },
      { path: 'photo-moderation', element: <PhotoModerationPage /> },
      { path: 'content-moderation', element: <ContentModerationPage /> },
      
      // System Tools
      { path: 'component-catalog', element: <AdminToolsPage /> },
      { path: 'theme-customization', element: <ThemeCustomizationPage /> },
      { path: 'testing', element: <TestingInterfacePage /> },
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
