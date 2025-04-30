
import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { 
  trackRewardEvent, 
  trackFunnelProgression,
  trackCohortMetric,
  REWARD_EVENT_TYPES, 
  FUNNEL_STAGES 
} from '@/lib/rewards/api/tracking';
import { isPreviewEnvironment } from '@/utils/environment';

// In-memory storage for preview environment
const previewStorage = new Map<string, string>();

// Safe localStorage wrapper that uses in-memory storage in preview environment
const safeStorage = {
  getItem: (key: string): string | null => {
    if (isPreviewEnvironment()) {
      return previewStorage.get(key) || null;
    }
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('localStorage.getItem error:', e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (isPreviewEnvironment()) {
      previewStorage.set(key, value);
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('localStorage.setItem error:', e);
    }
  }
};

export interface RewardTrackingEvents {
  trackPointsEarned: (points: number, source: string, metadata?: Record<string, any>) => Promise<boolean>;
  trackRewardViewed: (rewardId: string, rewardName: string, metadata?: Record<string, any>) => Promise<boolean>;
  trackRewardRedeemed: (rewardId: string, pointsSpent: number, metadata?: Record<string, any>) => Promise<boolean>;
  trackAchievementUnlocked: (achievementId: string, achievementName: string, metadata?: Record<string, any>) => Promise<boolean>;
  trackTierChange: (previousTier: number, newTier: number, metadata?: Record<string, any>) => Promise<boolean>;
  trackFunnelStep: (currentStage: string, metadata?: Record<string, any>) => Promise<boolean>;
  trackCohortActivity: (cohortType: string, cohortValue: string, activity: string, value: any) => Promise<boolean>;
  trackProfileView: () => Promise<boolean>;
  trackRedemptionHistoryView: () => Promise<boolean>;
  trackRewardShare: (rewardId: string) => Promise<boolean>;
  trackAbandonedRedemption: (rewardId: string, reason?: string) => Promise<boolean>;
}

export function useRewardTracking(): RewardTrackingEvents {
  const { user } = useAuth();
  
  // Track points earned event
  const trackPointsEarned = useCallback(async (
    points: number, 
    source: string, 
    metadata: Record<string, any> = {}
  ): Promise<boolean> => {
    if (!user?.id) return false;
    if (isPreviewEnvironment()) return true;
    
    // Determine if this is the user's first time earning points
    const isFirstTime = !safeStorage.getItem(`user_${user.id}_has_earned_points`);
    if (isFirstTime) {
      safeStorage.setItem(`user_${user.id}_has_earned_points`, 'true');
    }
    
    const result = await trackRewardEvent(REWARD_EVENT_TYPES.POINTS_EARNED, user.id, {
      points,
      source,
      is_first_time: isFirstTime,
      ...metadata
    });
    
    // If this is their first earn, also track the funnel progression
    if (isFirstTime && result) {
      await trackFunnelProgression(user.id, FUNNEL_STAGES.FIRST_EARN);
    }
    
    return result;
  }, [user?.id]);
  
  // Track reward viewed event
  const trackRewardViewed = useCallback(async (
    rewardId: string, 
    rewardName: string,
    metadata: Record<string, any> = {}
  ): Promise<boolean> => {
    if (!user?.id) return false;
    if (isPreviewEnvironment()) return true;
    
    const result = await trackRewardEvent(REWARD_EVENT_TYPES.REWARD_VIEWED, user.id, {
      reward_id: rewardId,
      reward_name: rewardName,
      ...metadata
    });
    
    // Update funnel progression
    if (result) {
      await trackFunnelProgression(user.id, FUNNEL_STAGES.REDEMPTION_BROWSE);
    }
    
    return result;
  }, [user?.id]);
  
  // Track reward redemption event
  const trackRewardRedeemed = useCallback(async (
    rewardId: string, 
    pointsSpent: number,
    metadata: Record<string, any> = {}
  ): Promise<boolean> => {
    if (!user?.id) return false;
    if (isPreviewEnvironment()) return true;
    
    // Check if this is a repeat redemption
    const redemptionCountKey = `user_${user.id}_redemption_count`;
    const previousRedemptions = parseInt(safeStorage.getItem(redemptionCountKey) || '0', 10);
    
    // Track the event
    const result = await trackRewardEvent(REWARD_EVENT_TYPES.REWARD_REDEEMED, user.id, {
      reward_id: rewardId,
      points_spent: pointsSpent,
      previous_redemptions: previousRedemptions,
      ...metadata
    });
    
    // Update redemption count in storage
    if (result) {
      safeStorage.setItem(redemptionCountKey, (previousRedemptions + 1).toString());
      
      // Update funnel progression
      const funnelStage = previousRedemptions > 0 ? 
        FUNNEL_STAGES.REPEAT_REDEMPTION : 
        FUNNEL_STAGES.REDEMPTION;
      
      await trackFunnelProgression(user.id, funnelStage);
    }
    
    return result;
  }, [user?.id]);
  
  // Track achievement unlocked event
  const trackAchievementUnlocked = useCallback(async (
    achievementId: string,
    achievementName: string,
    metadata: Record<string, any> = {}
  ): Promise<boolean> => {
    if (!user?.id) return false;
    if (isPreviewEnvironment()) return true;
    
    return await trackRewardEvent(REWARD_EVENT_TYPES.ACHIEVEMENT_UNLOCKED, user.id, {
      achievement_id: achievementId,
      achievement_name: achievementName,
      ...metadata
    });
  }, [user?.id]);
  
  // Track tier change event
  const trackTierChange = useCallback(async (
    previousTier: number,
    newTier: number,
    metadata: Record<string, any> = {}
  ): Promise<boolean> => {
    if (!user?.id) return false;
    if (isPreviewEnvironment()) return true;
    
    return await trackRewardEvent(REWARD_EVENT_TYPES.TIER_CHANGED, user.id, {
      previous_tier: previousTier,
      new_tier: newTier,
      is_upgrade: newTier > previousTier,
      ...metadata
    });
  }, [user?.id]);
  
  // Track funnel progression steps
  const trackFunnelStep = useCallback(async (
    currentStage: string,
    metadata: Record<string, any> = {}
  ): Promise<boolean> => {
    if (!user?.id) return false;
    if (isPreviewEnvironment()) return true;
    
    const previousStageKey = `user_${user.id}_funnel_stage`;
    const previousStage = safeStorage.getItem(previousStageKey);
    
    const result = await trackFunnelProgression(user.id, currentStage, {
      previousStage,
      ...metadata
    });
    
    // Update stored funnel stage
    if (result) {
      safeStorage.setItem(previousStageKey, currentStage);
    }
    
    return result;
  }, [user?.id]);
  
  // Track cohort-specific activity
  const trackCohortActivity = useCallback(async (
    cohortType: string,
    cohortValue: string,
    activity: string,
    value: any
  ): Promise<boolean> => {
    if (!user?.id) return false;
    if (isPreviewEnvironment()) return true;
    
    return await trackCohortMetric(user.id, cohortType, cohortValue, activity, value);
  }, [user?.id]);
  
  // Track reward profile view
  const trackProfileView = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;
    if (isPreviewEnvironment()) return true;
    
    return await trackRewardEvent(REWARD_EVENT_TYPES.PROFILE_VIEWED, user.id);
  }, [user?.id]);
  
  // Track redemption history view
  const trackRedemptionHistoryView = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;
    if (isPreviewEnvironment()) return true;
    
    return await trackRewardEvent(REWARD_EVENT_TYPES.REDEMPTION_HISTORY_VIEWED, user.id);
  }, [user?.id]);
  
  // Track reward share
  const trackRewardShare = useCallback(async (rewardId: string): Promise<boolean> => {
    if (!user?.id) return false;
    if (isPreviewEnvironment()) return true;
    
    const result = await trackRewardEvent(REWARD_EVENT_TYPES.REWARD_SHARE, user.id, {
      reward_id: rewardId
    });
    
    // Update funnel progression to advocacy
    if (result) {
      await trackFunnelProgression(user.id, FUNNEL_STAGES.ADVOCACY);
    }
    
    return result;
  }, [user?.id]);
  
  // Track abandoned redemption
  const trackAbandonedRedemption = useCallback(async (
    rewardId: string, 
    reason?: string
  ): Promise<boolean> => {
    if (!user?.id) return false;
    if (isPreviewEnvironment()) return true;
    
    return await trackRewardEvent(REWARD_EVENT_TYPES.ABANDONED_REDEMPTION, user.id, {
      reward_id: rewardId,
      reason
    });
  }, [user?.id]);
  
  return {
    trackPointsEarned,
    trackRewardViewed,
    trackRewardRedeemed,
    trackAchievementUnlocked,
    trackTierChange,
    trackFunnelStep,
    trackCohortActivity,
    trackProfileView,
    trackRedemptionHistoryView,
    trackRewardShare,
    trackAbandonedRedemption
  };
}
