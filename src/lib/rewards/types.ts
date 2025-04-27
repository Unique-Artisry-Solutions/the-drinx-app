
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

// Transform functions to ensure type safety
export function transformRewardTier(dbTier: any): RewardTier {
  return {
    ...dbTier,
    benefits: Array.isArray(dbTier.benefits) ? dbTier.benefits : []
  };
}

export function transformTransaction(dbTransaction: any): RewardTransaction {
  return {
    ...dbTransaction,
    metadata: typeof dbTransaction.metadata === 'string' 
      ? JSON.parse(dbTransaction.metadata) 
      : dbTransaction.metadata || {}
  };
}

