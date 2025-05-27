
// Export all promotional services
export { AffiliateService } from './AffiliateService';
export { ReferralService } from './ReferralService';
export { PricingService } from './PricingService';
export { UrgencyService } from './UrgencyService';

// Import all services for the combined service
import { AffiliateService } from './AffiliateService';
import { ReferralService } from './ReferralService';
import { PricingService } from './PricingService';
import { UrgencyService } from './UrgencyService';

// Combined promotional service for dashboard integration
export class PromotionalService {
  static affiliate = AffiliateService;
  static referral = ReferralService;
  static pricing = PricingService;
  static urgency = UrgencyService;
}
