
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
    const tableName = `analytics_${period}_rollup` as const;
    
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
    // Use a raw SQL query with select() to get grouped data
    // The newer Supabase client versions don't support .group() directly
    const { data, error } = await supabaseClient
      .from('analytics_events')
      .select('event_type, count')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString());
    
    if (error) {
      console.error('Error fetching event summary:', error);
      return null;
    }
    
    // If we can't use grouped queries directly, we can process the data client-side
    const groupedData = data?.reduce((acc: Record<string, number>, item: any) => {
      if (!acc[item.event_type]) acc[item.event_type] = 0;
      acc[item.event_type] += 1;
      return acc;
    }, {});
    
    // Convert to array format expected by consumers
    const result = Object.entries(groupedData || {}).map(([event_type, count]) => ({
      event_type,
      count
    }));
    
    return result;
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
    // Use a simpler query approach without group
    const { data, error } = await supabaseClient
      .from('analytics_events')
      .select('page_url, count')
      .eq('event_type', 'page_view')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())
      .order('count', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching popular pages:', error);
      return null;
    }
    
    // Process data client-side if needed
    const pageViews: Record<string, number> = {};
    data?.forEach((item: any) => {
      if (item.page_url) {
        if (!pageViews[item.page_url]) pageViews[item.page_url] = 0;
        pageViews[item.page_url] += 1;
      }
    });
    
    // Convert to sorted array
    const result = Object.entries(pageViews)
      .map(([page_url, count]) => ({ page_url, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    
    return result;
  } catch (error) {
    console.error('Failed to get popular pages data:', error);
    return null;
  }
}

/**
 * Get segment analytics data
 */
export async function getSegmentAnalytics(segmentId: string, startDate: Date, endDate: Date) {
  try {
    const { data, error } = await supabaseClient
      .from('audience_segment_analytics')
      .select('*')
      .eq('segment_id', segmentId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });
      
    if (error) {
      console.error('Error fetching segment analytics:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get segment analytics data:', error);
    return null;
  }
}

/**
 * Get segment growth data over time
 */
export async function getSegmentGrowthData(segmentId: string, timeframe: 'weekly' | 'monthly') {
  try {
    // We'll use a different approach based on the timeframe
    const groupBy = timeframe === 'weekly' ? 'week' : 'month';
    
    const { data, error } = await supabaseClient.rpc('get_segment_growth', {
      p_segment_id: segmentId,
      p_timeframe: groupBy
    });
    
    if (error) {
      console.error('Error fetching segment growth data:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get segment growth data:', error);
    return null;
  }
}

/**
 * Get segment overlap analysis
 * This shows how different segments overlap with each other
 */
export async function getSegmentOverlap(segmentIds: string[]) {
  try {
    if (segmentIds.length < 2) {
      return []; // Need at least 2 segments to compare
    }
    
    const { data, error } = await supabaseClient.rpc('analyze_segment_overlap', {
      p_segment_ids: segmentIds
    });
    
    if (error) {
      console.error('Error fetching segment overlap:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get segment overlap data:', error);
    return null;
  }
}

/**
 * Get user movement between segments over time
 */
export async function getSegmentMovementAnalytics(segmentId: string, startDate: Date, endDate: Date) {
  try {
    const { data, error } = await supabaseClient.rpc('analyze_segment_movement', {
      p_segment_id: segmentId,
      p_start_date: startDate.toISOString().split('T')[0],
      p_end_date: endDate.toISOString().split('T')[0]
    });
    
    if (error) {
      console.error('Error fetching segment movement analytics:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get segment movement analytics:', error);
    return null;
  }
}

/**
 * Schedule a report for export
 */
export async function scheduleReport(
  reportType: string,
  frequency: 'daily' | 'weekly' | 'monthly',
  recipients: string[],
  parameters: Record<string, any>
) {
  try {
    const { data, error } = await supabaseClient.rpc('schedule_analytics_report', {
      p_report_type: reportType,
      p_frequency: frequency,
      p_recipients: recipients,
      p_parameters: parameters
    });
    
    if (error) {
      console.error('Error scheduling report:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to schedule report:', error);
    return null;
  }
}

/**
 * Calculate estimated audience size for segment criteria in real-time
 */
export async function calculateAudienceSize(criteria: any[]) {
  try {
    const { data, error } = await supabaseClient.rpc('estimate_audience_size', {
      p_criteria: JSON.stringify(criteria)
    });
    
    if (error) {
      console.error('Error calculating audience size:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to calculate audience size:', error);
    return null;
  }
}

/**
 * Analyze audience segment relationships
 * Maps connections between users in different segments
 */
export async function analyzeSegmentRelationships(segmentId: string, relationshipType: 'influence' | 'interaction' | 'similarity' = 'interaction') {
  try {
    const { data, error } = await supabaseClient.rpc('analyze_segment_relationships', {
      p_segment_id: segmentId,
      p_relationship_type: relationshipType
    });
    
    if (error) {
      console.error('Error analyzing segment relationships:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to analyze segment relationships:', error);
    return null;
  }
}

/**
 * Find influential users within segments
 * Identifies users with high engagement and connection metrics
 */
export async function findInfluentialUsers(segmentId: string, limit: number = 20) {
  try {
    const { data, error } = await supabaseClient.rpc('find_segment_influencers', {
      p_segment_id: segmentId,
      p_limit: limit
    });
    
    if (error) {
      console.error('Error finding influential users:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to find influential users:', error);
    return null;
  }
}

/**
 * Analyze relationship strength between two segments
 * Measures the connection strength between user groups
 */
export async function analyzeSegmentConnectionStrength(
  sourceSegmentId: string, 
  targetSegmentId: string, 
  connectionMetric: 'interaction' | 'conversion' | 'similarity' = 'interaction'
) {
  try {
    const { data, error } = await supabaseClient.rpc('analyze_segment_connection_strength', {
      p_source_segment_id: sourceSegmentId,
      p_target_segment_id: targetSegmentId,
      p_connection_metric: connectionMetric
    });
    
    if (error) {
      console.error('Error analyzing segment connection strength:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to analyze segment connection strength:', error);
    return null;
  }
}

/**
 * Map audience relationship network
 * Creates a network graph of relationships between users across segments
 */
export async function mapAudienceNetwork(
  segmentIds: string[], 
  depth: number = 2,
  minStrength: number = 0.3
) {
  try {
    const { data, error } = await supabaseClient.rpc('map_audience_network', {
      p_segment_ids: segmentIds,
      p_depth: depth,
      p_min_strength: minStrength
    });
    
    if (error) {
      console.error('Error mapping audience network:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to map audience network:', error);
    return null;
  }
}

/**
 * Get cross-segment engagement patterns
 * Analyzes how users engage across multiple segments
 */
export async function getCrossSegmentEngagement(segmentIds: string[], timeframe: 'week' | 'month' | 'quarter' = 'month') {
  try {
    const { data, error } = await supabaseClient.rpc('get_cross_segment_engagement', {
      p_segment_ids: segmentIds,
      p_timeframe: timeframe
    });
    
    if (error) {
      console.error('Error getting cross-segment engagement:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get cross-segment engagement:', error);
    return null;
  }
}
