
import { AdminPageConfig } from './AdminPageWrapper';

export const createPageConfig = (
  title: string,
  options: Partial<AdminPageConfig> = {}
): AdminPageConfig => ({
  title,
  showBreadcrumbs: true,
  maxWidth: 'xl',
  padding: 'md',
  autoSetPageInfo: true,
  ...options
});

export const COMMON_PAGE_CONFIGS = {
  dashboard: createPageConfig('Dashboard', {
    description: 'Overview of system activity and key metrics',
    maxWidth: 'full'
  }),
  
  users: createPageConfig('User Management', {
    description: 'Manage users, roles, and permissions',
    maxWidth: '2xl'
  }),
  
  establishments: createPageConfig('Establishment Management', {
    description: 'Manage establishments and their information',
    maxWidth: '2xl'
  }),
  
  settings: createPageConfig('System Configuration', {
    description: 'Configure system settings and preferences',
    maxWidth: 'lg'
  }),
  
  analytics: createPageConfig('System Analytics', {
    description: 'View detailed analytics and reports',
    maxWidth: 'full'
  }),
  
  logs: createPageConfig('Logs & Alerts', {
    description: 'HTTP requests, payment audits, security events and alerts',
    maxWidth: 'full'
  }),
  
  contentModeration: createPageConfig('Content Moderation', {
    description: 'Review and moderate user-generated content',
    maxWidth: '2xl'
  })
};

export const getPageConfigByPath = (pathname: string): AdminPageConfig => {
  const pathMap: Record<string, AdminPageConfig> = {
    '/admin/dashboard': COMMON_PAGE_CONFIGS.dashboard,
    '/admin/users': COMMON_PAGE_CONFIGS.users,
    '/admin/establishments': COMMON_PAGE_CONFIGS.establishments,
    '/admin/system-configuration': COMMON_PAGE_CONFIGS.settings,
    '/admin/analytics': COMMON_PAGE_CONFIGS.analytics,
    '/admin/logs': COMMON_PAGE_CONFIGS.logs,
    '/admin/content-moderation': COMMON_PAGE_CONFIGS.contentModeration,
    '/admin/photo-moderation': COMMON_PAGE_CONFIGS.contentModeration,
  };

  return pathMap[pathname] || createPageConfig('Admin Page');
};
