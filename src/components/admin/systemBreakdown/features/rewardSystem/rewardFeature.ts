
import { FeatureItem } from '../../types';

export const rewardFeature: FeatureItem = {
  id: "reward-program",
  name: "Reward Program",
  description: "A comprehensive reward system that allows users to earn and redeem points for various activities",
  status: "implemented",
  adminAccess: "full",
  establishmentAccess: "read",
  individualAccess: "read",
  databaseStatus: "complete",
  userImpact: "high",
  complexity: "high",
  implementationProgress: 100,
  dbCompleted: true, // Using boolean as the type requires
  tags: ["reward", "loyalty", "user-engagement"],
  databaseAnalysis: `
    Database Implementation:
    - [x] User rewards table implemented
    - [x] Reward transactions table implemented
    - [x] Reward tiers table implemented
    - [x] Reward offerings table implemented
    - [x] Reward redemptions table implemented
    - [x] Reward rules table implemented
    - [x] Achievement tracking system implemented
    - [x] Streak tracking system implemented
  `,
  testSteps: [
    "Create test user with no rewards",
    "Perform action that should earn rewards",
    "Verify points are added to user's account",
    "Test redemption of reward points for a discount",
    "Test achievement unlocking mechanism",
    "Test streak maintenance and rewards",
    "Test milestone notifications"
  ]
};

// Also export as rewardProgramFeature for backward compatibility
export const rewardProgramFeature = rewardFeature;
