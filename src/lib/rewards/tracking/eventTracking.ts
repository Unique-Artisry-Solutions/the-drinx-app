
import { supabase } from '@/lib/supabase';
import { 
  RewardEventType, 
  BaseEventMetadata,
  PointsEventMetadata,
  TierEventMetadata,
  RewardEventMetadata,
  AchievementEventMetadata,
  FunnelEventMetadata,
  EngagementEventMetadata,
  EventMetadata
} from './eventTypes';

/**
 * Records a reward-related event to the analytics system
 * @param eventType The type of event from RewardEventType enum
 * @param metadata Event metadata appropriate for the event type
 * @returns Promise resolving to the tracking ID or null if failed
 */
export async function trackRewardEvent(
  eventType: RewardEventType,
  metadata: EventMetadata
): Promise<string | null> {
  try {
    // Ensure we have a timestamp
    const eventMetadata = {
      ...metadata,
      timestamp: metadata.timestamp || new Date().toISOString()
    } as Record<string, any>;

    // Track via the Supabase RPC function
    const { data, error } = await supabase.rpc('track_analytics_event', {
      p_user_id: metadata.userId,
      p_event_type: eventType,
      p_event_data: eventMetadata,
      p_page_url: (metadata as any).pageUrl || null,
      p_user_agent: navigator?.userAgent || null,
      p_ip_address: null // IP address is collected server-side
    });

    if (error) {
      console.error('Error tracking reward event:', error);
      return null;
    }

    return data as string;
  } catch (error) {
    console.error('Failed to track reward event:', error);
    return null;
  }
}

/**
 * Track a user's progression through a predefined funnel
 * @param funnelName Name of the funnel (e.g., "reward_redemption")
 * @param stageName Name of the current stage (e.g., "viewed_rewards")
 * @param stageIndex Index of the current stage (0-based)
 * @param totalStages Total number of stages in the funnel
 * @param userId User ID
 * @param additionalMetadata Additional metadata to include
 */
export async function trackFunnelStage(
  funnelName: string,
  stageName: string,
  stageIndex: number,
  totalStages: number,
  userId: string,
  additionalMetadata: Partial<BaseEventMetadata> = {}
): Promise<string | null> {
  // Get the previous stage tracking time from sessionStorage to calculate conversion time
  const prevStageKey = `${funnelName}_stage_${stageIndex - 1}_time`;
  const prevStageTime = sessionStorage.getItem(prevStageKey);
  
  // Store current stage timing
  const currentTime = Date.now();
  sessionStorage.setItem(`${funnelName}_stage_${stageIndex}_time`, currentTime.toString());
  
  // Calculate conversion time if previous stage exists
  const conversionTime = prevStageTime ? currentTime - parseInt(prevStageTime, 10) : undefined;

  return trackRewardEvent(
    RewardEventType.REWARDS_PAGE_VIEW, // We use page view as a generic event type for funnel tracking
    {
      userId,
      funnelName,
      stageName,
      stageIndex,
      totalStages,
      conversionTime,
      ...additionalMetadata
    } as FunnelEventMetadata
  );
}

/**
 * Tracks when a user drops off from a funnel
 * @param funnelName Name of the funnel
 * @param stageName Stage where the user dropped off
 * @param stageIndex Index of the stage where the user dropped off
 * @param totalStages Total number of stages in the funnel
 * @param userId User ID
 * @param reason Optional reason for the dropoff
 */
export async function trackFunnelDropoff(
  funnelName: string,
  stageName: string,
  stageIndex: number,
  totalStages: number,
  userId: string,
  reason?: string
): Promise<string | null> {
  return trackRewardEvent(
    RewardEventType.REWARDS_PAGE_VIEW, // We use page view as a generic event type for funnel tracking
    {
      userId,
      funnelName,
      stageName,
      stageIndex,
      totalStages,
      dropoff: true,
      reason,
    } as FunnelEventMetadata
  );
}

/**
 * Helper function to track points earned
 */
export async function trackPointsEarned(
  userId: string,
  points: number,
  reason: string,
  balance: number,
  category?: string,
  establishmentId?: string
): Promise<string | null> {
  return trackRewardEvent(
    RewardEventType.POINTS_EARNED,
    {
      userId,
      points,
      reason,
      balance,
      category,
      establishmentId
    } as PointsEventMetadata
  );
}

/**
 * Helper function to track points redeemed
 */
export async function trackPointsRedeemed(
  userId: string,
  points: number,
  reason: string,
  rewardId: string,
  rewardName: string,
  balance: number,
  establishmentId?: string
): Promise<string | null> {
  return trackRewardEvent(
    RewardEventType.POINTS_REDEEMED,
    {
      userId,
      points,
      reason,
      balance,
      rewardId,
      rewardName,
      establishmentId
    } as PointsEventMetadata & RewardEventMetadata
  );
}

/**
 * Helper function to track tier changes
 */
export async function trackTierChanged(
  userId: string,
  fromTierId: string | undefined,
  fromTierName: string | undefined,
  toTierId: string,
  toTierName: string,
  pointsToNextTier?: number,
  establishmentId?: string
): Promise<string | null> {
  return trackRewardEvent(
    RewardEventType.TIER_CHANGED,
    {
      userId,
      fromTierId,
      fromTierName,
      toTierId,
      toTierName,
      pointsToNextTier,
      establishmentId
    } as TierEventMetadata
  );
}

/**
 * Track when a user completes an achievement
 */
export async function trackAchievementCompleted(
  userId: string, 
  achievementId: string,
  achievementName: string,
  category?: string,
  pointsAwarded?: number
): Promise<string | null> {
  return trackRewardEvent(
    RewardEventType.ACHIEVEMENT_COMPLETED,
    {
      userId,
      achievementId,
      achievementName,
      category,
      pointsAwarded
    } as AchievementEventMetadata
  );
}

/**
 * Track when a user makes progress on an achievement
 */
export async function trackAchievementProgress(
  userId: string,
  achievementId: string,
  achievementName: string,
  progress: number,
  threshold: number,
  category?: string
): Promise<string | null> {
  return trackRewardEvent(
    RewardEventType.ACHIEVEMENT_PROGRESS,
    {
      userId,
      achievementId,
      achievementName,
      progress,
      threshold,
      category
    } as AchievementEventMetadata
  );
}
