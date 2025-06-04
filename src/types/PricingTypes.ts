
export interface PricingTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export interface PricingPlan {
  monthly: PricingTier[];
  annual: PricingTier[];
}

export interface PricingFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  included_in_tiers: string[];
}
