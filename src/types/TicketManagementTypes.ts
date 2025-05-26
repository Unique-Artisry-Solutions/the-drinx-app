
export interface TicketPurchase {
  id: string;
  user_id?: string;
  event_id?: string;
  swig_circuit_id?: string;
  ticket_type_id?: string;
  ticket_type: string;
  quantity: number;
  price_per_ticket: number;
  total_amount: number;
  service_fee: number;
  service_fee_percentage: number;
  contact_name: string;
  contact_email: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  status: 'purchased' | 'used' | 'cancelled' | 'transferred' | 'refunded';
  ticket_code?: string;
  purchase_details: any;
  created_at: string;
  updated_at: string;
}

export interface TicketTransactionHistory {
  id: string;
  ticket_purchase_id: string;
  transaction_type: 'purchase' | 'use' | 'cancel' | 'transfer' | 'refund' | 'status_change';
  from_status?: string;
  to_status?: string;
  performed_by?: string;
  transaction_data?: any;
  notes?: string;
  created_at: string;
}

export interface TicketPricingTier {
  id: string;
  event_id?: string;
  swig_circuit_id?: string;
  tier_name: string;
  base_price: number;
  tier_order: number;
  valid_from: string;
  valid_until?: string;
  max_quantity?: number;
  sold_quantity: number;
  is_early_bird: boolean;
  early_bird_discount_percentage: number;
  early_bird_discount_amount: number;
  early_bird_end_date?: string;
  tier_benefits: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TicketPriceInfo {
  tier_id: string;
  tier_name: string;
  current_price: number;
  base_price: number;
  discount_amount: number;
  is_early_bird: boolean;
  remaining_quantity?: number;
}

export interface TicketTransfer {
  id: string;
  ticket_purchase_id: string;
  from_user_id?: string;
  to_user_id?: string;
  to_email: string;
  transfer_code: string;
  status: 'pending' | 'completed' | 'cancelled' | 'expired';
  expires_at?: string;
  transferred_at?: string;
  created_at: string;
}

export interface TicketRefund {
  id: string;
  ticket_purchase_id: string;
  refund_amount: number;
  refund_reason?: string;
  processing_fee: number;
  status: 'pending' | 'processed' | 'failed';
  processed_at?: string;
  processed_by?: string;
  created_at: string;
}

export interface TicketCancellationPolicy {
  id: string;
  event_id?: string;
  swig_circuit_id?: string;
  days_before_event: number;
  refund_percentage: number;
  processing_fee: number;
  is_active: boolean;
  created_at: string;
}

export interface TicketInventory {
  id: string;
  event_id?: string;
  swig_circuit_id?: string;
  ticket_type_id?: string;
  total_quantity: number;
  sold_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  last_updated: string;
}

export interface BulkTicketOperation {
  operation: 'transfer' | 'refund' | 'cancel' | 'update_status';
  ticket_ids: string[];
  parameters?: any;
}

export interface RefundCalculation {
  refund_amount: number;
  processing_fee: number;
  refund_percentage: number;
}
