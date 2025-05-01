
import { supabase } from '@/lib/supabase';

// Define event types constants
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

// Define funnel stages
export const FUNNEL_STAGES = {
  SIGNUP: 'signup',
  FIRST_EARN: 'first_earn',
  REDEMPTION_BROWSE: 'redemption_browse',
  REDEMPTION: 'first_redemption',
  REPEAT_REDEMPTION: 'repeat_redemption',
  ADVOCACY: 'advocacy'
};

export async function trackRewardEvent(
  eventType: string,
  userId: string,
  metadata: Record<string, any> = {}
): Promise<boolean> {
  try {
    // Insert into analytics_events table
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: `reward_${eventType}`,
        user_id: userId,
        event_data: metadata
      });

    if (error) {
      console.error('Error tracking reward event:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in trackRewardEvent:', error);
    return false;
  }
}

export async function trackFunnelProgression(
  userId: string,
  funnelStage: string,
  metadata: Record<string, any> = {}
): Promise<boolean> {
  try {
    // Insert funnel progression event
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: `funnel_${funnelStage}`,
        user_id: userId,
        event_data: {
          funnel_stage: funnelStage,
          ...metadata
        }
      });

    if (error) {
      console.error('Error tracking funnel progression:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in trackFunnelProgression:', error);
    return false;
  }
}

export async function trackCohortMetric(
  userId: string,
  cohortType: string,
  cohortValue: string,
  activity: string,
  value: any
): Promise<boolean> {
  try {
    // Insert cohort metric
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: `cohort_metric`,
        user_id: userId,
        event_data: {
          cohort_type: cohortType,
          cohort_value: cohortValue,
          activity: activity,
          value: value
        }
      });

    if (error) {
      console.error('Error tracking cohort metric:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in trackCohortMetric:', error);
    return false;
  }
}
