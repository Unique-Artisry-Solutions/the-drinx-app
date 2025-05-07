
import { supabase } from '@/integrations/supabase/client';

// Define proper types to handle campaign data
interface CampaignSource {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

interface CampaignAnalytics {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  sources: Record<string, CampaignSource>;
}

/**
 * Gets analytics data for a campaign
 */
export const getCampaignAnalytics = async (campaignId: string): Promise<CampaignAnalytics> => {
  try {
    // Fetch campaign data
    const { data, error } = await supabase
      .from('event_marketing_campaigns')
      .select('id, metrics, target_audience')
      .eq('id', campaignId)
      .single();
      
    if (error) {
      console.error('Error fetching campaign analytics:', error);
      return createEmptyAnalytics();
    }
    
    if (!data || !data.metrics) {
      return createEmptyAnalytics();
    }

    // Parse metrics data with proper type checking
    const metrics = data.metrics as Record<string, any>;
    
    // Extract metrics or use defaults
    const impressions = typeof metrics.impressions === 'number' ? metrics.impressions : 0;
    const clicks = typeof metrics.clicks === 'number' ? metrics.clicks : 0;
    const conversions = typeof metrics.conversions === 'number' ? metrics.conversions : 0;
    const revenue = typeof metrics.revenue === 'number' ? metrics.revenue : 0;
    
    // Calculate derived metrics
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    
    // Parse source data with proper type checking
    const sources: Record<string, CampaignSource> = {};
    
    if (metrics.sources && typeof metrics.sources === 'object') {
      const sourceData = metrics.sources as Record<string, any>;
      
      // Process each source
      Object.keys(sourceData).forEach(source => {
        const sourceMetrics = sourceData[source];
        if (typeof sourceMetrics === 'object' && sourceMetrics !== null) {
          sources[source] = {
            impressions: typeof sourceMetrics.impressions === 'number' ? sourceMetrics.impressions : 0,
            clicks: typeof sourceMetrics.clicks === 'number' ? sourceMetrics.clicks : 0,
            conversions: typeof sourceMetrics.conversions === 'number' ? sourceMetrics.conversions : 0,
            revenue: typeof sourceMetrics.revenue === 'number' ? sourceMetrics.revenue : 0
          };
        }
      });
    }
    
    return {
      impressions,
      clicks,
      conversions,
      revenue,
      ctr,
      conversionRate,
      sources
    };
  } catch (error) {
    console.error('Error in getCampaignAnalytics:', error);
    return createEmptyAnalytics();
  }
};

/**
 * Creates an empty analytics object for when data is not available
 */
const createEmptyAnalytics = (): CampaignAnalytics => {
  return {
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    ctr: 0,
    conversionRate: 0,
    sources: {}
  };
};

/**
 * Gets the event details by ID, including analytics data
 */
export const getEventById = async (eventId: string) => {
  try {
    // Fetch event details using the service from eventService.ts
    const { data: eventService } = await import('@/services/eventService');
    return await eventService.getEventById(eventId);
  } catch (error) {
    console.error('Error fetching event details:', error);
    return null;
  }
};
