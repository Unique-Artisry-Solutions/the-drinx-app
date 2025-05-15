
import { userManagement } from './userManagement';
import { establishmentManagement } from './establishmentManagement';
import { barCrawlManagement } from './barCrawlManagement';
import { contentManagement } from './contentManagement';
import { systemConfiguration } from './systemConfiguration';
import { analyticsDashboard } from './analyticsDashboard';
import { pushNotificationSystem } from './pushNotificationSystem';
import { photoModeration } from './photoModeration';
import { systemBreakdown } from './systemBreakdown';
import { contentModeration } from './contentModeration';
import { audienceSegmentation } from './audienceSegmentation';
import { FeatureItem } from '../../types';

// Add the feature flags system to the admin features
export const adminFeatures: FeatureItem[] = [
  userManagement,
  establishmentManagement,
  barCrawlManagement,
  contentManagement,
  systemConfiguration,
  analyticsDashboard,
  pushNotificationSystem,
  photoModeration,
  systemBreakdown,
  contentModeration,
  audienceSegmentation,
  {
    id: 'feature-access-system',
    name: 'Feature Access System',
    description: 'A system to manage feature access based on subscription tiers and user segments',
    status: 'implemented',
    statusUpdated: true,
    category: 'system', 
    complexity: 'medium',
    adminAccess: 'full',
    establishmentAccess: 'partial',
    individualAccess: 'partial',
    databaseStatus: 'complete',
    userImpact: 'medium',
    components: [
      {
        name: 'Feature Flags Database',
        status: 'implemented',
        implementation: 1.0
      },
      {
        name: 'Feature Registry',
        status: 'implemented',
        implementation: 1.0
      },
      {
        name: 'Feature Context',
        status: 'implemented',
        implementation: 1.0
      },
      {
        name: 'FeatureGate Component',
        status: 'implemented',
        implementation: 1.0
      },
      {
        name: 'API Client',
        status: 'implemented',
        implementation: 1.0
      },
      {
        name: 'Feature Usage Analytics',
        status: 'implemented',
        implementation: 1.0
      },
      {
        name: 'Feature Monitoring',
        status: 'implemented',
        implementation: 1.0
      }
    ],
    dependencies: ['auth-system', 'subscription-system'],
  },
];
