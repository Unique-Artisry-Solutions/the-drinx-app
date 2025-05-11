
import { supabase } from '@/lib/supabase';

// Constants used by useRewardTracking.ts - need to be exported
export const REWARD_EVENT_TYPES = {
  POINTS_EARNED: 'points_earned',
  REWARD_VIEWED: 'reward_viewed',
  REWARD_REDEEMED: 'reward_redeemed',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  TIER_CHANGED: 'tier_changed',
  PROFILE_VIEWED: 'profile_viewed',
  REDEMPTION_HISTORY_VIEWED: 'redemption_history_viewed',
  REWARD_SHARE: 'reward_share',
  ABANDONED_REDEMPTION: 'abandoned_redemption'
};

export const FUNNEL_STAGES = {
  FIRST_EARN: 'first_earn',
  REDEMPTION_BROWSE: 'redemption_browse',
  REDEMPTION: 'redemption',
  REPEAT_REDEMPTION: 'repeat_redemption',
  ADVOCACY: 'advocacy'
};

export async function trackRewardEvent(
  eventType: string, 
  userId: string, 
  eventData: Record<string, any> = {}
): Promise<boolean> {
  try {
    // Record the event in the analytics_events table
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: eventType,
        user_id: userId,
        event_data: eventData
      });
      
    if (error) {
      console.error('Error tracking reward event:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error in trackRewardEvent:', error);
    return false;
  }
}

export async function trackFunnelProgression(
  userId: string,
  funnelStage: string,
  metadata: Record<string, any> = {}
): Promise<boolean> {
  return await trackRewardEvent(`funnel_${funnelStage}`, userId, {
    funnel_stage: funnelStage,
    ...metadata
  });
}

export async function trackCohortMetric(
  userId: string,
  cohortType: string,
  cohortValue: string,
  activity: string,
  value: any
): Promise<boolean> {
  return await trackRewardEvent('cohort_activity', userId, {
    cohort_type: cohortType,
    cohort_value: cohortValue,
    activity,
    value
  });
}
