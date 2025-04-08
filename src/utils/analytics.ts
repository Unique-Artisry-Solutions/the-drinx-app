
import { supabaseClient } from '@/lib/supabaseClient';

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
    const { data: session } = await supabaseClient.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      console.warn('Cannot track event: No authenticated user');
      return null;
    }
    
    const { data, error } = await supabaseClient.rpc('track_analytics_event', {
      p_user_id: userId,
      p_event_type: event.eventType,
      p_event_data: event.eventData || {},
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

/**
 * Get analytics rollup data
 */
export async function getAnalyticsData(period: 'daily' | 'weekly' | 'monthly', startDate: Date, endDate: Date) {
  try {
    // Use type assertion to tell TypeScript this is a valid table name
    const tableName = `analytics_${period}_rollup` as "analytics_daily_rollup" | "analytics_weekly_rollup" | "analytics_monthly_rollup";
    
    const { data, error } = await supabaseClient
      .from(tableName)
      .select('*')
      .gte(period === 'daily' ? 'date' : 'year', period === 'daily' ? startDate.toISOString().split('T')[0] : startDate.getFullYear())
      .lte(period === 'daily' ? 'date' : 'year', period === 'daily' ? endDate.toISOString().split('T')[0] : endDate.getFullYear());
      
    if (error) {
      console.error(`Error fetching ${period} analytics:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Failed to get ${period} analytics:`, error);
    return null;
  }
}

/**
 * Get user retention data
 */
export async function getUserRetention(startDate: Date, endDate: Date) {
  try {
    const { data, error } = await supabaseClient.rpc('get_user_retention', {
      p_start_date: startDate.toISOString().split('T')[0],
      p_end_date: endDate.toISOString().split('T')[0]
    });
    
    if (error) {
      console.error('Error fetching user retention:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get user retention data:', error);
    return null;
  }
}

/**
 * Get event summary statistics
 */
export async function getEventSummary(startDate: Date, endDate: Date) {
  try {
    const { data, error } = await supabaseClient
      .rpc('get_event_summary', {
        p_start_date: startDate.toISOString().split('T')[0],
        p_end_date: endDate.toISOString().split('T')[0]
      });
    
    if (error) {
      console.error('Error fetching event summary:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get event summary data:', error);
    return null;
  }
}

/**
 * Get popular pages based on page views
 */
export async function getPopularPages(startDate: Date, endDate: Date, limit: number = 10) {
  try {
    const { data, error } = await supabaseClient
      .from('analytics_events')
      .select('page_url, count(*)')
      .eq('event_type', 'page_view')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())
      .group('page_url')
      .order('count', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching popular pages:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get popular pages data:', error);
    return null;
  }
}
