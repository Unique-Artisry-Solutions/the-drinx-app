
import { FeatureItem } from '../../types';

export const achievementSystemFeature: FeatureItem = {
  id: 'achievement-system',
  name: 'Achievement System',
  description: 'Gamified achievements for user engagement and milestones',
  status: 'planned',
  implementationProgress: 30,
  priority: 'medium',
  complexity: 'high',
  category: 'Gamification',
  tags: ['achievements', 'gamification', 'rewards'],
  dependencies: ['user-profiles', 'visit-tracking'],
  dbStatus: 'partial',
  dbRequirementsText: 'Tables for achievements, user progress, and earned badges'
};
