export interface PromoCodeGeneratorProps {
  onCodesGenerated: (codes: string[]) => void;
  onCancel: () => void;
}

export interface PromoCodeGeneratorFormData {
  prefix: string;
  count: number;
  length: number;
  includeLetters: boolean;
  includeNumbers: boolean;
  discountType: 'percentage' | 'fixed' | 'free_item';
  discountValue: number;
  expiryDate: Date | null;
}

export interface PromoCodeTemplate {
  prefix: string;
  discountType: 'percentage' | 'fixed' | 'free_item';
  discountValue: number;
  expiryDate: Date | null;
}

export interface AppSubscription {
  id: string;
  user_id: string;
  promoter_id: string;
  status: 'active' | 'canceled' | 'pending';
  created_at: string;
  promoter_name?: string;
  tier_name?: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  is_default: boolean;
}

export interface FollowerData {
  id: string;
  subscriber_id: string;
  promoter_id: string;
  subscription_start: string;
  subscription_end: string | null;
  status: string;
  notification_preferences: {
    events: boolean;
    promotions: boolean;
    announcements: boolean;
  };
}
