
export interface PayoutRequest {
  id: string;
  organizer_id: string;
  event_id?: string;
  swig_circuit_id?: string;
  amount: number;
  fees_deducted: number;
  tax_withheld: number;
  net_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  payout_method: Record<string, any>;
  provider_transaction_id?: string;
  failure_reason?: string;
  requested_at: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export interface FeeStructure {
  id: string;
  name: string;
  region: string;
  event_type?: string;
  platform_fee_percentage: number;
  platform_fee_fixed: number;
  payment_processing_fee_percentage: number;
  payment_processing_fee_fixed: number;
  is_active: boolean;
  effective_from: string;
  effective_until?: string;
  created_at: string;
  updated_at: string;
}

export interface TaxConfiguration {
  id: string;
  region: string;
  country_code: string;
  tax_type: string;
  tax_rate: number;
  threshold_amount?: number;
  is_active: boolean;
  requires_tax_id: boolean;
  withholding_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinancialTransaction {
  id: string;
  user_id: string;
  event_id?: string;
  swig_circuit_id?: string;
  ticket_purchase_id?: string;
  payout_request_id?: string;
  transaction_type: 'ticket_sale' | 'fee_collection' | 'tax_withholding' | 'payout' | 'refund';
  amount: number;
  currency: string;
  fee_amount: number;
  tax_amount: number;
  net_amount: number;
  status: string;
  provider: string;
  provider_transaction_id?: string;
  reconciled: boolean;
  reconciled_at?: string;
  created_at: string;
  metadata: Record<string, any>;
}

export interface FinancialReport {
  id: string;
  organizer_id: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom';
  period_start: string;
  period_end: string;
  total_revenue: number;
  total_fees: number;
  total_taxes: number;
  net_earnings: number;
  ticket_sales_count: number;
  refunds_count: number;
  payouts_completed: number;
  payouts_pending: number;
  report_data: Record<string, any>;
  generated_at: string;
  created_at: string;
}

export interface OrganizerTaxInfo {
  id: string;
  organizer_id: string;
  tax_id?: string;
  business_name?: string;
  business_type?: string;
  address: Record<string, any>;
  region: string;
  country_code: string;
  tax_exempt: boolean;
  tax_exempt_certificate_url?: string;
  verified: boolean;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FeeCalculation {
  gross_amount: number;
  platform_fee: number;
  processing_fee: number;
  total_fees: number;
  tax_amount: number;
  net_amount: number;
}
