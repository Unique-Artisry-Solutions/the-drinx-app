
import { supabase } from '@/integrations/supabase/client';
import { isPreviewEnvironment } from '@/utils/environment';

// Comprehensive list of trackable reward events
export const REWARD_EVENT_TYPES = {
  POINTS_EARNED: 'points_earned',
  POINTS_REDEEMED: 'points_redeemed',
  REWARD_VIEWED: 'reward_viewed',
  REWARD_SELECTED: 'reward_selected',
  REWARD_REDEEMED: 'reward_redeemed',
  TIER_CHANGED: 'tier_changed',
  ENROLLMENT: 'program_enrollment',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  PROFILE_VIEWED: 'reward_profile_viewed',
  REDEMPTION_HISTORY_VIEWED: 'redemption_history_viewed',
  REWARD_SHARE: 'reward_share',
  ABANDONED_REDEMPTION: 'abandoned_redemption',
  PREFERENCES_UPDATED: 'reward_preferences_updated'
};

// Engagement funnel stages
export const FUNNEL_STAGES = {
  DISCOVERY: 'discovery',
  ENROLLMENT: 'enrollment',
  FIRST_EARN: 'first_earn',
  REPEAT_EARN: 'repeat_earn',
  REDEMPTION_BROWSE: 'redemption_browse',
  REDEMPTION: 'redemption',
  REPEAT_REDEMPTION: 'repeat_redemption',
  ADVOCACY: 'advocacy'
};

// In-memory storage for preview environment
const previewStorage = {
  sessionId: `preview_session_${Date.now()}`,
  cohorts: new Map<string, string>(),
  funnel: new Map<string, string>()
};

// Safe session storage wrapper that uses in-memory storage in preview environment
const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (isPreviewEnvironment()) {
      if (key === 'reward_session_id') {
        return previewStorage.sessionId;
      }
      return null;
    }
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      console.error('sessionStorage.getItem error:', e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (isPreviewEnvironment()) {
      if (key === 'reward_session_id') {
        previewStorage.sessionId = value;
      }
      return;
    }
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.error('sessionStorage.setItem error:', e);
    }
  }
};

// Safe localStorage wrapper that uses in-memory storage in preview environment
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (isPreviewEnvironment()) {
      if (key.includes('_enrollment_cohort')) {
        const userId = key.split('_')[1];
        return previewStorage.cohorts.get(userId) || null;
      }
      if (key.includes('_funnel_stage')) {
        const userId = key.split('_')[1];
        return previewStorage.funnel.get(userId) || null;
      }
      return null;
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
      if (key.includes('_enrollment_cohort')) {
        const userId = key.split('_')[1];
        previewStorage.cohorts.set(userId, value);
      }
      if (key.includes('_funnel_stage')) {
        const userId = key.split('_')[1];
        previewStorage.funnel.set(userId, value);
      }
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('localStorage.setItem error:', e);
    }
  }
};

/**
 * Track a reward program event with standardized metadata structure
 * @param eventType The type of event to track
 * @param userId The user ID
 * @param eventData Additional event-specific data
 * @returns Promise<boolean> Success status
 */
export async function trackRewardEvent(
  eventType: string, 
  userId: string, 
  eventData: Record<string, any> = {}
): Promise<boolean> {
  // Skip tracking in preview environment
  if (isPreviewEnvironment()) {
    console.log(`[Preview] Would track reward event: ${eventType}`, eventData);
    return true;
  }
  
  try {
    // Add standard metadata fields
    const enrichedEventData = {
      ...eventData,
      timestamp: new Date().toISOString(),
      client_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      session_id: getSessionId(),
      // Add cohort info if available
      enrollment_cohort: getUserEnrollmentCohort(userId),
      // Add current funnel stage if relevant
      current_funnel_stage: determineFunnelStage(userId, eventType, eventData)
    };
    
    await supabase.rpc('track_analytics_event', {
      p_user_id: userId,
      p_event_type: `reward_${eventType}`,
      p_event_data: enrichedEventData,
      p_page_url: window.location.pathname,
      p_user_agent: navigator.userAgent,
      p_ip_address: null // IP is collected server-side
    });
    
    console.log(`Tracked reward event: ${eventType}`, eventData);
    return true;
  } catch (error) {
    console.error('Error tracking reward event:', error);
    return false;
  }
}

/**
 * Track a user's progression through the rewards engagement funnel
 * @param userId The user ID
 * @param currentStage The funnel stage the user is at
 * @param metadata Additional context about the funnel progression
 * @returns Promise<boolean> Success status
 */
export async function trackFunnelProgression(
  userId: string,
  currentStage: string,
  metadata: Record<string, any> = {}
): Promise<boolean> {
  return await trackRewardEvent('funnel_progression', userId, {
    funnel_stage: currentStage,
    previous_stage: metadata.previousStage || null,
    time_in_previous_stage: metadata.timeInPreviousStage || null,
    conversion_path: metadata.conversionPath || null,
    ...metadata
  });
}

/**
 * Track cohort-specific metrics for a user
 * @param userId The user ID
 * @param cohortType The type of cohort (enrollment_date, tier, behavioral, etc.)
 * @param cohortValue The value identifying the cohort
 * @param metricName The metric being tracked
 * @param metricValue The value of the metric
 * @returns Promise<boolean> Success status
 */
export async function trackCohortMetric(
  userId: string,
  cohortType: string,
  cohortValue: string,
  metricName: string,
  metricValue: any
): Promise<boolean> {
  return await trackRewardEvent('cohort_metric', userId, {
    cohort_type: cohortType,
    cohort_value: cohortValue,
    metric_name: metricName,
    metric_value: metricValue,
    day_since_enrollment: getDaysSinceEnrollment(userId)
  });
}

// Helper functions

/**
 * Generate or retrieve a consistent session ID
 */
function getSessionId(): string {
  let sessionId = safeSessionStorage.getItem('reward_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    safeSessionStorage.setItem('reward_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Determine the user's enrollment cohort
 */
function getUserEnrollmentCohort(userId: string): string | null {
  // In a real implementation, this would fetch from a cache or localStorage
  // For now, we'll return a placeholder
  return safeLocalStorage.getItem(`user_${userId}_enrollment_cohort`) || null;
}

/**
 * Get number of days since user enrolled in rewards program
 */
function getDaysSinceEnrollment(userId: string): number | null {
  const enrollmentDateStr = safeLocalStorage.getItem(`user_${userId}_enrollment_date`);
  if (!enrollmentDateStr) return null;
  
  const enrollmentDate = new Date(enrollmentDateStr);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - enrollmentDate.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determine the user's current funnel stage based on their behavior
 */
function determineFunnelStage(
  userId: string, 
  eventType: string, 
  eventData: Record<string, any>
): string | null {
  // This is a simplified version - in production, this would be more sophisticated
  // with proper stage tracking in the database
  
  // Map certain events directly to funnel stages
  const eventToStageMap: Record<string, string> = {
    'program_enrollment': FUNNEL_STAGES.ENROLLMENT,
    'points_earned': FUNNEL_STAGES.REPEAT_EARN,
    'reward_viewed': FUNNEL_STAGES.REDEMPTION_BROWSE,
    'reward_redeemed': FUNNEL_STAGES.REDEMPTION,
    'reward_share': FUNNEL_STAGES.ADVOCACY
  };
  
  // If this is a first-time event, map it to the first earn stage
  if (eventType === 'points_earned' && eventData.is_first_time) {
    return FUNNEL_STAGES.FIRST_EARN;
  }
  
  // If this is a repeat redemption, mark it accordingly
  if (eventType === 'reward_redeemed' && eventData.previous_redemptions > 0) {
    return FUNNEL_STAGES.REPEAT_REDEMPTION;
  }
  
  // Return the mapped stage or null if no mapping exists
  return eventToStageMap[eventType] || null;
}
