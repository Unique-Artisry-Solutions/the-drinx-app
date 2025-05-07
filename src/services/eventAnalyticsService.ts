
import { supabase } from '@/integrations/supabase/client';

export interface CampaignAnalytics {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
  sources: Record<string, {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  }>;
}

export const getCampaignAnalytics = async (campaignId: string): Promise<CampaignAnalytics> => {
  try {
    const { data, error } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();

    if (error) throw error;

    const metrics = data?.metrics || {};
    const impressions = metrics.impressions || 0;
    const clicks = metrics.clicks || 0;
    const conversions = metrics.conversions || 0;
    const revenue = metrics.revenue || 0;
    
    // Calculate derived metrics
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    
    return {
      impressions,
      clicks,
      conversions,
      revenue,
      ctr,
      conversionRate,
      sources: metrics.sources || {}
    };
  } catch (error) {
    console.error('Error fetching campaign analytics:', error);
    return {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      ctr: 0,
      conversionRate: 0,
      sources: {}
    };
  }
};

export const recordEventAnalyticsEvent = async (
  eventId: string,
  eventType: 'page_view' | 'ticket_view' | 'ticket_sale' | 'social_share',
  data: Record<string, any> = {}
) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get existing analytics record for today
    const { data: existingData, error: fetchError } = await supabase
      .from('event_analytics')
      .select('*')
      .eq('event_id', eventId)
      .eq('date', today)
      .maybeSingle();
      
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }
    
    if (!existingData) {
      // Create new analytics record if none exists
      const newRecord: any = {
        event_id: eventId,
        date: today,
        page_views: 0,
        ticket_views: 0,
        ticket_sales: 0,
        social_shares: 0,
        revenue: 0,
        referral_sources: {}
      };
      
      // Increment the specific metric
      if (eventType === 'page_view') newRecord.page_views = 1;
      if (eventType === 'ticket_view') newRecord.ticket_views = 1;
      if (eventType === 'ticket_sale') {
        newRecord.ticket_sales = 1;
        newRecord.revenue = data.amount || 0;
      }
      if (eventType === 'social_share') newRecord.social_shares = 1;
      
      // Add referral source if provided
      if (data.referrer) {
        newRecord.referral_sources = { [data.referrer]: 1 };
      }
      
      const { error: insertError } = await supabase
        .from('event_analytics')
        .insert(newRecord);
        
      if (insertError) throw insertError;
    } else {
      // Update existing record
      const updates: any = {};
      
      if (eventType === 'page_view') updates.page_views = existingData.page_views + 1;
      if (eventType === 'ticket_view') updates.ticket_views = existingData.ticket_views + 1;
      if (eventType === 'ticket_sale') {
        updates.ticket_sales = existingData.ticket_sales + 1;
        updates.revenue = existingData.revenue + (data.amount || 0);
      }
      if (eventType === 'social_share') updates.social_shares = existingData.social_shares + 1;
      
      // Update referral source if provided
      if (data.referrer) {
        const referralSources = existingData.referral_sources || {};
        updates.referral_sources = {
          ...referralSources,
          [data.referrer]: (referralSources[data.referrer] || 0) + 1
        };
      }
      
      const { error: updateError } = await supabase
        .from('event_analytics')
        .update(updates)
        .eq('id', existingData.id);
        
      if (updateError) throw updateError;
    }
    
    return true;
  } catch (error) {
    console.error('Error recording event analytics:', error);
    return false;
  }
};

export const getTicketSalesAnalytics = async (eventId: string) => {
  try {
    // Get ticket types
    const { data: ticketTypes, error: ticketError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);
      
    if (ticketError) throw ticketError;
    
    // Get attendee counts for each ticket type
    const { data: attendees, error: attendeeError } = await supabase
      .from('event_attendees')
      .select('ticket_type_id, status')
      .eq('event_id', eventId);
      
    if (attendeeError) throw attendeeError;
    
    // Calculate sales for each ticket type
    const ticketAnalytics = ticketTypes.map(ticket => {
      const ticketAttendees = attendees.filter(a => a.ticket_type_id === ticket.id);
      const sold = ticketAttendees.filter(a => a.status !== 'cancelled').length;
      
      return {
        ...ticket,
        sold: sold,
        available: ticket.quantity - sold
      };
    });
    
    return ticketAnalytics;
  } catch (error) {
    console.error('Error getting ticket sales analytics:', error);
    throw error;
  }
};

export const trackCampaignConversion = async (
  campaignId: string,
  conversionType: 'view' | 'click' | 'conversion',
  conversionValue: number = 0,
  segmentId?: string
) => {
  try {
    // First get current metrics
    const { data: campaign, error: getError } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();
      
    if (getError) throw getError;
    
    let metrics = campaign.metrics || {};
    
    // Update the appropriate metric
    switch (conversionType) {
      case 'view':
        metrics.impressions = (metrics.impressions || 0) + 1;
        break;
      case 'click':
        metrics.clicks = (metrics.clicks || 0) + 1;
        break;
      case 'conversion':
        metrics.conversions = (metrics.conversions || 0) + 1;
        metrics.revenue = (metrics.revenue || 0) + conversionValue;
        break;
    }
    
    // Update metrics in the database
    const { error: updateError } = await supabase
      .from('event_marketing_campaigns')
      .update({ metrics })
      .eq('id', campaignId);
      
    if (updateError) throw updateError;
    
    // If segmentId is provided, also update segment performance
    if (segmentId) {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if record exists
      const { data: existingRecord, error: checkError } = await supabase
        .from('campaign_segment_performance')
        .select('*')
        .eq('campaign_id', campaignId)
        .eq('segment_id', segmentId)
        .eq('date', today)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      let updateData: any = {};
      
      switch (conversionType) {
        case 'view':
          updateData = { impressions: 1 };
          break;
        case 'click':
          updateData = { clicks: 1 };
          break;
        case 'conversion':
          updateData = { 
            conversions: 1,
            conversion_value: conversionValue
          };
          break;
      }
      
      if (!existingRecord) {
        // Insert new record
        const baseData = {
          campaign_id: campaignId,
          segment_id: segmentId,
          date: today,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          conversion_value: 0
        };
        
        const { error: insertError } = await supabase
          .from('campaign_segment_performance')
          .insert({
            ...baseData,
            ...updateData
          });
          
        if (insertError) throw insertError;
      } else {
        // Update existing record
        const fieldName = conversionType === 'view' 
          ? 'impressions' 
          : conversionType === 'click' 
            ? 'clicks' 
            : 'conversions';
            
        if (conversionType === 'conversion') {
          updateData.conversion_value = existingRecord.conversion_value + conversionValue;
        }
        
        updateData[fieldName] = existingRecord[fieldName] + 1;
        
        const { error: updateSegmentError } = await supabase
          .from('campaign_segment_performance')
          .update(updateData)
          .eq('id', existingRecord.id);
          
        if (updateSegmentError) throw updateSegmentError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error tracking campaign conversion:', error);
    return false;
  }
};
