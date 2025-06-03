
import { FeatureItem } from '../../types';

export const rewardFeature: FeatureItem = {
  id: 'reward-system-001',
  name: 'Reward System',
  description: 'Comprehensive reward system with points, tiers, and offerings',
  status: 'implemented',
  adminAccess: 'full',
  establishmentAccess: 'full',
  individualAccess: 'partial',
  databaseStatus: 'complete',
  userImpact: 'high',
  complexity: 'high',
  implementationProgress: 95,
  category: 'user_experience',
  databaseAnalysis: `
    Database Implementation:
    - [x] User points tracking system implemented
    - [x] Reward tiers table implemented
    - [x] Reward offerings table implemented
    - [x] Point transactions table implemented
    - [x] Reward redemptions table implemented
    - [x] Achievement system implemented
    - [x] Streak tracking implemented
    - [x] Performance analytics implemented
  `,
  testSteps: [
    'Create user account and verify point tracking',
    'Test reward tier progression',
    'Verify reward offering redemption',
    'Test achievement unlock system',
    'Verify streak tracking functionality',
    'Test reward analytics dashboard',
    'Verify point transaction history',
    'Test establishment reward configuration'
  ]
};
