
// Affiliate Marketing System Types
export interface AffiliateProgram {
  id: string;
  promoter_id: string;
  name: string;
  description?: string;
  commission_type: 'percentage' | 'fixed';
  commission_rate: number;
  min_payout_amount: number;
  cookie_duration_days: number;
  is_active: boolean;
  terms_and_conditions?: string;
  created_at: string;
  updated_at: string;
}

export interface AffiliatePartner {
  id: string;
  user_id: string;
  affiliate_program_id: string;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  affiliate_code: string;
  total_earnings: number;
  total_clicks: number;
  total_conversions: number;
  approved_at?: string;
  suspended_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AffiliateTrackingLink {
  id: string;
  affiliate_partner_id: string;
  event_id?: string;
  swig_circuit_id?: string;
  tracking_code: string;
  link_url: string;
  click_count: number;
  conversion_count: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AffiliateCommission {
  id: string;
  affiliate_partner_id: string;
  tracking_link_id: string;
  ticket_purchase_id?: string;
  commission_amount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  approved_at?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AffiliatePayout {
  id: string;
  affiliate_partner_id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payout_method: Record<string, any>;
  provider_transaction_id?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AffiliateAnalytics {
  total_clicks: number;
  total_conversions: number;
  conversion_rate: number;
  total_earnings: number;
  pending_commission: number;
  top_performing_links: AffiliateTrackingLink[];
}
