
import { supabase } from '@/lib/supabase';

export async function trackRewardEvent(
  eventType: string, 
  userId: string, 
  eventData: Record<string, any> = {}
): Promise<boolean> {
  try {
    await supabase.rpc('track_analytics_event', {
      p_user_id: userId,
      p_event_type: `reward_${eventType}`,
      p_event_data: eventData,
      p_page_url: null,
      p_user_agent: null,
      p_ip_address: null
    });
    return true;
  } catch (error) {
    console.error('Error tracking reward event:', error);
    return false;
  }
}

