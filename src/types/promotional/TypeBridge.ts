
import { Database } from '@/integrations/supabase/types';
import { AffiliateProgram, AffiliatePartner, AffiliateCommission, AffiliateTrackingLink } from './AffiliateTypes';
import { PricingRule } from './PricingTypes';

// Type bridge for database row types
type DatabaseAffiliateProgram = Database['public']['Tables']['affiliate_programs']['Row'];
type DatabaseAffiliatePartner = Database['public']['Tables']['affiliate_partners']['Row'];
type DatabaseAffiliateCommission = Database['public']['Tables']['affiliate_commissions']['Row'];
type DatabasePricingRule = Database['public']['Tables']['pricing_rules']['Row'];

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
    event_id: dbRule.event_id,
    swig_circuit_id: dbRule.swig_circuit_id,
    rule_type: dbRule.rule_type,
    price_adjustment_type: dbRule.price_adjustment_type,
    adjustment_value: dbRule.adjustment_value,
    min_price: dbRule.min_price,
    max_price: dbRule.max_price,
    conditions: dbRule.conditions,
    effective_from: dbRule.effective_from,
    effective_until: dbRule.effective_until,
    is_active: dbRule.is_active,
    priority: dbRule.priority,
    created_at: dbRule.created_at,
    updated_at: dbRule.updated_at,
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
