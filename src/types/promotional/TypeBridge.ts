
import type { Database } from '@/integrations/supabase/types';
import type { 
  PricingRule, 
  AffiliateProgram, 
  AffiliatePartner, 
  AffiliateCommission,
  AffiliateTrackingLink,
  ReferralProgram,
  ReferralTier,
  UserReferral,
  ReferralReward,
  CountdownTimer,
  UrgencyCampaign,
  ScarcityIndicator
} from './index';

// Database table row types
type DbPricingRule = Database['public']['Tables']['pricing_rules']['Row'];
type DbAffiliateProgram = Database['public']['Tables']['affiliate_programs']['Row'];
type DbAffiliatePartner = Database['public']['Tables']['affiliate_partners']['Row'];
type DbAffiliateCommission = Database['public']['Tables']['affiliate_commissions']['Row'];
type DbAffiliateTrackingLink = Database['public']['Tables']['affiliate_tracking_links']['Row'];
type DbReferralProgram = Database['public']['Tables']['referral_programs']['Row'];
type DbReferralTier = Database['public']['Tables']['referral_tiers']['Row'];
type DbUserReferral = Database['public']['Tables']['user_referrals']['Row'];
type DbReferralReward = Database['public']['Tables']['referral_rewards']['Row'];
type DbCountdownTimer = Database['public']['Tables']['countdown_timers']['Row'];
type DbUrgencyCampaign = Database['public']['Tables']['urgency_campaigns']['Row'];
type DbScarcityIndicator = Database['public']['Tables']['scarcity_indicators']['Row'];

// Database insert types
export type DbPricingRuleInsert = Database['public']['Tables']['pricing_rules']['Insert'];
export type DbAffiliateTrackingLinkInsert = Database['public']['Tables']['affiliate_tracking_links']['Insert'];
export type DbCountdownTimerInsert = Database['public']['Tables']['countdown_timers']['Insert'];
export type DbUrgencyCampaignInsert = Database['public']['Tables']['urgency_campaigns']['Insert'];
export type DbScarcityIndicatorInsert = Database['public']['Tables']['scarcity_indicators']['Insert'];

// Converter functions from database to app types
export function convertDatabasePricingRule(dbRule: DbPricingRule): PricingRule | null {
  if (!dbRule) return null;
  
  try {
    return {
      id: dbRule.id,
      promoter_id: dbRule.promoter_id,
      event_id: dbRule.event_id || undefined,
      swig_circuit_id: dbRule.swig_circuit_id || undefined,
      rule_name: dbRule.rule_name,
      rule_type: dbRule.rule_type as PricingRule['rule_type'],
      conditions: dbRule.conditions as Record<string, any>,
      price_adjustment_type: dbRule.price_adjustment_type as PricingRule['price_adjustment_type'],
      adjustment_value: Number(dbRule.price_adjustment_value),
      min_price: dbRule.min_price ? Number(dbRule.min_price) : undefined,
      max_price: dbRule.max_price ? Number(dbRule.max_price) : undefined,
      priority: dbRule.priority || 1,
      is_active: dbRule.is_active,
      effective_from: dbRule.effective_from,
      effective_until: dbRule.effective_until || undefined,
      created_at: dbRule.created_at,
      updated_at: dbRule.updated_at
    };
  } catch (error) {
    console.error('Error converting pricing rule:', error);
    return null;
  }
}

export function convertDatabaseAffiliateProgram(dbProgram: DbAffiliateProgram): AffiliateProgram | null {
  if (!dbProgram) return null;
  
  try {
    return {
      id: dbProgram.id,
      promoter_id: dbProgram.promoter_id,
      name: dbProgram.name,
      description: dbProgram.description || undefined,
      commission_type: dbProgram.commission_type as AffiliateProgram['commission_type'],
      commission_rate: Number(dbProgram.commission_rate),
      min_payout_amount: Number(dbProgram.min_payout_amount),
      cookie_duration_days: dbProgram.cookie_duration_days || 30,
      is_active: dbProgram.is_active,
      terms_and_conditions: dbProgram.terms_and_conditions || undefined,
      created_at: dbProgram.created_at,
      updated_at: dbProgram.updated_at
    };
  } catch (error) {
    console.error('Error converting affiliate program:', error);
    return null;
  }
}

export function convertDatabaseAffiliatePartner(dbPartner: DbAffiliatePartner): AffiliatePartner | null {
  if (!dbPartner) return null;
  
  try {
    return {
      id: dbPartner.id,
      user_id: dbPartner.user_id,
      affiliate_program_id: dbPartner.affiliate_program_id,
      status: dbPartner.status as AffiliatePartner['status'],
      affiliate_code: dbPartner.affiliate_code,
      total_earnings: Number(dbPartner.total_earnings),
      total_clicks: dbPartner.total_clicks || 0,
      total_conversions: dbPartner.total_conversions || 0,
      approved_at: dbPartner.approved_at || undefined,
      suspended_at: dbPartner.suspended_at || undefined,
      created_at: dbPartner.created_at,
      updated_at: dbPartner.updated_at
    };
  } catch (error) {
    console.error('Error converting affiliate partner:', error);
    return null;
  }
}

export function convertDatabaseAffiliateCommission(dbCommission: DbAffiliateCommission): AffiliateCommission | null {
  if (!dbCommission) return null;
  
  try {
    return {
      id: dbCommission.id,
      affiliate_partner_id: dbCommission.affiliate_partner_id,
      tracking_link_id: dbCommission.tracking_link_id,
      ticket_purchase_id: dbCommission.ticket_purchase_id || undefined,
      commission_amount: Number(dbCommission.commission_amount),
      status: dbCommission.status as AffiliateCommission['status'],
      approved_at: dbCommission.approved_at || undefined,
      paid_at: dbCommission.paid_at || undefined,
      created_at: dbCommission.created_at,
      updated_at: dbCommission.updated_at
    };
  } catch (error) {
    console.error('Error converting affiliate commission:', error);
    return null;
  }
}

export function convertDatabaseReferralProgram(dbProgram: DbReferralProgram): ReferralProgram | null {
  if (!dbProgram) return null;
  
  try {
    return {
      id: dbProgram.id,
      promoter_id: dbProgram.promoter_id,
      name: dbProgram.name,
      description: dbProgram.description || undefined,
      referrer_reward_type: dbProgram.referrer_reward_type as ReferralProgram['referrer_reward_type'],
      referrer_reward_value: Number(dbProgram.referrer_reward_value),
      referee_reward_type: dbProgram.referee_reward_type as ReferralProgram['referee_reward_type'],
      referee_reward_value: Number(dbProgram.referee_reward_value),
      max_uses_per_user: dbProgram.max_uses_per_user || undefined,
      expiration_date: dbProgram.expiration_date || undefined,
      is_active: dbProgram.is_active,
      tier_multipliers: dbProgram.tier_multipliers as Record<string, any>,
      created_at: dbProgram.created_at,
      updated_at: dbProgram.updated_at
    };
  } catch (error) {
    console.error('Error converting referral program:', error);
    return null;
  }
}

export function convertDatabaseReferralTier(dbTier: DbReferralTier): ReferralTier | null {
  if (!dbTier) return null;
  
  try {
    return {
      id: dbTier.id,
      referral_program_id: dbTier.referral_program_id,
      tier_name: dbTier.tier_name,
      min_referrals: dbTier.min_referrals,
      bonus_multiplier: Number(dbTier.bonus_multiplier),
      tier_order: dbTier.tier_order,
      benefits: dbTier.benefits as string[],
      created_at: dbTier.created_at,
      updated_at: dbTier.updated_at
    };
  } catch (error) {
    console.error('Error converting referral tier:', error);
    return null;
  }
}

export function convertDatabaseUserReferral(dbReferral: DbUserReferral): UserReferral | null {
  if (!dbReferral) return null;
  
  try {
    return {
      id: dbReferral.id,
      referral_program_id: dbReferral.referral_program_id,
      referrer_id: dbReferral.referrer_id,
      referee_id: dbReferral.referee_id || undefined,
      referral_code: dbReferral.referral_code,
      status: dbReferral.status as UserReferral['status'],
      conversion_event: dbReferral.conversion_event || undefined,
      conversion_data: dbReferral.conversion_data as Record<string, any>,
      completed_at: dbReferral.completed_at || undefined,
      created_at: dbReferral.created_at,
      updated_at: dbReferral.updated_at
    };
  } catch (error) {
    console.error('Error converting user referral:', error);
    return null;
  }
}

export function convertDatabaseReferralReward(dbReward: DbReferralReward): ReferralReward | null {
  if (!dbReward) return null;
  
  try {
    return {
      id: dbReward.id,
      user_referral_id: dbReward.user_referral_id,
      user_id: dbReward.user_id,
      reward_type: dbReward.reward_type as ReferralReward['reward_type'],
      reward_amount: Number(dbReward.reward_amount),
      reward_points: dbReward.reward_points || undefined,
      status: dbReward.status as ReferralReward['status'],
      tier_bonus_applied: Number(dbReward.tier_bonus_applied),
      awarded_at: dbReward.awarded_at || undefined,
      created_at: dbReward.created_at,
      updated_at: dbReward.updated_at
    };
  } catch (error) {
    console.error('Error converting referral reward:', error);
    return null;
  }
}

export function convertDatabaseCountdownTimer(dbTimer: DbCountdownTimer): CountdownTimer | null {
  if (!dbTimer) return null;
  
  try {
    return {
      id: dbTimer.id,
      event_id: dbTimer.event_id || undefined,
      swig_circuit_id: dbTimer.swig_circuit_id || undefined,
      timer_type: dbTimer.timer_type as CountdownTimer['timer_type'],
      title: dbTimer.title,
      description: dbTimer.description || undefined,
      target_datetime: dbTimer.target_datetime,
      display_style: dbTimer.display_style as Record<string, any>,
      is_active: dbTimer.is_active,
      auto_hide_on_expiry: dbTimer.auto_hide_on_expiry || true,
      urgency_message: dbTimer.urgency_message || undefined,
      created_at: dbTimer.created_at,
      updated_at: dbTimer.updated_at
    };
  } catch (error) {
    console.error('Error converting countdown timer:', error);
    return null;
  }
}

export function convertDatabaseUrgencyCampaign(dbCampaign: DbUrgencyCampaign): UrgencyCampaign | null {
  if (!dbCampaign) return null;
  
  try {
    return {
      id: dbCampaign.id,
      promoter_id: dbCampaign.promoter_id,
      event_id: dbCampaign.event_id || undefined,
      swig_circuit_id: dbCampaign.swig_circuit_id || undefined,
      campaign_name: dbCampaign.campaign_name,
      campaign_type: dbCampaign.campaign_type as UrgencyCampaign['campaign_type'],
      message_template: dbCampaign.message_template,
      display_conditions: dbCampaign.display_conditions as Record<string, any>,
      trigger_conditions: dbCampaign.trigger_conditions as Record<string, any>,
      is_active: dbCampaign.is_active,
      start_date: dbCampaign.start_date,
      end_date: dbCampaign.end_date || undefined,
      max_displays: dbCampaign.max_displays || undefined,
      current_displays: dbCampaign.current_displays || 0,
      conversion_count: dbCampaign.conversion_count || 0,
      created_at: dbCampaign.created_at,
      updated_at: dbCampaign.updated_at
    };
  } catch (error) {
    console.error('Error converting urgency campaign:', error);
    return null;
  }
}

export function convertDatabaseScarcityIndicator(dbIndicator: DbScarcityIndicator): ScarcityIndicator | null {
  if (!dbIndicator) return null;
  
  try {
    return {
      id: dbIndicator.id,
      urgency_campaign_id: dbIndicator.urgency_campaign_id || undefined,
      ticket_pricing_tier_id: dbIndicator.ticket_pricing_tier_id || undefined,
      indicator_type: dbIndicator.indicator_type as ScarcityIndicator['indicator_type'],
      threshold_value: dbIndicator.threshold_value ? Number(dbIndicator.threshold_value) : undefined,
      message_template: dbIndicator.message_template,
      display_style: dbIndicator.display_style as Record<string, any>,
      is_active: dbIndicator.is_active,
      priority: dbIndicator.priority || 1,
      created_at: dbIndicator.created_at,
      updated_at: dbIndicator.updated_at
    };
  } catch (error) {
    console.error('Error converting scarcity indicator:', error);
    return null;
  }
}

// Converter functions to database insert types
export function convertToDbPricingRuleInsert(rule: Omit<PricingRule, 'id' | 'created_at' | 'updated_at'>): DbPricingRuleInsert {
  return {
    promoter_id: rule.promoter_id,
    event_id: rule.event_id,
    swig_circuit_id: rule.swig_circuit_id,
    rule_name: rule.rule_name,
    rule_type: rule.rule_type,
    conditions: rule.conditions,
    price_adjustment_type: rule.price_adjustment_type,
    price_adjustment_value: rule.adjustment_value,
    min_price: rule.min_price,
    max_price: rule.max_price,
    priority: rule.priority,
    is_active: rule.is_active,
    effective_from: rule.effective_from,
    effective_until: rule.effective_until
  };
}

export function convertToDbAffiliateTrackingLinkInsert(link: Omit<AffiliateTrackingLink, 'id' | 'created_at' | 'updated_at'>): DbAffiliateTrackingLinkInsert {
  return {
    affiliate_partner_id: link.affiliate_partner_id,
    event_id: link.event_id,
    swig_circuit_id: link.swig_circuit_id,
    tracking_code: link.tracking_code,
    link_url: link.link_url,
    click_count: link.click_count,
    conversion_count: link.conversion_count,
    is_active: link.is_active,
    expires_at: link.expires_at
  };
}

export function convertToDbCountdownTimerInsert(timer: Omit<CountdownTimer, 'id' | 'created_at' | 'updated_at'>): DbCountdownTimerInsert {
  return {
    event_id: timer.event_id,
    swig_circuit_id: timer.swig_circuit_id,
    timer_type: timer.timer_type,
    title: timer.title,
    description: timer.description,
    target_datetime: timer.target_datetime,
    display_style: timer.display_style,
    is_active: timer.is_active,
    auto_hide_on_expiry: timer.auto_hide_on_expiry,
    urgency_message: timer.urgency_message
  };
}

export function convertToDbUrgencyCampaignInsert(campaign: Omit<UrgencyCampaign, 'id' | 'created_at' | 'updated_at'>): DbUrgencyCampaignInsert {
  return {
    promoter_id: campaign.promoter_id,
    event_id: campaign.event_id,
    swig_circuit_id: campaign.swig_circuit_id,
    campaign_name: campaign.campaign_name,
    campaign_type: campaign.campaign_type,
    message_template: campaign.message_template,
    display_conditions: campaign.display_conditions,
    trigger_conditions: campaign.trigger_conditions,
    is_active: campaign.is_active,
    start_date: campaign.start_date,
    end_date: campaign.end_date,
    max_displays: campaign.max_displays,
    current_displays: campaign.current_displays,
    conversion_count: campaign.conversion_count
  };
}

export function convertToDbScarcityIndicatorInsert(indicator: Omit<ScarcityIndicator, 'id' | 'created_at' | 'updated_at'>): DbScarcityIndicatorInsert {
  return {
    urgency_campaign_id: indicator.urgency_campaign_id,
    ticket_pricing_tier_id: indicator.ticket_pricing_tier_id,
    indicator_type: indicator.indicator_type,
    threshold_value: indicator.threshold_value,
    message_template: indicator.message_template,
    display_style: indicator.display_style,
    is_active: indicator.is_active,
    priority: indicator.priority
  };
}

// Filter functions to remove invalid items
export function filterValidPricingRules(items: any[]): PricingRule[] {
  return items.map(convertDatabasePricingRule).filter((item): item is PricingRule => item !== null);
}

export function filterValidPrograms(items: any[]): AffiliateProgram[] {
  return items.map(convertDatabaseAffiliateProgram).filter((item): item is AffiliateProgram => item !== null);
}

export function filterValidPartners(items: any[]): AffiliatePartner[] {
  return items.map(convertDatabaseAffiliatePartner).filter((item): item is AffiliatePartner => item !== null);
}

export function filterValidCommissions(items: any[]): AffiliateCommission[] {
  return items.map(convertDatabaseAffiliateCommission).filter((item): item is AffiliateCommission => item !== null);
}

export function filterValidReferralPrograms(items: any[]): ReferralProgram[] {
  return items.map(convertDatabaseReferralProgram).filter((item): item is ReferralProgram => item !== null);
}

export function filterValidReferralTiers(items: any[]): ReferralTier[] {
  return items.map(convertDatabaseReferralTier).filter((item): item is ReferralTier => item !== null);
}

export function filterValidUserReferrals(items: any[]): UserReferral[] {
  return items.map(convertDatabaseUserReferral).filter((item): item is UserReferral => item !== null);
}

export function filterValidReferralRewards(items: any[]): ReferralReward[] {
  return items.map(convertDatabaseReferralReward).filter((item): item is ReferralReward => item !== null);
}

export function filterValidCountdownTimers(items: any[]): CountdownTimer[] {
  return items.map(convertDatabaseCountdownTimer).filter((item): item is CountdownTimer => item !== null);
}

export function filterValidUrgencyCampaigns(items: any[]): UrgencyCampaign[] {
  return items.map(convertDatabaseUrgencyCampaign).filter((item): item is UrgencyCampaign => item !== null);
}

export function filterValidScarcityIndicators(items: any[]): ScarcityIndicator[] {
  return items.map(convertDatabaseScarcityIndicator).filter((item): item is ScarcityIndicator => item !== null);
}
