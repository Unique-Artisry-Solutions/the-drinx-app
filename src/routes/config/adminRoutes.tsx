
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
import AdminRouteHandler from '@/components/admin/AdminRouteHandler';

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const RewardSystemMonitorPage = lazy(() => import('@/pages/admin/RewardSystemMonitorPage'));
const RewardsAdminPage = lazy(() => import('@/pages/admin/RewardsAdminPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage'));
const AdminUserProfile = lazy(() => import('@/pages/admin/AdminUserProfile'));
const AdminEstablishmentsPage = lazy(() => import('@/pages/admin/AdminEstablishmentsPage'));
const AdminEstablishmentProfile = lazy(() => import('@/pages/admin/AdminEstablishmentProfile'));
const SystemAnalyticsPage = lazy(() => import('@/pages/admin/SystemAnalyticsPage'));
const PhotoModerationPage = lazy(() => import('@/pages/admin/PhotoModerationPage'));
const ContentModerationPage = lazy(() => import('@/pages/admin/ContentModerationPage'));
const ThemeCustomizationPage = lazy(() => import('@/pages/admin/ThemeCustomizationPage'));
const TestingInterfacePage = lazy(() => import('@/pages/admin/TestingInterfacePage'));

// Use AdminRouteHandler for the main /admin route to handle dev mode bypass
export const adminRoutes: RouteObject[] = [
  { path: '/admin', element: <AdminRouteHandler /> },
  { path: '/admin/login', element: <AdminLogin /> },
  // All other admin routes use the AdminLayout
  { 
    path: '/admin/dashboard', 
    element: <AdminLayout><AdminDashboard /></AdminLayout> 
  },
  { 
    path: '/admin/users', 
    element: <AdminLayout><AdminUsersPage /></AdminLayout> 
  },
  { 
    path: '/admin/users/:id', 
    element: <AdminLayout><AdminUserProfile /></AdminLayout> 
  },
  { 
    path: '/admin/establishments', 
    element: <AdminLayout><AdminEstablishmentsPage /></AdminLayout> 
  },
  { 
    path: '/admin/establishments/:id', 
    element: <AdminLayout><AdminEstablishmentProfile /></AdminLayout> 
  },
  { 
    path: '/admin/system-breakdown', 
    element: <AdminLayout><SystemFunctionalityBreakdown /></AdminLayout> 
  },
  { 
    path: '/admin/component-catalog', 
    element: <AdminLayout><ComponentCatalogPage /></AdminLayout> 
  },
  { 
    path: '/admin/analytics', 
    element: <AdminLayout><SystemAnalyticsPage /></AdminLayout> 
  },
  { 
    path: '/admin/photo-moderation', 
    element: <AdminLayout><PhotoModerationPage /></AdminLayout> 
  },
  { 
    path: '/admin/content-moderation', 
    element: <AdminLayout><ContentModerationPage /></AdminLayout> 
  },
  { 
    path: '/admin/theme-customization', 
    element: <AdminLayout><ThemeCustomizationPage /></AdminLayout> 
  },
  { 
    path: '/admin/documentation', 
    element: <AdminLayout><AdminDocumentationPage /></AdminLayout> 
  },
  { 
    path: '/admin/system-configuration', 
    element: <AdminLayout><SystemConfigurationPage /></AdminLayout> 
  },
  { 
    path: '/admin/notifications', 
    element: <AdminLayout><AdminNotificationsPage /></AdminLayout> 
  },
  { 
    path: '/admin/notification-testing', 
    element: <AdminLayout><NotificationTestingPage /></AdminLayout> 
  },
  { 
    path: '/admin/reward-system-monitor', 
    element: <AdminLayout><RewardSystemMonitorPage /></AdminLayout> 
  },
  { 
    path: '/admin/rewards', 
    element: <AdminLayout><RewardsAdminPage /></AdminLayout> 
  },
  { 
    path: '/admin/testing', 
    element: <AdminLayout><TestingInterfacePage /></AdminLayout> 
  },
];
