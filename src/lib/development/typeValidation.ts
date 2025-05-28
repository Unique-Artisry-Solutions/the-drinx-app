
import { 
  RewardTier, 
  RewardOffering, 
  Achievement, 
  RewardTransaction, 
  UserRewardProfile 
} from '@/types/rewards';

/**
 * Runtime type validation for development tooling
 */

export const isRewardTier = (obj: any): obj is RewardTier => {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.points_required === 'number' &&
    typeof obj.minimumPoints === 'number' &&
    Array.isArray(obj.benefits) &&
    typeof obj.description === 'string' &&
    typeof obj.color === 'string' &&
    typeof obj.icon === 'string' &&
    typeof obj.is_active === 'boolean'
  );
};

export const isRewardOffering = (obj: any): obj is RewardOffering => {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.pointCost === 'number' &&
    typeof obj.points_required === 'number' &&
    typeof obj.pointsRequired === 'number' &&
    typeof obj.pointValue === 'number' &&
    typeof obj.is_active === 'boolean'
  );
};

export const isAchievement = (obj: any): obj is Achievement => {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.points === 'number' &&
    typeof obj.pointsReward === 'number' &&
    typeof obj.icon === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.progress === 'number' &&
    typeof obj.threshold === 'number' &&
    typeof obj.isCompleted === 'boolean'
  );
};

export const isRewardTransaction = (obj: any): obj is RewardTransaction => {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.userId === 'string' &&
    typeof obj.user_id === 'string' &&
    (obj.type === 'earned' || obj.type === 'redeemed') &&
    (obj.transaction_type === 'EARN' || obj.transaction_type === 'REDEEM') &&
    typeof obj.points === 'number' &&
    typeof obj.pointsAmount === 'number' &&
    typeof obj.description === 'string' &&
    typeof obj.source === 'string' &&
    typeof obj.timestamp === 'string' &&
    typeof obj.created_at === 'string' &&
    typeof obj.date === 'string'
  );
};

export const isUserRewardProfile = (obj: any): obj is UserRewardProfile => {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.points === 'number' &&
    typeof obj.totalPoints === 'number' &&
    typeof obj.lifetime_points === 'number' &&
    typeof obj.lifetimePoints === 'number' &&
    isRewardTier(obj.currentTier) &&
    Array.isArray(obj.availableRewards) &&
    obj.availableRewards.every(isRewardOffering) &&
    Array.isArray(obj.transactionHistory) &&
    obj.transactionHistory.every(isRewardTransaction) &&
    Array.isArray(obj.redemptionHistory) &&
    obj.redemptionHistory.every(isRewardTransaction) &&
    Array.isArray(obj.achievements) &&
    obj.achievements.every(isAchievement) &&
    typeof obj.created_at === 'string' &&
    typeof obj.updated_at === 'string'
  );
};

/**
 * Development error reporting
 */
export const createTypeError = (expected: string, received: any, context?: string): Error => {
  const contextStr = context ? ` in ${context}` : '';
  return new Error(
    `Type validation failed${contextStr}: expected ${expected}, received ${typeof received}. Value: ${JSON.stringify(received, null, 2)}`
  );
};

/**
 * Strict type assertion with detailed error messages
 */
export const assertRewardTier = (obj: any, context?: string): RewardTier => {
  if (!isRewardTier(obj)) {
    throw createTypeError('RewardTier', obj, context);
  }
  return obj;
};

export const assertRewardOffering = (obj: any, context?: string): RewardOffering => {
  if (!isRewardOffering(obj)) {
    throw createTypeError('RewardOffering', obj, context);
  }
  return obj;
};

export const assertAchievement = (obj: any, context?: string): Achievement => {
  if (!isAchievement(obj)) {
    throw createTypeError('Achievement', obj, context);
  }
  return obj;
};

export const assertRewardTransaction = (obj: any, context?: string): RewardTransaction => {
  if (!isRewardTransaction(obj)) {
    throw createTypeError('RewardTransaction', obj, context);
  }
  return obj;
};

export const assertUserRewardProfile = (obj: any, context?: string): UserRewardProfile => {
  if (!isUserRewardProfile(obj)) {
    throw createTypeError('UserRewardProfile', obj, context);
  }
  return obj;
};
