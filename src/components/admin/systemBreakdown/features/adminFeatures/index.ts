
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

// Simplified admin features list
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
        type: 'database',
        status: 'completed',
      },
      {
        name: 'Feature Registry',
        type: 'library',
        status: 'completed',
      },
      {
        name: 'Feature Context',
        type: 'context',
        status: 'completed',
      },
      {
        name: 'FeatureGate Component',
        type: 'component',
        status: 'completed',
      },
      {
        name: 'API Client',
        type: 'api',
        status: 'completed',
      },
      {
        name: 'Feature Usage Analytics',
        type: 'dashboard',
        status: 'completed',
      },
      {
        name: 'Feature Monitoring',
        type: 'dashboard',
        status: 'completed',
      },
    ],
    lastUpdated: new Date().toISOString(),
    assignedTo: 'dev-team',
    dependencies: ['auth-system', 'subscription-system'],
  },
];
