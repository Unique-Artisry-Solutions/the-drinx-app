
// Export all promotional types
export type { PricingRule, DemandMetrics, PriceHistory, PricingAutomation, PricingAnalytics } from './PricingTypes';
export type { AffiliateProgram, AffiliatePartner, AffiliateCommission, AffiliateTrackingLink, AffiliatePayout } from './AffiliateTypes';
export type { ReferralProgram, ReferralTier, UserReferral, ReferralReward } from './ReferralTypes';
export type { CountdownTimer, UrgencyCampaign, ScarcityIndicator, UrgencyAnalytics } from './UrgencyTypes';

// Export pricing engine types
export type { PricingContext, DynamicPriceResult } from '@/services/pricing/DynamicPricingEngine';
export type { DemandAnalysisResult, RealTimeMetrics } from '@/services/demandAnalyticsService';
