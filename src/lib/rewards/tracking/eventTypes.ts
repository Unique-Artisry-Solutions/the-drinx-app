
/**
 * Defines the standardized event types for reward program tracking
 */
export enum RewardEventType {
  // Enrollment events
  PROGRAM_ENROLLMENT = 'reward_enrollment',
  
  // Points events
  POINTS_EARNED = 'points_earned',
  POINTS_REDEEMED = 'points_redeemed',
  POINTS_EXPIRED = 'points_expired',
  POINTS_ADJUSTED = 'points_adjusted',
  
  // Tier events
  TIER_CHANGED = 'tier_changed',
  TIER_BENEFIT_UNLOCKED = 'tier_benefit_unlocked',
  
  // Reward events
  REWARD_VIEWED = 'reward_viewed',
  REWARD_REDEEMED = 'reward_redeemed',
  REWARD_REDEMPTION_COMPLETED = 'reward_redemption_completed',
  
  // Achievement events
  ACHIEVEMENT_PROGRESS = 'achievement_progress',
  ACHIEVEMENT_COMPLETED = 'achievement_completed',
  
  // User engagement events
  REWARDS_PAGE_VIEW = 'rewards_page_view',
  PROFILE_CHECKED = 'reward_profile_checked',
  PREFERENCE_UPDATED = 'reward_preference_updated'
}

/**
 * Standard event metadata fields that should be included with all events
 */
export interface BaseEventMetadata {
  userId: string;
  timestamp?: string; // ISO string timestamp (added automatically if not provided)
  sessionId?: string;
  source?: string; // Source of the event (web, mobile, etc.)
  establishmentId?: string;
  section?: string; // Added section property for UI component tracking
  category?: string; // Added category for classification
  // Fields for achievement tracking
  achievementId?: string;
  achievementName?: string;
  achievementCount?: number;
  progress?: number;
  threshold?: number;
  // Fields for reward tracking
  rewardId?: string;
  rewardName?: string;
  pointsRequired?: number;
  // General fields
  tier?: number; // User tier
  points?: number; // Points balance
}

/**
 * Points-related event metadata
 */
export interface PointsEventMetadata extends BaseEventMetadata {
  points: number;
  reason?: string;
  category?: string;
  balance?: number;
}

/**
 * Tier-related event metadata
 */
export interface TierEventMetadata extends BaseEventMetadata {
  fromTierId?: string;
  fromTierName?: string;
  toTierId: string;
  toTierName: string;
  pointsToNextTier?: number;
}

/**
 * Reward-related event metadata
 */
export interface RewardEventMetadata extends BaseEventMetadata {
  rewardId?: string;
  rewardName?: string;
  pointsRequired?: number;
  category?: string;
}

/**
 * Achievement-related event metadata
 */
export interface AchievementEventMetadata extends BaseEventMetadata {
  achievementId?: string;
  achievementName?: string;
  progress?: number;
  threshold?: number;
  category?: string;
  pointsAwarded?: number;
}

/**
 * Page view and engagement event metadata
 */
export interface EngagementEventMetadata extends BaseEventMetadata {
  pageUrl?: string;
  viewDuration?: number; // in seconds
  interactionCount?: number;
  section?: string;
}

/**
 * Funnel stage tracking metadata
 */
export interface FunnelEventMetadata extends BaseEventMetadata {
  funnelName: string;
  stageName: string;
  stageIndex: number;
  totalStages: number;
  conversionTime?: number; // time in milliseconds since previous stage
  dropoff?: boolean; // whether the user dropped off at this stage
  reason?: string; // reason for dropoff
  achievementCount?: number; // count of achievements for certain views
  achievementId?: string; // ID of achievement being viewed/tracked
  rewardId?: string; // ID of reward being viewed/tracked
  rewardName?: string; // Name of reward being viewed/tracked
}

/**
 * Union type of all possible metadata types
 */
export type EventMetadata = 
  | BaseEventMetadata
  | PointsEventMetadata
  | TierEventMetadata
  | RewardEventMetadata
  | AchievementEventMetadata
  | EngagementEventMetadata
  | FunnelEventMetadata;
