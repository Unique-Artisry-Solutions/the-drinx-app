
import { FeatureItem } from '../../types';

// Define the reward program feature
export const rewardProgramFeature: FeatureItem = {
  id: 'reward-program',
  name: 'Reward Program',
  description: 'A loyalty program that rewards users for various actions within the app',
  implementationProgress: 70,
  status: 'in_progress',
  priority: 'high',
  complexity: 'high',
  effort: 'high',
  impact: 'high',
  category: 'Rewards',
  tags: ['rewards', 'loyalty', 'user-engagement'],
  responsible: 'Rewards Team',
  dependencies: ['user-accounts'],
  completionCriteria: [
    'Users can earn points for various actions',
    'Points can be redeemed for rewards',
    'Different tiers of rewards are available',
    'Activity history is visible to users'
  ],
  dbStatus: 'partial',
  dbCompleted: true,
  dbRequirementsText: 'Tables for rewards, user points, reward tiers, and redemption history',
  notes: 'Currently at 70% implementation. Core functionality is in place, but advanced features like tiers and analytics are still in development.'
};

// Export additional reward features
export const rewardFeatures: FeatureItem[] = [
  rewardProgramFeature,
  {
    id: 'reward-tiers',
    name: 'Reward Tiers',
    description: 'Different levels of rewards based on user activity and engagement',
    implementationProgress: 50,
    status: 'in_progress',
    priority: 'medium',
    complexity: 'medium',
    effort: 'medium',
    impact: 'high',
    category: 'Rewards',
    tags: ['rewards', 'tiers', 'gamification'],
    responsible: 'Rewards Team',
    dependencies: ['reward-program'],
    completionCriteria: [
      'Multiple tiers defined with clear requirements',
      'Users can see their current tier and progress',
      'Different benefits are available at each tier'
    ],
    dbStatus: 'partial',
    dbCompleted: true,
    dbRequirementsText: 'Extensions to rewards tables for tier definitions and user tier status',
    notes: 'Basic tier structure is defined, but tier-specific rewards need implementation'
  },
  {
    id: 'reward-analytics',
    name: 'Reward Analytics',
    description: 'Analytics dashboard for tracking reward program effectiveness',
    implementationProgress: 30,
    status: 'in_progress',
    priority: 'low',
    complexity: 'medium',
    effort: 'medium',
    impact: 'medium',
    category: 'Rewards',
    tags: ['rewards', 'analytics', 'dashboard'],
    responsible: 'Rewards Team',
    dependencies: ['reward-program', 'analytics-base'],
    completionCriteria: [
      'Dashboard showing reward program metrics',
      'Ability to track redemption rates',
      'Insights on most popular rewards',
      'User engagement metrics related to rewards'
    ],
    dbStatus: 'not_started',
    dbCompleted: false,
    dbRequirementsText: 'Analytics views and functions for reward data aggregation',
    notes: 'Initial metrics defined, but dashboard implementation is still early stage'
  }
];
