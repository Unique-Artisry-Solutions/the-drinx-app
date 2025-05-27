
// Main promotional types export
export * from './AffiliateTypes';
export * from './ReferralTypes';
export * from './PricingTypes';
export * from './UrgencyTypes';

// Combined promotional dashboard data
export interface PromotionalDashboardData {
  affiliate: {
    active_programs: number;
    total_partners: number;
    pending_payouts: number;
    monthly_revenue: number;
  };
  referral: {
    active_programs: number;
    total_referrals: number;
    conversion_rate: number;
    rewards_distributed: number;
  };
  pricing: {
    active_rules: number;
    revenue_impact: number;
    avg_demand_score: number;
    price_adjustments: number;
  };
  urgency: {
    active_campaigns: number;
    total_impressions: number;
    conversion_lift: number;
    timer_effectiveness: number;
  };
}
