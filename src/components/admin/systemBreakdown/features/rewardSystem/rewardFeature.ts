
// File: src/components/admin/systemBreakdown/features/rewardSystem/rewardFeature.ts
import { FeatureItem } from '../../types';

export const rewardSystemFeature: FeatureItem = {
  id: 'reward-system',
  name: 'Reward System',
  description: 'A comprehensive reward and loyalty program for users and establishments',
  status: 'implemented',
  category: 'core',
  complexity: 'high',
  priority: 'high',
  implementationProgress: 100,
  adminAccess: 'full',
  establishmentAccess: 'full',
  individualAccess: 'full',
  databaseStatus: 'complete',
  userImpact: 'high',
  databaseAnalysis: `
  # Reward System Database Schema Analysis

  ## Core Tables
  [x] reward_tiers - Defines levels in the loyalty program
  [x] reward_offerings - Individual rewards that can be redeemed
  [x] user_reward_profiles - Stores user's points, tier status
  [x] reward_transactions - Tracks point earnings and redemptions
  
  ## Supporting Tables
  [x] reward_settings - Configuration options for reward program
  [x] reward_campaigns - For special/seasonal promotions
  [x] reward_achievements - Milestone-based rewards
  `,
  dbRequirementsText: `Required tables:
  - reward_tiers
  - reward_offerings
  - user_reward_profiles
  - reward_transactions
  - reward_settings (optional)
  - reward_campaigns (for promotions)
  - reward_achievements (for milestones)`,
  tags: ['core-feature', 'signature', 'high-impact'],
  dbCompleted: true
};
