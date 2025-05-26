import { supabase } from '@/integrations/supabase/client';
import { EventMarketingCampaign } from '@/types/EventTypes';
import * as campaignService from './campaignService';
import * as analyticsService from './analyticsService';

// Define types for campaign interactions
export type InteractionType = 'impression' | 'click' | 'conversion';

// Helper function to handle Supabase errors
const handleSupabaseError = (error: any, message: string) => {
  console.error(message, error);
  throw new Error(`${message}: ${error.message}`);
};

export async function createMarketingCampaign(
  campaignData: campaignService.CampaignCreateData
): Promise<EventMarketingCampaign> {
  try {
    const campaign = await campaignService.createCampaign(campaignData);
    
    // Track campaign creation event
    await analyticsService.trackEvent({
      event_type: 'campaign_created',
      event_data: {
        campaign_id: campaign.id,
        event_id: campaign.event_id,
        campaign_type: campaign.campaign_type
      }
    });
    
    return campaign;
  } catch (error) {
    console.error('Error creating marketing campaign:', error);
    throw error;
  }
}

export async function fetchEventCampaigns(eventId: string): Promise<EventMarketingCampaign[]> {
  try {
    return await campaignService.getCampaignsByEvent(eventId);
  } catch (error) {
    console.error('Error fetching event campaigns:', error);
    return [];
  }
}

export async function updateCampaign(
  campaignId: string,
  updates: campaignService.CampaignUpdateData
): Promise<EventMarketingCampaign> {
  try {
    const campaign = await campaignService.updateCampaign(campaignId, updates);
    
    // Track campaign update event
    await analyticsService.trackEvent({
      event_type: 'campaign_updated',
      event_data: {
        campaign_id: campaignId,
        updates: Object.keys(updates)
      }
    });
    
    return campaign;
  } catch (error) {
    console.error('Error updating campaign:', error);
    throw error;
  }
}

export async function deleteCampaign(campaignId: string): Promise<void> {
  try {
    await campaignService.deleteCampaign(campaignId);
    
    // Track campaign deletion event
    await analyticsService.trackEvent({
      event_type: 'campaign_deleted',
      event_data: { campaign_id: campaignId }
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    throw error;
  }
}

export async function createSegmentBasedNotification(
  campaignId: string,
  segmentId: string,
  notification: { title: string; content: string; priority?: string }
): Promise<{ success: boolean; message: string }> {
  try {
    // Update campaign metrics to track notification sent
    await campaignService.updateCampaignMetrics(campaignId, {
      emails_sent: 1 // Increment by 1
    });

    // Track notification event
    await analyticsService.trackEvent({
      event_type: 'notification_sent',
      event_data: {
        campaign_id: campaignId,
        segment_id: segmentId,
        notification_type: 'segment_based'
      }
    });

    return {
      success: true,
      message: `Notification sent to segment ${segmentId}`
    };
  } catch (error) {
    console.error('Error creating segment notification:', error);
    return {
      success: false,
      message: 'Failed to send notification'
    };
  }
}

export async function getCampaignMetrics(campaignId: string): Promise<campaignService.CampaignMetrics> {
  try {
    return await campaignService.getCampaignMetrics(campaignId);
  } catch (error) {
    console.error('Error fetching campaign metrics:', error);
    return {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      emails_sent: 0,
      open_rate: 0,
      click_through_rate: 0,
      conversion_rate: 0,
      revenue: 0
    };
  }
}

export async function updateCampaignMetrics(
  campaignId: string,
  metrics: Partial<campaignService.CampaignMetrics>
): Promise<void> {
  try {
    await campaignService.updateCampaignMetrics(campaignId, metrics);
  } catch (error) {
    console.error('Error updating campaign metrics:', error);
    throw error;
  }
}

export async function getEventMarketingAnalytics(eventId: string): Promise<{
  campaigns: EventMarketingCampaign[];
  aggregatedMetrics: campaignService.CampaignMetrics;
  realtimeData: analyticsService.RealtimeAnalyticsData;
}> {
  try {
    const [campaigns, aggregatedMetrics, realtimeData] = await Promise.all([
      campaignService.getCampaignsByEvent(eventId),
      campaignService.aggregateCampaignMetrics(eventId),
      analyticsService.getRealtimeAnalytics()
    ]);

    return {
      campaigns,
      aggregatedMetrics,
      realtimeData
    };
  } catch (error) {
    console.error('Error fetching marketing analytics:', error);
    return {
      campaigns: [],
      aggregatedMetrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        emails_sent: 0,
        open_rate: 0,
        click_through_rate: 0,
        conversion_rate: 0,
        revenue: 0
      },
      realtimeData: {
        live_users: 0,
        events_last_hour: 0,
        conversions_last_hour: 0,
        top_pages: [],
        recent_events: []
      }
    };
  }
}
