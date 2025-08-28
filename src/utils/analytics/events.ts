import { supabase } from '@/integrations/supabase/client';
import { sanitizeAnalyticsData } from '@/utils/databaseSerialization';
import { redactSensitive } from '@/lib/logging/redact';

export type AnalyticsEvent = {
  eventType: string;
  eventData?: Record<string, any>;
  pageUrl?: string;
};

/**
 * Track a user interaction event
 */
export async function trackEvent(event: AnalyticsEvent): Promise<string | null> {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      console.warn('Cannot track event: No authenticated user');
      return null;
    }
    
    const cleaned = sanitizeAnalyticsData(redactSensitive(event.eventData || {}));
    const { data, error } = await supabase.rpc('track_analytics_event', {
      p_user_id: userId,
      p_event_type: event.eventType,
      p_event_data: cleaned,
      p_page_url: event.pageUrl || window.location.pathname,
      p_user_agent: navigator.userAgent,
      p_ip_address: null // IP is collected server-side
    });
    
    if (error) {
      console.error('Error tracking analytics event:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to track event:', error);
    return null;
  }
}