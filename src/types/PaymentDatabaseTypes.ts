
import { Json } from '@/integrations/supabase/types';

// Database row interfaces based on the new payment tables
export interface DbPaymentTransaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  provider: string;
  provider_transaction_id?: string;
  payment_method_id?: string;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface DbPaymentRetry {
  id: string;
  transaction_id: string;
  attempt_number: number;
  failure_reason: string;
  retry_scheduled_for: string;
  max_retries: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'max_retries_exceeded';
  completed_at?: string;
  metadata: Json;
  created_at: string;
}

export interface DbPaymentFailureLog {
  id: string;
  user_id?: string;
  payment_method_id?: string;
  amount?: number;
  currency?: string;
  error_message?: string;
  metadata: Json;
  created_at: string;
}

export interface DbPaymentReceipt {
  id: string;
  transaction_id: string;
  receipt_number: string;
  receipt_url?: string;
  receipt_data: Json;
  created_at: string;
}

export interface DbPaymentRefund {
  id: string;
  transaction_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  reason?: string;
  provider_refund_id?: string;
  refunded_by?: string;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface DbSubscriptionPayment {
  id: string;
  subscription_id: string;
  stripe_subscription_id?: string;
  user_id: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'incomplete';
  current_period_start?: string;
  current_period_end?: string;
  cancelled_at?: string;
  cancel_at_period_end?: boolean;
  metadata: Json;
  created_at: string;
  updated_at: string;
}
