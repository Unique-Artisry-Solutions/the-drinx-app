
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
