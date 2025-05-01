
import { supabase } from '@/lib/supabase';

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
