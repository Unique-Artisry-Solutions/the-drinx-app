
import { supabase } from '@/integrations/supabase/client';
import { CountdownTimer, UrgencyCampaign, ScarcityIndicator } from '@/types/promotional';

export class UrgencyService {
  // Countdown Timers
  static async createTimer(data: Omit<CountdownTimer, 'id' | 'created_at' | 'updated_at'>): Promise<CountdownTimer> {
    const { data: timer, error } = await supabase
      .from('countdown_timers')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create countdown timer: ${error.message}`);
    return timer;
  }

  static async getEventTimers(eventId?: string, swigCircuitId?: string): Promise<CountdownTimer[]> {
    let query = supabase
      .from('countdown_timers')
      .select('*')
      .eq('is_active', true);

    if (eventId) {
      query = query.eq('event_id', eventId);
    } else if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch countdown timers: ${error.message}`);
    return data || [];
  }

  static async updateTimer(id: string, updates: Partial<CountdownTimer>): Promise<CountdownTimer> {
    const { data, error } = await supabase
      .from('countdown_timers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update countdown timer: ${error.message}`);
    return data;
  }

  static async getActiveTimers(): Promise<CountdownTimer[]> {
    const { data, error } = await supabase
      .from('countdown_timers')
      .select('*')
      .eq('is_active', true)
      .gt('target_datetime', new Date().toISOString());

    if (error) throw new Error(`Failed to fetch active timers: ${error.message}`);
    return data || [];
  }

  // Urgency Campaigns
  static async createCampaign(data: Omit<UrgencyCampaign, 'id' | 'created_at' | 'updated_at'>): Promise<UrgencyCampaign> {
    const { data: campaign, error } = await supabase
      .from('urgency_campaigns')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create urgency campaign: ${error.message}`);
    return campaign;
  }

  static async getPromoterCampaigns(promoterId: string): Promise<UrgencyCampaign[]> {
    const { data, error } = await supabase
      .from('urgency_campaigns')
      .select('*')
      .eq('promoter_id', promoterId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch urgency campaigns: ${error.message}`);
    return data || [];
  }

  static async getActiveCampaigns(eventId?: string, swigCircuitId?: string): Promise<UrgencyCampaign[]> {
    let query = supabase
      .from('urgency_campaigns')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', new Date().toISOString());

    if (eventId) {
      query = query.eq('event_id', eventId);
    } else if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }

    // Add end_date filter
    query = query.or('end_date.is.null,end_date.gt.' + new Date().toISOString());

    const { data, error } = await query;

    if (error) throw new Error(`Failed to fetch active campaigns: ${error.message}`);
    return data || [];
  }

  static async recordCampaignDisplay(campaignId: string): Promise<void> {
    const { error } = await supabase
      .from('urgency_campaigns')
      .update({
        current_displays: supabase.raw('current_displays + 1')
      })
      .eq('id', campaignId);

    if (error) throw new Error(`Failed to record campaign display: ${error.message}`);
  }

  static async recordCampaignConversion(campaignId: string): Promise<void> {
    const { error } = await supabase
      .from('urgency_campaigns')
      .update({
        conversion_count: supabase.raw('conversion_count + 1')
      })
      .eq('id', campaignId);

    if (error) throw new Error(`Failed to record campaign conversion: ${error.message}`);
  }

  // Scarcity Indicators
  static async createIndicator(data: Omit<ScarcityIndicator, 'id' | 'created_at' | 'updated_at'>): Promise<ScarcityIndicator> {
    const { data: indicator, error } = await supabase
      .from('scarcity_indicators')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create scarcity indicator: ${error.message}`);
    return indicator;
  }

  static async getActiveIndicators(campaignId?: string): Promise<ScarcityIndicator[]> {
    let query = supabase
      .from('scarcity_indicators')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (campaignId) {
      query = query.eq('urgency_campaign_id', campaignId);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Failed to fetch scarcity indicators: ${error.message}`);
    return data || [];
  }

  static async evaluateScarcityTriggers(ticketTierId: string): Promise<ScarcityIndicator[]> {
    // Get current ticket inventory
    const { data: inventory } = await supabase
      .from('ticket_inventory')
      .select('total_quantity, sold_quantity')
      .eq('ticket_type_id', ticketTierId)
      .single();

    if (!inventory) return [];

    const remainingTickets = inventory.total_quantity - inventory.sold_quantity;
    const percentageSold = (inventory.sold_quantity / inventory.total_quantity) * 100;

    // Get relevant scarcity indicators
    const { data: indicators } = await supabase
      .from('scarcity_indicators')
      .select('*')
      .eq('ticket_pricing_tier_id', ticketTierId)
      .eq('is_active', true);

    if (!indicators) return [];

    // Filter indicators that should be triggered
    return indicators.filter(indicator => {
      switch (indicator.indicator_type) {
        case 'tickets_remaining':
          return remainingTickets <= (indicator.threshold_value || 0);
        case 'percentage_sold':
          return percentageSold >= (indicator.threshold_value || 0);
        case 'almost_sold_out':
          return percentageSold >= 90;
        case 'high_demand':
          return percentageSold >= 50 && remainingTickets <= 20;
        default:
          return false;
      }
    });
  }

  // Utility functions
  static formatTimeRemaining(targetDateTime: string): string {
    const now = new Date();
    const target = new Date(targetDateTime);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  static shouldShowUrgencyMessage(campaign: UrgencyCampaign): boolean {
    const now = new Date();
    const startDate = new Date(campaign.start_date);
    const endDate = campaign.end_date ? new Date(campaign.end_date) : null;

    // Check date range
    if (now < startDate) return false;
    if (endDate && now > endDate) return false;

    // Check display limits
    if (campaign.max_displays && campaign.current_displays >= campaign.max_displays) return false;

    // Check trigger conditions
    const conditions = campaign.trigger_conditions;
    if (conditions.min_time_remaining) {
      const timeRemaining = endDate ? endDate.getTime() - now.getTime() : Infinity;
      if (timeRemaining > conditions.min_time_remaining * 60 * 1000) return false;
    }

    return true;
  }
}
