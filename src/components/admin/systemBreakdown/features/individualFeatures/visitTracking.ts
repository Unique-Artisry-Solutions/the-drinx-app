
import { FeatureItem } from '../../types';

export const visitTrackingFeature: FeatureItem = {
  id: 'visit-tracking',
  name: 'Visit Tracking',
  description: 'Tracks and rewards users for visiting partner establishments',
  status: 'in_progress',
  implementationProgress: 75,
  priority: 'medium',
  complexity: 'medium',
  category: 'Tracking',
  tags: ['tracking', 'check-in', 'visit'],
  dependencies: ['establishment-database', 'reward-program'],
  dbStatus: 'partial',
  dbRequirementsText: 'Tables for visit records, check-ins, and visit statistics'
};
