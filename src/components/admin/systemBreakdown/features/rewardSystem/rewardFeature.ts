
import { FeatureItem } from '../../types';
import { rewardSystemDatabaseAnalysis, rewardSystemRequirements } from './databaseAnalysis';

export const rewardProgramFeature: FeatureItem = {
  id: "reward-program",
  name: "Reward Program",
  description: "Earn and redeem points for visiting establishments and trying new mocktails",
  status: "in_progress",
  adminAccess: "full",
  establishmentAccess: "none",
  individualAccess: "full",
  databaseStatus: "in_progress",
  dbStatus: "in_progress",
  userImpact: "high",
  complexity: "high",
  testSteps: [
    "Visit establishment and earn points",
    "Try new mocktail for bonus points",
    "View points balance",
    "Redeem points for reward",
    "Track reward history"
  ],
  databaseAnalysis: rewardSystemDatabaseAnalysis,
  dbRequirementsText: rewardSystemRequirements,
  implementationProgress: 70, // Updated progress
  dbCompleted: 85 // Updated database progress
};
