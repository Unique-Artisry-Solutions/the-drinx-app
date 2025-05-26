
import { Json } from '@/integrations/supabase/types';
import { 
  PaymentTransaction, 
  PaymentRefund, 
  PaymentReceipt,
  ProcessPaymentResponse,
  ProcessRefundResponse
} from '@/types/PaymentTypes';
import {
  DbPaymentTransaction,
  DbPaymentRetry,
  DbPaymentFailureLog,
  DbPaymentReceipt,
  DbPaymentRefund,
  DbSubscriptionPayment
} from '@/types/PaymentDatabaseTypes';

// Safe JSON conversion utilities
export const safeJsonToRecord = (json: Json): Record<string, any> => {
  if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
    return json as Record<string, any>;
  }
  return {};
};

export const safeJsonToArray = (json: Json): any[] => {
  if (Array.isArray(json)) {
    return json;
  }
  return [];
};

// Type-safe mappers for payment entities
export const mapPaymentTransactionFromDb = (dbRow: DbPaymentTransaction): PaymentTransaction => ({
  id: dbRow.id,
  user_id: dbRow.user_id,
  amount: dbRow.amount,
  currency: dbRow.currency,
  status: dbRow.status,
  provider: dbRow.provider,
  provider_transaction_id: dbRow.provider_transaction_id,
  payment_method_id: dbRow.payment_method_id,
  metadata: safeJsonToRecord(dbRow.metadata),
  created_at: dbRow.created_at,
  updated_at: dbRow.updated_at
});

export const mapPaymentRefundFromDb = (dbRow: DbPaymentRefund): PaymentRefund => ({
  id: dbRow.id,
  transaction_id: dbRow.transaction_id,
  amount: dbRow.amount,
  status: dbRow.status,
  reason: dbRow.reason,
  provider_refund_id: dbRow.provider_refund_id,
  refunded_by: dbRow.refunded_by,
  metadata: safeJsonToRecord(dbRow.metadata),
  created_at: dbRow.created_at,
  updated_at: dbRow.updated_at
});

export const mapPaymentReceiptFromDb = (dbRow: DbPaymentReceipt): PaymentReceipt => ({
  id: dbRow.id,
  transaction_id: dbRow.transaction_id,
  receipt_number: dbRow.receipt_number,
  receipt_url: dbRow.receipt_url,
  receipt_data: safeJsonToRecord(dbRow.receipt_data),
  created_at: dbRow.created_at
});

// Helper functions for creating database insert objects
export const preparePaymentTransactionForDb = (
  userId: string,
  amount: number,
  currency: string,
  paymentMethodId: string,
  metadata: Record<string, any> = {}
) => ({
  user_id: userId,
  amount,
  currency,
  payment_method_id: paymentMethodId,
  metadata: metadata as Json,
  status: 'pending' as const
});

export const preparePaymentRetryForDb = (
  transactionId: string,
  failureReason: string,
  attemptNumber: number,
  retryScheduledFor: string,
  maxRetries: number = 3,
  metadata: Record<string, any> = {}
) => ({
  transaction_id: transactionId,
  attempt_number: attemptNumber,
  failure_reason: failureReason,
  retry_scheduled_for: retryScheduledFor,
  max_retries: maxRetries,
  metadata: metadata as Json
});

export const preparePaymentFailureLogForDb = (
  userId: string | undefined,
  paymentMethodId: string | undefined,
  amount: number | undefined,
  currency: string = 'USD',
  errorMessage: string | undefined,
  metadata: Record<string, any> = {}
) => ({
  user_id: userId,
  payment_method_id: paymentMethodId,
  amount,
  currency,
  error_message: errorMessage,
  metadata: metadata as Json
});

export const prepareSubscriptionPaymentForDb = (
  subscriptionId: string,
  stripeSubscriptionId: string,
  userId: string,
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'incomplete' = 'active',
  metadata: Record<string, any> = {}
) => ({
  subscription_id: subscriptionId,
  stripe_subscription_id: stripeSubscriptionId,
  user_id: userId,
  status,
  metadata: metadata as Json
});

// Response mappers
export const createProcessPaymentResponse = (
  success: boolean,
  status: string,
  paymentIntentId: string,
  transactionId: string | null
): ProcessPaymentResponse => ({
  success,
  status,
  paymentIntentId,
  transactionId
});

export const createProcessRefundResponse = (
  success: boolean,
  refundId: string,
  status: string,
  transactionId: string
): ProcessRefundResponse => ({
  success,
  refundId,
  status,
  transactionId
});
