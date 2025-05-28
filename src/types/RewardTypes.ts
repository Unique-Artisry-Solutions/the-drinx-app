// Re-export all types from the unified rewards type system
export * from './rewards/index';

// Keep existing exports for backward compatibility
export type {
  Achievement,
  RewardTransaction,
  RewardOffering,
  UserRewardProfile,
  TimeSeriesData
} from './rewards/index';
