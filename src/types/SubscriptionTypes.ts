
export type SubscriptionTier = {
  id: string;
  name: string;
  price: number;
  tier: 'free' | 'basic' | 'premium';
  features: string[];
  is_active: boolean;
};

export type Subscription = {
  id: string;
  subscriber_id: string;
  promoter_id: string;
  tier_id?: string;
  status: string;
  subscription_start: string;
  subscription_end?: string;
};
