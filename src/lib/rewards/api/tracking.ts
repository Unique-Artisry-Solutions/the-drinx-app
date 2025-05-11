
import { supabase } from '@/lib/supabase';

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

// Add functions needed by useRewardTracking.ts
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
