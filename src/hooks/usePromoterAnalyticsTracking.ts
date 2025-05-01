
import { useCallback } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/contexts/auth';

export type PromoterEventType = 
  | 'event_created'
  | 'event_published'
  | 'event_edited'
  | 'event_cancelled'
  | 'campaign_created'
  | 'campaign_launched'
  | 'campaign_performance_viewed'
  | 'venue_contacted'
  | 'message_sent'
  | 'promotion_created'
  | 'promotion_redeemed'
  | 'marketing_material_uploaded'
  | 'dashboard_accessed'
  | 'dashboard_tab_changed'
  | 'dashboard_refreshed'
  | 'audience_metrics_viewed'
  | 'date_range_changed'
  | 'event_details_viewed'
  | 'demographic_segment_viewed'
  | 'audience_metric_viewed';

export type CampaignSource =
  | 'email'
  | 'social'
  | 'direct'
  | 'referral'
  | 'organic'
  | 'paid';

export type PromoterAnalyticsData = {
  eventId?: string;
  campaignId?: string;
  venueId?: string;
  messageId?: string;
  promotionId?: string;
  source?: CampaignSource;
  attendeeCount?: number;
  revenueAmount?: number;
  conversionRate?: number;
  engagementRate?: number;
  [key: string]: any;
};

/**
 * A custom hook for tracking promoter-related analytics events
 */
export function usePromoterAnalyticsTracking() {
  const { track, trackWithFeedback } = useAnalytics();
  const { user } = useAuth();
  
  /**
   * Track a promoter event with standard context data
   */
  const trackPromoterEvent = useCallback((
    eventType: PromoterEventType,
    data?: PromoterAnalyticsData
  ) => {
    // Add standard promoter context data
    const enrichedData = {
      ...data,
      promoterId: user?.id,
      timestamp: new Date().toISOString(),
      area: 'promoter',
    };
    
    return track(`promoter_${eventType}`, enrichedData);
  }, [track, user?.id]);
  
  /**
   * Track event-related actions
   */
  const trackEventAction = useCallback((
    action: 'created' | 'published' | 'edited' | 'cancelled' | 'viewed',
    eventId: string,
    eventData: Partial<PromoterAnalyticsData> = {}
  ) => {
    return trackPromoterEvent(`event_${action}` as PromoterEventType, {
      eventId,
      ...eventData
    });
  }, [trackPromoterEvent]);
  
  /**
   * Track campaign-related actions
   */
  const trackCampaignAction = useCallback((
    action: 'created' | 'launched' | 'paused' | 'performance_viewed',
    campaignId: string,
    campaignData: Partial<PromoterAnalyticsData> = {}
  ) => {
    return trackPromoterEvent(`campaign_${action}` as PromoterEventType, {
      campaignId,
      ...campaignData
    });
  }, [trackPromoterEvent]);
  
  /**
   * Track campaign performance metrics from various channels
   */
  const trackCampaignMetrics = useCallback((
    campaignId: string,
    source: CampaignSource,
    metrics: {
      impressions?: number;
      clicks?: number;
      conversions?: number;
      revenue?: number;
      engagementRate?: number;
      conversionRate?: number;
      [key: string]: any;
    }
  ) => {
    return trackPromoterEvent('campaign_performance_viewed', {
      campaignId,
      source,
      ...metrics,
      tracked_at: new Date().toISOString()
    });
  }, [trackPromoterEvent]);
  
  /**
   * Track venue communication events
   */
  const trackVenueCommunication = useCallback((
    action: 'contacted' | 'message_sent',
    venueId: string,
    messageData: Partial<PromoterAnalyticsData> = {}
  ) => {
    const eventType = action === 'contacted' ? 
      'venue_contacted' : 'message_sent';
      
    return trackPromoterEvent(eventType as PromoterEventType, {
      venueId,
      ...messageData
    });
  }, [trackPromoterEvent]);
  
  /**
   * Track promotion-related actions
   */
  const trackPromotionAction = useCallback((
    action: 'created' | 'edited' | 'activated' | 'deactivated' | 'redeemed',
    promotionId: string,
    promotionData: Partial<PromoterAnalyticsData> = {}
  ) => {
    const eventType = action === 'redeemed' ? 
      'promotion_redeemed' : 'promotion_' + action;
      
    return trackPromoterEvent(eventType as PromoterEventType, {
      promotionId,
      ...promotionData
    });
  }, [trackPromoterEvent]);
  
  /**
   * Track marketing material uploads
   */
  const trackMarketingMaterial = useCallback((
    materialType: 'image' | 'video' | 'document' | 'flyer',
    materialId: string,
    materialData: Partial<PromoterAnalyticsData> = {}
  ) => {
    return trackPromoterEvent('marketing_material_uploaded', {
      materialId,
      materialType,
      ...materialData
    });
  }, [trackPromoterEvent]);
  
  return {
    trackPromoterEvent,
    trackEventAction,
    trackCampaignAction,
    trackCampaignMetrics,
    trackVenueCommunication,
    trackPromotionAction,
    trackMarketingMaterial
  };
}
