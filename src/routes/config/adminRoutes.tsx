
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminNotificationsPage from '@/pages/admin/notifications/AdminNotificationsPage';
import NotificationTestingPage from '@/pages/admin/notifications/NotificationTestingPage';
import SystemFunctionalityBreakdown from '@/pages/admin/SystemFunctionalityBreakdown';
import ComponentCatalogPage from '@/pages/admin/ComponentCatalogPage';
import AdminDocumentationPage from '@/pages/admin/AdminDocumentationPage';
import SystemConfigurationPage from '@/pages/admin/SystemConfigurationPage';

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

export const adminRoutes: RouteObject[] = [
  { path: '/admin', element: <AdminLogin /> },
  { path: '/admin/login', element: <AdminLogin /> },
  { path: '/admin/dashboard', element: <AdminDashboard /> },
  { path: '/admin/users', element: <AdminUsersPage /> },
  { path: '/admin/users/:id', element: <AdminUserProfile /> },
  { path: '/admin/establishments', element: <AdminEstablishmentsPage /> },
  { path: '/admin/establishments/:id', element: <AdminEstablishmentProfile /> },
  { path: '/admin/system-breakdown', element: <SystemFunctionalityBreakdown /> },
  { path: '/admin/component-catalog', element: <ComponentCatalogPage /> },
  { path: '/admin/analytics', element: <SystemAnalyticsPage /> },
  { path: '/admin/photo-moderation', element: <PhotoModerationPage /> },
  { path: '/admin/content-moderation', element: <ContentModerationPage /> },
  { path: '/admin/theme-customization', element: <ThemeCustomizationPage /> },
  { path: '/admin/documentation', element: <AdminDocumentationPage /> },
  { path: '/admin/system-configuration', element: <SystemConfigurationPage /> },
  { path: '/admin/notifications', element: <AdminNotificationsPage /> },
  { path: '/admin/notification-testing', element: <NotificationTestingPage /> },
  { path: '/admin/reward-system-monitor', element: <RewardSystemMonitorPage /> },
  { path: '/admin/rewards', element: <RewardsAdminPage /> },
  { path: '/admin/testing', element: <TestingInterfacePage /> },
];
