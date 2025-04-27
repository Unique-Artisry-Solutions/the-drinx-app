
import { RewardTransaction, RewardTier, RewardOffering, RewardRedemption } from '@/types/SupabaseTables';

export interface RewardOperationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface UserRewardProfile {
  points: number;
  lifetimePoints: number;
  currentTier?: RewardTier;
  availableRewards: RewardOffering[];
  transactionHistory: RewardTransaction[];
  redemptionHistory: RewardRedemption[];
}
