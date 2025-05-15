
import { SystemFeature } from '@/components/admin/systemBreakdown/types';

export const promotionalToolsFeature: SystemFeature = {
  id: 'promotional-tools',
  name: 'Promotional Tools',
  description: 'Tools for promoters to create and manage marketing materials, campaigns, and promotions.',
  category: 'promoter',
  status: 'in_progress',
  implementation: 0.65,
  priority: 'high',
  components: [
    {
      name: 'Campaign Creation',
      status: 'in_progress',
      implementation: 0.7
    },
    {
      name: 'Marketing Materials Manager',
      status: 'in_progress',
      implementation: 0.6
    },
    {
      name: 'Promotion Codes Generator',
      status: 'implemented',
      implementation: 1.0
    },
    {
      name: 'Analytics Dashboard',
      status: 'planned',
      implementation: 0.3
    }
  ],
  dependencies: ['core-authentication', 'event-management'],
  tasks: [
    { id: 'promo-1', title: 'Implement campaign creation UI', status: 'completed' },
    { id: 'promo-2', title: 'Add audience targeting logic', status: 'in-progress' },
    { id: 'promo-3', title: 'Build marketing materials manager', status: 'in-progress' },
    { id: 'promo-4', title: 'Create promotion code system', status: 'completed' },
    { id: 'promo-5', title: 'Develop campaign effectiveness analytics', status: 'planned' }
  ]
};
