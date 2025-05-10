
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
