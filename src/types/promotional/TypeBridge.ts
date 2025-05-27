
import { Database } from '@/integrations/supabase/types';
import { AffiliateProgram, AffiliatePartner, AffiliateCommission, AffiliateTrackingLink } from './AffiliateTypes';
import { PricingRule } from './PricingTypes';
import { ReferralProgram, ReferralTier, UserReferral, ReferralReward } from './ReferralTypes';
import { CountdownTimer, UrgencyCampaign, ScarcityIndicator } from './UrgencyTypes';

// Type bridge for database row types
type DatabaseAffiliateProgram = Database['public']['Tables']['affiliate_programs']['Row'];
type DatabaseAffiliatePartner = Database['public']['Tables']['affiliate_partners']['Row'];
type DatabaseAffiliateCommission = Database['public']['Tables']['affiliate_commissions']['Row'];
type DatabasePricingRule = Database['public']['Tables']['pricing_rules']['Row'];
type DatabaseReferralProgram = Database['public']['Tables']['referral_programs']['Row'];
type DatabaseReferralTier = Database['public']['Tables']['referral_tiers']['Row'];
type DatabaseUserReferral = Database['public']['Tables']['user_referrals']['Row'];
type DatabaseReferralReward = Database['public']['Tables']['referral_rewards']['Row'];
type DatabaseCountdownTimer = Database['public']['Tables']['countdown_timers']['Row'];
type DatabaseUrgencyCampaign = Database['public']['Tables']['urgency_campaigns']['Row'];
type DatabaseScarcityIndicator = Database['public']['Tables']['scarcity_indicators']['Row'];

// Type guards and converters
export function isValidCommissionType(value: string): value is 'percentage' | 'fixed' {
  return value === 'percentage' || value === 'fixed';
}

export function isValidPartnerStatus(value: string): value is 'pending' | 'approved' | 'suspended' | 'rejected' {
  return ['pending', 'approved', 'suspended', 'rejected'].includes(value);
}

export function isValidCommissionStatus(value: string): value is 'pending' | 'approved' | 'paid' | 'cancelled' {
  return ['pending', 'approved', 'paid', 'cancelled'].includes(value);
}

export function isValidPricingRuleType(value: string): value is 'time_based' | 'demand_based' | 'inventory_based' | 'combined' {
  return ['time_based', 'demand_based', 'inventory_based', 'combined'].includes(value);
}

export function isValidPriceAdjustmentType(value: string): value is 'percentage' | 'fixed_amount' | 'tier_based' {
  return ['percentage', 'fixed_amount', 'tier_based'].includes(value);
}

export function isValidRewardType(value: string): value is 'points' | 'percentage' | 'fixed' {
  return ['points', 'percentage', 'fixed'].includes(value);
}

export function isValidReferralStatus(value: string): value is 'pending' | 'completed' | 'expired' | 'cancelled' {
  return ['pending', 'completed', 'expired', 'cancelled'].includes(value);
}

export function isValidReferralRewardType(value: string): value is 'referrer' | 'referee' {
  return ['referrer', 'referee'].includes(value);
}

export function isValidRewardStatus(value: string): value is 'pending' | 'awarded' | 'cancelled' {
  return ['pending', 'awarded', 'cancelled'].includes(value);
}

export function isValidTimerType(value: string): value is 'event_start' | 'sale_end' | 'early_bird' | 'flash_sale' | 'custom' {
  return ['event_start', 'sale_end', 'early_bird', 'flash_sale', 'custom'].includes(value);
}

export function isValidCampaignType(value: string): value is 'limited_time' | 'limited_quantity' | 'early_bird' | 'last_chance' | 'flash_sale' {
  return ['limited_time', 'limited_quantity', 'early_bird', 'last_chance', 'flash_sale'].includes(value);
}

export function isValidIndicatorType(value: string): value is 'tickets_remaining' | 'percentage_sold' | 'high_demand' | 'almost_sold_out' {
  return ['tickets_remaining', 'percentage_sold', 'high_demand', 'almost_sold_out'].includes(value);
}

// Safe JSON parsing
function safeJsonParse(value: any): any {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return value || {};
}

function safeJsonParseArray(value: any): any[] {
  const parsed = safeJsonParse(value);
  return Array.isArray(parsed) ? parsed : [];
}

// Converters
export function convertDatabaseAffiliateProgram(dbProgram: DatabaseAffiliateProgram): AffiliateProgram | null {
  if (!isValidCommissionType(dbProgram.commission_type)) {
    console.warn(`Invalid commission_type: ${dbProgram.commission_type}`);
    return null;
  }

  return {
    id: dbProgram.id,
    promoter_id: dbProgram.promoter_id,
    name: dbProgram.name,
    description: dbProgram.description,
    commission_type: dbProgram.commission_type,
    commission_rate: dbProgram.commission_rate,
    min_payout_amount: dbProgram.min_payout_amount,
    cookie_duration_days: dbProgram.cookie_duration_days,
    is_active: dbProgram.is_active,
    terms_and_conditions: dbProgram.terms_and_conditions,
    created_at: dbProgram.created_at,
    updated_at: dbProgram.updated_at,
  };
}

export function convertDatabaseAffiliatePartner(dbPartner: DatabaseAffiliatePartner): AffiliatePartner | null {
  if (!isValidPartnerStatus(dbPartner.status)) {
    console.warn(`Invalid partner status: ${dbPartner.status}`);
    return null;
  }

  return {
    id: dbPartner.id,
    user_id: dbPartner.user_id,
    affiliate_program_id: dbPartner.affiliate_program_id,
    status: dbPartner.status,
    affiliate_code: dbPartner.affiliate_code,
    total_earnings: dbPartner.total_earnings,
    total_clicks: dbPartner.total_clicks,
    total_conversions: dbPartner.total_conversions,
    approved_at: dbPartner.approved_at,
    suspended_at: dbPartner.suspended_at,
    created_at: dbPartner.created_at,
    updated_at: dbPartner.updated_at,
  };
}

export function convertDatabaseAffiliateCommission(dbCommission: DatabaseAffiliateCommission): AffiliateCommission | null {
  if (!isValidCommissionStatus(dbCommission.status)) {
    console.warn(`Invalid commission status: ${dbCommission.status}`);
    return null;
  }

  return {
    id: dbCommission.id,
    affiliate_partner_id: dbCommission.affiliate_partner_id,
    tracking_link_id: dbCommission.tracking_link_id,
    ticket_purchase_id: dbCommission.ticket_purchase_id,
    commission_amount: dbCommission.commission_amount,
    status: dbCommission.status,
    approved_at: dbCommission.approved_at,
    paid_at: dbCommission.paid_at,
    created_at: dbCommission.created_at,
    updated_at: dbCommission.updated_at,
  };
}

export function convertDatabasePricingRule(dbRule: DatabasePricingRule): PricingRule | null {
  if (!isValidPricingRuleType(dbRule.rule_type) || !isValidPriceAdjustmentType(dbRule.price_adjustment_type)) {
    console.warn(`Invalid pricing rule types: ${dbRule.rule_type}, ${dbRule.price_adjustment_type}`);
    return null;
  }

  return {
    id: dbRule.id,
    promoter_id: dbRule.promoter_id,
    event_id: dbRule.event_id,
    swig_circuit_id: dbRule.swig_circuit_id,
    rule_name: dbRule.rule_name,
    rule_type: dbRule.rule_type,
    price_adjustment_type: dbRule.price_adjustment_type,
    adjustment_value: dbRule.price_adjustment_value,
    min_price: dbRule.min_price,
    max_price: dbRule.max_price,
    conditions: safeJsonParse(dbRule.conditions),
    effective_from: dbRule.effective_from,
    effective_until: dbRule.effective_until,
    is_active: dbRule.is_active,
    priority: dbRule.priority,
    created_at: dbRule.created_at,
    updated_at: dbRule.updated_at,
  };
}

export function convertDatabaseReferralProgram(dbProgram: DatabaseReferralProgram): ReferralProgram | null {
  if (!isValidRewardType(dbProgram.referrer_reward_type) || !isValidRewardType(dbProgram.referee_reward_type)) {
    console.warn(`Invalid reward types: ${dbProgram.referrer_reward_type}, ${dbProgram.referee_reward_type}`);
    return null;
  }

  return {
    id: dbProgram.id,
    promoter_id: dbProgram.promoter_id,
    name: dbProgram.name,
    description: dbProgram.description,
    referrer_reward_type: dbProgram.referrer_reward_type,
    referrer_reward_value: dbProgram.referrer_reward_value,
    referee_reward_type: dbProgram.referee_reward_type,
    referee_reward_value: dbProgram.referee_reward_value,
    max_uses_per_user: dbProgram.max_uses_per_user,
    expiration_date: dbProgram.expiration_date,
    is_active: dbProgram.is_active,
    tier_multipliers: safeJsonParse(dbProgram.tier_multipliers),
    created_at: dbProgram.created_at,
    updated_at: dbProgram.updated_at,
  };
}

export function convertDatabaseReferralTier(dbTier: DatabaseReferralTier): ReferralTier | null {
  return {
    id: dbTier.id,
    referral_program_id: dbTier.referral_program_id,
    tier_name: dbTier.tier_name,
    min_referrals: dbTier.min_referrals,
    bonus_multiplier: dbTier.bonus_multiplier,
    tier_order: dbTier.tier_order,
    benefits: safeJsonParseArray(dbTier.benefits),
    created_at: dbTier.created_at,
    updated_at: dbTier.updated_at,
  };
}

export function convertDatabaseUserReferral(dbReferral: DatabaseUserReferral): UserReferral | null {
  if (!isValidReferralStatus(dbReferral.status)) {
    console.warn(`Invalid referral status: ${dbReferral.status}`);
    return null;
  }

  return {
    id: dbReferral.id,
    referral_program_id: dbReferral.referral_program_id,
    referrer_id: dbReferral.referrer_id,
    referee_id: dbReferral.referee_id,
    referral_code: dbReferral.referral_code,
    status: dbReferral.status,
    conversion_event: dbReferral.conversion_event,
    conversion_data: safeJsonParse(dbReferral.conversion_data),
    completed_at: dbReferral.completed_at,
    created_at: dbReferral.created_at,
    updated_at: dbReferral.updated_at,
  };
}

export function convertDatabaseReferralReward(dbReward: DatabaseReferralReward): ReferralReward | null {
  if (!isValidReferralRewardType(dbReward.reward_type) || !isValidRewardStatus(dbReward.status)) {
    console.warn(`Invalid reward type or status: ${dbReward.reward_type}, ${dbReward.status}`);
    return null;
  }

  return {
    id: dbReward.id,
    user_referral_id: dbReward.user_referral_id,
    user_id: dbReward.user_id,
    reward_type: dbReward.reward_type,
    reward_amount: dbReward.reward_amount,
    reward_points: dbReward.reward_points,
    status: dbReward.status,
    awarded_at: dbReward.awarded_at,
    tier_bonus_applied: dbReward.tier_bonus_applied,
    created_at: dbReward.created_at,
    updated_at: dbReward.updated_at,
  };
}

export function convertDatabaseCountdownTimer(dbTimer: DatabaseCountdownTimer): CountdownTimer | null {
  if (!isValidTimerType(dbTimer.timer_type)) {
    console.warn(`Invalid timer type: ${dbTimer.timer_type}`);
    return null;
  }

  return {
    id: dbTimer.id,
    event_id: dbTimer.event_id,
    swig_circuit_id: dbTimer.swig_circuit_id,
    timer_type: dbTimer.timer_type,
    title: dbTimer.title,
    description: dbTimer.description,
    target_datetime: dbTimer.target_datetime,
    display_style: safeJsonParse(dbTimer.display_style),
    is_active: dbTimer.is_active,
    auto_hide_on_expiry: dbTimer.auto_hide_on_expiry,
    urgency_message: dbTimer.urgency_message,
    created_at: dbTimer.created_at,
    updated_at: dbTimer.updated_at,
  };
}

export function convertDatabaseUrgencyCampaign(dbCampaign: DatabaseUrgencyCampaign): UrgencyCampaign | null {
  if (!isValidCampaignType(dbCampaign.campaign_type)) {
    console.warn(`Invalid campaign type: ${dbCampaign.campaign_type}`);
    return null;
  }

  return {
    id: dbCampaign.id,
    promoter_id: dbCampaign.promoter_id,
    event_id: dbCampaign.event_id,
    swig_circuit_id: dbCampaign.swig_circuit_id,
    campaign_name: dbCampaign.campaign_name,
    campaign_type: dbCampaign.campaign_type,
    message_template: dbCampaign.message_template,
    display_conditions: safeJsonParse(dbCampaign.display_conditions),
    trigger_conditions: safeJsonParse(dbCampaign.trigger_conditions),
    is_active: dbCampaign.is_active,
    start_date: dbCampaign.start_date,
    end_date: dbCampaign.end_date,
    max_displays: dbCampaign.max_displays,
    current_displays: dbCampaign.current_displays,
    conversion_count: dbCampaign.conversion_count,
    created_at: dbCampaign.created_at,
    updated_at: dbCampaign.updated_at,
  };
}

export function convertDatabaseScarcityIndicator(dbIndicator: DatabaseScarcityIndicator): ScarcityIndicator | null {
  if (!isValidIndicatorType(dbIndicator.indicator_type)) {
    console.warn(`Invalid indicator type: ${dbIndicator.indicator_type}`);
    return null;
  }

  return {
    id: dbIndicator.id,
    urgency_campaign_id: dbIndicator.urgency_campaign_id,
    ticket_pricing_tier_id: dbIndicator.ticket_pricing_tier_id,
    indicator_type: dbIndicator.indicator_type,
    threshold_value: dbIndicator.threshold_value,
    message_template: dbIndicator.message_template,
    display_style: safeJsonParse(dbIndicator.display_style),
    is_active: dbIndicator.is_active,
    priority: dbIndicator.priority,
    created_at: dbIndicator.created_at,
    updated_at: dbIndicator.updated_at,
  };
}

// Utility functions for filtering and validation
export function filterValidPrograms(programs: DatabaseAffiliateProgram[]): AffiliateProgram[] {
  return programs
    .map(convertDatabaseAffiliateProgram)
    .filter((program): program is AffiliateProgram => program !== null);
}

export function filterValidPartners(partners: DatabaseAffiliatePartner[]): AffiliatePartner[] {
  return partners
    .map(convertDatabaseAffiliatePartner)
    .filter((partner): partner is AffiliatePartner => partner !== null);
}

export function filterValidCommissions(commissions: DatabaseAffiliateCommission[]): AffiliateCommission[] {
  return commissions
    .map(convertDatabaseAffiliateCommission)
    .filter((commission): commission is AffiliateCommission => commission !== null);
}

export function filterValidPricingRules(rules: DatabasePricingRule[]): PricingRule[] {
  return rules
    .map(convertDatabasePricingRule)
    .filter((rule): rule is PricingRule => rule !== null);
}

export function filterValidReferralPrograms(programs: DatabaseReferralProgram[]): ReferralProgram[] {
  return programs
    .map(convertDatabaseReferralProgram)
    .filter((program): program is ReferralProgram => program !== null);
}

export function filterValidReferralTiers(tiers: DatabaseReferralTier[]): ReferralTier[] {
  return tiers
    .map(convertDatabaseReferralTier)
    .filter((tier): tier is ReferralTier => tier !== null);
}

export function filterValidUserReferrals(referrals: DatabaseUserReferral[]): UserReferral[] {
  return referrals
    .map(convertDatabaseUserReferral)
    .filter((referral): referral is UserReferral => referral !== null);
}

export function filterValidReferralRewards(rewards: DatabaseReferralReward[]): ReferralReward[] {
  return rewards
    .map(convertDatabaseReferralReward)
    .filter((reward): reward is ReferralReward => reward !== null);
}

export function filterValidCountdownTimers(timers: DatabaseCountdownTimer[]): CountdownTimer[] {
  return timers
    .map(convertDatabaseCountdownTimer)
    .filter((timer): timer is CountdownTimer => timer !== null);
}

export function filterValidUrgencyCampaigns(campaigns: DatabaseUrgencyCampaign[]): UrgencyCampaign[] {
  return campaigns
    .map(convertDatabaseUrgencyCampaign)
    .filter((campaign): campaign is UrgencyCampaign => campaign !== null);
}

export function filterValidScarcityIndicators(indicators: DatabaseScarcityIndicator[]): ScarcityIndicator[] {
  return indicators
    .map(convertDatabaseScarcityIndicator)
    .filter((indicator): indicator is ScarcityIndicator => indicator !== null);
}
