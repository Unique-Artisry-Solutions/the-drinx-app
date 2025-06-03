
import { FeatureItem } from '../types';
import { userManagement } from './adminFeatures/userManagement';
import { establishmentManagement } from './adminFeatures/establishmentManagement';
import { barCrawlManagement } from './adminFeatures/barCrawlManagement';
import { contentManagement } from './adminFeatures/contentManagement';
import { systemConfiguration } from './adminFeatures/systemConfiguration';
import { analyticsDashboard } from './adminFeatures/analyticsDashboard';
import { photoModeration } from './adminFeatures/photoModeration';
import { systemBreakdown } from './adminFeatures/systemBreakdown';
import { contentModeration } from './adminFeatures/contentModeration';
import { pushNotificationSystem } from './adminFeatures/pushNotificationSystem';

export const adminFeatures: FeatureItem[] = [
  userManagement,
  establishmentManagement,
  barCrawlManagement,
  contentManagement,
  systemConfiguration,
  analyticsDashboard,
  photoModeration,
  systemBreakdown,
  contentModeration,
  pushNotificationSystem,
  {
    id: 'admin-11',
    name: 'Theme Customization System',
    description: 'Manage global themes, colors, and branding across the platform',
    status: 'implemented',
    adminAccess: 'full',
    establishmentAccess: 'none',
    individualAccess: 'none',
    databaseStatus: 'complete',
    userImpact: 'medium',
    complexity: 'medium',
    implementationProgress: 95
  },
  {
    id: 'admin-12',
    name: 'Feature Testing Interface',
    description: 'Testing interface for new features before public release',
    status: 'implemented',
    adminAccess: 'full',
    establishmentAccess: 'none',
    individualAccess: 'none',
    databaseStatus: 'complete',
    userImpact: 'low',
    complexity: 'high',
    implementationProgress: 88
  },
  {
    id: 'admin-13',
    name: 'Global Notification Management',
    description: 'Send system-wide notifications and announcements',
    status: 'implemented',
    adminAccess: 'full',
    establishmentAccess: 'none',
    individualAccess: 'none',
    databaseStatus: 'complete',
    userImpact: 'medium',
    complexity: 'medium',
    implementationProgress: 92
  },
  {
    id: 'admin-14',
    name: 'Database Performance Monitoring',
    description: 'Monitor database performance and optimization metrics',
    status: 'implemented',
    adminAccess: 'full',
    establishmentAccess: 'none',
    individualAccess: 'none',
    databaseStatus: 'complete',
    userImpact: 'low',
    complexity: 'high',
    implementationProgress: 85
  },
  {
    id: 'admin-15',
    name: 'Security & Audit Logs',
    description: 'Comprehensive security monitoring and audit trail system',
    status: 'implemented',
    adminAccess: 'full',
    establishmentAccess: 'none',
    individualAccess: 'none',
    databaseStatus: 'complete',
    userImpact: 'high',
    complexity: 'high',
    implementationProgress: 90
  },
  {
    id: 'admin-16',
    name: 'API Management Dashboard',
    description: 'Monitor API usage, rate limiting, and external integrations',
    status: 'in_progress',
    adminAccess: 'full',
    establishmentAccess: 'none',
    individualAccess: 'none',
    databaseStatus: 'in_progress',
    userImpact: 'medium',
    complexity: 'high',
    implementationProgress: 60
  },
  {
    id: 'admin-17',
    name: 'Revenue Analytics Suite',
    description: 'Comprehensive revenue analytics across all user types',
    status: 'implemented',
    adminAccess: 'full',
    establishmentAccess: 'none',
    individualAccess: 'none',
    databaseStatus: 'complete',
    userImpact: 'high',
    complexity: 'high',
    implementationProgress: 93
  }
];
