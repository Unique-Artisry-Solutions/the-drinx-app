
import { supabase } from '@/integrations/supabase/client';
import { CountdownTimer, UrgencyCampaign, ScarcityIndicator } from '@/types/promotional';
import {
  convertDatabaseCountdownTimer,
  convertDatabaseUrgencyCampaign,
  convertDatabaseScarcityIndicator,
  convertToDbCountdownTimerInsert,
  convertToDbUrgencyCampaignInsert,
  convertToDbScarcityIndicatorInsert,
  filterValidCountdownTimers,
  filterValidUrgencyCampaigns,
  filterValidScarcityIndicators
} from '@/types/promotional/TypeBridge';

export class UrgencyService {
  // Countdown Timers
  static async createTimer(data: Omit<CountdownTimer, 'id' | 'created_at' | 'updated_at'>): Promise<CountdownTimer> {
    const insertData = convertToDbCountdownTimerInsert(data);
    
    const { data: timer, error } = await supabase
      .from('countdown_timers')
      .insert(insertData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create countdown timer: ${error.message}`);
    
    const convertedTimer = convertDatabaseCountdownTimer(timer);
    if (!convertedTimer) {
      throw new Error('Failed to convert database timer to valid type');
    }
    
    return convertedTimer;
  }

  static async getEventTimers(eventId: string): Promise<CountdownTimer[]> {
    const { data, error } = await supabase
      .from('countdown_timers')
      .select('*')
      .eq('event_id', eventId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch countdown timers: ${error.message}`);
    
    return filterValidCountdownTimers(data || []);
  }

  static async updateTimer(id: string, updates: Partial<CountdownTimer>): Promise<CountdownTimer> {
    const { data, error } = await supabase
      .from('countdown_timers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update countdown timer: ${error.message}`);
    
    const convertedTimer = convertDatabaseCountdownTimer(data);
    if (!convertedTimer) {
      throw new Error('Failed to convert updated timer to valid type');
    }
    
    return convertedTimer;
  }

  // Urgency Campaigns
  static async createCampaign(data: Omit<UrgencyCampaign, 'id' | 'created_at' | 'updated_at'>): Promise<UrgencyCampaign> {
    const insertData = convertToDbUrgencyCampaignInsert(data);
    
    const { data: campaign, error } = await supabase
      .from('urgency_campaigns')
      .insert(insertData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create urgency campaign: ${error.message}`);
    
    const convertedCampaign = convertDatabaseUrgencyCampaign(campaign);
    if (!convertedCampaign) {
      throw new Error('Failed to convert database campaign to valid type');
    }
    
    return convertedCampaign;
  }

  static async getPromoterCampaigns(promoterId: string): Promise<UrgencyCampaign[]> {
    const { data, error } = await supabase
      .from('urgency_campaigns')
      .select('*')
      .eq('promoter_id', promoterId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch urgency campaigns: ${error.message}`);
    
    return filterValidUrgencyCampaigns(data || []);
  }

  // Scarcity Indicators
  static async createIndicator(data: Omit<ScarcityIndicator, 'id' | 'created_at' | 'updated_at'>): Promise<ScarcityIndicator> {
    const insertData = convertToDbScarcityIndicatorInsert(data);
    
    const { data: indicator, error } = await supabase
      .from('scarcity_indicators')
      .insert(insertData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create scarcity indicator: ${error.message}`);
    
    const convertedIndicator = convertDatabaseScarcityIndicator(indicator);
    if (!convertedIndicator) {
      throw new Error('Failed to convert database indicator to valid type');
    }
    
    return convertedIndicator;
  }

  static async getCampaignIndicators(campaignId: string): Promise<ScarcityIndicator[]> {
    const { data, error } = await supabase
      .from('scarcity_indicators')
      .select('*')
      .eq('urgency_campaign_id', campaignId)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (error) throw new Error(`Failed to fetch scarcity indicators: ${error.message}`);
    
    return filterValidScarcityIndicators(data || []);
  }

  static async deleteTimer(id: string): Promise<void> {
    const { error } = await supabase
      .from('countdown_timers')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete countdown timer: ${error.message}`);
  }

  static async deleteCampaign(id: string): Promise<void> {
    const { error } = await supabase
      .from('urgency_campaigns')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete urgency campaign: ${error.message}`);
  }

  static async deleteIndicator(id: string): Promise<void> {
    const { error } = await supabase
      .from('scarcity_indicators')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete scarcity indicator: ${error.message}`);
  }
}
