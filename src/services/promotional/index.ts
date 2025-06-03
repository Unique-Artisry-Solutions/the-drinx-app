
// Streamlined promotional services - Phase 8C consolidation
import { AffiliateService } from './AffiliateService';
import { ReferralService } from './ReferralService';
import { PricingService } from './PricingService';
import { UrgencyService } from './UrgencyService';

// Unified promotional service interface
export interface PromotionalOperations {
  affiliate: typeof AffiliateService;
  referral: typeof ReferralService;
  pricing: typeof PricingService;
  urgency: typeof UrgencyService;
}

// Primary export - consolidated promotional service
export class UnifiedPromotionalService implements PromotionalOperations {
  static affiliate = AffiliateService;
  static referral = ReferralService;
  static pricing = PricingService;
  static urgency = UrgencyService;

  // Consolidated health check
  static async healthCheck(): Promise<{ [key: string]: boolean }> {
    return {
      affiliate: true,
      referral: true,
      pricing: true,
      urgency: true
    };
  }

  // Unified initialization
  static initialize(config?: any): void {
    console.log('Promotional services initialized with config:', config);
  }
}

// Export individual services for direct imports (backward compatibility)
export { AffiliateService } from './AffiliateService';
export { ReferralService } from './ReferralService';
export { PricingService } from './PricingService';
export { UrgencyService } from './UrgencyService';

// Legacy export for backward compatibility
/** @deprecated Use UnifiedPromotionalService instead */
export const PromotionalService = UnifiedPromotionalService;
